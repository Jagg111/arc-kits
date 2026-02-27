# Attachment Guide System — Implementation Plan

**Overall Progress:** `0%`

## TLDR

Replace the abstract goal preset system (`GOAL_PRESETS`) with hand-crafted per-weapon attachment guides. Each weapon gets a curated list of builds (ordered by investment level), an avoid list, and tactical tips. The Advisor gains new crafting material filters to auto-select a recommended build per weapon. The Builder shows all builds for browsing. Both systems share the same guide data layer.

## Critical Decisions

- **Replace, not augment**: The old 6-goal preset system (fix, budget, recoil, stealth, pvp, arc) is fully replaced. No coexistence.
- **Budget = build order**: Builds are ordered by index (0 = best investment, last = cheapest). No separate budget field.
- **Range as string arrays**: Each build tagged with `["close"]`, `["close", "mid"]`, etc. — not numeric meters. Standardized on `close / mid / long` vocabulary matching the Advisor.
- **Build-level filtering**: Advisor filters exclude entire builds, not individual slots. Slot-level downgrading is a future enhancement.
- **Crafting material toggles**: Advisor uses 4 checkboxes — Mechanical Components, Mod Components (auto-enables Mech), Kinetic Converter, Horizontal Grip. No rarity labels or abstract budget tiers.
- **Builder shows all builds**: No filtering in the builder — users see the full gamut tagged by range and rarity. The Advisor is where filtering happens.
- **Deep link via URL params**: Advisor's "Build →" button pre-selects attachments using the existing `useBuildUrl` query param system.
- **Prototype before coding UI**: Both Builder UI overhaul and Advisor attachment display need HTML prototypes before implementation.
- **Excluded weapons**: Jupiter, Equalizer, Hairpin get no guides (no slots or irrelevant).

## Tasks

- [ ] 🟥 **Step 1: HTML prototypes**
  - [ ] 🟥 Prototype Builder UI: build list presentation with range + rarity tags, tips display, avoid info
  - [ ] 🟥 Prototype Advisor: crafting material filter checkboxes layout + recommended build display on pairing cards
  - [ ] 🟥 Review and iterate on prototypes before proceeding to implementation

- [ ] 🟥 **Step 2: Fix mod rarity data in `mods.ts`**
  - [ ] 🟥 Change Extended Barrel from Rare to Epic
  - [ ] 🟥 Change Padded Stock from Rare to Epic
  - [ ] 🟥 Change Lightweight Stock from Rare to Epic
  - [ ] 🟥 Remove `poor` field from all mod families

- [ ] 🟥 **Step 3: Define new types in `types/index.ts`**
  - [ ] 🟥 Add `WeaponGuide`, `GuideBuild`, `AvoidEntry`, `SlotAdvice` interfaces
  - [ ] 🟥 Add `WeaponGuides` type (`Record<string, WeaponGuide>`)
  - [ ] 🟥 Add `RangeBucket` type (`"close" | "mid" | "long"`)
  - [ ] 🟥 Remove old `GoalPreset` and `GoalBuild` types

- [ ] 🟥 **Step 4: Build guide data for all weapons**
  - [ ] 🟥 Transcribe builds from all 18 guide images into new data structure (replacing `presets.ts`)
  - [ ] 🟥 Map tier numbers from images to actual rarities using `mods.ts` (e.g., "Compensator 3" → Compensator, Rare)
  - [ ] 🟥 Convert meter-based ranges to `close / mid / long` bucket arrays
  - [ ] 🟥 Encode avoid lists per weapon with reasons and exceptions
  - [ ] 🟥 Add tips/conditional advice strings per weapon

- [ ] 🟥 **Step 5: Update `useWeaponBuilder` hook**
  - [ ] 🟥 Replace `applyGoalBuild` with new build selection logic that reads from guide data
  - [ ] 🟥 Remove `selectedGoal` state, replace with `selectedBuild` (index into weapon's guide builds)
  - [ ] 🟥 Support applying a guide build to `equipped` state (same as goals did, but from new data)
  - [ ] 🟥 Handle weapons with no guide (Jupiter, Equalizer, Hairpin) gracefully

- [ ] 🟥 **Step 6: Builder UI overhaul**
  - [ ] 🟥 Replace goal card grid in `WeaponBuilder.tsx` with new build list component (based on Step 1 prototype)
  - [ ] 🟥 Tag each build with range and rarity indicators
  - [ ] 🟥 Display weapon tips and conditional advice
  - [ ] 🟥 Update `StatsSummaryBar.tsx` mobile build picker
  - [ ] 🟥 Remove or repurpose `GoalCard.tsx`

- [ ] 🟥 **Step 7: ModDrawer avoid warnings**
  - [ ] 🟥 Look up current weapon's avoid list when rendering mod options
  - [ ] 🟥 Show warning indicator on avoided mods in the drawer (with reason on hover/tap)
  - [ ] 🟥 Show alert when an avoided mod is actively equipped (for manual builds only — guide builds never include avoided mods)

- [ ] 🟥 **Step 8: Add Advisor attachment filter types and state**
  - [ ] 🟥 Add `AdvisorCraftingFilters` type: `{ mechanicalComponents: boolean, modComponents: boolean, kineticConverter: boolean, horizontalGrip: boolean }`
  - [ ] 🟥 Add crafting filter state to `useAdvisorFilters` hook
  - [ ] 🟥 Implement auto-enable logic (checking Mod Components forces Mechanical Components on; unchecking Mechanical Components forces Mod Components off)

- [ ] 🟥 **Step 9: Advisor build selection logic**
  - [ ] 🟥 Write function to pick best build for a weapon given: preferred range + crafting filters
  - [ ] 🟥 Filter builds by crafting eligibility (check each mod's rarity against what materials are available + found-only toggles)
  - [ ] 🟥 Among eligible builds, pick the lowest index (best investment) whose range array intersects with the Advisor's range filter
  - [ ] 🟥 Handle "any" range (matches all builds) and range-irrelevant weapons (shotguns, Ferro)

- [ ] 🟥 **Step 10: Advisor UI — crafting filters + build display**
  - [ ] 🟥 Add crafting material checkboxes to `AdvisorFilterBar.tsx` (Mechanical Components, Mod Components, KC, HG)
  - [ ] 🟥 Wire filters to build selection logic so each recommended weapon shows its best eligible build
  - [ ] 🟥 Implement build display on pairing cards (based on Step 1 prototype)

- [ ] 🟥 **Step 11: Advisor → Builder deep link**
  - [ ] 🟥 Update "Build →" button to encode recommended attachments into URL params via existing `useBuildUrl` system
  - [ ] 🟥 Ensure builder loads with pre-selected attachments when navigated to from Advisor

- [ ] 🟥 **Step 12: Cleanup**
  - [ ] 🟥 Remove old `GOAL_PRESETS` data and all references
  - [ ] 🟥 Remove old goal-related imports and dead code paths
  - [ ] 🟥 Verify build still passes (`npm run build`)
