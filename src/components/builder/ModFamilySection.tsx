// ============================================================================
// FILE: components/builder/ModFamilySection.tsx
// PURPOSE: Displays a single mod family in the ModDrawer with tier selection buttons
// USED BY: ModDrawer.tsx (one per compatible mod family for the slot)
//
// When the weapon guide lists this mod in its avoid list, we show a warning
// indicator and the reason (hover via title; reason text visible for tap/read).
// V1: visual cues only — no blocking or conditionals logic.
//
// Each tier button shows the tier image, rarity badge, effects list, and cost.
// ============================================================================

import type { ModFamily, Rarity } from "../../types";
import { RARITY_LABELS, RARITY_COLORS } from "../../data/constants";
import CostPill from "../shared/CostPill";

interface ModFamilySectionProps {
  mod: ModFamily;
  equippedTier?: Rarity;
  /** When set, this mod is on the weapon's avoid list; show warning + reason. */
  avoidReason?: string;
  onSelect: (fam: string, tier: Rarity) => void;
}

export default function ModFamilySection({
  mod,
  equippedTier,
  avoidReason,
  onSelect,
}: ModFamilySectionProps) {
  const tiers = Object.keys(mod.tiers) as Rarity[];
  const isSingleTier = tiers.length === 1;

  return (
    <div data-mod-family={mod.fam} className="border border-border rounded-lg overflow-hidden">
      <div className="p-3 bg-surface-alt">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary text-sm">{mod.fam}</span>
              {avoidReason !== undefined && (
                <span
                  className="shrink-0 text-danger-text"
                  title={avoidReason}
                  aria-label={`Avoid: ${avoidReason}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <div className="text-xs text-text-muted mt-0.5 truncate">{mod.desc}</div>
            {avoidReason !== undefined && (
              <p className="text-xs mt-1.5 text-danger-text" title={avoidReason}>
                Avoid: {avoidReason}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-2 space-y-2 bg-surface">
        {tiers.map((t) => {
          const tier = mod.tiers[t]!;
          const color = RARITY_COLORS[t];
          const isEquipped = t === equippedTier;
          return (
            <button
              key={t}
              onClick={() => onSelect(mod.fam, t)}
              className={`w-full text-left p-3 rounded-lg hover:brightness-125 transition-all border ${
                isEquipped ? "border-current ring-1 ring-current" : "border-transparent hover:border-text-muted"
              }`}
              style={{ backgroundColor: `color-mix(in srgb, ${color} ${isEquipped ? "19" : "9"}%, transparent)`, color: isEquipped ? color : undefined }}
            >
              <div className="flex items-start gap-3">
                {tier.img && (
                  <img
                    src={tier.img}
                    alt={`${mod.fam} ${RARITY_LABELS[t]}`}
                    loading="lazy"
                    className="shrink-0 w-12 h-12 rounded object-contain bg-surface"
                  />
                )}
                <div className="min-w-0 flex-1">
                  {!isSingleTier && (
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
                  )}
                  <ul className="text-sm text-text-secondary space-y-0.5">
                    {tier.e.map((effect, i) => (
                      <li key={i}>{effect}</li>
                    ))}
                  </ul>
                  {tier.cr ? (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tier.cr.split(", ").map((mat) => (
                        <CostPill key={mat} cost={mat} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-success mt-1">Free</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
