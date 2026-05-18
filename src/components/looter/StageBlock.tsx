// ============================================================================
// FILE: components/looter/StageBlock.tsx
// PURPOSE: One stage row inside a goal card. Left column = bucket badge with
//          a "click to cycle" hint. Right column = stage label + line checkboxes.
//          Stage completion is DERIVED from line checks — never stored.
// ============================================================================

import BucketBadge from "./BucketBadge";
import MaterialPill from "../shared/MaterialPill";
import type { Bucket, Stage } from "./types";

interface StageBlockProps {
  stage: Stage;
  bucket: Bucket;
  lineDone: Set<string>;
  onSetBucket: (bucket: Bucket) => void;
  onToggleLine: (lineId: string) => void;
  tinted?: boolean;  // bench tier stages get a faint indigo wash in the prototype
}

export default function StageBlock({
  stage,
  bucket,
  lineDone,
  onSetBucket,
  onToggleLine,
  tinted,
}: StageBlockProps) {
  const totalLines = stage.lines.length;
  const doneLines = stage.lines.filter((l) => lineDone.has(l.lineId)).length;
  const isDone = totalLines > 0 && doneLines === totalLines;
  const skipped = bucket === "skip";

  return (
    <div
      className="grid gap-2.5 items-start px-3 py-2 border-b border-border-subtle last:border-b-0"
      style={{
        gridTemplateColumns: "auto 1fr",
        backgroundColor: tinted ? "color-mix(in srgb, var(--color-accent) 3%, transparent)" : undefined,
        opacity: skipped ? 0.7 : 1,
      }}
    >
      <div className="flex flex-col items-start">
        <BucketBadge bucket={bucket} onSelect={onSetBucket} />
      </div>
      <div>
        <div
          className="text-[10px] uppercase tracking-wide mb-1.5 font-medium"
          style={{
            color: isDone
              ? "var(--color-success)"
              : skipped
              ? "var(--color-text-muted)"
              : "var(--color-accent-text)",
          }}
        >
          {stage.stageLabel}
          {isDone && " — complete"}
        </div>
        {stage.lines.map((line) => {
          const done = lineDone.has(line.lineId);
          if (line.kind === "item") {
            return (
              <label
                key={line.lineId}
                className="flex items-center gap-2 py-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => onToggleLine(line.lineId)}
                  style={{ accentColor: "var(--color-accent)" }}
                />
                <MaterialPill itemId={line.itemId} qty={line.qty} done={done} />
              </label>
            );
          }
          if (line.kind === "task") {
            return (
              <label
                key={line.lineId}
                className="flex items-center gap-2 py-1 text-xs cursor-pointer"
                style={{
                  color: done ? "var(--color-text-muted)" : "var(--color-text-primary)",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => onToggleLine(line.lineId)}
                  style={{ accentColor: "var(--color-accent)" }}
                />
                <span className="flex-1">{line.label}</span>
                {line.mapId && (
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">
                    {line.mapId.replace(/_/g, " ")}
                  </span>
                )}
              </label>
            );
          }
          // value_by_category bucket line
          return (
            <label
              key={line.lineId}
              className="flex items-center gap-2 py-1 text-xs cursor-pointer"
              style={{
                color: done ? "var(--color-text-muted)" : "var(--color-text-primary)",
                textDecoration: done ? "line-through" : "none",
              }}
            >
              <input
                type="checkbox"
                checked={done}
                onChange={() => onToggleLine(line.lineId)}
                disabled={skipped}
                style={{ accentColor: "var(--color-accent)" }}
              />
              <span className="flex-1">{line.label}</span>
              <span className="text-[11px] text-text-muted">{line.coins.toLocaleString()} coin</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
