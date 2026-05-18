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
import { PROJECTS, PROJECT_ORDER, daysUntilEnd } from "../../data/projects";
import { CURRENT_EVENT, daysUntilEventEnd } from "../../data/events";
import { WORKBENCHES } from "../../data/workbenches";
import { daysUntilDeparture } from "../../data/expedition";
import { useLooterState } from "../../hooks/useLooterState";
import { buildHuntList } from "../../looter/engine";
import { allStages as buildAllStages } from "../../looter/engine/stages";
import PriorityBoard from "./PriorityBoard";
import HuntBrief from "./HuntBrief";
import GoalCard from "./GoalCard";
import type { Stage } from "./types";

// ── Component ───────────────────────────────────────────────────────────────

export default function LooterPage() {
  const state = useLooterState();

  const allStages = useMemo<Stage[]>(() => buildAllStages(), []);

  const huntList = useMemo(
    () =>
      buildHuntList({
        stages: allStages,
        stageBucket: state.stageBucket,
        lineDone: state.lineDone,
      }),
    [allStages, state.stageBucket, state.lineDone],
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
        lineDone={state.lineDone}
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
                daysRemaining={eventDays}
                urgent={(eventDays ?? Infinity) <= 14}
                defaultExpanded
                stageBucket={state.stageBucket}
                lineDone={state.lineDone}
                onSetBucket={state.setBucket}
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
                daysRemaining={days}
                urgent={(days ?? Infinity) <= 14}
                defaultExpanded={p.id === "expedition"}
                stageBucket={state.stageBucket}
                lineDone={state.lineDone}
                onSetBucket={state.setBucket}
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
                daysRemaining={null}
                defaultExpanded={bench.id === "gunsmith"}
                stageBucket={state.stageBucket}
                lineDone={state.lineDone}
                onSetBucket={state.setBucket}
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
