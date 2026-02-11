import type { EquippedMod, ModFamily, SlotType, Rarity } from "../../types";
import { RARITY_LABELS, RARITY_COLORS } from "../../data/constants";
import { MOD_FAMILIES } from "../../data/mods";
import ModOption from "./ModOption";

interface AttachmentSlotProps {
  slot: SlotType;
  weaponId: string;
  equipped: EquippedMod | undefined;
  onEquip: (slot: string, fam: string, tier: Rarity) => void;
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
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
          {(() => {
            const family = families.find((f) => f.fam === equipped.fam);
            const tierData = family?.tiers[equipped.tier];
            return (
              <>
                {tierData?.img && (
                  <img
                    src={tierData.img}
                    alt={`${equipped.fam} ${RARITY_LABELS[equipped.tier]}`}
                    loading="lazy"
                    className="shrink-0 w-14 h-14 rounded object-contain bg-gray-900"
                  />
                )}
                <div>
                  <div className="font-bold text-white text-lg">{equipped.fam}</div>
                  <div
                    className="text-sm mt-1 font-semibold"
                    style={{ color: RARITY_COLORS[equipped.tier] }}
                  >
                    {RARITY_LABELS[equipped.tier]} — {equipped.tier}
                  </div>
                  {tierData && (
                    <>
                      <ul className="text-sm text-gray-300 mt-2 space-y-0.5">
                        {tierData.e.map((effect, i) => (
                          <li key={i}>{effect}</li>
                        ))}
                      </ul>
                      {tierData.cr ? (
                        <div className="text-xs text-orange-400 mt-1">{tierData.cr}</div>
                      ) : (
                        <div className="text-xs text-green-500 mt-1">Free</div>
                      )}
                    </>
                  )}
                </div>
              </>
            );
          })()}
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
