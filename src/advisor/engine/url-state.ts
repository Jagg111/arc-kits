// ============================================================================
// FILE: src/advisor/engine/url-state.ts
// PURPOSE: Parse and serialize shareable advisor query params.
// V1: de-scoped from runtime but preserved for V2 URL sharing.
// ============================================================================

import {
  ADVISOR_ALL_RARITIES,
  ADVISOR_DEFAULT_INPUTS,
  ADVISOR_INPUT_ENUMS,
} from "../../data/advisor_config";
import type {
  AdvisorInputs,
  AdvisorLocationId,
  AdvisorQueryState,
  AdvisorFocus,
  AdvisorPreferredRange,
  AdvisorSquadMode,
  Rarity,
} from "../../types";

// Compact URL codes keep query strings short and share-friendly.
const RARITY_CODES: Record<Rarity, string> = {
  Common: "c",
  Uncommon: "u",
  Rare: "r",
  Epic: "e",
  Legendary: "l",
};

// Reverse maps are used while parsing URLs.
const CODE_TO_RARITY = Object.fromEntries(
  Object.entries(RARITY_CODES).map(([rarity, code]) => [code, rarity as Rarity]),
) as Record<string, Rarity>;

// Safe enum parser with fallback to defaults.
function parseEnum<T extends string>(value: string | null, valid: T[], fallback: T): T {
  return value && valid.includes(value as T) ? (value as T) : fallback;
}

// Parse compact rarity token list (example: "c,u,r").
function parseRarityCodes(encoded: string | null): Rarity[] {
  if (!encoded) return [...ADVISOR_ALL_RARITIES];
  const values = encoded
    .split(",")
    .map((part) => CODE_TO_RARITY[part.trim()])
    .filter((value): value is Rarity => Boolean(value));
  return values.length > 0 ? values : [...ADVISOR_ALL_RARITIES];
}

// Compress arrays back into short token lists for URL writing.
function compactRarityCodes(rarities: Rarity[]): string {
  return rarities.map((rarity) => RARITY_CODES[rarity]).join(",");
}

// Read advisor state from a URL query string.
export function parseAdvisorQuery(search: string): AdvisorQueryState {
  const normalized = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(normalized);
  const loc = parseEnum<AdvisorLocationId>(params.get("loc"), ADVISOR_INPUT_ENUMS.locations, ADVISOR_DEFAULT_INPUTS.location);
  const sq = parseEnum<AdvisorSquadMode>(params.get("sq"), ADVISOR_INPUT_ENUMS.squadModes, ADVISOR_DEFAULT_INPUTS.squad);
  const fc = parseEnum<AdvisorFocus>(params.get("fc"), ADVISOR_INPUT_ENUMS.focuses, ADVISOR_DEFAULT_INPUTS.focus);
  const rg = parseEnum<AdvisorPreferredRange>(params.get("rg"), ADVISOR_INPUT_ENUMS.ranges, ADVISOR_DEFAULT_INPUTS.preferredRange);
  const wr = parseRarityCodes(params.get("wr"));

  return {
    tab: "advisor",
    location: loc,
    squad: sq,
    focus: fc,
    preferredRange: rg,
    allowedWeaponRarities: wr,
  };
}

// Write advisor state into a URL query string.
export function serializeAdvisorQuery(state: AdvisorInputs): string {
  const params = new URLSearchParams();
  params.set("tab", "advisor");
  params.set("loc", state.location);
  params.set("sq", state.squad);
  params.set("fc", state.focus);
  params.set("rg", state.preferredRange);
  params.set("wr", compactRarityCodes(state.allowedWeaponRarities));
  return `?${params.toString()}`;
}
