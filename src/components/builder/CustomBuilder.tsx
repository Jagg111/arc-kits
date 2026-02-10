import type { Weapon, EquippedState, TierKey, SlotType, CumulativeEffect } from "../../types";
import AttachmentSlot from "./AttachmentSlot";
import BuildSummary from "./BuildSummary";

interface CustomBuilderProps {
  weapon: Weapon;
  equipped: EquippedState;
  buildCost: Record<string, number>;
  cumulativeEffects: CumulativeEffect[];
  onEquip: (slot: string, fam: string, tier: TierKey) => void;
  onRemove: (slot: string) => void;
  onClearAll: () => void;
  onBack: () => void;
}

export default function CustomBuilder({
  weapon,
  equipped,
  buildCost,
  cumulativeEffects,
  onEquip,
  onRemove,
  onClearAll,
  onBack,
}: CustomBuilderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Goal Selection
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BuildSummary
            weapon={weapon}
            buildCost={buildCost}
            cumulativeEffects={cumulativeEffects}
            equipped={equipped}
            onClearAll={onClearAll}
          />
        </div>

        <div className="lg:col-span-2 space-y-3">
          {weapon.slots.map((slot) => (
            <AttachmentSlot
              key={slot}
              slot={slot as SlotType}
              weaponId={weapon.id}
              equipped={equipped[slot]}
              onEquip={onEquip}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
