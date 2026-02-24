// ============================================================================
// FILE: components/advisor/AdvisorFilterBar.tsx
// PURPOSE: Sticky filter bar with pill toggles for advisor preferences
// USED BY: AdvisorPage.tsx
// ============================================================================

import type {
  AdvisorLocationId,
  AdvisorSquadMode,
  AdvisorFocus,
  AdvisorPreferredRange,
  Rarity,
} from "../../types";
import type { AdvisorFilterState } from "../../hooks/useAdvisorFilters";
import {
  ADVISOR_INPUT_ENUMS,
  ADVISOR_LOCATION_LABELS,
  ADVISOR_SQUAD_LABELS,
  ADVISOR_FOCUS_LABELS,
  ADVISOR_RANGE_LABELS,
  ADVISOR_ALL_RARITIES,
} from "../../data/advisor_config";
import { RARITY_COLORS } from "../../data/constants";

interface AdvisorFilterBarProps {
  filters: AdvisorFilterState;
  onSetLocation: (loc: AdvisorLocationId) => void;
  onSetSquad: (sq: AdvisorSquadMode) => void;
  onSetFocus: (fc: AdvisorFocus) => void;
  onSetRange: (rg: AdvisorPreferredRange) => void;
  onToggleRarity: (rarity: Rarity) => void;
}

// Shared pill styling
const basePill =
  "px-2.5 py-1 rounded text-[0.72rem] font-medium border cursor-pointer transition-all whitespace-nowrap";
const unselectedPill = `${basePill} border-border bg-surface-alt text-text-secondary hover:border-border hover:text-text-primary`;

function selectedPillStyle() {
  return {
    backgroundColor: "color-mix(in srgb, var(--color-accent) 15%, transparent)",
    borderColor: "var(--color-accent)",
    color: "var(--color-accent-text)",
  };
}

function Separator() {
  return <div className="w-px h-5 bg-border shrink-0 hidden sm:block" />;
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-text-muted mr-0.5 whitespace-nowrap">
      {children}
    </span>
  );
}

export default function AdvisorFilterBar({
  filters,
  onSetLocation,
  onSetSquad,
  onSetFocus,
  onSetRange,
  onToggleRarity,
}: AdvisorFilterBarProps) {
  return (
    <div className="bg-filter-bar-bg border-b border-border-subtle py-2.5 px-5 sticky top-[52px] z-10">
      <div className="max-w-[80rem] mx-auto flex items-center gap-3 sm:gap-5 flex-wrap">
        {/* Location */}
        <div className="flex items-center gap-1.5">
          <FilterLabel>Where</FilterLabel>
          {ADVISOR_INPUT_ENUMS.locations.map((loc) => (
            <button
              key={loc}
              className={basePill + (filters.location !== loc ? ` border-border bg-surface-alt text-text-secondary hover:border-border hover:text-text-primary` : "")}
              style={filters.location === loc ? selectedPillStyle() : undefined}
              onClick={() => onSetLocation(loc)}
            >
              {ADVISOR_LOCATION_LABELS[loc]}
            </button>
          ))}
        </div>

        <Separator />

        {/* Squad */}
        <div className="flex items-center gap-1.5">
          <FilterLabel>Squad</FilterLabel>
          {ADVISOR_INPUT_ENUMS.squadModes.map((sq) => (
            <button
              key={sq}
              className={filters.squad !== sq ? unselectedPill : basePill}
              style={filters.squad === sq ? selectedPillStyle() : undefined}
              onClick={() => onSetSquad(sq)}
            >
              {ADVISOR_SQUAD_LABELS[sq]}
            </button>
          ))}
        </div>

        <Separator />

        {/* Focus */}
        <div className="flex items-center gap-1.5">
          <FilterLabel>Focus</FilterLabel>
          {ADVISOR_INPUT_ENUMS.focuses.map((fc) => (
            <button
              key={fc}
              className={filters.focus !== fc ? unselectedPill : basePill}
              style={filters.focus === fc ? selectedPillStyle() : undefined}
              onClick={() => onSetFocus(fc)}
            >
              {ADVISOR_FOCUS_LABELS[fc]}
            </button>
          ))}
        </div>

        <Separator />

        {/* Range */}
        <div className="flex items-center gap-1.5">
          <FilterLabel>Range</FilterLabel>
          {ADVISOR_INPUT_ENUMS.ranges.map((rg) => (
            <button
              key={rg}
              className={filters.preferredRange !== rg ? unselectedPill : basePill}
              style={filters.preferredRange === rg ? selectedPillStyle() : undefined}
              onClick={() => onSetRange(rg)}
            >
              {ADVISOR_RANGE_LABELS[rg]}
            </button>
          ))}
        </div>

        <Separator />

        {/* Rarity checkboxes */}
        <div className="flex items-center gap-1.5">
          <FilterLabel>Rarity</FilterLabel>
          {ADVISOR_ALL_RARITIES.map((rarity) => {
            const checked = filters.allowedWeaponRarities.includes(rarity);
            const rarityColor = RARITY_COLORS[rarity];
            return (
              <button
                key={rarity}
                className={`${basePill} inline-flex items-center gap-1`}
                style={
                  checked
                    ? {
                        backgroundColor: `color-mix(in srgb, ${rarityColor} 15%, transparent)`,
                        borderColor: rarityColor,
                        color: rarityColor,
                      }
                    : {
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-surface-alt)",
                        color: "var(--color-text-muted)",
                      }
                }
                onClick={() => onToggleRarity(rarity)}
              >
                {checked ? (
                  <span className="font-bold text-[0.7rem]">&#10003;</span>
                ) : (
                  <span className="text-[0.65rem]">&#10007;</span>
                )}
                {rarity}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
