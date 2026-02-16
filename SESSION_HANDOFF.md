# Session Handoff

## Project Overview
- Name: `arc-kits`
- Type: Static SPA for ARC Raiders weapon build planning and comparison.
- Stack: React 19, TypeScript 5 (strict), Vite 7, Tailwind CSS 4.
- Deployment: GitHub Pages via Actions on push to `master`.
- Runtime model: No backend/API/database; all game data is local in `src/data/*`.

## Current App Flow
1. Weapon selection screen (`WeaponPicker`) grouped by ammo type.
2. Weapon builder screen (`WeaponBuilder`) with:
- Goal-first presets or manual slot-by-slot attachment selection.
- Live cumulative effects calculation.
- Live crafting cost totals.
- URL state sync for shareable builds.

Core wiring is in `src/App.tsx`.

## Canonical Context Files
Read these first each session:
1. `CLAUDE.md`
2. `.claude/docs/architectural_patterns.md`
3. `.claude/docs/weapon_advisor_feature.md` (for upcoming advisor work)

## Architecture Rules (Current)
- Single source of app state: `src/hooks/useWeaponBuilder.ts`.
- Derived logic in dedicated hooks:
- `src/hooks/useBuildCost.ts`
- `src/hooks/useCumulativeEffects.ts`
- `src/hooks/useBuildUrl.ts`
- `src/hooks/useTheme.ts`
- Props-down / callbacks-up. No Context, Redux, or router.
- Data-driven UI from:
- `src/data/weapons.ts`
- `src/data/mods.ts`
- `src/data/presets.ts`
- `src/data/constants.ts`

## Theming and Styling
- Theme system is CSS custom properties on `data-theme` (`dark`/`light`).
- Tokens live in `src/index.css` and are consumed via Tailwind utilities and CSS vars.
- Game color maps in `src/data/constants.ts` reference CSS variables (`var(--color-...)`).

## URL and Shareability
- Current build URL format:
- `?w=<weaponId>&m=<slot:fam:tier,...>`
- Parsing/writing logic: `src/hooks/useBuildUrl.ts`.
- Uses `history.replaceState` (no router).

## Build and Deploy
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- CI deploy workflow: `.github/workflows/deploy.yml`
- Vite base path: `/arc-kits/` in `vite.config.ts`

## Known Issues / Watchlist
- Preset-tier mismatch exists:
- `src/data/presets.ts` -> `fix.stitcher` uses `Horizontal Grip` at `Uncommon`.
- `src/data/mods.ts` defines `Horizontal Grip` as Legendary-only.
- This should be reconciled before relying on that preset behavior.

## In-Progress Product Direction
- New feature: Weapon Advisor tab/page (spec + UI prototypes complete, implementation pending).
- Spec: `.claude/docs/weapon_advisor_feature.md`
- Visual prototypes:
- `prototypes/variation-a-dense.html`
- `prototypes/variation-b-balanced.html`
- `prototypes/variation-c-spacious.html`

## Session Kickoff Checklist
1. Read canonical context files.
2. Confirm task scope (bugfix, data update, UI polish, advisor implementation).
3. Verify related data consistency across `weapons/mods/presets/constants`.
4. Make focused changes preserving existing hook-centric architecture.
5. Run type check/build before handoff.
6. Summarize changed files + behavior impact + follow-up risks.

## Suggested Prompt For Future Assistant Sessions
"Read `CLAUDE.md`, `.claude/docs/architectural_patterns.md`, and relevant `src/**` files first. Preserve existing hook-centric architecture, CSS-token theme system, and data-driven mod/preset model. If changing presets/mods, validate tier compatibility against `src/data/mods.ts`. At the end, list changed files and behavior impacts."

## Parallel Claude + Codex Workflow
Use this when both assistants are contributing to the same project.

### 1. Session Ownership
- Start each session by stating the exact task scope and files expected to change.
- Prefer one assistant per task slice (for example: UI vs data, feature vs bugfix).
- Avoid having both assistants edit the same file at the same time.

### 2. Branch and Commit Hygiene
- Prefer separate branches per assistant/task.
- Use small, focused commits with clear messages.
- Rebase or merge frequently to reduce drift before large edits.

### 3. Shared Handoff Format
At the end of each session, include:
- Changed files.
- Behavior impact.
- Any follow-up work or risks.
- Commands/tests run and results.

### 4. Conflict Avoidance
- If a task touches `src/data/mods.ts` or `src/data/presets.ts`, call that out early.
- Re-check tier compatibility and weapon IDs after merges.
- Re-run type check/build after integrating changes from the other assistant.

### 5. Quick Integration Checklist
1. Pull/rebase latest branch state.
2. Resolve conflicts with data consistency first (`weapons/mods/presets/constants`).
3. Run type check/build.
4. Smoke test core flows (weapon picker, builder, URL sync, theme toggle).
5. Update this handoff file if architecture or workflow assumptions changed.
