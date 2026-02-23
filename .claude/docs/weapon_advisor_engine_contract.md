# Weapon Advisor Engine Contract (V1)

Status: V1 shipped
As of: February 22, 2026

## 1. Locked Product Decisions

1. Optimize for questionnaire-based weapon pair recommendations.
2. Return 2-3 recommendations when possible; otherwise return empty state.
3. Recommendations are always ordered `Primary` then `Secondary`.
4. `Primary` is top standalone fit; `Secondary` is chosen for complementarity.
5. Weapon rarity filter is a hard constraint.
6. Attachment recommendations are out of scope for V1 (weapon-only output).
7. Material filtering is out of scope for V1.
8. Advisor URL state is preserved in code for V2 but not exposed in V1 runtime.
9. Stealth filter is deferred to V2.
10. Shuffle/rotation is deferred to V2.

## 2. Input Contract

```ts
type AdvisorLocationId = "buried_city" | "spaceport" | "dam" | "blue_gate" | "stella_montis";
type AdvisorSquadMode = "solo" | "squad";
type AdvisorFocus = "pve" | "pvp" | "mixed";
type AdvisorPreferredRange = "close" | "mid" | "long" | "any";

interface AdvisorInputs {
  location: AdvisorLocationId;
  squad: AdvisorSquadMode;
  focus: AdvisorFocus;
  preferredRange: AdvisorPreferredRange;
  allowedWeaponRarities: Rarity[];
}
```

## 3. Hard Constraint Filters

Applied before scoring:

1. Weapon rarity must be in `allowedWeaponRarities`.

If fewer than 2 distinct weapons remain, return empty state immediately.

## 4. Score Model

### 4.1 Grade Mapping

`S=1.0, A=5/6, B=4/6, C=3/6, D=2/6, F=1/6` (normalized to `[0, 1]`).

### 4.2 Primary Score (3 components)

`primaryScore(weapon)` is a weighted sum of:

| Component | Weight | Description |
|-----------|--------|-------------|
| `mapFit` | 0.30 | How well the weapon's class fits the selected location. Uses 3-tier class bucketing: strong=1.0, okay=0.7, weak=0.4. |
| `roleFit` | 0.45 | How well the weapon matches the player's PvE/PvP focus. Lerps between PvP and ARC grades using focus blend weights. |
| `rangeFit` | 0.25 | How well the weapon's range stat fits the preferred range band. Soft window fit with overlapping bands. |

### 4.3 Secondary Complement Score (3 components)

`secondaryScore(primary, secondary)` is a weighted sum of:

| Component | Weight | Description |
|-----------|--------|-------------|
| `qualityFloor` | 0.50 | Secondary's own primary score (minimum quality bar). |
| `ammoDiversity` | 0.25 | Different ammo type = 1.0, same = 0.2. |
| `rangeDiversity` | 0.25 | Different band = 1.0, adjacent = 0.65, same = 0.3. |

Range adjacency: close↔mid and mid↔long are "adjacent". Close↔long is "different" (maximum spread).

### 4.4 Pair Score

```
pairScore = primaryScore × 0.60 + complementScore × 0.40
```

Squad mode bonus: +0.05 pair score when primary and secondary occupy different range bands (squad mode only).

### 4.5 Deterministic Sort Order

Pairs are sorted by:
1. `pairScore` (descending)
2. `primaryScore` (descending)
3. `secondaryScore` (descending)
4. `pairKey` (ascending, lexical — ensures alphabetical tiebreak)

## 5. Recommendation Generation

1. Score all filtered weapons for primary role.
2. Take top 8 primary candidates (deterministic sort with alphabetical tiebreak).
3. Expand ordered pairs over primary pool × all candidates (primary ≠ secondary).
4. Score complement for each pair.
5. Sort pairs deterministically (see §4.5).
6. Assign tier: index 0 = `top_pick`, rest = `strong_option`.
7. Return 2-3 results based on TOP_GAP threshold (see §6).

## 6. Output Count (2 vs 3 Results)

- Always show top 2 pairs.
- Show 3rd pair only if `pairs[2].pairScore >= pairs[0].pairScore - TOP_GAP` (default 0.06).
- This ensures the 3rd result is competitive with the top pick, not filler.

## 7. Synergy Tags

Derived per-pair from weapon data — no curation, pure logic:

| Tag | Type | Condition |
|-----|------|-----------|
| Ammo Split | positive | `primary.ammoType !== secondary.ammoType` |
| Same Ammo | warning | `primary.ammoType === secondary.ammoType` |
| Range Coverage | positive | `pickRangeBand(primary.range) !== pickRangeBand(secondary.range)` |
| Range Overlap | warning | `pickRangeBand(primary.range) === pickRangeBand(secondary.range)` |
| Role Split | positive | One weapon has PvP grade S/A AND other has ARC grade S/A |

## 8. Output Contract

```ts
type TierLabel = "top_pick" | "strong_option";

interface SynergyTag {
  type: "positive" | "warning";
  label: string;
}

interface PairRecommendation {
  rank: number;
  pairKey: string;           // "primaryId__secondaryId"
  primaryWeaponId: string;
  secondaryWeaponId: string;
  primaryScore: number;
  secondaryScore: number;
  pairScore: number;
  tier: TierLabel;
  synergyTags: SynergyTag[];
  debug?: {
    primaryBreakdown: AdvisorScoreBreakdown;
    secondaryBreakdown: AdvisorScoreBreakdown;
    complementBreakdown: AdvisorComplementBreakdown;
  };
}

interface AdvisorResult {
  status: "idle" | "results" | "empty";
  recommendations: PairRecommendation[]; // length 0, 2, or 3
  emptyState?: {
    code: "INSUFFICIENT_VALID_WEAPONS" | "NO_VALID_PAIRS";
    message: string;
  };
}
```

## 9. Empty-State Contract

When constraints prevent a valid 2-weapon recommendation:

1. Return `status = "empty"`.
2. Return `recommendations = []`.
3. Return `emptyState` with code and actionable message.
4. Suggested actions: broaden rarity filter.

## 10. URL State (V2, preserved in code)

Params are parsed/serialized for future URL sharing:

1. `tab=advisor`
2. `loc=<locationId>`
3. `sq=<solo|squad>`
4. `fc=<pve|pvp|mixed>`
5. `rg=<close|mid|long|any>`
6. `wr=<comma-separated rarity codes>` (c,u,r,e,l)

Not exposed in V1 runtime.

## 11. Configuration Surface

All tunable values live in `src/data/advisor_config.ts` (~30 values).
Every value has a plain-English comment explaining what it controls, what "higher" and "lower" mean, and a safe range for experimentation.

Key tuning workflow:
1. Change a value in `advisor_config.ts`.
2. Run `node scripts/advisor/run-matrix.mjs` to validate golden scenarios.
3. If an anchor scenario breaks, decide whether the new behavior is better.

## 12. Explicit Non-Goals for V1

1. No runtime AI calls.
2. No attachment recommendations.
3. No material/economy constraints.
4. No stealth filter.
5. No shuffle/rotation UX.
6. No "why not this other option" explanations.
7. No advisor URL sharing in runtime.
