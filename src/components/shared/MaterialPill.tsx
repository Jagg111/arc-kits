// ============================================================================
// FILE: components/shared/MaterialPill.tsx
// PURPOSE: Rarity-tinted material chip — structured-input sibling of CostPill.
//          CostPill parses a "6x Metal Parts" string; MaterialPill takes an
//          itemId + qty directly. Both share the same visual contract:
//          rarity-tinted background + rarity text color + small icon.
// USED BY: components/looter/* — priority board summary chips, stage block
//          line items.
// ============================================================================

import { ITEMS, itemImgUrl } from "../../data/items";
import { RARITY_COLORS } from "../../data/constants";

interface MaterialPillProps {
  itemId: string;
  qty: number;
  /** Show the item name. When false, renders compact (icon + qty only). */
  showName?: boolean;
  /** Render with a strike-through. */
  done?: boolean;
  /** "sm" matches the builder's CostPill density; "md" is the Looter default. */
  size?: "sm" | "md";
}

export default function MaterialPill({
  itemId,
  qty,
  showName = true,
  done = false,
  size = "md",
}: MaterialPillProps) {
  const item = ITEMS[itemId];
  const color = item ? RARITY_COLORS[item.rarity] : "var(--color-text-muted)";
  const imgPx = size === "sm" ? 16 : 20;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium ${
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs"
      }`}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 13%, transparent)`,
        color,
        opacity: done ? 0.55 : 1,
        textDecoration: done ? "line-through" : "none",
      }}
    >
      {item && (
        <img
          src={itemImgUrl(item.img, 100)}
          alt={item.name}
          loading="lazy"
          className="object-contain shrink-0"
          style={{ width: imgPx, height: imgPx }}
        />
      )}
      <span className="font-semibold tabular-nums">{qty}x</span>
      {showName && <span className="truncate">{item?.name ?? itemId}</span>}
    </span>
  );
}
