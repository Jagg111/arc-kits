// ============================================================================
// FILE: components/looter/PriorityBoard.tsx
// PURPOSE: Bird's-eye view at the top of the Looter page. Three columns
//          (🔥 High / ⏱ Soon / 🌱 Eventual) listing every non-skipped stage
//          as a chip. Drag chips between columns to change bucket. Click-to-
//          cycle lives on the StageBlock badge inside goal cards, not here —
//          the board's job is the at-a-glance overview, not a fast editor.
//
//          Each column shows a "Needs across this bucket" summary of the top
//          materials in that bucket. Phase 3 derives these from the same
//          stage data the goal cards render; Phase 4's aggregator will
//          replace the inline derivation.
// ============================================================================

import { useState, useMemo } from "react";
import MaterialPill from "../shared/MaterialPill";
import type { Bucket, Stage } from "./types";

interface PriorityBoardProps {
  stages: Stage[];
  stageBucket: Record<string, Bucket>;
  lineDone: Set<string>;
  onSetBucket: (stageId: string, bucket: Bucket) => void;
}

type ActiveBucket = "hi" | "soon" | "evt";

const COL_STYLES: Record<ActiveBucket, { color: string; icon: string; label: string }> = {
  hi:   { color: "var(--color-bucket-hi)",   icon: "🔥", label: "High" },
  soon: { color: "var(--color-bucket-soon)", icon: "⏱",  label: "Soon" },
  evt:  { color: "var(--color-bucket-evt)",  icon: "🌱", label: "Eventual" },
};

const DND_MIME = "application/x-arc-stage-id";

export default function PriorityBoard({
  stages,
  stageBucket,
  lineDone,
  onSetBucket,
}: PriorityBoardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [dragOverBucket, setDragOverBucket] = useState<ActiveBucket | null>(null);

  const byBucket = useMemo(() => {
    const map: Record<ActiveBucket, Stage[]> = { hi: [], soon: [], evt: [] };
    for (const stage of stages) {
      const b = stageBucket[stage.stageId] ?? "skip";
      if (b === "skip") continue;
      const total = stage.lines.length;
      const done = stage.lines.filter((l) => lineDone.has(l.lineId)).length;
      if (total > 0 && done === total) continue; // completed stages don't crowd the board
      map[b].push(stage);
    }
    return map;
  }, [stages, stageBucket, lineDone]);

  const summary = useMemo(() => {
    const summarize = (list: Stage[]) => {
      const totals: Record<string, number> = {};
      for (const stage of list) {
        for (const line of stage.lines) {
          if (line.kind !== "item") continue;
          if (lineDone.has(line.lineId)) continue;
          totals[line.itemId] = (totals[line.itemId] ?? 0) + line.qty;
        }
      }
      return Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    };
    return {
      hi: summarize(byBucket.hi),
      soon: summarize(byBucket.soon),
      evt: summarize(byBucket.evt),
    };
  }, [byBucket, lineDone]);

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden mb-4">
      <div className="px-3.5 py-2.5 flex items-center gap-2.5 border-b border-border-subtle bg-surface-alt">
        <h2 className="text-[11px] uppercase tracking-wide font-semibold text-text-secondary">
          Priority Board
        </h2>
        <span className="text-[11px] text-text-muted hidden sm:inline">
          drag chips between columns to change priority · use the stage badges below to cycle
        </span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto text-[11px] text-text-muted hover:text-text-primary cursor-pointer"
        >
          {collapsed ? "expand ▾" : "collapse ▴"}
        </button>
      </div>
      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {(["hi", "soon", "evt"] as ActiveBucket[]).map((b) => {
            const s = COL_STYLES[b];
            const chips = byBucket[b];
            const mats = summary[b];
            return (
              <div
                key={b}
                className="px-3 py-2.5 md:border-r border-border-subtle last:border-r-0 border-b md:border-b-0 min-h-[130px] transition-colors"
                onDragOver={(e) => {
                  if (e.dataTransfer.types.includes(DND_MIME)) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverBucket !== b) setDragOverBucket(b);
                  }
                }}
                onDragLeave={(e) => {
                  // Only clear when leaving the column, not when moving over inner children
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setDragOverBucket((prev) => (prev === b ? null : prev));
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const stageId = e.dataTransfer.getData(DND_MIME);
                  setDragOverBucket(null);
                  if (stageId) onSetBucket(stageId, b);
                }}
                style={{
                  backgroundColor:
                    dragOverBucket === b
                      ? `color-mix(in srgb, ${s.color} 12%, transparent)`
                      : undefined,
                  outline:
                    dragOverBucket === b
                      ? `1px dashed ${s.color}`
                      : undefined,
                  outlineOffset: dragOverBucket === b ? "-4px" : undefined,
                }}
              >
                <div className="flex items-center gap-1.5 mb-2 text-[11px] uppercase tracking-wide" style={{ color: s.color }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: s.color, display: "inline-block" }} />
                  <span>{s.icon} {s.label}</span>
                  <span className="ml-auto text-text-muted text-[10px]">{chips.length}</span>
                </div>
                {mats.length > 0 && (
                  <div className="mb-2 pb-2 border-b border-dashed border-border-subtle">
                    <div className="text-[9px] uppercase tracking-wide text-text-muted mb-1.5">
                      Needs across this bucket
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {mats.map(([itemId, qty]) => (
                        <MaterialPill
                          key={itemId}
                          itemId={itemId}
                          qty={qty}
                          showName
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {chips.length === 0 && (
                  <div className="text-[11px] text-text-muted italic">no stages here</div>
                )}
                {chips.map((stage) => {
                  const total = stage.lines.length;
                  const done = stage.lines.filter((l) => lineDone.has(l.lineId)).length;
                  return (
                    <div
                      key={stage.stageId}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData(DND_MIME, stage.stageId);
                      }}
                      className="flex items-center gap-1.5 w-full text-left px-2 py-1.5 mb-1 rounded border border-border bg-bg-base text-xs hover:border-accent cursor-grab active:cursor-grabbing select-none"
                      title="Drag to another bucket"
                    >
                      <span className="text-text-muted text-[10px]">⋮⋮</span>
                      <span className="flex-1 truncate">{stage.goalName} · {stage.stageLabel}</span>
                      <span className="text-[10px] text-text-muted">{done}/{total}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
