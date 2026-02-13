// ============================================================================
// FILE: components/builder/AttachmentSlot.tsx
// PURPOSE: Renders a single attachment slot — either showing the equipped mod or an empty "+" button
// USED BY: WeaponBuilder.tsx (one per slot in the weapon's slots array)
//
// TWO RENDER PATHS:
//   1. Equipped: Shows mod image, name, tier badge, effects list, and a remove (X) button.
//      Crafting costs are displayed as rarity-colored pills with material icons via CostPill.
//      Clicking the card opens the ModDrawer to swap to a different mod.
//   2. Empty: Shows a dashed-border button with "+" icon. Clicking opens the ModDrawer.
//
// The `families` filter ensures only mods compatible with the current weapon are considered.
// The `w` array on each ModFamily lists which weapon IDs can use that mod.
// ============================================================================

import type { EquippedMod, ModFamily, SlotType, Rarity } from "../../types";
import { RARITY_LABELS, RARITY_COLORS } from "../../data/constants";
import { MOD_FAMILIES } from "../../data/mods";
import CostPill from "../shared/CostPill";

interface AttachmentSlotProps {
  slot: SlotType;
  weaponId: string;
  equipped: EquippedMod | undefined;
  onEquip: (slot: string, fam: string, tier: Rarity) => void;
  onRemove: (slot: string) => void;
  onOpenDrawer: (slot: SlotType) => void;
}

export default function AttachmentSlot({
  slot,
  weaponId,
  equipped,
  onRemove,
  onOpenDrawer,
}: AttachmentSlotProps) {
  const families = (MOD_FAMILIES[slot] ?? []).filter((f: ModFamily) =>
    f.w.includes(weaponId),
  );

  if (equipped) {
    const family = families.find((f) => f.fam === equipped.fam);
    const tierData = family?.tiers[equipped.tier];
    const color = RARITY_COLORS[equipped.tier];

    return (
      <div
        className="bg-surface rounded-xl border border-border p-3 flex items-start gap-3 cursor-pointer hover:border-border-subtle transition-colors"
        onClick={() => onOpenDrawer(slot)}
      >
        {tierData?.img && (
          <img
            src={tierData.img}
            alt={`${equipped.fam} ${RARITY_LABELS[equipped.tier]}`}
            loading="lazy"
            className="shrink-0 w-12 h-12 rounded object-contain bg-surface-alt"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary text-sm truncate">{equipped.fam}</span>
            <span
              className="shrink-0 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: color, color: "white" }}
            >
              {RARITY_LABELS[equipped.tier]}
            </span>
          </div>
          <ul className="text-xs text-text-secondary mt-0.5 space-y-0.5">
            {tierData?.e.map((effect, i) => (
              <li key={i}>{effect}</li>
            )) ?? <li>{slot}</li>}
          </ul>
          {tierData?.cr ? (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {tierData.cr.split(", ").map((mat) => (
                <CostPill key={mat} cost={mat} />
              ))}
            </div>
          ) : (
            <div className="text-xs text-success mt-1">Free</div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(slot);
          }}
          className="shrink-0 p-1.5 rounded-lg hover:bg-danger-bg text-danger-text hover:text-danger-text transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => onOpenDrawer(slot)}
      className="w-full bg-surface/50 rounded-xl border-2 border-dashed border-border hover:border-accent/50 p-3 flex items-center gap-3 transition-colors text-left group"
    >
      <div className="w-12 h-12 rounded bg-surface-alt flex items-center justify-center shrink-0 group-hover:bg-surface-hover">
        <svg className="w-5 h-5 text-text-faint group-hover:text-accent-text transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div>
        <div className="font-semibold text-sm text-text-secondary group-hover:text-text-primary">{slot}</div>
        <div className="text-xs text-text-faint">Tap to choose</div>
      </div>
    </button>
  );
}
