# Attachment Guide System — Implementation Plan

**Overall Progress:** `10%`

## TLDR

Replace the abstract goal preset system (`GOAL_PRESETS`) with hand-crafted per-weapon attachment guides. Each weapon gets a curated list of builds (ordered by investment level), an avoid list, conditionals, and tactical tips. The Advisor gains new crafting material filters to auto-select a recommended build per weapon. The Builder shows all builds for browsing. Both systems share the same guide data layer.

Source images for all weapon guides live in `/attachment-images/` (18 weapons).

---

## Critical Decisions

- **Replace, not augment**: The old 6-goal preset system (fix, budget, recoil, stealth, pvp, arc) is fully replaced. No coexistence. `GOAL_PRESETS`, `GoalPreset`, `GoalBuild`, `GoalCard.tsx`, `selectedGoal` state — all removed.
- **Budget = build order**: Builds are ordered by index (0 = best investment, last = cheapest). No separate budget field. This ordering matters in the Builder (browsing) and in the Advisor (auto-pick prefers lowest index among eligible builds).
- **Build names = range labels**: Each build's `name` field is just the range string (e.g., "Short - Medium", "Long", "Short"). The weapon name is never embedded in the build name — it can be derived at render time if ever needed. These range labels are what get surfaced in the Builder UI as the build card's primary label.
- **Range as string arrays**: Each build tagged with `["close"]`, `["close", "mid"]`, etc. — not numeric meters. Standardized on `close / mid / long` vocabulary matching the Advisor. Image label mappings: "Short" → `close`, "Medium" → `mid`, "Long" → `long`. Compound labels like "Short - Medium" → `["close", "mid"]`, "Short - Medium - Long" → `["close", "mid", "long"]`.
- **Build-level filtering**: Advisor filters exclude entire builds, not individual slots. Slot-level downgrading is a future enhancement.
- **Crafting material toggles**: Advisor uses 4 checkboxes — Mechanical Components (default ON), Mod Components (auto-enables Mech), Kinetic Converter, Horizontal Grip. No rarity labels or abstract budget tiers.
- **Builder shows all builds**: No filtering in the Builder — users see the full gamut tagged by range and rarity. The Advisor is where filtering happens.
- **Deep link via URL params**: Advisor's "Customize →" button pre-selects attachments using the existing `useBuildUrl` query param system.
- **Prototype before coding UI**: Both Builder UI overhaul and Advisor attachment display have finalized HTML prototypes for reference.
- **Excluded weapons**: Jupiter, Equalizer, Hairpin get no guides (they have no attachment slots or irrelevant).
- **Anvil Splitter**: Included in Builder guide data (it's a valid build), but excluded from Advisor auto-selection (too niche for a single-weapon Legendary toggle).
- **Two builder screens**: This plan covers the **build list screen** (shown after clicking a weapon from the weapon list) and the **full builder/customizer screen** (where you swap individual attachments via the ModDrawer). The build list screen gets a full overhaul per the R4 prototype (`prototypes/builder/build-list-r4.html`). The full builder/customizer screen (with the mod drawer) is mostly left alone — the only changes are removing the goal picker sidebar section and in its place adding a "Back to builds" link.

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
- Each filled slot shows: mod image (from `mods.ts` tier data `tiers[rarity].img`), abbreviated mod name, and rarity indicator (colored border on the icon)
- Empty slots render as dashed-border containers with slot type label
- The existing weapon rarity filter (Common/Uncommon/Rare/Epic weapons) and crafting material filters are **completely separate axes** — rarity filters control which weapons get recommended, crafting filters control which attachment builds get shown
- Existing weapon recommendation engine logic is untouched by this feature
- **"Customize →" button** replaces the current "Build →" button label. It encodes the recommended build's attachments into URL params and navigates to the Builder with those mods pre-loaded
- **"No attachment guide" state**: Weapons with no guide data (e.g., Hairpin) show a simple italic "No attachment guide" text line instead of a mod gallery. No dashed placeholders.
- **WeaponBlock.tsx restructuring** (see Step 10 for details): Rarity badge moves inline with weapon name, "Customize →" becomes the sole meta row element, new mod gallery row appears below

### Builder Workflow

This plan covers **two distinct screens** in the builder flow:

#### Screen 1: Build List (full overhaul per R4 prototype)

1. **Entry point**: User selects a weapon → sees the build list (replaces old goal cards)
   - All builds shown with range labels, crafting requirement tags, mod gallery previews
   - "Build Manually" is a text link in the builds header subtitle (e.g., "Select a set to enter builder, or build manually") — not a full-size tile card like the old "Build Manually" option
   - Weapon tips, avoids, conditionals, and weakness are always visible in the sidebar (desktop) / collapsible accordion (mobile)
2. **Select a build**: Click a build card → its attachments get applied to slots → transitions to the full builder/customizer screen (Screen 2)
   - No persistent "active build" tracking — the build identity is not preserved after application
   - The applied build becomes just regular equipped mods, same as a manual build
3. **Build Manually**: Click the "build manually" link → transitions to Screen 2 with blank slate (no mods equipped)

#### Screen 2: Full Builder/Customizer (mostly unchanged)

The existing slot editing view with the ModDrawer. Changes are minimal:
1. **Remove the goal picker sidebar section** — the "Quick Start" goal list and collapsed active-goal display are removed entirely
2. **Add "Back to builds" link** — replaces the old goal-switching UI. Clicking it clears all equipped mods and returns to Screen 1 (the build list)
3. **Keep everything else** — cumulative effects sidebar, cost breakdown, attachment slot grid, ModDrawer, StatsSummaryBar, "Clear All Attachments" button all remain as-is
4. **Avoid warnings in ModDrawer** — new addition (Step 7): show warning indicators on avoided mods

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

**Note on `RARITY_LABELS`**: The constant in `constants.ts` maps both Rare and Epic to `"III"`. This is expected and correct — the three mods above are single-tier mods that don't use tier numbers. Do not change `RARITY_LABELS` as part of this work.

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

## Shared Components & Utilities

These new shared pieces are used by both the Builder and Advisor and should be built as reusable components/utilities.

### `src/components/shared/ModGallery.tsx`

A reusable mod gallery component showing a row of mod icons with labels. Used by both `BuildCard.tsx` (Builder) and `WeaponBlock.tsx` (Advisor).

**Props:**
- `mods: Array<{ slot: string, family: string, tier: Rarity }>` — the build's mod selections
- `weaponId: string` — needed to look up mod images from `mods.ts` (find the matching `ModFamily` by `fam` name within the slot's family array, then read `tiers[tier].img`)
- `allSlots: string[]` — the weapon's full slot list, so empty/unequipped slots can be rendered as dashed placeholders with the slot type label
- `compact?: boolean` — controls sizing. Desktop: 36px icons, 10px labels, `flex: 0 1 80px` items. Mobile: 30px icons, 9px labels, `flex: 0 1 70px` items

**Layout:** `display: flex; justify-content: flex-start; gap: 6px` (Builder) or `justify-content: center; gap: 12px` (Advisor). Each item is a vertical column: icon on top, abbreviated label below. Icons have a 2px solid rarity-colored border (`RARITY_COLORS[tier]`). Empty slots show a dashed border container with the slot type name.

**Image source:** Each mod's image comes from `MOD_FAMILIES[slot].find(f => f.fam === family).tiers[tier].img`. This is the wiki thumbnail URL already present in `mods.ts` for most tiers. If `img` is undefined, fall back to a colored square placeholder using `RARITY_COLORS[tier]`.

### `src/utils/abbreviate.ts`

A utility function `abbreviateModName(name: string): string` that shortens mod names for gallery labels. Applied universally (not mobile-only) — the gallery's flex wrapping handles text length at any width.

**Abbreviation rules (applied via word-level find-replace):**
- "Compensator" → "Comp."
- "Extended" → "Ext."
- "Light" (as in Light Mag) → "Lt."
- "Magazine" → "Mag"
- "Shotgun" → "SG"
- "Vertical" → "Vert."
- "Medium" → "Med."
- "Muzzle Brake" → stays as-is (recognizable, wraps naturally)
- "Stable Stock" → stays as-is
- "Angled Grip" → stays as-is
- Tier suffixes (I, II, III) always shown, appended after the abbreviated name

These abbreviation rules are consistent between Builder and Advisor — same function, same output everywhere.

### `src/components/builder/BuildCard.tsx`

Replaces `GoalCard.tsx`. A single build card in the build list. See Step 6 for full details.

---

## Builder UI Specifications (from R4 Prototype)

These specifications come directly from the finalized R4 prototype (`prototypes/builder/build-list-r4.html`) and should be followed exactly.

### Weapon Header Changes

The current `WeaponHeader.tsx` gets simplified. **Remove** the class, ammo, PVP grade, and ARC grade badges from the visual output. **Add** the weapon image. **Move** the weakness callout out of the header and into the sidebar/accordion intel section instead.

**New layout:**
- **Desktop**: Flex row with weapon image (120px wide, `drop-shadow`) + text column (weapon name at 28px bold + rarity label as colored text inline on the same baseline + weapon `desc` text below)
- **Mobile**: Same flex row but weapon image at 80px wide, name at 20px bold

**Important**: The underlying data fields (`weaponClass`, `ammoType`, `pvp`, `arc`) remain in `weapons.ts` — only the visual rendering in `WeaponHeader.tsx` changes. The `WEAPON_IMAGES` map in `constants.ts` already has all weapon image URLs.

### Build List Layout

**Desktop (lg+ breakpoint):** 2-column grid with `grid-template-columns: 1fr 280px`.
- **Left column**: Build list header + build cards stacked vertically
- **Right column**: Sticky sidebar (`top: 76px`) with "Weapon Intel" section containing callout panels

**Mobile (<lg breakpoint):** Single column.
- Weapon header → collapsible intel accordion (collapsed by default) → build list header + cards

### Build List Header

A flex row with:
- "SUGGESTED ATTACHMENTS" label (14px bold uppercase, `text-muted`)
- Subtitle text: "Select a set to enter builder, or [build manually]" (12px, `text-muted`) where "build manually" is an accent-colored text link that enters the full builder with blank slate

### Build Card Anatomy

Each card is a clickable row with:

1. **Numbered circle** (22px diameter) — sequential build number (1, 2, 3...) colored by highest-rarity mod in the build
2. **Card body** containing:
   - **Top row**: Range label (14px semibold, e.g., "Short - Medium") + dot separator (`·`) + crafting requirement label (10px, colored by max rarity)
   - **Mod gallery row**: `ModGallery` component showing the build's mods
3. **Chevron** (`>` arrow, 16px) — right-aligned, animates `translateX(2px)` on card hover and changes to accent color
4. **Left border accent** — 3px solid, colored by highest-rarity mod at graduated opacity

**Card hover state**: Border transitions to `color-mix(in srgb, var(--color-accent) 50%, transparent)`, background gets subtle accent tint.

### Graduated Visual Hierarchy

The left border color, numbered circle color, and crafting requirement label are all determined by the **highest-rarity mod** in each build. Iterate the build's `slots`, look up each mod's `tier` rarity, find the max using `RARITY_ORDER` from `constants.ts`:

| Max Rarity | Left Border | Circle | Crafting Label |
|---|---|---|---|
| Legendary | `color-mix(in srgb, var(--color-rarity-legendary) 50%, transparent)` | gold bg/text | "Requires Legendaries" (gold) |
| Epic | `color-mix(in srgb, var(--color-rarity-epic) 45%, transparent)` | pink bg/text | "Requires Mod Components" (pink) |
| Rare | `color-mix(in srgb, var(--color-rarity-rare) 40%, transparent)` | blue bg/text | "Requires Mod Components" (blue) |
| Uncommon | `color-mix(in srgb, var(--color-rarity-uncommon) 35%, transparent)` | green bg/text | "Requires Mech Components" (green) |
| Common | `var(--color-border-subtle)` | gray bg/text | "Base Materials" (`text-faint`) |

Note: Epic and Rare both say "Mod Components" — the color differentiates them visually.

The circle uses `color-mix(in srgb, var(--color-rarity-X) N%, transparent)` for the background, with the full rarity color for text.

### Weapon Intel Sidebar (Desktop)

Always-visible sticky sidebar. Contains callout panels in this order:

1. **Weakness callout** (orange left border, `callout-weakness`): Shows `weapon.weakness` text. Title: "KNOWN WEAKNESS" with warning icon.
2. **Tips callout** (orange left border, `callout-tip`): Shows `guide.tips[]` as a bulleted list. Title: "TIPS" with lightbulb icon. Bold mod names within tip text.
3. **Avoid callout** (red left border, `callout-avoid`): Shows `guide.avoid[]` entries. Title: "AVOID" with warning icon. Each entry: bold mod name + reason text.
4. **Conditional callout** (amber/warning left border, `callout-conditional`): Shows `guide.conditionals[]`. Title: "CONDITIONAL" with info icon. Each entry: bold mod name + note text.

Only render callout panels that have content. The sidebar title is "WEAPON INTEL" (12px bold uppercase, `text-muted`).

### Weapon Intel Accordion (Mobile)

Replaces the sidebar on mobile. A collapsible accordion **collapsed by default**:
- **Toggle button**: Full-width bar reading "WEAPON INTEL" with a chevron that rotates on open. Shows a count badge (e.g., number of intel items).
- **Body**: Same callout panels as desktop sidebar, stacked vertically with 8px gap. Panels use `surface-alt` background (no border) when inside the accordion.

### Responsive Breakpoints Summary

| Aspect | Desktop (lg+) | Mobile (<lg) |
|---|---|---|
| Layout | 2-col grid (1fr 280px) | Single column |
| Sidebar | Always visible, sticky | Collapsible accordion |
| Weapon image | 120px wide | 80px wide |
| Weapon name | 28px | 20px |
| Gallery icons | 36px | 30px |
| Card padding | 14px | 12px |

---

## Tasks

- [🟩] **Step 1: HTML prototypes**
  - [🟩] Prototype Builder UI: build list presentation with range + rarity tags, tips display, avoid info, "Build Manually" option, back-to-list reset flow  — **Builde list screen prototype approved with engineering notes** (`prototypes/builder/build-list-r4.html`)
  - [🟩] Prototype Advisor: crafting material filter checkboxes layout + recommended build display on pairing cards (full slot layout with mod images/names/rarity, including blank slots) — **Advisor prototype approved with engineering notes** (`prototypes/advisor/CLAUDE-r3-final.html`)
  - [🟩] Review and iterate on prototypes before proceeding to implementation
  - [🟩] Review final prototypes and note changes to this plan — Plan updated with finer detail and changes surfaced through finalized prototypes.

- [ ] **Step 2: Fix mod rarity data in `mods.ts`**
  - [ ] Change Extended Barrel from `Rare` to `Epic` (key change in `tiers` object)
  - [ ] Change Padded Stock from `Rare` to `Epic`
  - [ ] Change Lightweight Stock from `Rare` to `Epic`
  - [ ] Remove `poor` field from `ModFamily` interface in `types/index.ts`
  - [ ] Remove `poor` arrays from all mod families in `mods.ts` (Compensator, Muzzle Brake, Angled Grip, Vertical Grip, Horizontal Grip, Kinetic Converter)
  - [ ] Verify `RARITY_LABELS` — both Rare and Epic map to "III", this is expected and correct; do not change

- [ ] **Step 3: Define new types in `types/index.ts`**
  - [ ] Add `WeaponGuide` interface: `{ builds: GuideBuild[], avoid: AvoidEntry[], conditionals: ConditionalEntry[], tips: string[] }`
  - [ ] Add `GuideBuild` interface: `{ name: string, range: RangeBucket[], slots: EquippedState, advisorEligible?: boolean }` — Note: `name` is just the range label (e.g., "Short - Medium"), not prefixed with weapon name
  - [ ] Add `AvoidEntry` interface: `{ mod: string, reason: string }`
  - [ ] Add `ConditionalEntry` interface: `{ mod: string, note: string }` (or similar — "CAN BE USED, BUT..." items)
  - [ ] Add `WeaponGuides` type: `Record<string, WeaponGuide>`
  - [ ] Add `RangeBucket` type: `"close" | "mid" | "long"`
  - [ ] Add `AdvisorCraftingFilters` type: `{ mechanicalComponents: boolean, modComponents: boolean, kineticConverter: boolean, horizontalGrip: boolean }`
  - [ ] Remove old `GoalPreset` and `GoalBuild` types

- [ ] **Step 4: Build guide data for all weapons**
  - [ ] Create `src/data/guides.ts` with `WEAPON_GUIDES: WeaponGuides` (replaces `presets.ts`)
  - [ ] Transcribe builds from all 18 guide images into `GuideBuild` objects
  - [ ] Map tier numbers from images to actual rarities using `mods.ts` (e.g., "Compensator 3" → `{ fam: "Compensator", tier: "Rare" }`)
  - [ ] Convert meter-based ranges to `close / mid / long` bucket arrays
  - [ ] Set build `name` fields to range labels only (e.g., "Short - Medium", "Long", "Short")
  - [ ] Mark Anvil Splitter builds with `advisorEligible: false`
  - [ ] Encode avoid lists per weapon (mod name + reason string)
  - [ ] Encode conditionals per weapon (mod name + note string)
  - [ ] Add tips strings per weapon

- [ ] **Step 5: Create shared components and utilities**
  - [ ] Create `src/utils/abbreviate.ts` with `abbreviateModName()` function (see Shared Components section for full abbreviation rules)
  - [ ] Create `src/components/shared/ModGallery.tsx` (see Shared Components section for full props/layout spec)
  - [ ] ModGallery should look up mod images from `MOD_FAMILIES[slot].find(f => f.fam === family).tiers[tier].img` — fall back to colored square placeholder if `img` is undefined
  - [ ] ModGallery should use `abbreviateModName()` for all labels
  - [ ] ModGallery should render empty/unequipped slots as dashed-border containers with slot type label

- [ ] **Step 6: Update `useWeaponBuilder` hook**
  - [ ] Replace `applyGoalBuild` with `applyGuideBuild(buildIndex: number)` that reads from guide data
  - [ ] Remove `selectedGoal` state entirely — no persistent "active build" tracking
  - [ ] Applying a build just sets `equipped` state (same as old goals, but from new data)
  - [ ] Add `resetToBuilds()` action that clears `equipped` and returns to build list view
  - [ ] Handle weapons with no guide (Jupiter, Equalizer, Hairpin) gracefully — show lockdown message
  - [ ] Simplify local state in `WeaponBuilder.tsx`: replace `goalDismissed` / `goalExpanded` with a single `showBuildList` boolean

- [ ] **Step 7: Builder UI overhaul — Build List Screen**
  - [ ] **Simplify `WeaponHeader.tsx`**: Remove class, ammo, PVP grade, ARC grade badges. Add weapon image (120px desktop / 80px mobile from `WEAPON_IMAGES`). Add rarity as inline colored text (not a badge). Keep `desc` text. Remove weakness callout (moves to sidebar). Keep underlying data fields intact in `weapons.ts`.
  - [ ] **Create `BuildCard.tsx`** (`src/components/builder/BuildCard.tsx`): Replaces `GoalCard.tsx`. Renders numbered circle + range label + crafting requirement tag + ModGallery + chevron. Implements graduated visual hierarchy (left border + circle colored by highest-rarity mod). See "Build Card Anatomy" and "Graduated Visual Hierarchy" sections above for exact specs.
  - [ ] **Update `WeaponBuilder.tsx` build list flow**: Replace goal card grid with build list (header + `BuildCard` stack). "Build Manually" rendered as a text link in the header subtitle, not a full tile. Desktop: 2-column grid (`1fr 280px`) with build list on left, weapon intel sidebar on right. Mobile: single column.
  - [ ] **Implement Weapon Intel sidebar** (desktop): Always-visible sticky sidebar with weakness + tips + avoid + conditional callout panels. Only render panels that have content. See "Weapon Intel Sidebar" section for styling specs.
  - [ ] **Implement Weapon Intel accordion** (mobile): Collapsible accordion collapsed by default. Toggle bar with "WEAPON INTEL" label + chevron. Same callout panels as sidebar. See "Weapon Intel Accordion" section for specs.
  - [ ] **Update `StatsSummaryBar.tsx`**: Replace `selectedGoal` + `availableGoals` goal picker section with new build list. Update props from `[string, GoalPreset][]` to `GuideBuild[]`.
  - [ ] **Remove `GoalCard.tsx`** component entirely

- [ ] **Step 8: Builder UI — Full Builder/Customizer Screen changes**
  - [ ] Remove the goal picker sidebar section from `WeaponBuilder.tsx` (the "Quick Start" goal list and collapsed active-goal display)
  - [ ] Add "Back to builds" link that clears all equipped mods and returns to the build list screen
  - [ ] Keep everything else unchanged: cumulative effects sidebar, cost breakdown, attachment slot grid, ModDrawer, "Clear All Attachments" button

- [ ] **Step 9: ModDrawer avoid warnings**
  - [ ] Look up current weapon's avoid list when rendering mod options
  - [ ] Show warning indicator on avoided mods in the drawer (with reason on hover/tap)
  - [ ] Visual cues only for V1 — no exceptions or conditions logic, just mod name + reason text

- [ ] **Step 10: Add Advisor crafting filter state**
  - [ ] Add crafting filter state to `useAdvisorFilters` hook with defaults: `{ mechanicalComponents: true, modComponents: false, kineticConverter: false, horizontalGrip: false }`
  - [ ] Implement auto-enable logic: checking Mod Components forces Mechanical Components ON; unchecking Mechanical Components forces Mod Components OFF

- [ ] **Step 11: Advisor build selection logic**
  - [ ] Write `selectBuildForAdvisor(weaponId, preferredRange, craftingFilters)` function
  - [ ] Filter out builds with `advisorEligible: false` (Anvil Splitter builds)
  - [ ] Filter builds by crafting eligibility: for each mod in the build, check rarity against enabled filters using the weakest-link rule
  - [ ] Among eligible builds, pick the lowest index (best investment) whose range array intersects with the Advisor's range filter
  - [ ] Handle "any" range (matches all builds on range)
  - [ ] Fallback: if no builds qualify after all filters, return the cheapest build (last index)

- [ ] **Step 12: Advisor UI — crafting filters + build display**
  - [ ] Add crafting material checkboxes to `AdvisorFilterBar.tsx` (Mechanical Components, Mod Components, KC, HG). Use the `pill-craft` visual style (green-tinted background, checkmark/X prefix toggle). Place on the second row, to the right of weapon rarity filters.
  - [ ] Wire filters to build selection logic so each recommended weapon shows its best eligible build
  - [ ] **Update `WeaponBlock.tsx` layout**: Move rarity badge inline with weapon name (same row, `align-items: baseline`). Rename "Build →" to "Customize →". "Customize →" becomes the sole element in a separate meta row. Add new mod gallery row below meta (only rendered when `attachmentBuild` prop is provided).
  - [ ] Add optional `attachmentBuild` prop to `WeaponBlock.tsx` — array of equipped mods for the recommended build. When absent, no gallery renders (backwards compatible).
  - [ ] Implement build display using shared `ModGallery` component: show all weapon slots (including blank ones), each filled slot with mod image + abbreviated name + rarity-colored border
  - [ ] Handle "no attachment guide" state: render italic "No attachment guide" text when no build data exists for a weapon

- [ ] **Step 13: Advisor → Builder deep link**
  - [ ] Update "Customize →" button to encode the recommended build's attachments into URL params via existing `useBuildUrl` system
  - [ ] Extend the existing `onOpenBuilder` callback pipeline (WeaponBlock → PairingCard → AdvisorResults → AdvisorPage → App) to include mod selections alongside the weapon ID
  - [ ] Ensure Builder loads with those attachments pre-equipped when navigated to from Advisor

- [ ] **Step 14: Cleanup**
  - [ ] Remove old `GOAL_PRESETS` data from `presets.ts` (or delete file entirely)
  - [ ] Remove old goal-related imports and dead code paths across all files
  - [ ] Verify build still passes (`npm run build`)
