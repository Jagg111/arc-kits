// ============================================================================
// FILE: components/looter/BucketBadge.tsx
// PURPOSE: Segmented control for selecting a stage's priority bucket.
//          Four options stacked vertically (Hi / Soon / Evt / Skip); active
//          one highlighted. Done state is signalled by the stage label — this
//          component always renders the 4 buttons to avoid layout shifts.
// ============================================================================

import type { Bucket } from "./types";

interface BucketBadgeProps {
  bucket: Bucket;
  onSelect: (b: Bucket) => void;
}

const OPTIONS: { value: Bucket; label: string }[] = [
  { value: "hi",   label: "🔥 Hi"   },
  { value: "soon", label: "⏱ Soon"  },
  { value: "evt",  label: "🌱 Evt"  },
  { value: "skip", label: "— Skip"  },
];

const ACTIVE_COLOR: Record<Bucket, string> = {
  hi:   "var(--color-bucket-hi)",
  soon: "var(--color-bucket-soon)",
  evt:  "var(--color-bucket-evt)",
  skip: "var(--color-text-muted)",
};

export default function BucketBadge({ bucket, onSelect }: BucketBadgeProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {OPTIONS.map(({ value, label }) => {
        const active = bucket === value;
        const color = ACTIVE_COLOR[value];
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className="w-full px-1.5 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wide border cursor-pointer transition-colors text-center"
            style={
              active
                ? {
                    color: value === "skip" ? "var(--color-text-secondary)" : color,
                    backgroundColor: `color-mix(in srgb, ${color} ${value === "skip" ? 20 : 15}%, transparent)`,
                    borderColor: value === "skip" ? "var(--color-text-muted)" : `color-mix(in srgb, ${color} 40%, transparent)`,
                    borderStyle: "solid",
                  }
                : {
                    color: "var(--color-text-muted)",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border-subtle)",
                  }
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
