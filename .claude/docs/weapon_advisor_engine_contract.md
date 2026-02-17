# Weapon Advisor Engine Contract (V1 Rebaseline)

Status: Active prototyping contract
As of: February 17, 2026

## 1. Locked Product Decisions

1. Optimize for questionnaire-based weapon pair recommendations.
2. Return exactly 2 recommendations when possible; otherwise return empty state.
3. Recommendations are always ordered `Primary` then `Secondary`.
4. `Primary` is top standalone fit; `Secondary` is chosen for complementarity.
5. Weapon rarity filter is a hard constraint.
6. Stealth requirement is a hard constraint.
7. Attachment recommendations are out of scope for V1 (weapon-only output).
8. Material filtering is out of scope for V1.
9. Advisor URL state is shareable.
10. No backward compatibility requirement for removed URL fields.

## 2. Input Contract

```ts
type LocationId = "buried_city" | "spaceport" | "dam" | "blue_gate" | "stella_montis";
type SquadMode = "solo" | "squad";
type Focus = "pve" | "pvp" | "mixed";
type PreferredRange = "close" | "mid" | "long" | "any";

interface AdvisorInputs {
  location: LocationId;
  squad: SquadMode;
  focus: Focus;
  preferredRange: PreferredRange;
  stealthImportant: boolean;
  allowedWeaponRarities: Array<"Common" | "Uncommon" | "Rare" | "Epic" | "Legendary">;
  debug: boolean;
}
```

## 3. Hard Constraint Filters

Applied before scoring:

1. Weapon rarity must be in `allowedWeaponRarities`.
2. If `stealthImportant === true`, weapon ID must be in stealth-eligible set.

If fewer than 2 distinct weapons remain, return empty state immediately.

## 4. Score Model

### 4.1 Grade Mapping

`S=6, A=5, B=4, C=3, D=2, F=1`, normalized to `[0,1]`.

### 4.2 Primary Score

`primaryScore(weapon)` is a weighted sum of:

1. `locationFit` (0.30)
2. `focusFit` (0.27)
3. `rangeFit` (0.23)
4. `soloSquadFit` (0.11)
5. `stealthPreferenceFit` (0.09)

### 4.3 Secondary Complement Score

`secondaryScore(primary, secondary)` includes:

1. `baseSecondaryFit` (secondary primary score at lower influence)
2. `ammoComplement` (cross-ammo bonus / same-ammo penalty)
3. `rangeComplement` (coverage diversity bonus)
4. `roleComplement` (redundancy penalty)

### 4.4 Pair Score

`pairScore = 0.65 * primaryScore + 0.35 * secondaryScore`

## 5. Recommendation Generation

1. Score all filtered weapons for primary role.
2. Expand ordered pairs over top primary pool.
3. Score complementarity for each pair.
4. Sort descending by:
   1. `pairScore`
   2. `primaryScore`
   3. `secondaryScore`
   4. lexical `pairKey = "${primaryId}__${secondaryId}"`
5. Return top 2 or empty-state response.

## 6. Tie Buckets and Shuffle

1. Tie bucket key is rounded pair score to 4 decimals.
2. Shuffle exhausts unseen pairs in current bucket before advancing.
3. After all pairs are seen, shuffle wraps and starts a new cycle.
4. Input changes reset shuffle progression.

## 7. Output Contract

```ts
interface PairRecommendation {
  rank: number;
  pairKey: string;
  primaryWeaponId: string;
  secondaryWeaponId: string;
  primaryScore: number;
  secondaryScore: number;
  pairScore: number;
  tieBucketId: string;
  reasons: string[]; // 2 short statements
  debug?: {
    primaryBreakdown: Record<string, number>;
    secondaryBreakdown: Record<string, number>;
    complementBreakdown: Record<string, number>;
  };
}

interface AdvisorResult {
  recommendations: PairRecommendation[]; // length 0 or 2
  emptyState?: {
    code: "INSUFFICIENT_VALID_WEAPONS" | "NO_VALID_PAIRS";
    message: string;
  };
  shuffleState: {
    bucketIndex: number;
    seenPairKeys: string[];
    cycle: number;
  };
}
```

## 8. URL State Contract

1. `tab=advisor`
2. `loc=<locationId>`
3. `sq=<solo|squad>`
4. `fc=<pve|pvp|mixed>`
5. `rg=<close|mid|long|any>`
6. `st=<0|1>`
7. `wr=<comma-separated rarity codes>`
8. `dbg=<0|1>` (optional)
9. `sh=<bucketCursor>:<offset>` (optional)

Removed in V1 rebaseline: `ds`, `mat`.

## 9. Empty-State Contract

When constraints prevent a valid 2-weapon recommendation:

1. Return `recommendations = []`.
2. Return `emptyState` with code and actionable message.
3. Suggested actions: broaden rarity filter or disable stealth.

## 10. Explicit Non-Goals for V1

1. No runtime AI calls.
2. No attachment recommendations.
3. No material/economy constraints.
4. No "why not this other option" explanations.
