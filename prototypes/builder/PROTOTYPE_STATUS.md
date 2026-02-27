# Builder Build List Prototype — Status & Feedback

## Current Status
**Round 2 complete.** Variation C1 selected as the direction. Need one more refinement pass.

## Files
- `build-list.html` — Round 1 (3 initial directions: Compact List, Card Stack, Sidebar+List)
- `build-list-r2.html` — Round 2 (3 variations with full app chrome, real images, weapon desc)

## Winning Direction: Variation C1 (from Round 2)
**"Description in Hero, Mod Chips in Build Cards, Sticky Intel Sidebar"**

Key traits:
- Full app header with "< Weapons" back nav
- Weapon hero card at top with image + description
- Build cards as vertical list — each card shows build number, name, and mod chips (small image + rarity-colored name)
- Sticky sidebar on the right with Weapon Intel (weakness, tips, avoids)

## Feedback for Round 3 (Next Session)

### Hero Section
- **Declutter badges**: Drop SMG, Light ammo, PVP grade, ARC grade pill badges
- **Keep rarity** but find a subtler way to show it (single "Common" badge feels awkward alone — maybe incorporate into the name styling or a subtle text label)
- **Keep weapon image** — make sure it has a clear placeholder/presence

### Build List
- **Add a header**: Something like "Suggested Attachments" above the build card list
- **Remove range pills** from each build row — the build names already contain range info (e.g., "Short - Medium", "Medium - Long"), so the Close/Mid/Long pills are redundant
- **Remove rarity badges** from each build row — rarity is already inferred by the mod images and their rarity-colored names
- **"Build Manually" placement**: Current dashed card takes too much vertical space. Convert to a text link or small inline element (not a full card row). Could sit near the "Suggested Attachments" header as a subtle alternative action

### What's Working Well (Keep These)
- Mod chips with small images + rarity-colored names — great density
- Sticky intel sidebar with distinct callout types (weakness, tips, avoid)
- Full app header chrome (back nav, tabs, theme toggle)
- Weapon description in the hero area, always visible
- Build numbering (circled numbers)
- Overall two-column layout with builds taking the majority width

### Not Yet Addressed
- Mobile layout (secondary priority per user — get desktop right first)
- Advisor prototype (Step 1 subtask 2 — not started yet)
- Weakness entry in sidebar is a new addition to the attachment_guide_plan.md that needs to be formally added

## Technical Notes for Next Session
- All mod image URLs are in `src/data/mods.ts` (wiki thumbnails at 96px)
- Weapon images are in `src/data/constants.ts` WEAPON_IMAGES map (wiki thumbnails at 160px)
- Stitcher weapon data (desc, weakness, class, etc.) is in `src/data/weapons.ts` line 16
- App header structure is in `src/components/layout/Header.tsx`
- CSS color tokens are in `src/index.css` (dark theme block lines 20-78)
- The attachment guide master plan is at `.claude/docs/attachment_guide_plan.md`
