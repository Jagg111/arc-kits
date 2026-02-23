# Weapon Advisor Golden Scenario Matrix (V1)

Status: Active calibration matrix
As of: February 22, 2026

Purpose:

1. Keep recommendation behavior reproducible while tuning scoring.
2. Catch regressions in filtering, ranking, tier assignment, and synergy tags.
3. Validate weapon-only advisor contract (no attachment checks in V1).

## 1. Global Invariants

1. Output length is 2-3 (results state) or 0 (empty state).
2. Primary and secondary weapon IDs are always different within each pair.
3. Every recommended weapon rarity is allowed by the rarity filter.
4. Exactly 1 `top_pick` tier; remaining pairs are `strong_option`.
5. Every pair has at least 1 synergy tag.
6. Tier values are only `top_pick` or `strong_option`.
7. Same inputs produce identical output on repeated calls (determinism).

## 2. Scenario Types

- **Anchor scenarios** (G01, G03, G08): Top pair must exactly match `exactExpectedPairKey`. These are regression anchors — if one breaks during tuning, it's intentional and the golden case must be updated.
- **Flexible scenarios** (G02, G04-G07, G09-G10): Top primary and/or secondary must be in the expected pool. Allows engine flexibility during tuning without breaking tests.

## 3. Scenario Matrix

### G01 — Spaceport, Solo, PvP, Long, All Rarities (Anchor)

- **Inputs**: `spaceport, solo, pvp, long, rarities=all`
- **Exact top pair**: `renegade__anvil`
- **Expected primary pool**: `renegade, osprey, tempest`
- **Expected secondary pool**: `anvil, venator, ferro, vulcano`
- **Rationale**: Core happy path. Renegade is the obvious SR pick for long-range PvP at Spaceport. Anvil provides all-round secondary coverage. Community consensus strongly supports this pairing.

### G02 — Stella Montis, Squad, PvP, Close, All Rarities

- **Inputs**: `stella_montis, squad, pvp, close, rarities=all`
- **Expected primary pool**: `vulcano, bobcat, stitcher, anvil`
- **Expected secondary pool**: `bobcat, anvil, venator, tempest`
- **Rationale**: CQC-dominant map in squad mode. Vulcano, Bobcat, and Stitcher are all strong CQC options. Anvil appears because its PvP:A grade and HC class is strong at Stella Montis.

### G03 — Blue Gate, Solo, PvE, Long, All Rarities (Anchor)

- **Inputs**: `blue_gate, solo, pve, long, rarities=all`
- **Exact top pair**: `equalizer__ferro`
- **Expected primary pool**: `equalizer, jupiter, hullcracker, aphelion`
- **Expected secondary pool**: `ferro, anvil, renegade, tempest`
- **Rationale**: PvE-focused scenario at Blue Gate. Equalizer and Jupiter tie at identical primary scores (both ARC:S, both Special class = strong at Blue Gate). Alphabetical tiebreak selects Equalizer. Ferro provides strong BR-class secondary with ammo diversity.

### G04 — Dam, Squad, Mixed, Any, All Rarities

- **Inputs**: `dam, squad, mixed, any, rarities=all`
- **Expected primary pool**: `renegade, tempest, anvil`
- **Expected secondary pool**: `vulcano, anvil, ferro, stitcher`
- **Rationale**: Dam rewards mid-range all-rounders. Renegade leads due to strong BR class fit and good grades. Tempest is a close runner-up. Squad mode bonus rewards range-diverse pairs.

### G05 — Buried City, Solo, Mixed, Close, Common + Uncommon

- **Inputs**: `buried_city, solo, mixed, close, rarities=Common+Uncommon`
- **Expected primary pool**: `anvil, stitcher, ferro, iltoro`
- **Expected secondary pool**: `iltoro, stitcher, ferro, anvil`
- **Rationale**: Budget rarity constraint at a CQC map. Anvil dominates on raw grades even though HC isn't the top CQC class. Stitcher and Il Toro are strong CQC alternatives. Limited weapon pool produces genuinely competitive pairings.

### G06 — Dam, Squad, Mixed, Mid, Common + Uncommon

- **Inputs**: `dam, squad, mixed, mid, rarities=Common+Uncommon`
- **Expected primary pool**: `anvil, ferro, rattler`
- **Expected secondary pool**: `iltoro, stitcher, rattler`
- **Rationale**: Budget + mid-range at Dam. Anvil and Ferro lead as strong mid-range C+U options. Restricted pool forces creative pairings. Squad bonus rewards range diversity.

### G07 — Buried City, Solo, Mixed, Close, Uncommon Only

- **Inputs**: `buried_city, solo, mixed, close, rarities=Uncommon`
- **Expected primary pool**: `anvil, iltoro`
- **Rationale**: Extreme rarity constraint. Only 2 Uncommon weapons exist in the data (Anvil and Il Toro). Both pass filter and produce a valid pairing. Tests minimum viable weapon pool.

### G08 — Blue Gate, Squad, PvE, Long, Legendaries Only (Anchor)

- **Inputs**: `blue_gate, squad, pve, long, rarities=Legendary`
- **Exact top pair**: `equalizer__jupiter`
- **Rationale**: Only 3 Legendary weapons exist. Equalizer and Jupiter tie at identical primary scores for PvE at Blue Gate. Alphabetical tiebreak makes Equalizer the primary. Tests Legendary-only rarity constraint with PvE focus.

### G09 — Spaceport, Solo, PvP, Long, Legendaries Only

- **Inputs**: `spaceport, solo, pvp, long, rarities=Legendary`
- **Expected primary pool**: `aphelion, jupiter, equalizer`
- **Rationale**: Without stealth filter (V1), all 3 legendaries are available. Aphelion has the best PvP grade of the three (PvP:C vs F). Results are mediocre but valid — tests that the engine doesn't crash or produce invalid output with weak candidates.

### G10 — Stella Montis, Solo, PvP, Close, Common + Uncommon

- **Inputs**: `stella_montis, solo, pvp, close, rarities=Common+Uncommon`
- **Expected primary pool**: `anvil, stitcher, iltoro`
- **Expected secondary pool**: `iltoro, stitcher, ferro, anvil`
- **Rationale**: Budget CQC at Stella Montis. Anvil dominates due to PvP:A grade even though HC isn't the ideal CQC class. Tests that roleFit weight (0.45) correctly outweighs mapFit (0.30) — a weapon with strong grades beats a weapon with ideal class but weak grades.

## 4. Calibration Notes

During V1 implementation, two key calibration decisions were made:

1. **mapFit weight reduced from 0.40 → 0.30, roleFit increased from 0.35 → 0.45**: The original weights caused weapon class to dominate over actual PvP/ARC grades. This meant Ferro (BR class, PvP:C) beat Anvil (HC class, PvP:A) as secondary everywhere because BR was "strong" at most locations. The reweighting ensures actual combat performance matters more than class fit.

2. **Range diversity: close↔long = different, not adjacent**: The initial implementation treated close↔long as adjacent (0.65) when it should be maximum diversity (1.0). Close↔mid and mid↔long are adjacent (0.65). Same band = 0.3.

## 5. Execution Notes

1. Run `node scripts/advisor/run-matrix.mjs` for human-readable pass/fail output.
2. Run `node scripts/advisor/run-matrix.mjs --json` for machine-readable output.
3. Use `node scripts/advisor/run-matrix.mjs --show-pairs` to include scored pair details per scenario.
4. Filter to a single scenario: `node scripts/advisor/run-matrix.mjs --scenario G01`.
5. Combine options: `node scripts/advisor/run-matrix.mjs --scenario G01 --json --show-pairs`.
6. Treat exact-case drift as intentional only when reviewed and updated together.
7. Promote the matrix to automated CI checks once advisor UI integration starts.
