# Advisor Attachment Prototypes — Status

## What This Is
Prototyping how the Advisor page shows **crafting material filters** and **recommended attachment builds** on weapon pairing cards. This is Step 1 of the attachment guide plan (`.claude/docs/attachment_guide_plan.md`).

## Final Decision: R3 Gallery Layout

**`CLAUDE-r3-final.html`** is the approved prototype for engineering handoff.

Layout: 3-column grid (desktop), 1-column (mobile). Each weapon block shows a horizontal gallery of 36px rarity-colored icon squares with 10px mod name captions below each. Crafting filter pills sit in the filter bar alongside existing rarity filters.

## Prototype Files

### Round 1 (superseded)
- `CLAUDE-inline-slots.html` — Attachments inline, crafting pills in filter bar. Filter bar didn't match live app.
- `CLAUDE-compact-badges.html` — Mods as tiny dot+name badges. Too compact.
- `CLAUDE-expandable-panel.html` — Expand/collapse per weapon. **REJECTED** — extra clicks.

### Round 2 (evaluated, not selected)
- `CLAUDE-r2-slots-3col.html` — 3-col, vertical slot rows. **Not selected**: cards too tall with 4-slot weapons, doesn't fit 3 above fold.
- `CLAUDE-r2-slots-2col.html` — 2-col, wider cards. **Not selected**: wastes horizontal space, reduces comparison ability.
- `CLAUDE-r2-integrated.html` — 3-col, compact rarity-tinted chips. **Not selected**: mobile abbreviations too cryptic for new players (violates recognition over recall).
- `CLAUDE-r2-image-only.html` — 3-col, image-only with tooltips. **Not selected**: tooltip-dependent identification prevents cross-card scanning; mobile tap-to-reveal is poor UX.
- `CLAUDE-r2-gallery.html` — 3-col, 36px icons + 9px labels. **Best R2 candidate**, refined into R3.

### Round 3 (final)
- `CLAUDE-r3-final.html` — **APPROVED**. Refined gallery layout with:
  - 10px labels (up from 9px for WCAG readability)
  - Standardized abbreviation rules (see below)
  - "Mod Components ON" variant showing Rare-tier builds
  - "No attachment guide" state for excluded weapons (Hairpin)
  - 4-slot weapon stress test (Vulcano)
  - Rarity badge moved inline with weapon name (part of identity, not separate metadata)
  - "Build" renamed to "Customize" (communicates mods come pre-loaded)
  - Build button border + padding improved for tap target and visual clarity

## Confirmed Design Decisions

### Layout
- **3-column grid** on desktop, 1-column on mobile
- **Gallery layout**: 36px rarity-colored icon squares, centered horizontally, with 10px mod name captions below
- Each gallery item uses `flex: 1; max-width: 90px` for even distribution regardless of slot count
- Empty slots: dashed-border icon with slot type label ("Tech Mod", "Stock")
- No guide weapons: simple italic "No attachment guide" text, no gallery row

### Weapon Block Layout
- Rarity badge sits **inline with the weapon name** (same row), not in a separate meta row
- "Customize →" link sits below the name row as the sole element in the meta row
- "Customize" (not "Build") communicates that mods come pre-loaded and user is going to tweak
- Button has visible border + slightly larger padding for better tap target and visual affordance

### Filter Bar
- **Crafting filters** sit to the right of weapon rarity filters on the second row
- Full names: "Mech Components", "Mod Components", "Kinetic Converter", "Horizontal Grip"
- **Green-tinted** pill style (distinct from orange accent pills and colored rarity pills)
- Checkmark/X prefix for on/off states

### Mod Name Abbreviations
Universal rules (same on desktop and mobile — gallery flex-wrap handles text length):
| Full Name | Abbreviated |
|---|---|
| Extended | Ext. |
| Medium | Med. |
| Light | Lt. |
| Shotgun | SG |
| Compensator | Comp. |
| Vertical | Vert. |
| Magazine | Mag |
| Muzzle Brake | _(stays as-is)_ |
| Stable Stock | _(stays as-is)_ |
| Angled Grip | _(stays as-is)_ |

Tier number always shown (I, II, III).

### Interaction
- No expand/collapse — attachments always visible
- "Customize →" button on each weapon block deep-links to Builder with mods pre-loaded
- No hover/tap tooltips — all info visible at a glance

## Engineering Handoff Notes
1. Extend `WeaponBlock.tsx` to accept optional attachment build data and render the `mod-gallery` row
2. Restructure `WeaponBlock.tsx` layout: rarity badge inline with weapon name, "Customize →" replaces "Build →" in the meta row below
3. Add crafting filter pills to `AdvisorFilterBar.tsx` using the green-tinted `pill-craft` style
4. Wire crafting filter state through `useAdvisorFilters` hook
5. The `mod-gallery` component can be extracted as a shared component if the Builder also needs it
6. Abbreviation logic should live in a utility function, not hardcoded per-instance
