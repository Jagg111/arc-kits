# Builder Build List Prototype — Status & Feedback

## Current Status
**Round 3 complete. Builder prototype approved.** Moving on to Advisor prototype next.

## Files
- `build-list.html` — Round 1 (3 initial directions: Compact List, Card Stack, Sidebar+List)
- `build-list-r2.html` — Round 2 (3 variations with full app chrome, real images, weapon desc)
- `build-list-r3.html` — Round 3 (final C1 refinement — approved)

## Final Design (Round 3)

### Hero Section
- Weapon image + name with subtle rarity text label inline (e.g., "Stitcher Common")
- No SMG/Light/PVP/ARC badge clutter — just name, rarity, description
- Full weapon description always visible

### Build List
- **"Suggested Attachments"** section header with inline subtitle: "Select a set for more details, or **build manually**" (build manually is an accent-colored link)
- Build cards as vertical list — each card shows circled build number, human-readable name (carries range info), and mod chips
- Mod chips: small image + rarity-colored mod name — no separate range pills or rarity badges on the row
- No "Build Manually" card — replaced by inline text link in the header

### Sidebar (Desktop)
- Sticky "Weapon Intel" sidebar on the right
- Distinct callout types: Weakness (orange), Tips (orange), Avoid (red)
- Each avoid entry: bold mod name + dash + reason

### Mobile
- Compact hero with full description (matches desktop 1:1)
- Collapsible "Weapon Intel" accordion (collapsed by default)
- Same "Suggested Attachments" header pattern with inline subtitle
- Abbreviated mod names on chips to fit narrow viewport (e.g., "Comp 3", "H.Grip", "KC")

### Not Yet Addressed
- Advisor prototype (Step 1 subtask 2 — next session)
- Weakness field is a new addition surfaced in prototype that needs formal addition to the `WeaponGuide` type or kept on the `Weapon` type (already exists as `weakness` field on weapons.ts)

## Technical Notes
- All mod image URLs are in `src/data/mods.ts` (wiki thumbnails at 96px)
- Weapon images are in `src/data/constants.ts` WEAPON_IMAGES map (wiki thumbnails at 160px)
- Stitcher weapon data (desc, weakness, class, etc.) is in `src/data/weapons.ts` line 16
- App header structure is in `src/components/layout/Header.tsx`
- CSS color tokens are in `src/index.css` (dark theme block lines 20-78)
- The attachment guide master plan is at `.claude/docs/attachment_guide_plan.md`
