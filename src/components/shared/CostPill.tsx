// ============================================================================
// FILE: components/shared/CostPill.tsx
// PURPOSE: Reusable cost material pill that shows a material's icon and name,
//          colored by the material's in-game rarity tier (Common/Uncommon/Rare).
// USED BY: AttachmentSlot.tsx, ModFamilySection.tsx (inline cost pills),
//          WeaponBuilder.tsx, StatsSummaryBar.tsx (total cost rows)
//
// COLOR PATTERN: Uses color-mix() for a ~13% opacity tinted background with the
// rarity color for the text. Colors are CSS custom properties that adapt per theme.
// ============================================================================

import { MATERIAL_INFO, RARITY_COLORS } from "../../data/constants";

interface CostPillProps {
  /** Raw cost string like "6x Metal Parts", parsed internally */
  cost: string;
}

/** Parses "6x Metal Parts" into { qty: "6", name: "Metal Parts" } */
function parseCost(cost: string): { qty: string; name: string } | null {
  const match = cost.trim().match(/^(\d+)x\s+(.+)$/);
  return match ? { qty: match[1], name: match[2] } : null;
}

export default function CostPill({ cost }: CostPillProps) {
  const parsed = parseCost(cost);
  if (!parsed) return <span className="px-1.5 py-0.5 rounded text-xs font-medium text-text-secondary">{cost}</span>;

  const info = MATERIAL_INFO[parsed.name];
  const color = info ? RARITY_COLORS[info.rarity] : "#9ca3af";

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 13%, transparent)`, color }}
    >
      {info?.img && (
        <img
          src={info.img}
          alt={parsed.name}
          loading="lazy"
          className="w-4 h-4 object-contain"
        />
      )}
      {cost}
    </span>
  );
}
