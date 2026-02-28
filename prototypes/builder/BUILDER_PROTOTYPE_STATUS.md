# Builder Build List Prototype — Status & Feedback

## Current Status
**Round 4 complete. Builder prototype approved and ready for engineering handoff.**

## Files
- `build-list.html` — Round 1 (3 initial directions: Compact List, Card Stack, Sidebar+List)
- `build-list-r2.html` — Round 2 (3 variations with full app chrome, real images, weapon desc)
- `build-list-r3.html` — Round 3 (C1 refinement — PM approved, then iterated further)
- `build-list-r4.html` — **Round 4 (UX expert refinement — FINAL, approved for handoff)**
  - Engineering handoff notes are embedded in the HTML file itself (bottom section)

## Technical Notes
- All mod image URLs are in `src/data/mods.ts` (wiki thumbnails at 96px)
- Weapon images are in `src/data/constants.ts` WEAPON_IMAGES map (wiki thumbnails at 160px)
- Stitcher weapon data (desc, weakness, class, etc.) is in `src/data/weapons.ts` line 16
- App header structure is in `src/components/layout/Header.tsx`
- CSS color tokens are in `src/index.css` (dark theme block lines 20-78)
- The attachment guide master plan is at `.claude/docs/attachment_guide_plan.md`
