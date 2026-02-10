import type { EquippedState } from "../../types";
import { TIER_LABELS, TIER_COLORS } from "../../data/constants";
import CostDisplay from "../shared/CostDisplay";

interface BuildPreviewProps {
  equipped: EquippedState;
  buildCost: Record<string, number>;
  onCustomize: () => void;
}

export default function BuildPreview({
  equipped,
  buildCost,
  onCustomize,
}: BuildPreviewProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-orange-500 p-8 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Your Build
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-400 font-semibold">Total Cost:</span>
          <CostDisplay cost={buildCost} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(equipped).map(([slot, { fam, tier }]) => (
          <div
            key={slot}
            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
          >
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              {slot}
            </div>
            <div className="font-bold text-lg text-white">{fam}</div>
            <div
              className="text-sm mt-2 font-semibold"
              style={{ color: TIER_COLORS[String(tier)] }}
            >
              {TIER_LABELS[String(tier)]}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onCustomize}
        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
      >
        Customize This Build
      </button>
    </div>
  );
}
