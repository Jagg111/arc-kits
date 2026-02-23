# Weapon Advisor Internet-Validated Matrix (Two Pair Sets)

Status: Research report (independent from current golden expected fields and advisor weights)  
As of: February 18, 2026

## Method and Guardrails

1. Inputs analyzed: all scenarios in `src/data/advisor_golden_cases.ts`.
2. Decision inputs intentionally excluded:
- `expectedPrimaryPool`
- `expectedSecondaryPool`
- `exactExpectedPairKey`
- weighting logic in `src/data/advisor_config.ts`
3. Source blend: official ARC Raiders updates and forum discussions.
4. Recency weighting: post-October 30, 2025 sources prioritized where conflict exists.
5. Weapon scope: only IDs present in `src/data/weapons.ts`.
6. Output format per scenario:
- `recommendedPrimaryPool`
- `recommendedSecondaryPool`
- `topPairKey` (`primary__secondary`)
- `alternatePairKey` (`primary__secondary`)
- confidence, rationale, and citations

## Scenario Matrix

### S01 - Spaceport, Solo, PvP, Long, All Rarities

1. `recommendedPrimaryPool`: `renegade`, `osprey`, `tempest`
2. `recommendedSecondaryPool`: `anvil`, `venator`, `ferro`, `vulcano`
3. `topPairKey`: `renegade__anvil`
4. `alternatePairKey`: `osprey__venator`
5. Confidence: High
6. Why: Spaceport pressure and longer lanes favor precise medium/long primaries, while community pair discussions repeatedly add hard-hitting close/mid backup sidearms. [O2] [F1] [F5]

### S02 - Stella Montis, Squad, PvP, Close, All Rarities

1. `recommendedPrimaryPool`: `bobcat`, `vulcano`, `stitcher`, `anvil`
2. `recommendedSecondaryPool`: `anvil`, `renegade`, `venator`, `tempest`, `ferro`
3. `topPairKey`: `bobcat__anvil`
4. `alternatePairKey`: `vulcano__renegade`
5. Confidence: High
6. Why: Official Stella framing plus player reports strongly point to close-quarters fighting where high-TTK SMG/shotgun starts perform best, with a precision secondary for extension. [O2] [F2] [F5]

### S03 - Blue Gate, Solo, PvE, Long, All Rarities

1. `recommendedPrimaryPool`: `jupiter`, `equalizer`, `hullcracker`, `aphelion`
2. `recommendedSecondaryPool`: `anvil`, `renegade`, `ferro`, `tempest`
3. `topPairKey`: `jupiter__anvil`
4. `alternatePairKey`: `equalizer__renegade`
5. Confidence: Medium-High
6. Why: Official Blue Gate direction and forum prep for ARC-heavy encounters favor ARC-specialized long-range weapons, with a reliable anti-player fallback sidearm. [O2] [F3] [F5]

### S04 - Dam, Squad, Mixed, Any, All Rarities

1. `recommendedPrimaryPool`: `tempest`, `renegade`, `torrente`, `rattler`
2. `recommendedSecondaryPool`: `anvil`, `stitcher`, `venator`, `ferro`, `vulcano`
3. `topPairKey`: `tempest__anvil`
4. `alternatePairKey`: `renegade__stitcher`
5. Confidence: Medium
6. Why: Dam's multi-lane mixed pacing supports flexible AR/BR anchors with one fast close-range finisher for collapse or hold breaks. [O2] [F1] [F5]

### S05 - Buried City, Solo, Mixed, Close, Common + Uncommon

1. `recommendedPrimaryPool`: `stitcher`, `anvil`, `iltoro`, `ferro`
2. `recommendedSecondaryPool`: `anvil`, `ferro`, `iltoro`, `rattler`, `burletta`
3. `topPairKey`: `stitcher__anvil`
4. `alternatePairKey`: `iltoro__ferro`
5. Confidence: High
6. Why: Buried City's tighter engagement profile and low-rarity constraints make close-pressure commons/uncommons optimal, with Anvil/Ferro retained for mixed PvE pressure. [O2] [F1] [F5]

### S06 - Spaceport, Solo, PvP, Long, All Rarities, Stealth

1. `recommendedPrimaryPool`: `renegade`, `osprey`, `tempest`, `arpeggio`
2. `recommendedSecondaryPool`: `anvil`, `ferro`, `stitcher`, `tempest`
3. `topPairKey`: `renegade__anvil`
4. `alternatePairKey`: `osprey__ferro`
5. Confidence: Medium
6. Why: Community stealth threads emphasize suppressor behavior changes while still favoring lane-control rifles for Spaceport; backup choices stay high-stopping for short duels after reveal. [O1] [F4] [F1]

### S07 - Spaceport, Solo, PvP, Long, Legendaries, Stealth

1. `recommendedPrimaryPool`: `aphelion`, `jupiter`, `equalizer`
2. `recommendedSecondaryPool`: `jupiter`, `equalizer`, `aphelion`
3. `topPairKey`: `aphelion__jupiter`
4. `alternatePairKey`: `jupiter__equalizer`
5. Confidence: Low
6. Why: Forced best-guess under strict Legendary+Stealth constraints; forum stealth guidance does not strongly support stealth execution for these legendary options, so this remains a pragmatic combat-first fallback. [O1] [F4] [F5]

### S08 - Dam, Squad, Mixed, Mid, Common + Uncommon

1. `recommendedPrimaryPool`: `kettle`, `rattler`, `anvil`, `ferro`
2. `recommendedSecondaryPool`: `anvil`, `ferro`, `stitcher`, `rattler`, `kettle`
3. `topPairKey`: `kettle__anvil`
4. `alternatePairKey`: `rattler__ferro`
5. Confidence: Medium
6. Why: Mid-lane Dam squad play with lower rarities benefits from stable AR/BR pressure plus one heavy sidearm anchor; recent official Kettle changes improve its viability in this role. [O1] [O2] [F5]

### S09 - Buried City, Solo, Mixed, Close, Uncommons

1. `recommendedPrimaryPool`: `anvil`, `iltoro`
2. `recommendedSecondaryPool`: `iltoro`, `anvil`
3. `topPairKey`: `anvil__iltoro`
4. `alternatePairKey`: `iltoro__anvil`
5. Confidence: High
6. Why: With Uncommon-only filtering, the viable set is inherently constrained to two in-repo candidates, and this pair covers mixed close engagements better than either alone. [O2] [F1] [F5]

### S10 - Blue Gate, Squad, PvE, Long, Legendaries

1. `recommendedPrimaryPool`: `jupiter`, `equalizer`, `aphelion`
2. `recommendedSecondaryPool`: `equalizer`, `aphelion`, `jupiter`
3. `topPairKey`: `jupiter__equalizer`
4. `alternatePairKey`: `equalizer__aphelion`
5. Confidence: Medium
6. Why: Squad PvE and long-range Blue Gate context align with ARC-focused legendary energy options; alternate keeps coverage when one slot needs sustained beam pressure over bolt burst. [O2] [F3] [F5]

### S11 - Dam, Squad, Mixed, Any, All Rarities

1. `recommendedPrimaryPool`: `tempest`, `renegade`, `torrente`, `rattler`
2. `recommendedSecondaryPool`: `anvil`, `stitcher`, `venator`, `ferro`, `vulcano`
3. `topPairKey`: `tempest__anvil`
4. `alternatePairKey`: `renegade__stitcher`
5. Confidence: Medium
6. Why: Same input profile as S04, therefore same independent recommendation set by design. [O2] [F1] [F5]

### S12 - Stella Montis, Solo, Mixed, Close, All Rarities, Stealth

1. `recommendedPrimaryPool`: `stitcher`, `anvil`, `bobcat`, `renegade`
2. `recommendedSecondaryPool`: `anvil`, `tempest`, `renegade`, `ferro`
3. `topPairKey`: `stitcher__anvil`
4. `alternatePairKey`: `renegade__tempest`
5. Confidence: Medium-Low
6. Why: Stella close-range pressure remains dominant, but stealth-constrained mixed play has less consistent consensus; this set balances silent-entry intent with practical fight-closing reliability. [O2] [F2] [F4]

### S13 - Spaceport, Solo, PvP, Long, All Rarities

1. `recommendedPrimaryPool`: `renegade`, `osprey`, `tempest`
2. `recommendedSecondaryPool`: `anvil`, `venator`, `ferro`, `vulcano`
3. `topPairKey`: `renegade__anvil`
4. `alternatePairKey`: `osprey__venator`
5. Confidence: High
6. Why: Same input profile as S01, mirrored intentionally. [O2] [F1] [F5]

### S14 - Spaceport, Solo, PvP, Long, All Rarities

1. `recommendedPrimaryPool`: `renegade`, `osprey`, `tempest`
2. `recommendedSecondaryPool`: `anvil`, `venator`, `ferro`, `vulcano`
3. `topPairKey`: `renegade__anvil`
4. `alternatePairKey`: `osprey__venator`
5. Confidence: High
6. Why: Same input profile as S01, mirrored intentionally despite different harness purpose. [O2] [F1] [F5]

## Duplicate-Profile Mirroring Applied

1. S01 = S13 = S14 (identical input profile)
2. S04 = S11 (identical input profile)

## Concise Delta vs Current Golden Expectations

1. Stable top-pair alignment retained:
- `S01`: `renegade__anvil` (same)
- `S03`: `jupiter__anvil` (same)
- `S06`: `renegade__anvil` (same)
- `S10`: `jupiter__equalizer` (same)
- `S14`: `renegade__anvil` (same)
2. Intentional change for low-signal constrained case:
- `S07`: report provides forced best-guess pair(s) instead of empty output.
3. New additions vs current matrix where no exact pair was previously locked:
- `S02`, `S04`, `S05`, `S08`, `S09`, `S11`, `S12`, `S13` now include both `topPairKey` and `alternatePairKey`.

## Validation Checklist (Applied)

1. All recommendations use IDs in `src/data/weapons.ts`.
2. Each scenario has both `topPairKey` and `alternatePairKey`.
3. Pair weapons are distinct inside each key.
4. Rarity-constrained scenarios only use allowed rarities.
5. Duplicate-input scenarios are mirrored.
6. Every scenario cites at least one official source and one forum source.

## Sources

### Official

- [O1] ARC Raiders Tech Test 2 Update 1.13.0 (Nov 17, 2025):  
  https://www.arcraiders.com/en-us/news/updates-and-patch-notes/tech-test-2-update-1-13-0---november-17--2025
- [O2] ARC Raiders Preparing for the Second Expedition (Nov 6, 2025):  
  https://www.arcraiders.com/en-us/news/game-updates/preparing-for-the-second-expedition

### Forums / Community Discussions

- [F1] Reddit: map/loadout opinions (Spaceport, Buried City, etc.):  
  https://www.reddit.com/r/ArcRaiders/comments/1lqwd1u/favorite_weapon_of_each_ammo_type_and_why/
- [F2] Reddit: close-quarters Stella/Bobcat meta sentiment:  
  https://www.reddit.com/r/ArcRaiders/comments/1mbx90b/is_bobcat_a_must_for_stella/
- [F3] Reddit: Blue Gate ARC prep/loadout discussion:  
  https://www.reddit.com/r/ArcRaiders/comments/1mho97l/how_do_i_prepare_for_cyclopsmatriarch/
- [F4] Reddit: stealth + silencer behavior discussion:  
  https://www.reddit.com/r/ArcRaiders/comments/1m7zwx2/does_using_silencer_still_trigger_enemies_and/
- [F5] Reddit: common two-weapon pairing habits:  
  https://www.reddit.com/r/ArcRaiders/comments/1mz5mor/whats_your_goto_pair_and_why/

