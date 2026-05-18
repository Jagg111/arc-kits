// ============================================================================
// FILE: components/shared/CostPill.tsx
// PURPOSE: Thin adapter over MaterialPill for callers that receive raw cost
//          strings like "6x Metal Parts". Parses the string, looks up the
//          itemId via ITEM_ID_BY_NAME, and delegates to MaterialPill for
//          consistent rarity-tinted rendering site-wide.
// USED BY: AttachmentSlot.tsx, ModFamilySection.tsx
// ============================================================================

import { ITEM_ID_BY_NAME, MATERIAL_INFO, RARITY_COLORS } from "../../data/constants";
import MaterialPill from "./MaterialPill";

interface CostPillProps {
  /** Raw cost string like "6x Metal Parts", parsed internally */
  cost: string;
}

function parseCost(cost: string): { qty: string; name: string } | null {
  const match = cost.trim().match(/^(\d+)x\s+(.+)$/);
  return match ? { qty: match[1], name: match[2] } : null;
}

export default function CostPill({ cost }: CostPillProps) {
  const parsed = parseCost(cost);
  if (!parsed) return <span className="px-1.5 py-0.5 rounded text-xs font-medium text-text-secondary">{cost}</span>;

  const itemId = ITEM_ID_BY_NAME[parsed.name];
  if (itemId) {
    return <MaterialPill itemId={itemId} qty={Number(parsed.qty)} size="sm" />;
  }

  // Fallback for any material not yet in ITEMS
  const info = MATERIAL_INFO[parsed.name];
  const color = info ? RARITY_COLORS[info.rarity] : "#9ca3af";
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 13%, transparent)`, color }}
    >
      {info?.img && <img src={info.img} alt={parsed.name} loading="lazy" className="w-4 h-4 object-contain" />}
      {parsed.qty} {parsed.name}
    </span>
  );
}
