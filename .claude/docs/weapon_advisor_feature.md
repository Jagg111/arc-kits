# Weapon Advisor Feature (V1 Rebaseline)

Status: Prototyping and engine tuning
As of: February 17, 2026

## 1. Feature Vision

### Problem
The app currently helps with individual weapon building, but players still ask:
"Which two weapons should I bring for this run?"

### V1 Solution
A preference-driven, client-side advisor that recommends exactly two weapons:

1. Best-fit primary weapon
2. Complementary secondary weapon

V1 intentionally focuses on weapon selection quality. Attachment recommendations are deferred.

## 2. Locked V1 Decisions

1. Advisor remains a separate tab/page in the SPA.
2. No backend and no runtime AI calls.
3. All recommendations are deterministic and data-driven.
4. Output is exactly 2 recommendations or an empty state.
5. Weapon rarity is a hard filter.
6. Stealth requirement is a hard filter.
7. Damage Style question is removed.
8. Material filters are removed from V1 advisor form.
9. Attachment recommendations are removed from V1 output.
10. URL state remains shareable for active advisor fields only.

## 3. Advisor Inputs (V1)

### Preference Inputs

1. Location: `buried_city | spaceport | dam | blue_gate | stella_montis`
2. Squad mode: `solo | squad`
3. Focus: `pve | pvp | mixed`
4. Preferred range: `close | mid | long | any`
5. Stealth important: `yes | no`

### Availability Filter

1. Weapon rarity access: `Common, Uncommon, Rare, Epic, Legendary` (multi-select)

## 4. Recommendation Output (V1)

Each result card includes:

1. Primary weapon
2. Secondary weapon
3. Pair score (internal; user-facing optional)
4. Short reason text (2 statements)
5. Open-in-builder actions for each weapon

Not included in V1:

1. Attachment plans
2. Material budget advice
3. Preset-based loadout cards

## 5. Scoring Model (V1)

Primary score factors:

1. Location fit
2. Focus fit (PVP/ARC blend)
3. Preferred range fit
4. Solo/squad fit
5. Stealth preference fit

Secondary scoring adds complementarity:

1. Ammo diversity
2. Range coverage diversity
3. Role diversity

Pair score favors the primary:

`pairScore = 0.65 * primary + 0.35 * secondary`

## 6. Technical Scope

### In Scope

1. Advisor input normalization
2. Hard filtering (rarity + stealth)
3. Primary and secondary ranking
4. Tie-bucket shuffle behavior
5. URL parsing/serialization for active fields
6. Golden matrix harness for regression checks

### Out of Scope (V1)

1. Attachment recommendation engine
2. Material budget constraint modeling
3. Preset-goal attachment mapping
4. Why-not comparison narratives

## 7. Prototype Alignment Note

The HTML prototype (`prototypes/advisor-concept-20260216-1530-hybrid-v2.html`) still shows:

1. Damage Style question
2. Material budget controls
3. Attachment badges in results

These elements are intentionally deferred and should not be treated as V1 requirements.

## 8. Phase 2 Attachment Plan (Future)

Reintroduce attachments only after weapon-ranking quality is stable.

Recommended sequence:

1. Restore preset-independent utility planner as baseline.
2. Enforce complete craft-cost coverage for all advisor-eligible tiers.
3. Add curated overrides only for known edge-case weapons.
4. Reintroduce material filters once attachment output is trustworthy.
