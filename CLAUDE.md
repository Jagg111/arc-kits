# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ArcKits — Arc Raiders Weapon Builder

## What This Is
A static single-page web app for building and comparing weapon loadouts in Arc Raiders.
Users select a weapon, optionally apply a preset goal build, or manually pick mods per slot.
The app calculates cumulative stat effects and crafting costs in real time.

No backend, no API calls, no database. All game data is hardcoded. Deployed to GitHub Pages.

## Tech Stack
- React 19 + TypeScript 5.9 (strict mode)
- Vite 7 (bundler + dev server)
- Tailwind CSS 4 (via @tailwindcss/vite plugin)
- No state library — props-down/callbacks-up with custom hooks

## Build & Dev Commands
- `npm run dev` — Vite dev server with HMR on localhost:5173
- `npm run build` — TypeScript check (`tsc -b`) then Vite production build to `dist/`
- `npm run preview` — serve production build locally

## Deployment
GitHub Pages via GitHub Actions. Workflow at `.github/workflows/deploy.yml`.
Auto-deploys on push to `master`. Base path set to `/arc-kits/` in `vite.config.ts:6`.

## Project Structure

```
src/
  App.tsx                  — Root component, tab routing (activeView state), wires hooks to UI
  main.tsx                 — ReactDOM entry point
  index.css                — Tailwind CSS entry + theme color tokens (dark/light)

  types/index.ts           — All TypeScript interfaces and type aliases

  data/                    — Static game data (immutable, no logic)
    weapons.ts             — Weapon definitions (id, stats, slots, grades)
    mods.ts                — Mod families by slot type (tiers, effects, costs, compatibility)
    presets.ts             — Goal-based preset builds (fix, budget, recoil, stealth, pvp, arc)
    constants.ts           — Label maps, color maps, rarity ordering, weapon images, material metadata
    advisor_config.ts      — Advisor scoring weights, location tiers, filter label maps, input enums
    advisor_mock.ts        — Temporary mock pairing data (delete when engine wired to UI)
    advisor_golden_cases.ts — Golden scenario test cases for regression validation

  hooks/                   — Business logic (state + computed values)
    useWeaponBuilder.ts    — Core state: selected weapon, goal, equipped mods + all actions
    useBuildCost.ts        — Computes total crafting materials from equipped mods
    useCumulativeEffects.ts — Aggregates stat bonuses across equipped mods via regex
    useBuildUrl.ts         — URL query param sync for shareable builds
    useTheme.ts            — Dark/light mode toggle with OS preference + localStorage persistence
    useAdvisorFilters.ts   — Advisor filter bar state (location, squad, focus, range, rarity)

  advisor/engine/          — Deterministic weapon pairing recommendation engine
    index.ts               — Public API: recommendLoadouts(), buildRankedRecommendations()
    feature-map.ts         — Per-weapon derived facts (range band, burst/sustained, stealth)
    filters.ts             — Input normalization and hard constraint filtering
    primary-score.ts       — Standalone weapon scoring (map fit, role fit, range fit)
    secondary-score.ts     — Complement scoring (ammo diversity, range diversity, quality floor)
    pair-ranker.ts         — Pair construction, tier assignment, synergy tag generation
    url-state.ts           — URL query param serialization (V2, preserved in code)
    utils.ts               — Shared math helpers (grade-to-score, range band, clamp)

  components/              — UI organized by feature domain
    layout/Header.tsx      — Sticky header with Weapons/Advisor tabs, theme toggle, reset button
    weapons/               — Weapon selection screen
      WeaponPicker.tsx     — Groups weapons by ammo type
      AmmoGroup.tsx        — Renders a group of weapon cards
      WeaponCard.tsx       — Clickable weapon card
    builder/               — Mod builder screen
      WeaponBuilder.tsx    — Main builder layout (goal picker + slots + stats)
      AttachmentSlot.tsx   — Single slot: shows equipped mod or mod picker
      ModDrawer.tsx        — Mobile-friendly mod selection drawer
      ModFamilySection.tsx — Mod family display with tier selection buttons
      StatsSummaryBar.tsx  — Mobile bottom bar (goals/stats/cost tabs)
    advisor/               — Weapon advisor recommendation page
      AdvisorPage.tsx      — Top-level orchestrator with filter state
      AdvisorFilterBar.tsx — Sticky pill-toggle filter bar
      AdvisorResults.tsx   — Results header + 3-column pairing grid
      PairingCard.tsx      — Single pairing card with tier badge + synergy tags
      WeaponBlock.tsx      — Weapon image + name + class/rarity badges
      SynergyTagList.tsx   — Synergy tag pills (positive/warning)
      AdvisorOnboarding.tsx — Idle state before location selected
      AdvisorEmptyState.tsx — Empty state when no pairings match
    goals/                 — Goal/preset related components
      WeaponHeader.tsx     — Weapon info display with stat badges
      GoalCard.tsx         — Goal preset card
    shared/                — Reusable leaf components
      Badge.tsx            — Colored label pill
      CostPill.tsx         — Rarity-colored crafting cost pill with material icon
      CostDisplay.tsx      — Cost breakdown display (currently unused)
```

## Key Architecture Decisions
- **Builder state**: lives in `useWeaponBuilder` hook, consumed by `App.tsx`. Computed values (`buildCost`, `cumulativeEffects`) are separate hooks with `useMemo`
- **Advisor state**: lives in `useAdvisorFilters` hook, consumed by `AdvisorPage` directly (page-owned, not lifted to App). This is the pattern for feature-page-scoped state
- No Context API or global state — props-down/callbacks-up
- **Theming**: Dark/light mode via CSS custom properties on `data-theme` attribute. **All colors** — both semantic UI colors (surfaces, borders, text, accent) and game-specific colors (ammo, rarity, grade, class) — are defined in `src/index.css` and registered via Tailwind `@theme inline`. UI colors use Tailwind utilities (`bg-surface`, `text-text-primary`). Game colors use CSS vars via inline styles (`var(--color-ammo-light)` etc.), with `color-mix()` for semi-transparent backgrounds.
- Game color lookup objects in `src/data/constants.ts` reference CSS custom properties (e.g., `"var(--color-rarity-rare)"`) so they automatically adapt per theme
- URL state sync via `useBuildUrl` hook — builds are shareable via query params (`?w=tempest&m=Muzzle:Compensator:Rare,...`), synced with `history.replaceState`

## How to Add Game Content
- **New weapon**: Add entry to `src/data/weapons.ts`, add preset builds in `src/data/presets.ts`
- **New mod family**: Add to the appropriate slot array in `src/data/mods.ts`, set `w` (weapon compatibility) array
- **New goal preset**: Add new key to `GOAL_PRESETS` in `src/data/presets.ts` with icon, name, desc, and per-weapon builds
- **New stat type for effects**: Add regex pattern to `STAT_PATTERNS` in `src/hooks/useCumulativeEffects.ts:5-16`
- **New crafting material**: Add entry to `MATERIAL_INFO` in `src/data/constants.ts` with its rarity and wiki thumbnail URL
- **New game color** (ammo/rarity/grade/class): Add a CSS custom property to both theme blocks in `src/index.css` (dark + light variants), register it in `@theme inline`, then add the `var(--color-...)` reference to the appropriate map in `src/data/constants.ts`. Use `color-mix(in srgb, <color> <percent>%, transparent)` for semi-transparent backgrounds.
- **New UI color**: Add a CSS custom property to both theme blocks in `src/index.css`, register it in the `@theme inline` block, then use the Tailwind utility (e.g., `bg-[name]`, `text-[name]`)
- **New advisor location**: Add to `ADVISOR_INPUT_ENUMS.locations` and `ADVISOR_LOCATION_LABELS` in `src/data/advisor_config.ts`, add `LOCATION_CLASS_TIERS` entry with strong/okay/weak weapon classes
- **Tune advisor scoring**: Edit values in `src/data/advisor_config.ts`, run `node scripts/advisor/run-matrix.mjs` to validate golden cases

## Type System
All types in `src/types/index.ts`. Key interfaces:
- `Weapon` — weapon definition with stats, slots, grades
- `ModFamily` — mod with tiers, effects, weapon compatibility
- `EquippedState` — `Record<string, EquippedMod>` mapping slot to mod
- `GoalPreset` — preset build template with per-weapon configurations
- `CumulativeEffect` — aggregated stat bonus from multiple mods
- `AppView` — top-level tab routing (`"weapons" | "advisor"`)
- `AdvisorInputs` — advisor questionnaire state (location, squad, focus, range, rarities)
- `PairRecommendation` — engine output per weapon pairing (scores, tier, synergy tags)
- `AdvisorResult` — full engine response (status + recommendations array)

## Additional Documentation
When working on patterns, conventions, or architectural questions, check:
- `.claude/docs/architectural_patterns.md` — recurring code patterns, state management, styling conventions, data flow

## Session Startup Context
Before making changes in a new session, read `SESSION_HANDOFF.md` first for current project status, constraints, known issues, and active product direction. Treat it as the cross-session source of truth, then use this file for architecture and workflow details.
