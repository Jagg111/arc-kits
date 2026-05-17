// ============================================================================
// FILE: components/looter/GoalCard.tsx
// PURPOSE: Collapsible card representing one goal (project / event / bench).
//          Header shows name + progress + deadline pill + ON/OFF toggle.
//          Expanded body renders one StageBlock per stage.
// ============================================================================

import { useState } from "react";
import StageBlock from "./StageBlock";
import type { Bucket, Stage } from "./types";

interface GoalCardProps {
  goalId: string;
  name: string;
  goalKind: "project" | "bench" | "event";
  stages: Stage[];
  on: boolean;
  daysRemaining: number | null;
  urgent?: boolean;
  defaultExpanded?: boolean;
  stageBucket: Record<string, Bucket>;
  lineDone: Set<string>;
  onToggleGoal: () => void;
  onCycleBucket: (stageId: string) => void;
  onToggleLine: (lineId: string) => void;
  /** Bench-only: current target tier and setter. Tiers above this are
   *  excluded from material demand by the aggregator. */
  benchId?: string;
  benchMaxTier?: number;
  benchTargetTier?: number;
  onSetBenchTargetTier?: (benchId: string, tier: number) => void;
}

export default function GoalCard({
  name,
  goalKind,
  stages,
  on,
  daysRemaining,
  urgent,
  defaultExpanded,
  stageBucket,
  lineDone,
  onToggleGoal,
  onCycleBucket,
  onToggleLine,
  benchId,
  benchMaxTier,
  benchTargetTier,
  onSetBenchTargetTier,
}: GoalCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);

  const totalLines = stages.reduce((n, s) => n + s.lines.length, 0);
  const doneLines = stages.reduce(
    (n, s) => n + s.lines.filter((l) => lineDone.has(l.lineId)).length,
    0,
  );
  const pct = totalLines === 0 ? 0 : Math.round((doneLines / totalLines) * 100);

  return (
    <div
      className="rounded-lg overflow-hidden mb-2.5 border border-border-subtle bg-surface"
      style={{ opacity: on ? 1 : 0.55 }}
    >
      <div
        className={`flex items-center gap-2.5 px-3.5 py-3 cursor-pointer ${expanded ? "bg-surface-alt border-b border-border-subtle" : "hover:bg-surface-alt"}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="font-semibold flex-1 text-sm">{name}</span>
        <span className="text-[11px] text-text-muted">{totalLines === 0 ? "persistent" : `${doneLines}/${totalLines}`}</span>
        <span className="w-14 h-1 rounded bg-border overflow-hidden">
          <span className="block h-full" style={{ width: `${pct}%`, backgroundColor: "var(--color-accent)" }} />
        </span>
        {daysRemaining !== null && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full border"
            style={{
              color: urgent ? "var(--color-warning)" : "var(--color-text-secondary)",
              borderColor: urgent ? "var(--color-warning)" : "var(--color-border)",
            }}
          >
            {daysRemaining}d
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleGoal();
          }}
          className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
          style={{
            backgroundColor: on ? "var(--color-success)" : "var(--color-border)",
            color: on ? "#000" : "var(--color-text-muted)",
          }}
        >
          {on ? "ON" : "OFF"}
        </button>
        <span
          className="text-text-muted transition-transform"
          style={{ transform: expanded ? "rotate(90deg)" : "none" }}
        >
          ▶
        </span>
      </div>
      {expanded && on && goalKind === "bench" && benchId && benchMaxTier && onSetBenchTargetTier && (
        <div className="px-3.5 py-2 border-b border-border-subtle bg-surface-alt/50 flex items-center gap-2 text-xs">
          <span className="text-text-secondary">Target tier:</span>
          {Array.from({ length: benchMaxTier }, (_, i) => i + 1).map((t) => {
            const active = (benchTargetTier ?? benchMaxTier) === t;
            return (
              <button
                key={t}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetBenchTargetTier(benchId, t);
                }}
                className="px-2 py-0.5 rounded-full text-[11px] font-semibold border"
                style={{
                  borderColor: active ? "var(--color-accent)" : "var(--color-border)",
                  backgroundColor: active
                    ? "color-mix(in srgb, var(--color-accent) 18%, transparent)"
                    : "transparent",
                  color: active ? "var(--color-accent-text)" : "var(--color-text-secondary)",
                }}
              >
                T{t}
              </button>
            );
          })}
          <span className="text-[10px] text-text-muted ml-1">
            tiers above target are excluded from demand
          </span>
        </div>
      )}
      {expanded && on && (
        <div>
          {stages.map((stage) => (
            <StageBlock
              key={stage.stageId}
              stage={stage}
              bucket={stageBucket[stage.stageId] ?? "soon"}
              lineDone={lineDone}
              onCycleBucket={() => onCycleBucket(stage.stageId)}
              onToggleLine={onToggleLine}
              tinted={goalKind === "bench"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
