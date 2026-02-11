import type { WeaponClass, AmmoType, Rarity } from "../types";

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
  Light: "#e6da35",
  Medium: "#2439fb",
  Heavy: "#d21818",
  Shotgun: "#e38c8c",
  Special: "#21c204",
};

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: "#6C6B69",
  Uncommon: "#27BC57",
  Rare: "#3b82f6",
  Epic: "#CB3098",
  Legendary: "#FFC301",
};

export const RARITY_ORDER: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
};

export const RARITY_LABELS: Record<Rarity, string> = {
  Common: "I",
  Uncommon: "II",
  Rare: "III",
  Epic: "III",
  Legendary: "★",
};

export const GRADE_COLORS: Record<string, string> = {
  S: "#f59e0b",
  A: "#22c55e",
  B: "#3b82f6",
  C: "#eab308",
  D: "#f97316",
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

