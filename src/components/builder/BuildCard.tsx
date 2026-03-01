// ============================================================================
// FILE: components/builder/BuildCard.tsx
// PURPOSE: Single build card in the build list screen (replaces GoalCard.tsx)
// USED BY: WeaponBuilder.tsx
//
// ANATOMY:
//   [Numbered circle] [Range label · Crafting requirement tag] [Chevron >]
//   [ModGallery row]
//
// VISUAL HIERARCHY:
//   Left border, circle, and crafting label are all colored by the
//   highest-rarity mod in the build. This graduated system visually
//   communicates investment level at a glance.
//
// RARITY TIER MAPPING:
//   Legendary → gold   | "Requires Legendaries"
//   Epic      → pink   | "Requires Mod Components"
//   Rare      → blue   | "Requires Mod Components"
//   Uncommon  → green  | "Requires Mech Components"
//   Common    → gray   | "Base Materials"
// ============================================================================

import type { GuideBuild, Rarity } from "../../types";
import { RARITY_ORDER } from "../../data/constants";
import ModGallery from "../shared/ModGallery";

interface BuildCardProps {
  /** Sequential build number (1-based) */
  index: number;
  build: GuideBuild;
  /** Full list of the weapon's slots (for ModGallery empty-slot rendering) */
  allSlots: string[];
  onSelect: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** CSS variable name for a rarity color (without the `var()` wrapper). */
const RARITY_VAR: Record<Rarity, string> = {
  Common: "--color-rarity-common",
  Uncommon: "--color-rarity-uncommon",
  Rare: "--color-rarity-rare",
  Epic: "--color-rarity-epic",
  Legendary: "--color-rarity-legendary",
};

/** Opacity percentages for the left border color-mix per rarity tier. */
const BORDER_OPACITY: Record<Rarity, number> = {
  Common: 0,       // uses --color-border-subtle instead
  Uncommon: 35,
  Rare: 40,
  Epic: 45,
  Legendary: 50,
};

/** Circle background opacity for color-mix. */
const CIRCLE_OPACITY: Record<Rarity, number> = {
  Common: 15,
  Uncommon: 20,
  Rare: 20,
  Epic: 20,
  Legendary: 25,
};

/** Human-readable crafting requirement label per max rarity. */
const CRAFTING_LABEL: Record<Rarity, string> = {
  Common: "Base Materials",
  Uncommon: "Requires Mech Components",
  Rare: "Requires Mod Components",
  Epic: "Requires Mod Components",
  Legendary: "Requires Legendaries",
};

/**
 * Determine the highest rarity among all mods in a build.
 * Uses RARITY_ORDER (Common=1 … Legendary=5) to compare.
 */
function getMaxRarity(build: GuideBuild): Rarity {
  let max: Rarity = "Common";
  for (const mod of Object.values(build.slots)) {
    if (RARITY_ORDER[mod.tier] > RARITY_ORDER[max]) {
      max = mod.tier;
    }
  }
  return max;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BuildCard({ index, build, allSlots, onSelect }: BuildCardProps) {
  const maxRarity = getMaxRarity(build);
  const colorVar = `var(${RARITY_VAR[maxRarity]})`;

  // Left border: rarity color at graduated opacity, or subtle border for Common
  const borderColor =
    maxRarity === "Common"
      ? "var(--color-border-subtle)"
      : `color-mix(in srgb, ${colorVar} ${BORDER_OPACITY[maxRarity]}%, transparent)`;

  // Circle: tinted background + full rarity color text
  const circleBg = `color-mix(in srgb, ${colorVar} ${CIRCLE_OPACITY[maxRarity]}%, transparent)`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex items-start gap-3 w-full text-left rounded-xl border border-border bg-surface-alt/50 p-3.5 lg:p-[14px] transition-all hover:bg-surface-alt"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      {/* Numbered circle */}
      <span
        className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5"
        style={{ backgroundColor: circleBg, color: colorVar }}
      >
        {index}
      </span>

      {/* Card body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Top row: range label · crafting requirement */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-text-primary">
            {build.name}
          </span>
          <span className="text-text-faint text-xs">·</span>
          <span className="text-xs font-medium text-text-secondary">
            {CRAFTING_LABEL[maxRarity]}
          </span>
        </div>

        {/* Mod gallery row */}
        <ModGallery mods={build.slots} allSlots={allSlots} />
      </div>

      {/* Chevron — animates right on hover */}
      <svg
        className="w-4 h-4 text-text-faint shrink-0 mt-1 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent-text"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
