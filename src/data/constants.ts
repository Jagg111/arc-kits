// ============================================================================
// FILE: data/constants.ts
// PURPOSE: Color palettes, label maps, and ordering tables used across the UI
// USED BY: Most component files for dynamic styling — WeaponCard, Badge, AmmoGroup, etc.
// IMPORTS FROM: types/index.ts (for type aliases)
// ============================================================================

import type { WeaponClass, AmmoType, Rarity } from "../types";

// Expands short weapon class codes (e.g. "AR") to full display names (e.g. "Assault Rifle")
export const CLASS_LABELS: Record<WeaponClass, string> = {
  AR: "Assault Rifle",
  BR: "Battle Rifle",
  SMG: "SMG",
  SG: "Shotgun",
  Pistol: "Pistol",
  HC: "Hand Cannon",
  LMG: "LMG",
  SR: "Sniper Rifle",
  Special: "Special",
};

// Hex colors for each weapon class — used for colored badges and highlights
export const CLASS_COLORS: Record<WeaponClass, string> = {
  AR: "#3b82f6",
  BR: "#f59e0b",
  SMG: "#22c55e",
  SG: "#ef4444",
  Pistol: "#a855f7",
  HC: "#ec4899",
  LMG: "#f97316",
  SR: "#06b6d4",
  Special: "#6b7280",
};

// Hex colors for each ammo type — used in AmmoGroup headings and badges
export const AMMO_COLORS: Record<AmmoType, string> = {
  Light: "#e6da35",
  Medium: "#2439fb",
  Heavy: "#d21818",
  Shotgun: "#e38c8c",
  Special: "#21c204",
};

// Hex colors for rarity tiers — used for mod tier buttons, badges, and equipped mod display
export const RARITY_COLORS: Record<Rarity, string> = {
  Common: "#6C6B69",
  Uncommon: "#27BC57",
  Rare: "#3b82f6",
  Epic: "#CB3098",
  Legendary: "#FFC301",
};

// Numeric ordering for sorting weapons by rarity (lower = more common)
export const RARITY_ORDER: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
};

// Short labels for rarity tiers — shown on tier buttons (I, II, III, ★)
export const RARITY_LABELS: Record<Rarity, string> = {
  Common: "I",
  Uncommon: "II",
  Rare: "III",
  Epic: "III",
  Legendary: "★",
};

// Colors for letter grades (S through F) — used on weapon cards for PVP/ARC ratings
export const GRADE_COLORS: Record<string, string> = {
  S: "#22c55e",
  A: "#4ade80",
  B: "#facc15",
  C: "#fb923c",
  D: "#ef4444",
  F: "#6b7280",
};

// Numeric ordering for sorting weapons by grade (lower = better grade)
export const GRADE_ORDER: Record<string, number> = {
  S: 1, A: 2, B: 3, C: 4, D: 5, F: 6,
};

// Display order for ammo type groups on the weapon picker screen
export const AMMO_TYPES: AmmoType[] = [
  "Light",
  "Medium",
  "Heavy",
  "Shotgun",
  "Special",
];


