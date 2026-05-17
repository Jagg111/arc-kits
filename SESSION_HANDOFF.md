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
1. `GEMINI.md` (takes absolute precedence)
2. `CLAUDE.md`
3. `DESIGN_SYSTEM.md`
4. `UI_UX_WORKFLOW.md`
5. `.claude/docs/architectural_patterns.md`
6. `.claude/docs/weapon_advisor_feature.md` (for upcoming advisor work)

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

## Looter Feature — Phase 1 (Data Recon & Modeling) Shipped
GitHub issue: [#3](https://github.com/Jagg111/arc-kits/issues/3). Phase 1 = data layer only, no UI yet.

### Files landed in `src/data/`
- `items.ts` — 273-entry master item index across 7 wiki categories (basic / topside / refined / nature / trinket / recyclable / quick_use). Each row carries rarity, stack size, sell price, recycle output graph, and wiki thumbnail (`{file, hash}` — hash is non-derivable, stored per row). Generated from `.claude/tmp/items_final.json` (raw wiki HTML parse) via `.claude/tmp/gen_items.cjs`. `MATERIAL_INFO` in `constants.ts` is now a derived view over `ITEMS` — Builder cost pills unchanged.
- `workbenches.ts` — 7 benches (Gunsmith, Gear Bench, Medical Lab, Explosives, Utility, Refiner + Scrappy) with per-tier `RecipeCost[]`. Scrappy is modeled as `isScrappy: true` with 5 tiers (levels 2–5; level 1 is default). Recipes derived from items.ts's `uses` field via `.claude/tmp/gen_workbenches.cjs`. Dev-time guard validates every `itemId` resolves in `ITEMS`.
- `expedition.ts` — Single `CURRENT_EXPEDITION` config for the active cycle (no historical timeline). `inDepartureWindow()` and `daysUntilDeparture()` helpers. `EXPEDITION_POLICY` constant lists what's lost vs preserved on departure.
- `projects.ts` — 3 projects (Expedition 5-stage, Avian Alarm 5-stage, Trophy Display 5-stage). Hand-authored from in-game screenshots in `.claude/tmp/screenshots/`. Stage requirements are a tagged union: `items` (commits), `task` (location-tagged objective — Avian Alarm Stage 1 has `mapId: "riven_tides"`), or `value_by_category` (Expedition Stage 5 bulk coin commit). Avian Alarm carries `umbrella: "Last Resort"` linking it to the live event.
- `events.ts` — Single `CURRENT_EVENT` for the active limited-time event. Currently Miniature Voyages (Last Resort umbrella, ends ~2026-05-26). Models event metadata + `prioritizeItemIds` (5 ship model ids) only — no merit-tier tracking; user completion state is for the Looter persistence hook.
- `map_conditions.ts` — Catalog of all 16 known hourly-rotating modifiers (7 Major + 9 Minor). `lootBoostItemIds` for named-item conditions (Husk Graveyard → ARC parts, Bird City → 6 exclusive ducks), `lootBoostCategories` for broad ones (Lush Blooms → nature), `lootBoostNote` for free-text. `suppressesLoot: true` flag handles Close Scrutiny (the one Major that reduces general loot). `MAP_IDS` placeholder mirrors what `loot_zones.ts` will own when it lands.

### Open items
- **Loot zones** (`loot_zones.ts`) — deferred. Needs focused recon of 6 per-map wiki pages for POI lists + zone↔loot weighting. Recommended as its own session.
- **Expedition LOAD STAGE category mapping** — Stage 5's in-game "Combat Items / Survival Items / Provisions / Materials" buckets don't map cleanly to our 7 `ItemCategory` values. Encoded as best-effort with inline notes. Revisit if Looter prioritizer needs precise targeting.
- **End-time precision** — Expedition project (~2026-06-22) and Avian Alarm / Miniature Voyages (~2026-05-26) endsAt values are hour-precision approximations from in-game timer readouts. Fine for "days remaining" UI.

### What's not modeled (out of scope for Phase 1)
- Per-tier merit progress for events
- Historical expedition cycles (only the active one is tracked)
- Specific drop-rate weights on map conditions (just boost categories)
- User state (Looter persistence hook is Phase 4)

### Tools & generators in `.claude/tmp/`
- `items_final.json` — authoritative wiki Loot page extract (regenerate from `loot.html` via `parse2.cjs` if wiki updates)
- `gen_items.cjs` — emits the `ITEMS` body of items.ts
- `gen_workbenches.cjs` — derives workbench recipes from `items_final.json` uses field
- `emit_items_ts.cjs` / `emit_workbenches_ts.cjs` — wrap the bodies with the typed file headers
- `screenshots/` — 15 in-game screenshots of project stages (source of truth for projects.ts)

### Scope decision (2026-05-16): MVP vs deferred slice
The original Phase 3–6 plan has been re-sliced. The live map-conditions pipeline + the map-ranker half of the prioritizer are **deferred to a separate deliverable** (tracked in its own GitHub issue). Rationale: that piece is its own project (external relay infra, parsing brittleness, ranking heuristics) and the rest of the prototype value — priority buckets, hunt list, persistence — is independently shippable and useful without live-rotation data.

### MVP scope (ship first, under issue #3)
Phases renumbered after the slice; ordering is UI-first to make behavior eyeball-checkable cheaply, persistence last because the state shape is the same in-memory or persisted.
- **Phase 2** ✅ — Static HTML mockups in `.claude/prototypes/looter/`. Chosen direction: **G+ v3a (Priority Buckets)**.
- **Phase 3** ✅ — Page shell wired into the app. See "Phase 3 shipped" below.
- **Phase 4** (partially anticipated in Phase 3) — Extract the material-demand aggregator into a pure module + add bench `targetTier` consumption + per-material drop-POI mapping. Phase 3 already implements real aggregation inline (reads `stageBucket + goalOn + lineDone`, tags contributions by bucket, sorts) — but it lives in `LooterPage.tsx` as `buildMockHuntList()` and the primary-map field is hardcoded. Phase 4 is mostly an extract + name + targetTier/POI pass, not a rewrite. Output shape reserves an empty `recommendedMaps: RankedMap[]` slot for #4 to fill.
- **Phase 5** ✅ — Persistence shipped. `useLooterState` reads/writes a single versioned key (`arc-kits.looter.v1`) in localStorage. `initial` (the seeded demo state) is applied only when no stored entry exists, so returning users keep their progress. `Set` (lineDone) is serialized as an array; malformed blobs fall back to `initial` with a console warning. Public API unchanged — `LooterPage` consumes it identically. JSON export/import deferred (out of MVP).

### Phase 3 — Shipped (2026-05-16)
- Looter tab live at the top-level (`AppView` extended). Tab routing in `App.tsx`; tab button in `Header.tsx`.
- Components under `src/components/looter/`: `LooterPage`, `PriorityBoard`, `HuntBrief`, `GoalCard`, `StageBlock`, `BucketBadge`, `types.ts`. Page-owned state via `src/hooks/useLooterState.ts` (in-memory, `useState`-backed; same public API Phase 5 will promote to localStorage).
- Material chip styling unified with the Builder: `src/components/shared/MaterialPill.tsx` is the structured-input (`itemId + qty`) sibling of `CostPill`. Used in PriorityBoard summary chips and StageBlock item lines. `CostPill` remains unchanged for the Builder.
- Theme tokens added in `src/index.css`: `--color-bucket-hi/soon/evt` (dark + light), registered in `@theme inline`.
- **Drag between Priority Board columns** is implemented via native HTML5 DnD on chips → column drop zones. Within-column reordering is intentionally absent — buckets carry the engine signal, ordinal position within a bucket is not read. Click-to-cycle on the chip and on the stage's bucket badge is the keyboard/touch fallback (HTML5 DnD has no touch support).
- **Wiki thumbnail size** is `100px` everywhere in the Looter (`MaterialPill`). 96px is *not* universally pre-cached on the MediaWiki backend — many items 404 at 96 (including all ship models and Oil). 100 is the smallest size every item in `ITEMS` has cached. CostPill (Builder) still uses 96 because the Builder pulls from a curated material subset that doesn't hit the gap.
- **Deferred-feature placeholders** for #4: runner-up map accordion, "switch primary to X" link, Advisor cross-link with map pre-filter — rendered as dimmed cards inside `HuntBrief` so the layout reserves the real estate.
- **Seeded demo state**: `LooterPage.initialState()` populates `stageBucket` / `goalOn` so the page isn't blank on first visit. This is load-bearing for first-run UX in Phase 3 — Phase 5 should keep the seed but apply it only when no persisted state exists.
- Mobile (under 1080px): right rail collapses below the goal card list. Priority Board columns stack vertically under `md:` (768px).
- Build: `tsc -b && vite build` clean.

Excluded from MVP (lives in #4): Runner-up map accordion, "switch primary to X" link, Looter → Advisor cross-link with map pre-filter.

### Deferred — separate deliverable ([#4](https://github.com/Jagg111/arc-kits/issues/4))
- **Live map-conditions pipeline.** Settled design: scrape `arcraiders.com/map-conditions/map/<slug>` (Next.js SSR, parseable from `curl`; no CORS on the origin), GHA writes JSON to a **Gist** (no repo commits), SPA fetches from `gist.githubusercontent.com`. Parse by visible condition name (matched against `MAP_CONDITIONS` catalog), not by hashed CSS class names. Probe and pin the page's render timezone before parsing display-string times.
- **Map-ranker engine.** Overlays live conditions onto material demand to produce ranked maps + recommended POIs. Consumes the Phase 4 aggregator output + the Gist snapshot.

### Phase 2 — Chosen Direction (G+ v3a): key contracts for downstream phases

The chosen layout encodes design decisions that downstream phases must honor:

- **Priority is per-stage and bucketed**, not per-goal and not strict ordinal. Each stage/tier of every goal independently sits in 🔥 High / ⏱ Soon / 🌱 Eventual / skipped. A bench's T1 can be High while its T2 is Eventual — this is the load-bearing requirement that killed simpler models in exploration.
- **Stage completion is derived**, not a separate stored flag. A stage is "done" iff every line checkbox under it is ticked. Persistence (Phase 4) stores only the set of completed line ids — `useLooterState` should expose a `lineDone: Set<string>` and compute stage-done from it. This makes reversibility free: unticking any line reopens the stage.
- **Bench tiers are independent stages**, each with its own bucket badge and a `skip` toggle. A "skipped" tier is distinct from a low-priority one — it's removed from material demand entirely.
- **Engine consumes stage-priority signals** (Phase 5). Material demand needs to be tagged with its originating stage's bucket so the prioritizer can weight High ≫ Soon ≫ Eventual when ranking maps. Goal-level priority is not a useful abstraction here.
- **Engine returns ranked maps**, not top-1. The chosen layout exposes a "Runner-up" map accordion with a "switch primary to X" link — the engine API should naturally support `recommendMaps(): RankedMap[]`.
- **Hunt list is a derived view** over (active stages × their materials × map drop tables). The "138 metal_parts" total is a sum across all non-skipped, un-ticked stages that need it, with per-stage breakdown preserved for the tooltip.

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
4. Smoke test core flows (weapon picker, builder, URL sync, theme toggle, advisor tab).
5. Update this handoff file if architecture or workflow assumptions changed.
