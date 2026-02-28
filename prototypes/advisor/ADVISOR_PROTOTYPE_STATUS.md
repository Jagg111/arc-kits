# Advisor Attachment Prototypes — Status

## What This Is
Prototyping how the Advisor page shows **crafting material filters** and **recommended attachment builds** on weapon pairing cards. This is Step 1 of the attachment guide plan (`.claude/docs/attachment_guide_plan.md`).

## Prototype Files

### Round 1 (initial explorations — mostly superseded)
- `CLAUDE-inline-slots.html` — Attachments inline, crafting pills in filter bar. Decent but filter bar didn't match live app.
- `CLAUDE-compact-badges.html` — Mods as tiny dot+name badges, crafting in separate sub-bar. Too compact.
- `CLAUDE-expandable-panel.html` — Expand/collapse per weapon. **REJECTED** — user wants no extra clicks.

### Round 2 (current candidates)
- `CLAUDE-r2-slots-3col.html` — **3-column grid**, vertical slot rows under each weapon. Real weapon images. Filter bar matches live advisor screenshot.
- `CLAUDE-r2-slots-2col.html` — **2-column grid**, wider cards, mods flow horizontally. Shows "no guide" state for Hairpin. Shows Mod Components ON state with Rare-tier mods.
- `CLAUDE-r2-integrated.html` — **3-column grid**, mods as compact rarity-tinted chips integrated into the weapon block layout (image left, name+chips right). Most compact vertically.

## User Feedback So Far

### Confirmed Preferences
- **No expand/collapse** — attachments must always be visible without interaction
- **Filter bar must match the live advisor** — screenshot reference provided showing single-row pill layout with wrapping
- **Crafting filters** go to the right of weapon rarity filters, using full names: "Mech Components", "Mod Components", "Kinetic Converter", "Horizontal Grip" (never abbreviate KC/HG)
- **Crafting pill style**: green-tinted (distinct from orange accent pills and colored rarity pills)
- **Mod detail level**: Image placeholder + mod name only (skip explicit rarity badge — the rarity color on the name/icon implies it)
- **Mod images**: Rarity-colored placeholder squares for now (not real wiki mod image URLs)
- **Weapon images**: Use real wiki thumbnail URLs (same as the live app)

### Still Needs Decision
- **2-col vs 3-col grid** — user wanted to see both, hasn't picked yet
- **Vertical slot rows vs horizontal chip flow** — two approaches shown, no final pick
- **Mobile mod name abbreviation** — R2-C abbreviates on mobile, may or may not be acceptable

## Key Design Decisions (from attachment_guide_plan.md)
- 4 crafting checkboxes: Mech Components (default ON), Mod Components (auto-enables Mech), Kinetic Converter, Horizontal Grip
- Build-level filtering (whole builds excluded, not individual slots)
- Fallback: if no builds qualify after filters, show cheapest build (last index)
- All slots shown including intentionally blank ones (e.g., "Stock: not needed")
- Existing weapon rarity filter and crafting filters are separate axes
- "Build →" button deep-links to Builder via existing useBuildUrl system

## Next Steps
1. Get user feedback on R2 prototypes (which layout direction to pursue)
2. Iterate with R3 prototypes based on feedback
3. Once final prototype approved, mark Step 1 advisor prototype as done in the attachment guide plan
4. Proceed to Step 2 (fix mod rarity data) and beyond
