import type { EquippedMod, ModFamily, SlotType, Rarity } from "../../types";
import { RARITY_LABELS, RARITY_COLORS } from "../../data/constants";
import { MOD_FAMILIES } from "../../data/mods";

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
        className="bg-gray-900 rounded-xl border border-gray-700 p-3 flex items-center gap-3 cursor-pointer hover:border-gray-600 transition-colors"
        onClick={() => onOpenDrawer(slot)}
      >
        {tierData?.img && (
          <img
            src={tierData.img}
            alt={`${equipped.fam} ${RARITY_LABELS[equipped.tier]}`}
            loading="lazy"
            className="shrink-0 w-12 h-12 rounded object-contain bg-gray-800"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm truncate">{equipped.fam}</span>
            <span
              className="shrink-0 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: color, color: "white" }}
            >
              {RARITY_LABELS[equipped.tier]}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 truncate">
            {tierData?.e[0] ?? slot}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(slot);
          }}
          className="shrink-0 p-1.5 rounded-lg hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-colors"
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
      className="w-full bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-700 hover:border-orange-500/50 p-3 flex items-center gap-3 transition-colors text-left group"
    >
      <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-gray-750">
        <svg className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div>
        <div className="font-semibold text-sm text-gray-400 group-hover:text-gray-300">{slot}</div>
        <div className="text-xs text-gray-600">Tap to choose</div>
      </div>
    </button>
  );
}
