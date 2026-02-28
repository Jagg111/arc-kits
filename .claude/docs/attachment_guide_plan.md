# Attachment Guide System — Implementation Plan

**Overall Progress:** `8%`

## TLDR

Replace the abstract goal preset system (`GOAL_PRESETS`) with hand-crafted per-weapon attachment guides. Each weapon gets a curated list of builds (ordered by investment level), an avoid list, conditionals, and tactical tips. The Advisor gains new crafting material filters to auto-select a recommended build per weapon. The Builder shows all builds for browsing. Both systems share the same guide data layer.

Source images for all weapon guides live in `/attachment-images/` (18 weapons).

---

## Critical Decisions

- **Replace, not augment**: The old 6-goal preset system (fix, budget, recoil, stealth, pvp, arc) is fully replaced. No coexistence. `GOAL_PRESETS`, `GoalPreset`, `GoalBuild`, `GoalCard.tsx`, `selectedGoal` state — all removed.
- **Budget = build order**: Builds are ordered by index (0 = best investment, last = cheapest). No separate budget field. This ordering matters in the Builder (browsing) and in the Advisor (auto-pick prefers lowest index among eligible builds).
- **Human-readable build names**: Each build carries a `name` field (e.g., "Tempest - Long Range", "Stitcher - Short - Medium"). These get surfaced in the Builder UI.
- **Range as string arrays**: Each build tagged with `["close"]`, `["close", "mid"]`, etc. — not numeric meters. Standardized on `close / mid / long` vocabulary matching the Advisor. Image label mappings: "Short" → `close`, "Medium" → `mid`, "Long" → `long`. Compound labels like "Short - Medium" → `["close", "mid"]`, "Short - Medium - Long" → `["close", "mid", "long"]`.
- **Build-level filtering**: Advisor filters exclude entire builds, not individual slots. Slot-level downgrading is a future enhancement.
- **Crafting material toggles**: Advisor uses 4 checkboxes — Mechanical Components (default ON), Mod Components (auto-enables Mech), Kinetic Converter, Horizontal Grip. No rarity labels or abstract budget tiers.
- **Builder shows all builds**: No filtering in the Builder — users see the full gamut tagged by range and rarity. The Advisor is where filtering happens.
- **Deep link via URL params**: Advisor's "Build →" button pre-selects attachments using the existing `useBuildUrl` query param system.
- **Prototype before coding UI**: Both Builder UI overhaul and Advisor attachment display need HTML prototypes before implementation.
- **Excluded weapons**: Jupiter, Equalizer, Hairpin get no guides (no slots or irrelevant).
- **Anvil Splitter**: Included in Builder guide data (it's a valid build), but excluded from Advisor auto-selection (too niche for a single-weapon Legendary toggle).

---

## Refined Behavioral Details

### Crafting Filter → Build Eligibility Logic

The crafting checkboxes map to mod rarity tiers. A build is eligible only if **every mod** in it passes:

| Mod Rarity | Required Checkbox |
|---|---|
| Common | _(always available — base materials only)_ |
| Uncommon | Mechanical Components |
| Rare | Mod Components _(auto-enables Mechanical Components)_ |
| Epic | Mod Components _(Extended Barrel, Padded Stock, Lightweight Stock all cost Mod Components)_ |
| Legendary (KC) | Kinetic Converter toggle |
| Legendary (HG) | Horizontal Grip toggle |

**Weakest-link rule**: The highest-rarity craftable mod in a build determines the minimum checkbox needed. If a build has Compensator 2 (Uncommon) + Angled Grip 3 (Rare) + Medium Mag 1 (Common), it requires the Mod Components checkbox. Legendary items are independent toggles checked in addition to whatever covers the other mods.

**Default state**: Mechanical Components is ON by default. This covers Uncommon mods and ensures most cheapest builds are eligible out of the box. Users can uncheck it to see only all-Common builds (fallback behavior).

**Fallback when no builds qualify**: If crafting + range filters exclude all builds for a weapon, fall back to the cheapest build (last index) regardless of filters. This prevents empty attachment displays.

**Silencer III (Epic, found-only)**: Never appears in any guide build recommendation, so no special handling needed. It has no crafting cost and is found-only, but since it's not in any build data, the filter system never encounters it.

### Advisor Attachment Display

- When the Advisor recommends a weapon pairing, each weapon shows its best eligible build's full attachment layout
- **All slots shown** — including intentionally blank/empty ones (e.g., Ferro's Grip slot shows as empty)
- Each filled slot shows: mod image, mod name, and rarity indicator
- The existing weapon rarity filter (Common/Uncommon/Rare/Epic weapons) and crafting material filters are **completely separate axes** — rarity filters control which weapons get recommended, crafting filters control which attachment builds get shown
- Existing weapon recommendation engine logic is untouched by this feature

### Builder Workflow

1. **Entry point**: User selects a weapon → sees the build list (replaces old goal cards)
   - All builds shown with human-readable names, range tags, rarity indicators
   - "Build Manually" option available for blank-slate entry
   - Weapon tips and explanations always visible (not hidden behind build selection)
2. **Select a build**: Click a build → its attachments get applied to slots → transitions to slot editing view
   - No persistent "active build" tracking — the build identity is not preserved after application
   - The applied build becomes just regular equipped mods, same as a manual build
3. **Customize**: User can freely modify any slot via the ModDrawer
   - Avoid warnings shown on relevant mods in the drawer (mod name + reason text)
   - Conditionals surfaced separately from avoids
4. **Reset**: "Back to build list" clears all equipped mods (full reset) and returns to step 1
   - No concept of "drift" tracking — it's a clean reset

### Data Model Concepts

- **Avoid list**: Per-weapon array of `{ mod: string, reason: string }`. Simple for V1 — just mod name and reason text. No exceptions or condition fields yet (future enhancement). Displayed as visual cues in the ModDrawer.
- **Conditionals**: Per-weapon array, separate from avoids. These are "CAN BE USED, BUT..." items (e.g., "Horizontal Grip can be used on Tempest but -30% ADS"). Modeled as a distinct field on the guide, not lumped into tips or avoids.
- **Tips**: Per-weapon array of strings. Weapon-level advice (not tied to specific builds). Surfaced in the Builder screen. If a tip is specifically about a mod (e.g., "Compensators are the only muzzle option"), it's still a weapon-level tip — mod-specific detail lives in the mod data itself.
- **"Not Needed" slots**: Builds that show "Not Needed" for a slot simply omit that slot from the build's `slots` record (same pattern as old preset system where missing slot = no mod). The Advisor display still renders these as visually blank slots.

### Rarity Corrections (Step 2)

These three mods are currently keyed as `Rare` in `mods.ts` but should be `Epic`:
- **Extended Barrel** — single tier, has crafting cost (`2x Mod Components, 8x Wires`), keeps its cost
- **Padded Stock** — single tier, has crafting cost (`2x Mod Components, 5x Duct Tape`), keeps its cost
- **Lightweight Stock** — single tier, has crafting cost (`2x Mod Components, 5x Duct Tape`), keeps its cost

The `poor` field is fully removed from the `ModFamily` interface and all mod data. The new per-weapon avoid lists replace its purpose entirely.

### Tier Number → Rarity Mapping (for image transcription)

When transcribing from guide images, tier numbers map to:
- **1** = Common
- **2** = Uncommon
- **3** = Rare

Single-tier mods (Extended Barrel, Padded Stock, Lightweight Stock, Silencer III, Shotgun Silencer, Horizontal Grip, Kinetic Converter, Anvil Splitter) don't use tier numbers — they have a fixed rarity.

### Guide Image Notes

- `osprey.png`: All builds are for Osprey despite some being mislabeled as "Renegade" in the screenshot. Treat all as Osprey builds.
- Guide data will be seeded from the images as-is. The owner will personally refine and adjust templates over time. Some weapons may eventually need additional all-Common cheapest builds to accommodate the zero-checkbox scenario, but that's a future data cleanup pass — not blocking implementation.

---

## Tasks

- [x] 🟩 **Step 1: HTML prototypes**
  - [x] 🟩 Prototype Builder UI: build list presentation with range + rarity tags, tips display, avoid info, "Build Manually" option, back-to-list reset flow
  - [x] 🟩 Prototype Advisor: crafting material filter checkboxes layout + recommended build display on pairing cards (full slot layout with mod images/names/rarity, including blank slots) — **R3 gallery layout approved** (`prototypes/advisor/CLAUDE-r3-final.html`)
  - [ ] 🟥 Review and iterate on prototypes before proceeding to implementation
  - [ ] 🟥 Review final prototypes and note any changes needed to this plan and future steps to accomodate — No plan changes needed; R3 gallery layout is compatible with all planned steps

- [ ] 🟥 **Step 2: Fix mod rarity data in `mods.ts`**
  - [ ] 🟥 Change Extended Barrel from `Rare` to `Epic` (key change in `tiers` object)
  - [ ] 🟥 Change Padded Stock from `Rare` to `Epic`
  - [ ] 🟥 Change Lightweight Stock from `Rare` to `Epic`
  - [ ] 🟥 Remove `poor` field from `ModFamily` interface in `types/index.ts`
  - [ ] 🟥 Remove `poor` arrays from all mod families in `mods.ts` (Compensator, Muzzle Brake, Angled Grip, Vertical Grip, Horizontal Grip, Kinetic Converter)

- [ ] 🟥 **Step 3: Define new types in `types/index.ts`**
  - [ ] 🟥 Add `WeaponGuide` interface: `{ builds: GuideBuild[], avoid: AvoidEntry[], conditionals: ConditionalEntry[], tips: string[] }`
  - [ ] 🟥 Add `GuideBuild` interface: `{ name: string, range: RangeBucket[], slots: EquippedState, advisorEligible?: boolean }`
  - [ ] 🟥 Add `AvoidEntry` interface: `{ mod: string, reason: string }`
  - [ ] 🟥 Add `ConditionalEntry` interface: `{ mod: string, note: string }` (or similar — "CAN BE USED, BUT..." items)
  - [ ] 🟥 Add `WeaponGuides` type: `Record<string, WeaponGuide>`
  - [ ] 🟥 Add `RangeBucket` type: `"close" | "mid" | "long"`
  - [ ] 🟥 Add `AdvisorCraftingFilters` type: `{ mechanicalComponents: boolean, modComponents: boolean, kineticConverter: boolean, horizontalGrip: boolean }`
  - [ ] 🟥 Remove old `GoalPreset` and `GoalBuild` types

- [ ] 🟥 **Step 4: Build guide data for all weapons**
  - [ ] 🟥 Create `src/data/guides.ts` with `WEAPON_GUIDES: WeaponGuides` (replaces `presets.ts`)
  - [ ] 🟥 Transcribe builds from all 18 guide images into `GuideBuild` objects
  - [ ] 🟥 Map tier numbers from images to actual rarities using `mods.ts` (e.g., "Compensator 3" → `{ fam: "Compensator", tier: "Rare" }`)
  - [ ] 🟥 Convert meter-based ranges to `close / mid / long` bucket arrays
  - [ ] 🟥 Mark Anvil Splitter builds with `advisorEligible: false`
  - [ ] 🟥 Encode avoid lists per weapon (mod name + reason string)
  - [ ] 🟥 Encode conditionals per weapon (mod name + note string)
  - [ ] 🟥 Add tips strings per weapon

- [ ] 🟥 **Step 5: Update `useWeaponBuilder` hook**
  - [ ] 🟥 Replace `applyGoalBuild` with `applyGuideBuild(buildIndex: number)` that reads from guide data
  - [ ] 🟥 Remove `selectedGoal` state entirely — no persistent "active build" tracking
  - [ ] 🟥 Applying a build just sets `equipped` state (same as old goals, but from new data)
  - [ ] 🟥 Add `resetToBuilds()` action that clears `equipped` and returns to build list view
  - [ ] 🟥 Handle weapons with no guide (Jupiter, Equalizer, Hairpin) gracefully — show lockdown message

- [ ] 🟥 **Step 6: Builder UI overhaul**
  - [ ] 🟥 Replace goal card grid in `WeaponBuilder.tsx` with new build list component (based on Step 1 prototype)
  - [ ] 🟥 Each build shows: human-readable name, range tags, rarity indicators
  - [ ] 🟥 "Build Manually" option enters slot editing view with blank slate
  - [ ] 🟥 Display weapon tips throughout the builder experience (not hidden by build selection)
  - [ ] 🟥 Display conditionals distinctly from tips and avoids
  - [ ] 🟥 "Back to build list" button clears equipped mods and returns to build list
  - [ ] 🟥 Update `StatsSummaryBar.tsx` mobile build picker to use new build list
  - [ ] 🟥 Remove `GoalCard.tsx` component

- [ ] 🟥 **Step 7: ModDrawer avoid warnings**
  - [ ] 🟥 Look up current weapon's avoid list when rendering mod options
  - [ ] 🟥 Show warning indicator on avoided mods in the drawer (with reason on hover/tap)
  - [ ] 🟥 Visual cues only for V1 — no exceptions or conditions logic, just mod name + reason text

- [ ] 🟥 **Step 8: Add Advisor crafting filter state**
  - [ ] 🟥 Add crafting filter state to `useAdvisorFilters` hook with defaults: `{ mechanicalComponents: true, modComponents: false, kineticConverter: false, horizontalGrip: false }`
  - [ ] 🟥 Implement auto-enable logic: checking Mod Components forces Mechanical Components ON; unchecking Mechanical Components forces Mod Components OFF

- [ ] 🟥 **Step 9: Advisor build selection logic**
  - [ ] 🟥 Write `selectBuildForAdvisor(weaponId, preferredRange, craftingFilters)` function
  - [ ] 🟥 Filter out builds with `advisorEligible: false` (Anvil Splitter builds)
  - [ ] 🟥 Filter builds by crafting eligibility: for each mod in the build, check rarity against enabled filters using the weakest-link rule
  - [ ] 🟥 Among eligible builds, pick the lowest index (best investment) whose range array intersects with the Advisor's range filter
  - [ ] 🟥 Handle "any" range (matches all builds on range)
  - [ ] 🟥 Fallback: if no builds qualify after all filters, return the cheapest build (last index)

- [ ] 🟥 **Step 10: Advisor UI — crafting filters + build display**
  - [ ] 🟥 Add crafting material checkboxes to `AdvisorFilterBar.tsx` (Mechanical Components, Mod Components, KC, HG)
  - [ ] 🟥 Wire filters to build selection logic so each recommended weapon shows its best eligible build
  - [ ] 🟥 Implement build display on pairing cards: show all weapon slots (including blank ones), each filled slot with mod image + name + rarity (based on Step 1 prototype)

- [ ] 🟥 **Step 11: Advisor → Builder deep link**
  - [ ] 🟥 Update "Build →" button to encode the recommended build's attachments into URL params via existing `useBuildUrl` system
  - [ ] 🟥 Ensure Builder loads with those attachments pre-equipped when navigated to from Advisor

- [ ] 🟥 **Step 12: Cleanup**
  - [ ] 🟥 Remove old `GOAL_PRESETS` data from `presets.ts` (or delete file entirely)
  - [ ] 🟥 Remove old goal-related imports and dead code paths across all files
  - [ ] 🟥 Verify build still passes (`npm run build`)
