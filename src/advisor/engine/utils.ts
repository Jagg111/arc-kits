// ============================================================================
// FILE: src/advisor/engine/utils.ts
// PURPOSE: Shared small utility helpers used by multiple engine modules.
// ============================================================================

import { ADVISOR_GRADE_TO_SCORE, ADVISOR_RANGE_TARGETS } from "../../data/advisor_config";
import type { AdvisorPreferredRange, RangeBucket, TierData } from "../../types";

// Clamp any number into [min, max].
export function clamp(value: number, min = 0, max = 1): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// Round to a deterministic precision.
export function roundTo(value: number, precision = 4): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

// Convert grade letters to normalized numeric score.
export function gradeToScore(grade: string): number {
  return ADVISOR_GRADE_TO_SCORE[grade] ?? ADVISOR_GRADE_TO_SCORE.C;
}

// Returns the minimum distance between two sets of range bands.
// 0 = shared band, 1 = adjacent (close↔mid or mid↔long), 2 = opposite extremes (close↔long).
const BAND_ORDER: Record<RangeBucket, number> = { close: 0, mid: 1, long: 2 };

export function bandDistance(a: RangeBucket[], b: RangeBucket[]): number {
  let min = Infinity;
  for (const x of a) {
    for (const y of b) {
      const d = Math.abs(BAND_ORDER[x] - BAND_ORDER[y]);
      if (d < min) min = d;
    }
  }
  return min === Infinity ? 0 : min;
}

// Soft range fit around preferred min/max boundaries.
export function rangeFitFromNumeric(range: number, preferred: AdvisorPreferredRange): number {
  if (preferred === "any") return 0.75;
  const target = ADVISOR_RANGE_TARGETS[preferred];
  if (range >= target.min && range <= target.max) return 1;

  if (range < target.min) {
    const deltaLow = target.min - range;
    return clamp(1 - deltaLow / 40);
  }

  const deltaHigh = range - target.max;
  return clamp(1 - deltaHigh / 40);
}

// Fire-mode classifiers used by scoring logic.
export function isBurstFireMode(fireMode: string): boolean {
  return /semi|bolt|lever|break|burst|single/i.test(fireMode);
}

export function isSustainedFireMode(fireMode: string): boolean {
  return /full-auto/i.test(fireMode);
}

// Parse crafting materials from a tier cost string.
export function parseCostMaterials(tierData: TierData | undefined): string[] {
  if (!tierData?.cr) return [];
  const mats: string[] = [];
  for (const token of tierData.cr.split(",")) {
    const match = token.trim().match(/^(\d+)x\s+(.+)$/);
    if (match) mats.push(match[2]);
  }
  return mats;
}

// Dedupe helper.
export function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

// Stable composite ID for ordered weapon pairs.
export function pairKey(primaryWeaponId: string, secondaryWeaponId: string): string {
  return `${primaryWeaponId}__${secondaryWeaponId}`;
}

