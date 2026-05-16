// ============================================================================
// FILE: components/looter/LooterPage.tsx
// PURPOSE: Top-level orchestrator for the Looter tab. Page-owned state via
//          useLooterState (Phase 3: in-memory only — Phase 5 swaps it for a
//          localStorage-backed hook with the same API).
//
//          Derives `Stage[]` from the static data files (projects, events,
//          workbenches) so the rest of the tree is data-shape agnostic.
//          Builds a MOCK hunt list for Phase 3 — Phase 4 replaces this with
//          a real material-demand aggregator that consumes stageBucket +
//          lineDone + goalOn and returns the same `HuntList` shape.
// ============================================================================

import { useMemo } from "react";
import { ITEMS } from "../../data/items";
import { PROJECTS, PROJECT_ORDER, daysUntilEnd } from "../../data/projects";
import { CURRENT_EVENT, daysUntilEventEnd } from "../../data/events";
import { WORKBENCHES } from "../../data/workbenches";
import { daysUntilDeparture } from "../../data/expedition";
import { useLooterState } from "../../hooks/useLooterState";
import PriorityBoard from "./PriorityBoard";
import HuntBrief from "./HuntBrief";
import GoalCard from "./GoalCard";
import type { Bucket, HuntList, HuntListLine, Stage } from "./types";

// ── Stage generators ────────────────────────────────────────────────────────

function projectStages(): Stage[] {
  const out: Stage[] = [];
  for (const projectId of PROJECT_ORDER) {
    const project = PROJECTS[projectId];
    if (!project) continue;
    const goalId = `proj:${project.id}`;
    for (const stage of project.stages) {
      const stageId = `${goalId}:s${stage.level}`;
      const stageLabel = `Stage ${stage.level} · ${stage.name}`;
      const r = stage.requirement;
      if (r.kind === "items") {
        out.push({
          stageId,
          goalId,
          goalName: project.name,
          goalKind: "project",
          stageLabel,
          kind: "items",
          lines: r.items.map((it) => ({
            lineId: `${stageId}:${it.itemId}`,
            kind: "item" as const,
            itemId: it.itemId,
            itemName: ITEMS[it.itemId]?.name ?? it.itemId,
            qty: it.qty,
          })),
        });
      } else if (r.kind === "task") {
        out.push({
          stageId,
          goalId,
          goalName: project.name,
          goalKind: "project",
          stageLabel,
          kind: "task",
          lines: [
            {
              lineId: `${stageId}:task`,
              kind: "task" as const,
              label: r.description,
              mapId: r.mapId,
            },
          ],
        });
      } else {
        out.push({
          stageId,
          goalId,
          goalName: project.name,
          goalKind: "project",
          stageLabel,
          kind: "value_by_category",
          lines: r.buckets.map((b, i) => ({
            lineId: `${stageId}:bucket${i}`,
            kind: "bucket" as const,
            label: `${b.category} commit`,
            coins: b.coins,
          })),
        });
      }
    }
  }
  return out;
}

function eventStages(): Stage[] {
  if (!CURRENT_EVENT) return [];
  const goalId = `event:${CURRENT_EVENT.id}`;
  return [
    {
      stageId: goalId,
      goalId,
      goalName: CURRENT_EVENT.name,
      goalKind: "event",
      stageLabel: "Ship Models · extract with any",
      kind: "event",
      lines: CURRENT_EVENT.prioritizeItemIds.map((id) => ({
        lineId: `${goalId}:${id}`,
        kind: "item" as const,
        itemId: id,
        itemName: ITEMS[id]?.name ?? id,
        qty: 1,
      })),
    },
  ];
}

function benchStages(): Stage[] {
  const out: Stage[] = [];
  for (const bench of Object.values(WORKBENCHES)) {
    const goalId = `bench:${bench.id}`;
    for (const tier of bench.tiers) {
      const stageId = `${goalId}:t${tier.level}`;
      out.push({
        stageId,
        goalId,
        goalName: bench.name,
        goalKind: "bench",
        stageLabel: `T${tier.level}`,
        kind: "items",
        lines: tier.cost.map((c) => ({
          lineId: `${stageId}:${c.itemId}`,
          kind: "item" as const,
          itemId: c.itemId,
          itemName: ITEMS[c.itemId]?.name ?? c.itemId,
          qty: c.qty,
        })),
      });
    }
  }
  return out;
}

// ── Phase 3 mock hunt list ──────────────────────────────────────────────────
// Phase 4 replaces this with a real aggregator producing the same `HuntList`
// shape. The `recommendedMaps` slot is intentionally empty here — Phase 4 + #4
// (live map-conditions pipeline) fill it.

function buildMockHuntList(
  stages: Stage[],
  stageBucket: Record<string, Bucket>,
  goalOn: Record<string, boolean>,
  lineDone: Set<string>,
): HuntList {
  // Aggregate item-line demand across active, non-skipped, un-ticked lines,
  // tagging each contribution with its originating stage bucket. This matches
  // the eventual aggregator shape (per Phase 2 design contract) but ignores
  // bench-target-tier, drop-rate weights, and map fit — Phase 4 + #4 add those.
  const byItem: Record<
    string,
    { total: number; breakdown: HuntListLine["breakdown"] }
  > = {};

  for (const stage of stages) {
    if (!goalOn[stage.goalId]) continue;
    const bucket = stageBucket[stage.stageId] ?? "soon";
    if (bucket === "skip") continue;
    for (const line of stage.lines) {
      if (line.kind !== "item") continue;
      if (lineDone.has(line.lineId)) continue;
      const entry = byItem[line.itemId] ?? { total: 0, breakdown: [] };
      entry.total += line.qty;
      entry.breakdown.push({
        bucket: bucket as "hi" | "soon" | "evt",
        source: `${stage.goalName} ${stage.stageLabel.replace(/^Stage /, "S").replace(/ · .+$/, "")}`,
        qty: line.qty,
      });
      byItem[line.itemId] = entry;
    }
  }

  // Sort: any line with an "hi" bucket first, then "soon", then "evt", then by total desc.
  const bucketRank = (bs: HuntListLine["breakdown"]) =>
    bs.some((b) => b.bucket === "hi") ? 0 : bs.some((b) => b.bucket === "soon") ? 1 : 2;

  const materials: HuntListLine[] = Object.entries(byItem)
    .map(([itemId, v]) => ({
      itemId,
      itemName: ITEMS[itemId]?.name ?? itemId,
      total: v.total,
      breakdown: v.breakdown,
    }))
    .sort((a, b) => {
      const ra = bucketRank(a.breakdown);
      const rb = bucketRank(b.breakdown);
      if (ra !== rb) return ra - rb;
      return b.total - a.total;
    })
    .slice(0, 12);

  // Static placeholder primary map. Phase 4 + #4 produce this dynamically.
  const primaryMap = materials.length > 0
    ? {
        mapId: "dam_battlegrounds",
        name: "Dam Battlegrounds",
        condition: "⚡ Lush Blooms (mock)",
        focusPOIs: ["Scrap Yard", "Workshop"],
      }
    : undefined;

  return {
    primaryMap,
    recommendedMaps: [],
    materials,
  };
}

// ── Initial demo state ──────────────────────────────────────────────────────
// Sensible defaults so the page isn't blank on first visit. State is in-memory
// only in Phase 3, so this resets on every refresh.

function initialState() {
  const stageBucket: Record<string, Bucket> = {};
  const goalOn: Record<string, boolean> = {};
  const benchTargetTier: Record<string, number> = {};

  // Projects: cycle-scoped on, persistent off
  for (const projectId of PROJECT_ORDER) {
    const p = PROJECTS[projectId];
    if (!p) continue;
    goalOn[`proj:${p.id}`] = p.cycleScoped;
    for (const stage of p.stages) {
      const stageId = `proj:${p.id}:s${stage.level}`;
      // Expedition: S2 soon, S3+ eventual; everything else soon
      if (p.id === "expedition") {
        stageBucket[stageId] = stage.level <= 2 ? "soon" : "evt";
      } else if (p.id === "avian_alarm") {
        stageBucket[stageId] = stage.level === 1 ? "soon" : "evt";
      } else {
        stageBucket[stageId] = "evt";
      }
    }
  }

  // Event: on, high
  if (CURRENT_EVENT) {
    const goalId = `event:${CURRENT_EVENT.id}`;
    goalOn[goalId] = true;
    stageBucket[goalId] = "hi";
  }

  // Benches: gunsmith + gear_bench on, others off; T1 soon, T2+ eventual
  const activeBenches = new Set(["gunsmith", "gear_bench"]);
  for (const bench of Object.values(WORKBENCHES)) {
    const goalId = `bench:${bench.id}`;
    goalOn[goalId] = activeBenches.has(bench.id);
    benchTargetTier[bench.id] = bench.maxTier;
    for (const tier of bench.tiers) {
      const stageId = `${goalId}:t${tier.level}`;
      stageBucket[stageId] = tier.level === 1 ? "soon" : "evt";
    }
  }
  // Gunsmith T1 high (load-bearing demo signal)
  stageBucket["bench:gunsmith:t1"] = "hi";

  return {
    stageBucket,
    lineDone: new Set<string>(),
    goalOn,
    benchTargetTier,
  };
}

// ── Component ───────────────────────────────────────────────────────────────

export default function LooterPage() {
  const state = useLooterState(initialState());

  const allStages = useMemo<Stage[]>(
    () => [...eventStages(), ...projectStages(), ...benchStages()],
    [],
  );

  const huntList = useMemo(
    () => buildMockHuntList(allStages, state.stageBucket, state.goalOn, state.lineDone),
    [allStages, state.stageBucket, state.goalOn, state.lineDone],
  );

  const expeditionDays = daysUntilDeparture();
  const eventDays = daysUntilEventEnd();

  // Group stages by goal for the card list, preserving section ordering
  const stagesByGoal = useMemo(() => {
    const m = new Map<string, Stage[]>();
    for (const s of allStages) {
      const arr = m.get(s.goalId) ?? [];
      arr.push(s);
      m.set(s.goalId, arr);
    }
    return m;
  }, [allStages]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-1">Looter</h1>
      <p className="text-xs text-text-muted mb-3">
        Phase 3 · in-memory state (resets on refresh) · map ranking lands with live conditions (#4)
      </p>

      {/* ── Timers ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border"
          style={{
            borderColor: "color-mix(in srgb, var(--color-accent) 35%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--color-accent) 8%, transparent)",
          }}
        >
          <span>🚀</span>
          <span className="text-text-secondary">Expedition departs in</span>
          <span className="font-bold" style={{ color: "var(--color-accent-text)" }}>
            {expeditionDays} days
          </span>
        </div>
        {eventDays !== null && CURRENT_EVENT && (
          <div
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border"
            style={{
              borderColor: "var(--color-warning)",
              backgroundColor: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
              animation: eventDays <= 14 ? "pulse 2.4s ease-in-out infinite" : undefined,
            }}
          >
            <span>⏳</span>
            <span className="text-text-secondary">
              {CURRENT_EVENT.umbrella ?? CURRENT_EVENT.name} ends in
            </span>
            <span className="font-bold" style={{ color: "var(--color-warning)" }}>
              {eventDays} days
            </span>
          </div>
        )}
      </div>

      <PriorityBoard
        stages={allStages}
        stageBucket={state.stageBucket}
        goalOn={state.goalOn}
        lineDone={state.lineDone}
        onCycleBucket={state.cycleBucket}
        onSetBucket={state.setBucket}
      />

      {/* ── Desktop split: cards (main) + hunt brief (right rail) ── */}
      <div className="grid gap-5 items-start grid-cols-1 looter-split">
        <div className="min-w-0 looter-split-main">
          <SectionHead icon="🎉" label="Events" count={CURRENT_EVENT ? "1 active" : "0 active"} />
          {CURRENT_EVENT && (() => {
            const ev = CURRENT_EVENT;
            const evGoalId = `event:${ev.id}`;
            return (
              <GoalCard
                goalId={evGoalId}
                name={ev.name}
                goalKind="event"
                stages={stagesByGoal.get(evGoalId) ?? []}
                on={state.goalOn[evGoalId] ?? false}
                daysRemaining={eventDays}
                urgent={(eventDays ?? Infinity) <= 14}
                defaultExpanded
                stageBucket={state.stageBucket}
                lineDone={state.lineDone}
                onToggleGoal={() => state.toggleGoal(evGoalId)}
                onCycleBucket={state.cycleBucket}
                onToggleLine={state.toggleLine}
              />
            );
          })()}

          <SectionHead icon="🏗️" label="Projects" count={`${PROJECT_ORDER.length} total`} />
          {PROJECT_ORDER.map((pid) => {
            const p = PROJECTS[pid];
            if (!p) return null;
            const goalId = `proj:${p.id}`;
            const days = daysUntilEnd(pid);
            return (
              <GoalCard
                key={goalId}
                goalId={goalId}
                name={p.name}
                goalKind="project"
                stages={stagesByGoal.get(goalId) ?? []}
                on={state.goalOn[goalId] ?? false}
                daysRemaining={days}
                urgent={(days ?? Infinity) <= 14}
                defaultExpanded={p.id === "expedition"}
                stageBucket={state.stageBucket}
                lineDone={state.lineDone}
                onToggleGoal={() => state.toggleGoal(goalId)}
                onCycleBucket={state.cycleBucket}
                onToggleLine={state.toggleLine}
              />
            );
          })}

          <SectionHead icon="🛠️" label="Workbenches" count={`${Object.keys(WORKBENCHES).length} total`} />
          {Object.values(WORKBENCHES).map((bench) => {
            const goalId = `bench:${bench.id}`;
            return (
              <GoalCard
                key={goalId}
                goalId={goalId}
                name={bench.name}
                goalKind="bench"
                stages={stagesByGoal.get(goalId) ?? []}
                on={state.goalOn[goalId] ?? false}
                daysRemaining={null}
                defaultExpanded={bench.id === "gunsmith"}
                stageBucket={state.stageBucket}
                lineDone={state.lineDone}
                onToggleGoal={() => state.toggleGoal(goalId)}
                onCycleBucket={state.cycleBucket}
                onToggleLine={state.toggleLine}
              />
            );
          })}
        </div>

        <div className="min-w-0 looter-split-rail">
          <HuntBrief huntList={huntList} />
        </div>
      </div>

      <style>{`
        @media (min-width: 1080px) {
          .looter-split { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
          .looter-split-rail { position: sticky; top: 80px; }
        }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); } 50% { box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15); } }
      `}</style>
    </div>
  );
}

function SectionHead({ icon, label, count }: { icon: string; label: string; count: string }) {
  return (
    <div className="flex items-center gap-2.5 mt-3.5 mb-1.5 mx-1 text-[11px] uppercase tracking-wide text-text-secondary first:mt-0">
      <span className="text-base">{icon}</span>
      <span>{label}</span>
      <span className="text-text-muted text-[10px] normal-case tracking-normal font-normal">· {count}</span>
      <span className="flex-1 h-px bg-border-subtle ml-1" />
    </div>
  );
}
