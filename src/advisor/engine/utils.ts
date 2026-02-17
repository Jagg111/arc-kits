// ============================================================================
// FILE: src/advisor/engine/utils.ts
// PURPOSE: Shared small utility helpers used by multiple engine modules.
// ============================================================================

import { ADVISOR_GRADE_TO_SCORE, ADVISOR_RANGE_TARGETS, ADVISOR_TIE_PRECISION } from "../../data/advisor_config";
import type { AdvisorPreferredRange, TierData, Weapon } from "../../types";

export type RangeBand = "close" | "mid" | "long";

// Clamp any number into [min, max].
export function clamp(value: number, min = 0, max = 1): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// Round to a deterministic precision (used for tie bucket IDs).
export function roundTo(value: number, precision = ADVISOR_TIE_PRECISION): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

// Convert grade letters to normalized numeric score.
export function gradeToScore(grade: string): number {
  return ADVISOR_GRADE_TO_SCORE[grade] ?? ADVISOR_GRADE_TO_SCORE.C;
}

// Convert numeric weapon range into a coarse distance band.
export function pickRangeBand(range: number): RangeBand {
  if (range < ADVISOR_RANGE_TARGETS.mid.min) return "close";
  if (range <= ADVISOR_RANGE_TARGETS.mid.max) return "mid";
  return "long";
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

// Simple role diversity signal using range band distance.
export function roleDistance(a: Weapon, b: Weapon): number {
  const bandA = pickRangeBand(a.range);
  const bandB = pickRangeBand(b.range);
  if (bandA === bandB) return 0.15;
  if ((bandA === "close" && bandB === "long") || (bandA === "long" && bandB === "close")) return 1;
  return 0.65;
}
