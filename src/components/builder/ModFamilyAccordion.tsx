import type { ModFamily, Rarity } from "../../types";
import { RARITY_LABELS, RARITY_COLORS } from "../../data/constants";

interface ModFamilyAccordionProps {
  mod: ModFamily;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: (fam: string, tier: Rarity) => void;
}

export default function ModFamilyAccordion({
  mod,
  isExpanded,
  onToggle,
  onSelect,
}: ModFamilyAccordionProps) {
  const tiers = Object.keys(mod.tiers) as Rarity[];

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
          isExpanded ? "bg-gray-750 border-b border-gray-700" : "bg-gray-800 hover:bg-gray-750"
        }`}
      >
        <div className="min-w-0">
          <div className="font-semibold text-white text-sm">{mod.fam}</div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">{mod.desc}</div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-2 space-y-2 bg-gray-850">
          {tiers.map((t) => {
            const tier = mod.tiers[t]!;
            const color = RARITY_COLORS[t];
            return (
              <button
                key={t}
                onClick={() => onSelect(mod.fam, t)}
                className="w-full text-left p-3 rounded-lg hover:brightness-125 transition-all border border-transparent hover:border-gray-500"
                style={{ backgroundColor: color + "18" }}
              >
                <div className="flex items-start gap-3">
                  {tier.img && (
                    <img
                      src={tier.img}
                      alt={`${mod.fam} ${RARITY_LABELS[t]}`}
                      loading="lazy"
                      className="shrink-0 w-12 h-12 rounded object-contain bg-gray-900"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="shrink-0 px-2 py-0.5 rounded text-xs font-bold"
                        style={{ backgroundColor: color, color: "white" }}
                      >
                        {RARITY_LABELS[t]}
                      </span>
                      <span className="text-xs font-medium" style={{ color }}>
                        {t}
                      </span>
                    </div>
                    <ul className="text-sm text-gray-200 space-y-0.5">
                      {tier.e.map((effect, i) => (
                        <li key={i}>{effect}</li>
                      ))}
                    </ul>
                    {tier.cr ? (
                      <div className="text-xs text-orange-400 mt-1">{tier.cr}</div>
                    ) : (
                      <div className="text-xs text-green-500 mt-1">Free</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
