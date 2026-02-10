import type { EquippedMod, ModFamily, SlotType, TierKey } from "../../types";
import { TIER_LABELS, TIER_COLORS } from "../../data/constants";
import { MOD_FAMILIES } from "../../data/mods";
import ModOption from "./ModOption";

interface AttachmentSlotProps {
  slot: SlotType;
  weaponId: string;
  equipped: EquippedMod | undefined;
  onEquip: (slot: string, fam: string, tier: TierKey) => void;
  onRemove: (slot: string) => void;
}

export default function AttachmentSlot({
  slot,
  weaponId,
  equipped,
  onEquip,
  onRemove,
}: AttachmentSlotProps) {
  const families = (MOD_FAMILIES[slot] ?? []).filter((f) =>
    f.w.includes(weaponId),
  );

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg text-gray-200">{slot}</h4>
        {equipped && (
          <button
            onClick={() => onRemove(slot)}
            className="text-sm text-red-400 hover:text-red-300 font-medium"
          >
            Remove
          </button>
        )}
      </div>

      {equipped ? (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
          <div>
            <div className="font-bold text-white text-lg">{equipped.fam}</div>
            <div
              className="text-sm mt-1 font-semibold"
              style={{ color: TIER_COLORS[String(equipped.tier)] }}
            >
              {TIER_LABELS[String(equipped.tier)]}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {families.map((fam: ModFamily) => (
            <ModOption
              key={fam.fam}
              mod={fam}
              onSelect={(famName, tier) => onEquip(slot, famName, tier)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
