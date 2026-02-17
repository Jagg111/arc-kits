# Weapon Advisor Golden Scenario Matrix (V1 Rebaseline)

Status: Active calibration matrix
As of: February 17, 2026

Purpose:

1. Keep recommendation behavior reproducible while tuning scoring.
2. Catch regressions in filtering, ranking, shuffle, and URL state.
3. Validate weapon-only advisor contract (no attachment checks in V1).

## 1. Global Invariants

1. Output length is either exactly `2` or `0` with empty state.
2. Primary and secondary weapon IDs are always different.
3. Every recommended weapon rarity is allowed by filter.
4. If `stealthImportant=true`, both weapons are stealth-eligible.
5. Debug mode includes score breakdowns.
6. Non-debug mode hides score breakdowns.

## 2. Scenario Matrix

### S01 Baseline Long-Range PVP

1. Inputs: `spaceport, solo, pvp, long, stealth=false, rarities=all`
2. Expected primary pool: `renegade, osprey, tempest`
3. Expected secondary pool: `stitcher, venator, anvil, vulcano`
4. Exact top pair: `renegade__anvil`

### S02 Indoor CQC PVP

1. Inputs: `stella_montis, squad, pvp, close, stealth=false, rarities=all`
2. Expected primary pool: `bobcat, vulcano, stitcher, anvil`
3. Expected secondary pool: `renegade, tempest, venator, ferro, vulcano, bobcat`

### S03 ARC-Heavy Long-Range PvE

1. Inputs: `blue_gate, solo, pve, long, stealth=false, rarities=all`
2. Expected primary pool: `equalizer, jupiter, aphelion, hullcracker`
3. Expected secondary pool: `anvil, ferro, tempest, renegade`
4. Exact top pair: `jupiter__anvil`

### S04 Mixed Terrain Flexible Run

1. Inputs: `dam, squad, mixed, any, stealth=false, rarities=all`
2. Expected primary pool: `tempest, renegade, rattler, torrente`

### S05 Common/Uncommon Economy Constraint

1. Inputs: `buried_city, solo, mixed, close, stealth=false, rarities=Common+Uncommon`
2. Expected primary pool: `stitcher, anvil, ferro, iltoro`
3. Expected secondary pool: `rattler, burletta, kettle, iltoro`

### S06 Stealth Required Wide Budget

1. Inputs: `spaceport, solo, pvp, long, stealth=true, rarities=all`
2. Expected primary pool: `osprey, renegade, tempest, arpeggio`
3. Exact top pair: `renegade__anvil`

### S07 Stealth + Legendary Only (Expected Empty)

1. Inputs: `spaceport, solo, pvp, long, stealth=true, rarities=Legendary`
2. Expected: empty state

### S08 Common/Uncommon Mid-Range Mixed

1. Inputs: `dam, squad, mixed, mid, stealth=false, rarities=Common+Uncommon`
2. Expected: valid 2-weapon output

### S09 Uncommon Weapons Only

1. Inputs: `buried_city, solo, mixed, close, stealth=false, rarities=Uncommon`
2. Expected primary pool: `anvil, iltoro`

### S10 Legendary ARC Sanity

1. Inputs: `blue_gate, squad, pve, long, stealth=false, rarities=Legendary`
2. Exact top pair: `jupiter__equalizer`

### S11 Tie-Bucket Shuffle Cycle

1. Inputs: `dam, squad, mixed, any, stealth=false, rarities=all`
2. Expected: shuffle exhausts current top tie bucket before advancing

### S12 Stealth Exclusion Rules

1. Inputs: `stella_montis, solo, mixed, close, stealth=true, rarities=all`
2. Assertions: `hairpin`, `iltoro`, and `vulcano` are excluded

### S13 Same-Ammo Penalty Check

1. Inputs: `spaceport, solo, pvp, long, stealth=false, rarities=all`
2. Assertions: same-ammo penalties impact near-tie ordering

### S14 URL Round-Trip Shareability

1. Inputs: S01 profile with `tab=advisor`
2. Assertions: parse->serialize->parse yields equivalent state for active fields

## 3. Execution Notes

1. Run `node scripts/advisor/run-matrix.mjs --json` for machine-readable output.
2. Treat exact-case drift as intentional only when reviewed and updated together.
3. Promote the matrix to automated CI checks once advisor UI integration starts.
