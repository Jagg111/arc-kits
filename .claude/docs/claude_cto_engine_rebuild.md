# CTO Engine Rebuild — Decision Record & Implementation Plan

Status: Complete — implemented February 23, 2026
As of: February 22, 2026

---

## 1. Background

The previous dev team built a functional advisor engine (`src/advisor/engine/`) with:
- 5-component weighted primary scoring (locationFit, focusFit, rangeFit, soloSquadFit, stealthPreferenceFit)
- 4-component secondary complement scoring (baseSecondaryFit, ammoComplement, rangeComplement, roleComplement)
- ~70+ hand-tuned floating-point config values in `advisor_config.ts`
- Tie-bucket-aware shuffle system for variety
- 14 golden test scenarios calibrated against the old contract

The new PM/designer team rewrote the product vision (`weapon_advisor_feature.md`) and created a refined prototype (`prototypes/advisor-concept-20260222-refined-states.html`). The old engine contract and golden matrix are now outdated and no longer align with the new product direction.

---

## 2. PM Decisions (from CTO ↔ PM Q&A)

These decisions were made through a structured question-and-answer session:

| Decision | PM Answer |
|---|---|
| Output count (2 vs 3 pairings) | Score-driven threshold — show 3rd only if close to top |
| Tier assignment | Exactly 1 Top Pick, rest are Strong Option |
| Synergy tags | Fully derived from weapon data (no manual curation) |
| Location influence | Moderate — biases results but great all-round weapons can appear across locations |
| Determinism | Fully deterministic for V1 (no shuffle) |
| Scoring complexity | Simpler is better — fewer knobs, easier to reason about |
| Golden cases | Start fresh (old ones discarded) |
| Squad mode depth | Light touch — slight bias toward specialized vs versatile |
| Location class tiers | Hand-authored by PM from game meta knowledge (not derived from old weights) |

---

## 3. Approaches Evaluated

### Approach A: "Trait Envelope Matching"
- Describe weapons as bags of boolean/enum traits, rank by trait overlap
- Zero floating-point tuning, ~25 discrete config values
- **Rejected**: Too coarse — 21 weapons with ~6 traits produces many ties. Risk of "too generic" results (failure mode #1 from spec). Small input changes may not shift output.

### Approach B: "Curated Scenario Matrix"
- Pre-compute right answer for every (location × focus × range) combo = 60 entries
- Zero scoring math, PM directly edits recommendations
- **Rejected**: Enormous authoring burden (~600 curated values). Scales terribly with new dimensions (stealth × economy multiplies matrix). Brittle to balance changes.

### Approach C: "Streamlined Weighted Score" ← SELECTED
- Keep weighted-sum architecture, collapse from 5 primary components to 3
- Replace 45 opaque class-weight floats with 15 readable "strong/okay/weak" bucket decisions
- ~30 config values (down from ~70+), ~80% code reuse
- **Selected**: Pragmatic balance of simplicity, granularity, and extensibility. Directly addresses PM's complaint about opacity without abandoning proven architecture.

---

## 4. New Engine Design

### 4.1 Primary Scoring (3 components, down from 5)

```
mapFit  (0.40) — "How well does this weapon fit the map?"
                  3-tier class bucketing per location: strong=1.0, okay=0.7, weak=0.4
                  Replaces 9 floats per location with 3 readable class lists

roleFit (0.35) — "Does this weapon match what the player wants to do?"
                  Lerp between pvp/arc grades based on focus blend (pve/pvp/mixed)

rangeFit(0.25) — "Does this weapon operate at the right range?"
                  Soft window fit (reused from current engine)
```

**Removed**: `soloSquadFit` (moves to pair-level modifier), `stealthPreferenceFit` (deferred to V1+)

### 4.2 Secondary Complement Scoring (3 components, down from 4)

```
qualityFloor  (0.50) — secondary's own primaryScore (minimum quality bar)
ammoDiversity (0.25) — different ammo type = 1.0, same = 0.2
rangeDiversity(0.25) — different band = 1.0, adjacent = 0.65, same = 0.3
```

**Removed**: `roleComplement` (was 0.10 weight, redundant with range diversity)

### 4.3 Pair Scoring

```
pairScore = primaryScore × 0.60 + complementScore × 0.40
```

Squad mode: +0.05 pair bonus when weapons specialize into different range bands (squad only).

### 4.4 Synergy Tags (derived from weapon data)

| Tag | Type | Condition |
|---|---|---|
| Ammo Split | positive (green) | `primary.ammoType !== secondary.ammoType` |
| Same Ammo | warning (amber) | `primary.ammoType === secondary.ammoType` |
| Range Coverage | positive (green) | `pickRangeBand(primary.range) !== pickRangeBand(secondary.range)` |
| Range Overlap | warning (amber) | `pickRangeBand(primary.range) === pickRangeBand(secondary.range)` |
| Role Split | positive (green) | One has pvp grade S/A AND other has arc grade S/A |

### 4.5 Tier Assignment & Output Count

Single threshold: `TOP_GAP = 0.06`

- `pairs[0]` = always Top Pick
- `pairs[1]` = Strong Option (always shown if exists)
- `pairs[2]` = Strong Option, shown only if `pairs[2].pairScore >= pairs[0].pairScore - TOP_GAP`

### 4.6 Location Class Tiers (Config Structure)

```ts
const LOCATION_CLASS_TIERS: Record<LocationId, {
  strong: WeaponClass[];  // → 1.0
  okay: WeaponClass[];    // → 0.7
  weak: WeaponClass[];    // → 0.4
}> = {
  buried_city:   { strong: [...], okay: [...], weak: [...] },
  spaceport:     { strong: [...], okay: [...], weak: [...] },
  dam:           { strong: [...], okay: [...], weak: [...] },
  blue_gate:     { strong: [...], okay: [...], weak: [...] },
  stella_montis: { strong: [...], okay: [...], weak: [...] },
};
```

PM will hand-author these tiers based on current game meta knowledge.

---

## 5. Implementation Steps

### Step 1: Simplify Types
**File:** `src/types/index.ts` (lines 108-200)
- Remove `stealthImportant` from `AdvisorInputs`
- Simplify `AdvisorScoreBreakdown`: `mapFit`, `roleFit`, `rangeFit`, `weightedTotal`
- Simplify `AdvisorComplementBreakdown`: `qualityFloor`, `ammoDiversity`, `rangeDiversity`, `weightedTotal`
- Add `SynergyTag` type (`{ type: "positive"|"warning"; label: string }`) and `TierLabel` type
- Update `PairRecommendation`: add `tier`, `synergyTags[]`, remove `tieBucketId`, `reasons[]`
- Remove `ShuffleState`
- Simplify `AdvisorResult`: remove `shuffleState`
- Remove `AdvisorQueryState.shuffle`
- Update `GoldenScenarioCase`: remove shuffle/stealth fields

### Step 2: Rebuild Config
**File:** `src/data/advisor_config.ts`
- Replace `ADVISOR_LOCATION_PROFILES` (9 floats × 5 locations) with `LOCATION_CLASS_TIERS` (3 class lists × 5 locations)
- Replace `ADVISOR_PRIMARY_WEIGHTS` (5 values) with 3 hardcoded constants
- Replace `ADVISOR_PAIR_WEIGHTS` (6 values) with 5 hardcoded constants
- Add `TOP_GAP = 0.06` threshold
- Remove `ADVISOR_CLASS_ROLE_SCORE`, `ADVISOR_TIE_PRECISION`
- Remove `stealthImportant` from `ADVISOR_DEFAULT_INPUTS`
- Keep: `ADVISOR_GRADE_TO_SCORE`, `ADVISOR_RANGE_TARGETS`, `ADVISOR_FOCUS_BLEND`, `ADVISOR_RARITY_RANK`, `ADVISOR_ALL_RARITIES`, `ADVISOR_INPUT_ENUMS`

### Step 3: Simplify Primary Scoring
**File:** `src/advisor/engine/primary-score.ts`
- Replace 5 scoring functions with 3: `scoreMapFit`, `scoreRoleFit` (reuse current `scoreFocusFit`), `scoreRangeFit` (reuse `rangeFitFromNumeric`)
- Remove `scoreLocationFit`, `scoreSoloSquadFit`, `scoreStealthPreferenceFit`

### Step 4: Simplify Secondary Scoring
**File:** `src/advisor/engine/secondary-score.ts`
- 3 components: qualityFloor, ammoDiversity, rangeDiversity
- Remove roleComplement

### Step 5: Rebuild Pair Ranker
**File:** `src/advisor/engine/pair-ranker.ts`
- Add synergy tag derivation per pair
- Add tier assignment (TOP_GAP threshold)
- Add 2-vs-3 output logic (same threshold)
- Add squad mode pair bonus (+0.05 for different range bands in squad)
- Remove `buildReasons()` (replaced by synergy tags)
- Remove `tieBucketId` generation

### Step 6: Simplify Engine Entry Point
**File:** `src/advisor/engine/index.ts`
- Remove `getShuffleBatch` import and usage
- Remove `ShuffleState` from options/result
- Simplify `recommendLoadouts`: return top 2-3 from sorted list based on threshold
- Remove shuffle export

### Step 7: Update Filters
**File:** `src/advisor/engine/filters.ts`
- Remove stealth check from `passWeaponHardConstraints` (keep code structure for easy V1+ re-add)
- Remove stealth from `normalizeInputs`

### Step 8: Clean Up Feature Map
**File:** `src/advisor/engine/feature-map.ts`
- Remove `roleScore` field (tied to removed `ADVISOR_CLASS_ROLE_SCORE`)
- Keep `stealthEligible` (cheap to maintain, V1+ will use it)
- Keep everything else

### Step 9: Clean Up URL State
**File:** `src/advisor/engine/url-state.ts`
- Remove `st` (stealth) param
- Remove `sh` (shuffle) param
- Keep all other params

### Step 10: Delete Shuffle Module
**File:** `src/advisor/engine/shuffle.ts`
- Delete entirely — out of scope for V1

### Step 11: Replace Golden Cases
**File:** `src/data/advisor_golden_cases.ts`
- Replace all 14 scenarios with fresh cases testing new contract:
  - Happy paths per location
  - Rarity filter behavior
  - Focus/range differentiation
  - Empty state
  - Synergy tag correctness
  - Tier assignment

### Step 12: Update Matrix Harness
**Files:** `scripts/advisor/cli.ts`, `scripts/advisor/run-matrix.mjs`
- Remove shuffle test logic
- Add synergy tag + tier validation
- Match new output contract

### Step 13: Update Docs
**Files:** `.claude/docs/weapon_advisor_engine_contract.md`, `.claude/docs/weapon_advisor_golden_matrix.md`
- Rewrite both to document new V1 contract

---

## 6. Files Modified (Summary)

| File | Action |
|---|---|
| `src/types/index.ts` | Edit — simplify advisor types |
| `src/data/advisor_config.ts` | Major rewrite — new config structure |
| `src/data/advisor_golden_cases.ts` | Replace — fresh golden cases |
| `src/advisor/engine/primary-score.ts` | Rewrite — 3 components |
| `src/advisor/engine/secondary-score.ts` | Simplify — 3 components |
| `src/advisor/engine/pair-ranker.ts` | Major edit — add synergy/tier/threshold |
| `src/advisor/engine/index.ts` | Simplify — remove shuffle |
| `src/advisor/engine/filters.ts` | Minor edit — remove stealth check |
| `src/advisor/engine/feature-map.ts` | Minor edit — remove roleScore |
| `src/advisor/engine/url-state.ts` | Minor edit — remove st/sh params |
| `src/advisor/engine/shuffle.ts` | Delete |
| `src/advisor/engine/utils.ts` | Keep as-is |
| `scripts/advisor/cli.ts` | Update for new contract |
| `scripts/advisor/run-matrix.mjs` | Update for new contract |
| `.claude/docs/weapon_advisor_engine_contract.md` | Rewrite |
| `.claude/docs/weapon_advisor_golden_matrix.md` | Rewrite |

---

## 7. Verification

1. **Build**: `npm run build` passes with no type errors
2. **Matrix harness**: `node scripts/advisor/run-matrix.mjs` — all new golden cases pass
3. **Manual spot checks**: Run engine with representative inputs and verify:
   - Output has 2-3 pairs
   - Exactly 1 Top Pick
   - Synergy tags present and correct
   - Known strong weapons appear in results
4. **Determinism**: Same inputs produce identical output on repeated calls
5. **Empty state**: Restrictive rarity filter produces empty state with helpful message
6. **Differentiation**: PvE ≠ PvP results; close ≠ long results; different locations shift output

---

## 8. Extensibility Notes (Phase 2+ Readiness)

| Future Feature | How it slots in |
|---|---|
| Stealth filter | Re-add `stealthImportant` to inputs + re-enable 1-line check in `filters.ts`. Feature map already tracks `stealthEligible`. |
| Economy-aware ranking | Add `costTier` derived from rarity → small multiplier on pair score for high-risk (squad) runs. One new config value. |
| Attachment recommendations | Orthogonal to engine — reuse existing presets system in `src/data/presets.ts`. |
| Shuffle / "show more" | Re-add shuffle as a layer on top of deterministic ranker. Engine already produces full sorted list. |
| Per-pairing reasoning text | Synergy tags provide the "why" for V1. Reasoning text is additive — compute from the same data used for tags. |
