# Weapon Advisor Feature (V1)

Status: UI complete, engine complete, live wiring pending
As of: February 23, 2026

## 1. Feature Vision

### Problems

Players face two core pains when preparing for a run:

1. **Pairing confidence** — Picking a solid primary is manageable, but choosing a secondary that truly complements it across range, ammo type, and combat role is where players get stuck.
2. **Resource risk** — Crafting is expensive. Players want confidence that a weapon is worth the material investment before committing.

### Solution

A preference-driven, client-side advisor that recommends weapon pairings suited to the player's mission, playstyle, and available weapons:

1. Player inputs a small set of preferences (location, playstyle, rarity access)
2. The advisor returns 2-3 weapon pairings (primary + secondary) with scannable synergy indicators
3. The player reviews the shortlist and makes the final call

### Tool Philosophy

The advisor is a **shortlist curator**, not an authoritative oracle. It narrows the weapon pool to a handful of solid options with visible synergy signals to build confidence, then the player decides. The player retains agency.

### Usage Modes

The tool serves two equally important moments:

- **Pre-queue** — Player knows where they're going and needs a quick loadout recommendation before queuing. Speed and minimal friction matter.
- **Theory-crafting** — Player is between sessions, exploring what weapon combos exist for future runs. Browsing and comparison matter.

The UI must serve both: fast enough for pre-queue, explorable enough for theory-crafting.

## 2. Locked V1 Decisions

1. Advisor is a separate tab/page in the SPA.
2. No backend and no runtime AI calls.
3. All recommendations are deterministic and data-driven.
4. Output always yields 2-3 primary + secondary pairings, or an empty state.
5. Weapon rarity is a hard filter (access gate, not a ranking factor).
6. Attachment and weapon level recommendations are out of scope for V1.

## 3. Advisor Inputs (V1)

### Preference Inputs

1. **Location**: `buried_city | spaceport | dam | blue_gate | stella_montis`
2. **Squad mode**: `solo | squad` — Affects weapon specialization (squad allows specialization since teammates cover gaps; solo demands versatility) and risk tolerance (squad runs mean higher death risk, so players may prefer cheaper-to-replace weapons).
3. **Focus**: `pve | pvp | mixed`
4. **Preferred range**: `any | close | mid | long`

### Availability Filter

1. **Weapon rarity access**: `Common, Uncommon, Rare, Epic, Legendary` (multi-select) — Only show weapons the player can actually craft.

## 4. Recommendation Output (V1)

Each result set includes:

1. 2-3 weapon pairings (primary + secondary)
2. Synergy tags per pairing (see below)

Results must **meaningfully vary** based on inputs. If changing location or playstyle produces the same recommendations, the tool is failing.

### Synergy Tags

Each pairing displays small tags that surface the pairing quality criteria from Section 5 at a glance. Players are scanners — tags communicate "why" faster than prose.

**Positive (green):**
- **Ammo Split** — primary and secondary use different ammo pools
- **Range Coverage** — primary and secondary cover complementary range bands
- **Role Split** — one weapon strong PvE, the other strong PvP

**Warning (amber):**
- **Same Ammo** — both weapons draw from the same ammo pool
- **Range Overlap** — both weapons serve similar range bands

Tags map directly to the three dimensions in Section 5. A pairing with all three green tags is ideal; amber tags signal a trade-off the player should be aware of, not a disqualification.

### Tier-Based Ranking

Results use **tier labels** instead of forced numeric ranking:

- **Top Pick** — highest-scoring pairing(s). Receives orange accent treatment.
- **Strong Option** — solid pairings that score close behind. Receives neutral treatment.

If all 2-3 pairings score within a narrow band, all may share the "Top Pick" tier. If one clearly dominates, it gets "Top Pick" and the rest get "Strong Option." This reflects the "shortlist curator" philosophy — the tool presents solid options, not a definitive #1.

### UI States

The advisor has three distinct states:

1. **Initial load** — All rarity checkboxes pre-checked (most permissive). Location, squad, focus, and range are unselected. The results area shows an onboarding prompt directing the player to select a location. No weapon cards are visible. This ensures the page always starts fresh (no remembered filters across sessions) while keeping friction low — one click on a location pill is enough to generate results.

2. **Results** — 2-3 pairings displayed in a 3-column grid (desktop) or single-column stack (mobile). Each column card shows the primary and secondary weapon with type/rarity badges and synergy tags. A context echo line below the filter bar confirms the active filters (e.g., "Spaceport · Solo · PVP · Long range").

3. **Empty state** — Shown when the filter combination yields zero viable pairings (e.g., Common-only + Long range). Displays a clear message ("No pairings match these filters") with guidance to broaden filters. Visually distinct from the initial load state — this is "we tried but found nothing" vs. "we haven't tried yet."

## 5. What Makes a Good Pairing

A good weapon pair covers multiple complementary dimensions:

1. **Range coverage** — Primary handles one range band, secondary covers the gap
2. **Ammo diversity** — Different ammo pools so the player never runs completely dry
3. **Role split** — One weapon for PvE threats, one for PvP encounters (or versatile for both)

No single dimension dominates — it's the holistic combination that matters.

## 6. Scoring Model (V1)

Primary weapon scoring factors:

1. Location fit
2. Solo/squad fit (versatility vs. specialization, risk tolerance)
3. Focus fit (PvE/PvP blend)
4. Preferred range fit

Secondary weapon scoring focuses on complementing the primary:

1. Ammo diversity
2. Range coverage diversity
3. Role diversity

## 7. Failure Modes

These outcomes would kill user trust and adoption:

1. **Too generic** — Same recommendations regardless of inputs. If location and playstyle don't meaningfully shift results, the tool adds no value.
2. **Missing known-good weapons** — If experienced players see that weapons they know are strong never appear in results, they'll assume the data is wrong and stop using the tool.

## 8. Technical Scope

### In Scope (V1)

1. Advisor input normalization
2. Hard filtering (rarity)
3. Primary and secondary ranking
4. Tie-bucket behavior
5. Golden matrix harness for regression checks

### Out of Scope (V1)

1. Stealth filter (occasional need — add as post-MVP enhancement)
2. Open-in-builder link (convenience — player can navigate manually)
3. Economy-aware ranking (rarity filters access only; cost-influenced ranking comes later)
4. Attachment recommendation engine
5. Material budget constraint modeling
6. Weapon level recommendations
7. Shareable URL state for advisor fields
8. Why-not comparison narratives
9. Per-pairing reasoning text (synergy tags cover the "why" for V1)

## 9. Phase 2+ Roadmap (Future)

Recommended sequence after V1 weapon-pairing quality is stable:

1. Add stealth preference filter
2. Add open-in-builder links for recommended weapons
3. Add shareable URL state for advisor inputs
4. Introduce economy-aware ranking (prefer cheaper weapons for high-risk runs)
5. Introduce material availability filtering
6. Add attachment recommendations using goal-based layouts from presets.ts
7. Swap attachment rarities based on available materials
8. Add optional reasoning text per pairing (1-2 sentence explanations for theory-crafters)
