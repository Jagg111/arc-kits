# Weapons Page & Builder Feature

Status: Shipped
As of: March 2026

## 1. Feature Overview

The builder lets players browse curated attachment guides for each weapon and customize their loadout before a run. It is the primary tool for loadout planning and pairs with the Advisor tab for weapon selection.

## 2. Two-Screen Flow

### Screen 1: Build List (entry point after selecting a weapon)

The player lands here after picking a weapon from the weapon picker. It shows all curated builds for that weapon, ordered from best investment to cheapest.

- Each build card shows: a range label (e.g., "Short - Medium"), a crafting requirement indicator, and a mod gallery preview
- A **Weapon Intel** sidebar (desktop) / collapsible accordion (mobile) shows weapon-specific tips, avoids, conditionals, and a known weakness callout
- A **"build manually"** text link lets the player skip the build list and enter Screen 2 with a blank slate

### Screen 2: Full Builder / Customizer

The slot-by-slot editing view. The player arrives here either by clicking a build card (mods pre-loaded) or the "build manually" link (blank slate).

- Attachment slots are shown for all weapon slots; clicking a slot opens the **ModDrawer**
- The ModDrawer shows all mod options for that slot, with warning indicators on any mods flagged in the weapon's avoid list
- A **cumulative effects sidebar** (desktop) / bottom bar (mobile) shows aggregated stat changes and crafting cost from all equipped mods
- A **"Back to builds"** link clears all equipped mods and returns to Screen 1

## 3. Guide Data

Each weapon's guide lives in `src/data/guides.ts` as a `WeaponGuide` object. Key fields:

- `builds: GuideBuild[]` — ordered list of builds, each with a range label, range buckets, and equipped mod selections
- `avoid: AvoidEntry[]` — mods to discourage with a reason string
- `conditionals: ConditionalEntry[]` — mods that are situationally okay with a note
- `tips: string[]` — weapon-level tactical advice

Weapons with no guide (Jupiter, Equalizer, Hairpin) show a "no attachment guide" message in the Advisor and a blank customizer in the Builder.

## 4. Key Behaviors

- **No persistent build identity** — selecting a build card applies those mods to the equipped state, but the build identity isn't tracked. The applied mods are just regular equipped mods like any manual selection.
- **Avoid warnings are visual only** — the ModDrawer shows a warning indicator + reason tooltip on avoided mods, but does not block selection.
- **URL sync** — `useBuildUrl` keeps equipped mods in sync with query params, making builds shareable and enabling the Advisor's "Customize →" deep link.

## 5. Advisor Integration

The Advisor tab's "Customize →" button navigates directly to Screen 2 with a recommended build pre-loaded. The callback pipeline threads through: `WeaponBlock` → `PairingCard` → `AdvisorResults` → `AdvisorPage` → `App.tsx`, passing both the weapon ID and the mod selections.

## 6. Key Files

| File | Role |
|---|---|
| `src/data/guides.ts` | All weapon guide data |
| `src/hooks/useWeaponBuilder.ts` | Core builder state and actions |
| `src/components/builder/WeaponBuilder.tsx` | Build list + customizer layout |
| `src/components/builder/BuildCard.tsx` | Single build card in the build list |
| `src/components/builder/AttachmentSlot.tsx` | Individual slot in the customizer |
| `src/components/builder/ModDrawer.tsx` | Mod selection drawer |
| `src/components/shared/ModGallery.tsx` | Reusable mod icon row (used in build cards and Advisor) |
| `src/utils/abbreviate.ts` | Mod name abbreviation for gallery labels |
