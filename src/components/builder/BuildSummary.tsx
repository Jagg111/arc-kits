import type { Weapon, EquippedState, CumulativeEffect } from "../../types";

interface BuildSummaryProps {
  weapon: Weapon;
  buildCost: Record<string, number>;
  cumulativeEffects: CumulativeEffect[];
  equipped: EquippedState;
  onClearAll: () => void;
}

export default function BuildSummary({
  weapon,
  buildCost,
  cumulativeEffects,
  equipped,
  onClearAll,
}: BuildSummaryProps) {
  const hasEquipped = Object.keys(equipped).length > 0;
  const hasCost = Object.keys(buildCost).length > 0;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 lg:sticky lg:top-16 space-y-4">
      <div>
        <h3 className="font-bold text-xl text-white mb-2">{weapon.name}</h3>
        <p className="text-xs text-gray-500">{weapon.desc}</p>
      </div>

      {hasCost && (
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm text-gray-400 font-semibold mb-3">
            Total Cost
          </h4>
          <div className="space-y-2">
            {Object.entries(buildCost).map(([item, qty]) => (
              <div
                key={item}
                className="flex items-center justify-between text-sm bg-gray-800 rounded-lg px-3 py-2"
              >
                <span className="text-gray-300">{item}</span>
                <span className="text-orange-400 font-bold">{qty}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cumulativeEffects.length > 0 && (
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm text-gray-400 font-semibold mb-3">
            Cumulative Effects
          </h4>
          <div className="space-y-3">
            {cumulativeEffects.map((effect) => (
              <div key={effect.stat} className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">
                    {effect.stat}
                  </span>
                  <span className="text-sm font-bold text-orange-400">
                    {effect.unit === "%"
                      ? `${effect.total}%`
                      : `+${effect.total}`}
                  </span>
                </div>
                {effect.mods.length > 1 && (
                  <div className="space-y-1">
                    {effect.mods.map((mod, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs text-gray-400"
                      >
                        <span>{mod.name}</span>
                        <span>{mod.effect}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasEquipped && (
        <button
          onClick={onClearAll}
          className="w-full px-4 py-3 rounded-lg bg-red-900/30 hover:bg-red-900/40 text-red-400 font-semibold transition-colors"
        >
          Clear All Attachments
        </button>
      )}
    </div>
  );
}
