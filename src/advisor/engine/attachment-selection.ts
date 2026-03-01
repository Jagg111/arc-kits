// ============================================================================
// FILE: advisor/engine/attachment-selection.ts
// PURPOSE: Selects the best attachment guide build for a weapon in Advisor.
//
// Selection rules (Step 11):
// 1) Ignore builds marked advisorEligible: false.
// 2) Keep only builds craftable with current material toggles.
// 3) From those, keep builds matching preferred range ("any" matches all).
// 4) Pick the first remaining build (lowest index = best investment).
// 5) Fallback: if none remain after filters, return the cheapest build
//    (last advisor-eligible build).
// ============================================================================

import type {
  AdvisorCraftingFilters,
  AdvisorPreferredRange,
  EquippedMod,
  GuideBuild,
} from "../../types";
import { WEAPON_GUIDES } from "../../data/guides";

/** V1 Advisor only allows explicit legendary toggles for these two mods. */
const LEGENDARY_FAMILY_TOGGLES: Record<string, keyof AdvisorCraftingFilters> = {
  "Kinetic Converter": "kineticConverter",
  "Horizontal Grip": "horizontalGrip",
};

/**
 * Checks if one equipped mod is craft-eligible under the current material toggles.
 * This enforces the "weakest-link" model by letting build-level checks require
 * every slot to pass.
 */
function isModCraftEligible(
  mod: EquippedMod,
  craftingFilters: AdvisorCraftingFilters,
): boolean {
  switch (mod.tier) {
    case "Common":
      return true;
    case "Uncommon":
      return craftingFilters.mechanicalComponents;
    case "Rare":
    case "Epic":
      return craftingFilters.modComponents;
    case "Legendary": {
      const toggle = LEGENDARY_FAMILY_TOGGLES[mod.fam];
      return toggle ? craftingFilters[toggle] : false;
    }
    default:
      return false;
  }
}

/** True only when every equipped slot in the build passes crafting eligibility. */
function isBuildCraftEligible(
  build: GuideBuild,
  craftingFilters: AdvisorCraftingFilters,
): boolean {
  return Object.values(build.slots).every((mod) =>
    isModCraftEligible(mod, craftingFilters),
  );
}

/** Preferred range "any" means no range filtering. */
function doesBuildMatchRange(
  build: GuideBuild,
  preferredRange: AdvisorPreferredRange,
): boolean {
  return preferredRange === "any" || build.range.includes(preferredRange);
}

/**
 * Returns the selected guide build for Advisor cards.
 * Returns null when the weapon has no guide data or no advisor-eligible builds.
 */
export function selectBuildForAdvisor(
  weaponId: string,
  preferredRange: AdvisorPreferredRange,
  craftingFilters: AdvisorCraftingFilters,
): GuideBuild | null {
  const guide = WEAPON_GUIDES[weaponId];
  if (!guide || guide.builds.length === 0) {
    return null;
  }

  // Step 11 rule: remove advisor-ineligible builds (e.g. Anvil Splitter variant).
  const advisorEligibleBuilds = guide.builds.filter(
    (build) => build.advisorEligible !== false,
  );

  if (advisorEligibleBuilds.length === 0) {
    return null;
  }

  // Apply crafting first, then range; pick earliest remaining build.
  const rangedCandidate = advisorEligibleBuilds
    .filter((build) => isBuildCraftEligible(build, craftingFilters))
    .find((build) => doesBuildMatchRange(build, preferredRange));

  if (rangedCandidate) {
    return rangedCandidate;
  }

  // Fallback: guaranteed non-empty display by using cheapest advisor-eligible build.
  return advisorEligibleBuilds[advisorEligibleBuilds.length - 1];
}

