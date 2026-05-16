// ============================================================================
// FILE: components/looter/BucketBadge.tsx
// PURPOSE: Click-to-cycle bucket badge shown on every stage. Cycles
//          High → Soon → Eventual → Skipped → High. Done state (all lines
//          checked) renders as a static green pill — click is a no-op since
//          completion is derived, not a manual state.
// ============================================================================

import type { Bucket } from "./types";

interface BucketBadgeProps {
  bucket: Bucket;
  done?: boolean;
  onClick?: () => void;
}

const STYLES: Record<Bucket, { color: string; label: string; icon: string }> = {
  hi:   { color: "var(--color-bucket-hi)",   label: "High",     icon: "🔥" },
  soon: { color: "var(--color-bucket-soon)", label: "Soon",     icon: "⏱" },
  evt:  { color: "var(--color-bucket-evt)",  label: "Eventual", icon: "🌱" },
  skip: { color: "var(--color-text-muted)",  label: "Skipped",  icon: "—" },
};

export default function BucketBadge({ bucket, done, onClick }: BucketBadgeProps) {
  if (done) {
    const c = "var(--color-success)";
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border"
        style={{
          color: c,
          backgroundColor: `color-mix(in srgb, ${c} 15%, transparent)`,
          borderColor: `color-mix(in srgb, ${c} 40%, transparent)`,
        }}
      >
        ✓ done
      </span>
    );
  }

  const s = STYLES[bucket];
  const isSkip = bucket === "skip";

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border cursor-pointer"
      style={{
        color: s.color,
        backgroundColor: isSkip ? "transparent" : `color-mix(in srgb, ${s.color} 15%, transparent)`,
        borderColor: isSkip ? "var(--color-border)" : `color-mix(in srgb, ${s.color} 40%, transparent)`,
        borderStyle: isSkip ? "dashed" : "solid",
      }}
      title="Click to cycle priority"
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: s.color, display: isSkip ? "none" : "inline-block" }} />
      <span>{s.icon} {s.label}</span>
    </button>
  );
}
