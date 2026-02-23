// ============================================================================
// FILE: components/advisor/SynergyTagList.tsx
// PURPOSE: Row of synergy tag pills for a weapon pairing (green = positive, amber = warning)
// USED BY: PairingCard.tsx
// ============================================================================

import type { SynergyTag } from "../../types";

interface SynergyTagListProps {
  tags: SynergyTag[];
}

export default function SynergyTagList({ tags }: SynergyTagListProps) {
  return (
    <div className="flex gap-1 flex-wrap px-0.5 py-0.5">
      {tags.map((tag) => (
        <span
          key={tag.label}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[0.58rem] font-medium"
          style={{
            color: tag.type === "positive" ? "var(--color-success)" : "var(--color-warning)",
            backgroundColor:
              tag.type === "positive"
                ? "color-mix(in srgb, var(--color-success) 8%, transparent)"
                : "color-mix(in srgb, var(--color-warning) 8%, transparent)",
          }}
        >
          <span className="text-[0.62rem]">{tag.type === "positive" ? "\u2713" : "!"}</span>
          {tag.label}
        </span>
      ))}
    </div>
  );
}
