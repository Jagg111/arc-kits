import type { WeaponClass, AmmoType, Rarity, TierKey } from "../types";

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

export const AMMO_COLORS: Record<AmmoType, string> = {
  Light: "#a3e635",
  Medium: "#fbbf24",
  Heavy: "#f87171",
  Shotgun: "#fb923c",
  Special: "#818cf8",
};

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: "#9ca3af",
  Uncommon: "#22c55e",
  Rare: "#3b82f6",
  Epic: "#a855f7",
  Legendary: "#f59e0b",
};

export const RARITY_ORDER: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
};

export const TIER_LABELS: Record<string, string> = {
  "1": "T1",
  "2": "T2",
  "3": "T3",
  "3+": "T3+",
};

export const TIER_COLORS: Record<string, string> = {
  "1": "#22c55e",
  "2": "#3b82f6",
  "3": "#a855f7",
  "3+": "#f59e0b",
};

export const GRADE_COLORS: Record<string, string> = {
  S: "#f59e0b",
  A: "#22c55e",
  B: "#3b82f6",
  C: "#a855f7",
  D: "#9ca3af",
  F: "#ef4444",
};

export const AMMO_TYPES: AmmoType[] = [
  "Light",
  "Medium",
  "Heavy",
  "Shotgun",
  "Special",
];

export const BASE_MAG_SIZES: Record<string, number> = {
  kettle: 20,
  rattler: 12,
  arpeggio: 24,
  tempest: 24,
  bettina: 20,
  ferro: 1,
  renegade: 8,
  aphelion: 10,
  stitcher: 30,
  bobcat: 20,
  iltoro: 3,
  vulcano: 4,
  hairpin: 10,
  burletta: 10,
  venator: 12,
  anvil: 1,
  torrente: 60,
  osprey: 8,
  jupiter: 5,
  hullcracker: 1,
  equalizer: 80,
};

export function tierKey(t: TierKey): string {
  return String(t);
}
