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
3. Advisor tab (`AdvisorPage`) with filter-driven weapon pairing recommendations.
- Filter bar: location, squad mode, focus, range, rarity.
- Three states: onboarding (no location), results (2-3 pairings), empty (too restrictive).
- Live engine: `recommendLoadouts()` called via `useMemo` in `AdvisorPage`.

Tab routing via `activeView` state in `src/App.tsx`.

## Canonical Context Files
Read these first each session:
1. `CLAUDE.md`
2. `DESIGN_SYSTEM.md`
3. `UI_UX_WORKFLOW.md`
4. `.claude/docs/architectural_patterns.md`
5. `.claude/docs/weapon_advisor_feature.md` (for upcoming advisor work)

## Architecture Rules (Current)
- Builder state: `src/hooks/useWeaponBuilder.ts` (consumed by App).
- Advisor state: `src/hooks/useAdvisorFilters.ts` (page-owned, consumed by AdvisorPage).
- Derived logic in dedicated hooks:
- `src/hooks/useBuildCost.ts`
- `src/hooks/useCumulativeEffects.ts`
- `src/hooks/useBuildUrl.ts`
- `src/hooks/useTheme.ts`
- Props-down / callbacks-up. No Context, Redux, or router.
- Data-driven UI from:
- `src/data/weapons.ts`
- `src/data/guides.ts`
- `src/data/mods.ts`
- `src/data/presets.ts`
- `src/data/constants.ts`
- `src/data/advisor_config.ts`
- `src/data/advisor_golden_cases.ts`

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

## Looter — Shipped
GitHub issue: [#3](https://github.com/Jagg111/arc-kits/issues/3) (MVP complete).

- Tab live at top level (`AppView` extended). Components under `src/components/looter/` (`LooterPage`, `PriorityBoard`, `HuntBrief`, `GoalCard`, `StageBlock`, `BucketBadge`).
- Page-owned state via `src/hooks/useLooterState.ts` — persists to localStorage under `arc-kits.looter.v1`. Seeded demo state applies only for first-time visitors.
- Material demand aggregator extracted as a pure module; engine output reserves `recommendedMaps: RankedMap[]` for the deferred map-ranker (#4) to fill.
- Data layer in `src/data/`: `items.ts`, `workbenches.ts`, `expedition.ts`, `projects.ts`, `events.ts`, `map_conditions.ts`, `loot_zones.ts`. See `CLAUDE.md` for per-file content rules and generator scripts in `.claude/tmp/`.
- Shared chip styling: `src/components/shared/MaterialPill.tsx` (structured-input sibling of `CostPill`). Looter uses 100px wiki thumbnails (96px isn't universally cached on MediaWiki).
- Theme tokens: `--color-bucket-hi/soon/evt` in `src/index.css`.

### Load-bearing design contracts (don't break)
- **Priority is per-stage and bucketed** (🔥 High / ⏱ Soon / 🌱 Eventual / skip) — not per-goal, not ordinal. A bench's T1 can be High while T2 is Eventual.
- **Stage completion is derived** from `lineDone: Set<string>`, never a separate flag. Unticking any line reopens the stage.
- **Bench tiers are independent stages**. A `skip` tier is removed from material demand entirely; a low-priority tier still contributes.
- **Material demand is tagged with its originating stage's bucket** so the prioritizer can weight High ≫ Soon ≫ Eventual.
- **Hunt list is a derived view** over (active stages × materials × drop tables), with per-stage breakdown preserved for tooltips.

### Deferred — separate deliverable ([#4](https://github.com/Jagg111/arc-kits/issues/4))
- **Live map-conditions pipeline.** Settled design: scrape `arcraiders.com/map-conditions/map/<slug>` (Next.js SSR, parseable from `curl`; no CORS on the origin), GHA writes JSON to a **Gist** (no repo commits), SPA fetches from `gist.githubusercontent.com`. Parse by visible condition name (matched against `MAP_CONDITIONS` catalog), not by hashed CSS class names. Probe and pin the page's render timezone before parsing display-string times.
- **Map-ranker engine.** Overlays live conditions onto material demand to produce ranked maps + recommended POIs. Consumes the aggregator output + the Gist snapshot.
- **UI placeholders already in place** inside `HuntBrief` as dimmed cards: runner-up map accordion, "switch primary to X" link, Looter → Advisor cross-link with map pre-filter.

### Known data caveats
- **Expedition LOAD STAGE category mapping** — Stage 5's in-game "Combat / Survival / Provisions / Materials" buckets don't map cleanly to the 7 `ItemCategory` values. Encoded best-effort with inline notes.
- **End-time precision** — Expedition (~2026-06-22) and Avian Alarm / Miniature Voyages (~2026-05-26) `endsAt` are hour-precision approximations from in-game timers.
- **Not modeled**: per-tier merit progress for events, historical expedition cycles, specific drop-rate weights on map conditions.

## Advisor V1 — Shipped
- Engine (`src/advisor/engine/`) wired to UI (`src/components/advisor/`) — fully live.
- Golden matrix: 10/10 passing (`src/data/advisor_golden_cases.ts`, CLI: `scripts/advisor/cli.ts`).
- V1 scope: weapon-only pairing recommendations (no attachments, no material filter).
- Spec: `.claude/docs/weapon_advisor_feature.md`
- Engine contract: `.claude/docs/weapon_advisor_engine_contract.md`
- Golden matrix doc: `.claude/docs/weapon_advisor_golden_matrix.md`
- Phase 2 roadmap: see feature doc §9 (stealth filter, builder links, URL sharing, economy ranking).

## Session Kickoff Checklist
1. Read canonical context files.
2. Confirm task scope (bugfix, data update, UI polish, advisor implementation).
3. Verify related data consistency across `weapons/mods/presets/constants`.
4. Make focused changes preserving existing hook-centric architecture.
5. Run type check/build before handoff.
6. Summarize changed files + behavior impact + follow-up risks.

## Suggested Prompt For Future Assistant Sessions
"Read `CLAUDE.md`, `.claude/docs/architectural_patterns.md`, and relevant `src/**` files first. Preserve existing hook-centric architecture, CSS-token theme system, and data-driven mod/preset model. If changing presets/mods, validate tier compatibility against `src/data/mods.ts`. At the end, list changed files and behavior impacts."

