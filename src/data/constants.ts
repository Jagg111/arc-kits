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

// Colors for each weapon class — CSS custom properties that adapt per theme
export const CLASS_COLORS: Record<WeaponClass, string> = {
  AR: "var(--color-class-ar)",
  BR: "var(--color-class-br)",
  SMG: "var(--color-class-smg)",
  SG: "var(--color-class-sg)",
  Pistol: "var(--color-class-pistol)",
  HC: "var(--color-class-hc)",
  LMG: "var(--color-class-lmg)",
  SR: "var(--color-class-sr)",
  Special: "var(--color-class-special)",
};

// Colors for each ammo type — CSS custom properties that adapt per theme
export const AMMO_COLORS: Record<AmmoType, string> = {
  Light: "var(--color-ammo-light)",
  Medium: "var(--color-ammo-medium)",
  Heavy: "var(--color-ammo-heavy)",
  Shotgun: "var(--color-ammo-shotgun)",
  Special: "var(--color-ammo-special)",
};

// Colors for rarity tiers — CSS custom properties that adapt per theme
export const RARITY_COLORS: Record<Rarity, string> = {
  Common: "var(--color-rarity-common)",
  Uncommon: "var(--color-rarity-uncommon)",
  Rare: "var(--color-rarity-rare)",
  Epic: "var(--color-rarity-epic)",
  Legendary: "var(--color-rarity-legendary)",
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

// Colors for letter grades (S through F) — CSS custom properties that adapt per theme
export const GRADE_COLORS: Record<string, string> = {
  S: "var(--color-grade-s)",
  A: "var(--color-grade-a)",
  B: "var(--color-grade-b)",
  C: "var(--color-grade-c)",
  D: "var(--color-grade-d)",
  F: "var(--color-grade-f)",
};

// Crafting material metadata — maps material names to their rarity tier and wiki thumbnail icon.
// Used by cost display components to color-code materials and show icons.
// Image URLs follow the same wiki thumbnail pattern as mod icons in mods.ts.
export const MATERIAL_INFO: Record<string, { rarity: Rarity; img: string }> = {
  "Metal Parts":           { rarity: "Common",   img: "https://arcraiders.wiki/w/images/thumb/8/89/Metal_Parts.png/96px-Metal_Parts.png.webp" },
  "Plastic Parts":         { rarity: "Common",   img: "https://arcraiders.wiki/w/images/thumb/c/c9/Plastic_Parts.png/96px-Plastic_Parts.png.webp" },
  "Rubber Parts":          { rarity: "Common",   img: "https://arcraiders.wiki/w/images/thumb/9/93/Rubber_Parts.png/96px-Rubber_Parts.png.webp" },
  "Wires":                 { rarity: "Common",   img: "https://arcraiders.wiki/w/images/thumb/3/39/Wires.png/96px-Wires.png.webp" },
  "Duct Tape":             { rarity: "Uncommon", img: "https://arcraiders.wiki/w/images/thumb/4/4e/Duct_Tape.png/96px-Duct_Tape.png.webp" },
  "Steel Spring":          { rarity: "Uncommon", img: "https://arcraiders.wiki/w/images/thumb/d/db/Steel_Spring.png/96px-Steel_Spring.png.webp" },
  "Mechanical Components": { rarity: "Uncommon", img: "https://arcraiders.wiki/w/images/thumb/9/94/Mechanical_Components.png/96px-Mechanical_Components.png.webp" },
  "Mod Components":        { rarity: "Rare",     img: "https://arcraiders.wiki/w/images/thumb/0/0f/Mod_Components.png/96px-Mod_Components.png.webp" },
};

// Weapon images — wiki thumbnail URLs keyed by weapon id.
// Same pattern as MATERIAL_INFO and mod icons in mods.ts.
const WI = (hash: string, file: string) =>
  `https://arcraiders.wiki/w/images/thumb/${hash}/${file}/160px-${file}.webp`;

export const WEAPON_IMAGES: Record<string, string> = {
  hairpin:      WI("6/65", "Hairpin-Level1.png"),
  burletta:     WI("d/d4", "Burletta-Level1.png"),
  kettle:       WI("c/c1", "Kettle-Level1.png"),
  stitcher:     WI("3/3a", "Stitcher-Level1.png"),
  bobcat:       WI("3/36", "Bobcat-Level1.png"),
  rattler:      WI("b/be", "Rattler-Level1.png"),
  arpeggio:     WI("6/6c", "Arpeggio-Level1.png"),
  renegade:     WI("b/b5", "Renegade-Level1.png"),
  venator:      WI("b/b4", "Venator-Level1.png"),
  torrente:     WI("1/1e", "Torrente-Level1.png"),
  osprey:       WI("a/ae", "Osprey-Level1.png"),
  tempest:      WI("c/c9", "Tempest-Level1.png"),
  ferro:        WI("b/b0", "Ferro-Level1.png"),
  anvil:        WI("0/00", "Anvil-Level1.png"),
  bettina:      WI("a/ac", "Bettina.png"),
  iltoro:       WI("5/50", "Il_Toro-Level1.png"),
  vulcano:      WI("d/da", "Vulcano-Level1.png"),
  hullcracker:  WI("b/ba", "Hullcracker-Level1.png"),
  aphelion:     WI("8/88", "Aphelion.png"),
  jupiter:      WI("6/68", "Jupiter.png"),
  equalizer:    WI("9/96", "Equalizer.png"),
};

// Display order for ammo type groups on the weapon picker screen
export const AMMO_TYPES: AmmoType[] = [
  "Light",
  "Medium",
  "Heavy",
  "Shotgun",
  "Special",
];


