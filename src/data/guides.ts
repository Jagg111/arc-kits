// ============================================================================
// FILE: data/guides.ts
// PURPOSE: Hand-crafted per-weapon attachment guides
// USED BY: Builder (build list screen), Advisor (auto-pick best build),
//          ModDrawer (avoid warnings), WeaponIntel sidebar/accordion
//
// DATA SOURCE: Transcribed from guide images in /attachment-images/ (18 weapons).
// Excluded weapons (no guide): Jupiter, Equalizer, Hairpin.
//
// CONVENTIONS:
//   - Builds are ordered by investment level: index 0 = best (most expensive),
//     last index = cheapest. The Advisor prefers the lowest eligible index.
//   - Build `name` is always the range label (e.g. "Short - Medium"), never
//     prefixed with the weapon name.
//   - Range buckets use "close" / "mid" / "long" vocabulary. Image label
//     mapping: "Short" → close, "Medium" → mid, "Long" → long.
//   - Tier number → rarity: 1 = Common, 2 = Uncommon, 3 = Rare.
//     Single-tier mods have a fixed rarity (see mods.ts).
//   - `advisorEligible: false` excludes a build from Advisor auto-selection.
//   - Omitted slots in a build's `slots` record mean "Not Needed" (intentionally
//     empty). The UI renders these as blank placeholders.
// ============================================================================

import type { WeaponGuides } from "../types";

export const WEAPON_GUIDES: WeaponGuides = {
  // ===========================================================================
  // LIGHT AMMO
  // ===========================================================================

  burletta: {
    builds: [
      {
        // (1) Burletta — 40m range
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Rare" },
        },
      },
      {
        // (2) Burletta — 40m range
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Light Magazine": { fam: "Light Magazine", tier: "Uncommon" },
        },
      },
      {
        // (3) Burletta — 35m range
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Uncommon" },
        },
      },
      {
        // (4) Burletta — 35m range
        name: "Short",
        range: ["close"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Common" },
        },
      },
      {
        // (5) Burletta — 30m range
        name: "Short",
        range: ["close"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          "Light Magazine": { fam: "Light Magazine", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Muzzle Brake", reason: "You want as much dispersion reduction as possible; use Compensators" },
      { mod: "Extended Barrel", reason: "Not useful on a pistol with this range profile" },
    ],
    conditionals: [],
    tips: [
      "Silencers will help reduce noise for stealth, less ARC aggro, and confusing raiders",
      "Do NOT use Muzzle Brakes on Burletta — you want dispersion reduction, use Compensators",
    ],
  },

  kettle: {
    builds: [
      {
        // (1) Kettle — Short - Medium - Long
        name: "Short - Medium - Long",
        range: ["close", "mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (2) Kettle — Short - Medium - Long
        name: "Short - Medium - Long",
        range: ["close", "mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          "Light Magazine": { fam: "Light Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (3) Kettle — Short - Medium - Long
        name: "Short - Medium - Long",
        range: ["close", "mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Kinetic Converter", reason: "Doesn't work on Kettle — it's pull-capped so fire rate has no effect, and the recoil penalty hurts" },
      { mod: "Muzzle Brake", reason: "Kettle's issue is bloom, not recoil; Compensators are the only option" },
      { mod: "Vertical Grip", reason: "Angled Grips handle the horizontal spread better on this weapon" },
    ],
    conditionals: [],
    tips: [
      "Kinetic Converters don't work on Kettle because it's pull-capped — they feed the RPM to 600 but it has no effect on a semi-auto gun",
    ],
  },

  stitcher: {
    builds: [
      {
        // (1) Stitcher — Short - Medium, 30m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Horizontal Grip", tier: "Legendary" },
          "Light Magazine": { fam: "Light Magazine", tier: "Rare" },
          Stock: { fam: "Kinetic Converter", tier: "Legendary" },
        },
      },
      {
        // (2) Stitcher — Medium - Long, 40m
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Rare" },
          Stock: { fam: "Padded Stock", tier: "Epic" },
        },
      },
      {
        // (3) Stitcher — Medium - Long, 35m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (4) Stitcher — Short - Medium, 25m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (5) Stitcher — Short, 20m
        name: "Short",
        range: ["close"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          "Light Magazine": { fam: "Light Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Muzzle Brake", reason: "Stitcher has bloom, not recoil, as its main issue; Compensators are the only option" },
      { mod: "Extended Barrel", reason: "Not worth the slot on an SMG with this range" },
      { mod: "Vertical Grip", reason: "Horizontal recoil is more problematic; use Angled Grip or Horizontal Grip" },
    ],
    conditionals: [],
    tips: [
      "Muzzle Brakes can be used as well for no-recoil (for Stitcher 1-2 only)",
      "However long/mid range shots will be way less effective due to the bullets going everywhere",
      "Learn and adapt on how to shoot with compensators and avoid muzzle brakes",
    ],
  },

  bobcat: {
    builds: [
      {
        // (1) Bobcat — Short - Medium, 30m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Horizontal Grip", tier: "Legendary" },
          "Light Magazine": { fam: "Light Magazine", tier: "Rare" },
          Stock: { fam: "Kinetic Converter", tier: "Legendary" },
        },
      },
      {
        // (2) Bobcat — Medium - Long, 40m/50m
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Horizontal Grip", tier: "Legendary" },
          "Light Magazine": { fam: "Light Magazine", tier: "Rare" },
          Stock: { fam: "Padded Stock", tier: "Epic" },
        },
      },
      {
        // (3) Bobcat — Medium - Long, 35m/45m
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Rare" },
          Stock: { fam: "Padded Stock", tier: "Epic" },
        },
      },
      {
        // (4) Bobcat — Short - Medium, 25m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Light Magazine": { fam: "Light Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (5) Bobcat — Short - Medium, 25m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          "Light Magazine": { fam: "Light Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (6) Bobcat — Short - Medium, 20m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          "Light Magazine": { fam: "Light Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Extended Barrel", reason: "Not worth the slot on an SMG" },
      { mod: "Vertical Grip", reason: "Horizontal recoil is the bigger problem; use Angled or Horizontal Grip" },
    ],
    conditionals: [],
    tips: [
      "Muzzle Brakes can be used as well for no-recoil (for Bobcat 1-2 only)",
      "However long/mid range shots will be way less effective due to the bullets going everywhere",
      "Learn and adapt on how to shoot with compensators and avoid muzzle brakes",
    ],
  },

  // ===========================================================================
  // MEDIUM AMMO
  // ===========================================================================

  rattler: {
    builds: [
      {
        // (1) Rattler — Medium Range, 30m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          Stock: { fam: "Padded Stock", tier: "Epic" },
        },
      },
      {
        // (2) Rattler — Short Range, 30m
        name: "Short",
        range: ["close"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          Stock: { fam: "Kinetic Converter", tier: "Legendary" },
        },
      },
      {
        // (3) Rattler — Medium Range, 30m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Rare" },
          Stock: { fam: "Stable Stock", tier: "Uncommon" },
        },
      },
      {
        // (4) Rattler — Medium Range, 25m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Vertical Grip", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (5) Rattler — Medium Range, 25m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Muzzle Brake", reason: "Rattler has so much bloom — Compensators are the only option" },
      { mod: "Extended Barrel", reason: "Not effective on this weapon" },
      { mod: "Vertical Grip", reason: "Angled Grips are preferred for Rattler's horizontal spread" },
    ],
    conditionals: [],
    tips: [
      "Muzzle Brakes are pointless on Rattler — the gun has so much bloom",
      "Compensators are the only option",
    ],
  },

  arpeggio: {
    builds: [
      {
        // (1) Arpeggio — Long Range, 75m
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Rare" },
          Stock: { fam: "Padded Stock", tier: "Epic" },
        },
      },
      {
        // (2) Arpeggio — Medium, 65m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Vertical Grip", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Rare" },
          Stock: { fam: "Stable Stock", tier: "Rare" },
        },
      },
      {
        // (3) Arpeggio — Medium, 65m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Uncommon" },
        },
      },
      {
        // (4) Arpeggio — Short - Medium, 55m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Vertical Grip", tier: "Common" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (5) Arpeggio — Short - Medium, 45m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          Underbarrel: { fam: "Vertical Grip", tier: "Common" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Muzzle Brake", reason: "Arpeggio has so much bloom — Compensators are the only option" },
      { mod: "Extended Barrel", reason: "Not needed on this weapon" },
      { mod: "Angled Grip", reason: "The gun kicks vertically a lot; Vertical Grips are preferred" },
      { mod: "Kinetic Converter", reason: "Not useful on a burst-fire weapon" },
    ],
    conditionals: [
      { mod: "Vertical Grip III", note: "-30% ADS speed penalty; only use if you can tolerate the slower aim" },
    ],
    tips: [
      "Muzzle Brakes are pointless on Arpeggio — the gun has so much bloom",
      "Compensators are the only option",
      "Angled Grips are not worth it because the gun kicks vertically a lot",
    ],
  },

  renegade: {
    builds: [
      {
        // (1) Renegade — Very Long, 200m
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Extended Barrel", tier: "Epic" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Rare" },
        },
      },
      {
        // (2) Renegade — Jiggle Peek - Mid/Long, 150m
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Rare" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (3) Renegade — Long, 150m
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Rare" },
        },
      },
      {
        // (4) Renegade — Long, 150m
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Rare" },
        },
      },
      {
        // (5) Renegade — Long, 150m
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Rare" },
        },
      },
      {
        // (6) Renegade — Long, 150m
        name: "Long",
        range: ["long"],
        slots: {
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Padded Stock", reason: "Not useful on a lever-action weapon" },
      { mod: "Muzzle Brake", reason: "Compensators are not needed (unless you don't have a stock)" },
    ],
    conditionals: [],
    tips: [
      "Extended Barrels help in long range fighting — less need to lead your shots due to higher bullet velocity",
      "Compensators won't help here because by the time you are ready to shoot next shot, stocks already recover the crosshair back to 100% accuracy",
      "Silencers will help in reducing noise for stealth, less ARC aggro, and confusing raiders",
      "Must have Compensator if using Lightweight Stock",
    ],
  },

  venator: {
    builds: [
      {
        // (1) Venator — Long Range, 75m
        name: "Long",
        range: ["long"],
        slots: {
          Underbarrel: { fam: "Angled Grip", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
        },
      },
      {
        // (2) Venator — Short - Medium Range, 40m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
        },
      },
      {
        // (3) Venator — Short - Medium Range, 40m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
        },
      },
      {
        // (4) Venator — Short - Medium Range, 40m
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Vertical Grip", reason: "The gun kicks a lot left/right; Angled Grips are the only option to control horizontal recoil, just pull down" },
      { mod: "Horizontal Grip", reason: "Legendary grip not worth it on Venator — Angled Grips handle it" },
    ],
    conditionals: [],
    tips: [
      "Vertical Grips are pointless on Venator — the gun kicks a lot left/right",
      "To control vertical recoil, just pull down; Angled Grips are the only option",
    ],
  },

  torrente: {
    builds: [
      {
        // (1) Torrente — Medium - Short, 28m
        name: "Medium - Short",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Kinetic Converter", tier: "Legendary" },
        },
      },
      {
        // (2) Torrente — Medium - Short, 28m
        name: "Medium - Short",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (3) Torrente — Medium - Short, 28m
        name: "Medium - Short",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (4) Torrente — Medium - Short, 25m
        name: "Medium - Short",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (5) Torrente — Medium - Short, 20m
        name: "Medium - Short",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (6) Torrente — Medium - Short, 20m
        name: "Medium - Short",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Extended Barrel", reason: "Not effective on an LMG" },
      { mod: "Muzzle Brake", reason: "Torrente has so much bloom — Compensators are the only option" },
      { mod: "Padded Stock", reason: "Not that effective on Torrente" },
    ],
    conditionals: [],
    tips: [
      "Muzzle Brakes are pointless on Torrente — the gun has so much bloom",
      "Compensators are the only option",
      "Stable Stock 1 is not that effective — invest in higher tiers or skip",
    ],
  },

  osprey: {
    builds: [
      {
        // (1) Osprey — Long Quick Scoping Long, 80m+
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Extended Barrel", tier: "Epic" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Rare" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (2) Osprey — Long (labeled as Renegade in image, but is Osprey)
        name: "Long",
        range: ["long"],
        slots: {
          "Medium Magazine": { fam: "Medium Magazine", tier: "Rare" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (3) Osprey — Long (labeled as Renegade in image, but is Osprey)
        name: "Long",
        range: ["long"],
        slots: {
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (4) Osprey — Long (labeled as Renegade in image, but is Osprey)
        name: "Long",
        range: ["long"],
        slots: {
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (5) Osprey — Long (labeled as Renegade in image, but is Osprey)
        name: "Long",
        range: ["long"],
        slots: {
          "Medium Magazine": { fam: "Medium Magazine", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Padded Stock", reason: "Stocks won't do anything if you use Osprey 4; only useful with Osprey 1" },
      { mod: "Muzzle Brake", reason: "Not needed on a bolt-action sniper" },
    ],
    conditionals: [],
    tips: [
      "Extended Barrels help in long range fighting — less need to lead your shots due to higher bullet velocity",
      "Compensators won't help here because by the time you are ready to shoot next shot, stocks already recover the crosshair back to 100% accuracy",
      "Silencers will help in reducing noise for stealth, less ARC aggro, and confusing raiders",
      "If you have Osprey 4, you can put Vertical Grip if needed and a grip/ammo stock",
      "Compensators are not needed on Osprey",
    ],
  },

  tempest: {
    builds: [
      {
        // (1) Tempest — Long Range, 60m
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Rare" },
        },
      },
      {
        // (2) Tempest — Long Range, 55m
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Rare" },
        },
      },
      {
        // (3) Tempest — Long Range, 50m
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Rare" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Rare" },
        },
      },
      {
        // (4) Tempest — Medium, 50m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
        },
      },
      {
        // (5) Tempest — Medium, 50m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Vertical Grip", tier: "Common" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
        },
      },
      {
        // (6) Tempest — Medium, 40m
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          "Medium Magazine": { fam: "Medium Magazine", tier: "Uncommon" },
        },
      },
    ],
    avoid: [
      { mod: "Muzzle Brake", reason: "Tempest has bloom issues — Compensators are the only option" },
      { mod: "Extended Barrel", reason: "Not effective on Tempest" },
      { mod: "Vertical Grip", reason: "Angled Grips handle the horizontal recoil better" },
    ],
    conditionals: [
      { mod: "Horizontal Grip", note: "-30% ADS speed penalty; consider if you can tolerate slower aim" },
      { mod: "Angled Grip III", note: "-30% ADS speed penalty; powerful but slows your aim-down-sights" },
    ],
    tips: [
      "Muzzle Brakes are pointless on Tempest — the gun has so much bloom",
      "Compensators are the only option",
    ],
  },

  // ===========================================================================
  // HEAVY AMMO
  // ===========================================================================

  ferro: {
    builds: [
      {
        // (1) Ferro — all ranges (break-action)
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Muzzle: { fam: "Extended Barrel", tier: "Epic" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (2) Ferro — all ranges
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Muzzle: { fam: "Silencer", tier: "Rare" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (3) Ferro — medium
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Silencer", tier: "Uncommon" },
        },
      },
      {
        // (4) Ferro — all ranges (budget)
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Silencer", tier: "Uncommon" },
        },
      },
    ],
    avoid: [
      { mod: "Vertical Grip", reason: "Single-shot break-action; recoil is irrelevant since you reload between shots" },
      { mod: "Padded Stock", reason: "Stability is pointless on a single-shot weapon" },
      { mod: "Horizontal Grip", reason: "Recoil control is irrelevant for break-action" },
      { mod: "Stable Stock", reason: "Dispersion recovers fully between shots naturally" },
      { mod: "Compensator", reason: "Dispersion recovers fully between shots" },
      { mod: "Muzzle Brake", reason: "Recoil is irrelevant for a single-shot weapon" },
      { mod: "Angled Grip", reason: "Recoil control is irrelevant for break-action" },
    ],
    conditionals: [],
    tips: [
      "Stable Stocks, Muzzle Brakes, Compensators are pointless on Ferro",
      "Because it's a one-shot weapon — all dispersion is already recovered after your shot and is fully accurate on next reload",
      "Silencer or Extended Barrel is your only option for muzzle",
      "For stocks use ONLY Lightweight Stock for quick ADS",
    ],
  },

  anvil: {
    builds: [
      {
        // (1) Anvil — Long Range
        name: "Long",
        range: ["long"],
        slots: {
          Muzzle: { fam: "Extended Barrel", tier: "Epic" },
        },
      },
      {
        // (2) Anvil — Short - Medium
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          "Tech Mod": { fam: "Anvil Splitter", tier: "Legendary" },
        },
        advisorEligible: false,
      },
      {
        // (3) Anvil — Short - Medium - Long
        name: "Short - Medium - Long",
        range: ["close", "mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
        },
      },
      {
        // (4) Anvil — Short - Medium
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
        },
      },
      {
        // (5) Anvil — Short - Medium - Long
        name: "Short - Medium - Long",
        range: ["close", "mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Muzzle Brake", reason: "DO NOT USE Muzzle Brakes on Anvil — you want as much dispersion reduction as possible, use Compensators" },
    ],
    conditionals: [],
    tips: [
      "Extended Barrels help in long range fighting — less need to lead your shots due to higher bullet velocity",
      "Silencers will help in reducing noise for stealth, less ARC aggro, and confusing raiders",
    ],
  },

  bettina: {
    builds: [
      {
        // (1) Bettina — Short-Medium Range
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Rare" },
          Stock: { fam: "Kinetic Converter", tier: "Legendary" },
        },
      },
      {
        // (2) Bettina — Mid-Long Range
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Horizontal Grip", tier: "Legendary" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (3) Bettina — Mid-Long Range
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Rare" },
          Stock: { fam: "Padded Stock", tier: "Epic" },
        },
      },
      {
        // (4) Bettina — Medium Range
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (5) Bettina — Medium Range
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Uncommon" },
        },
      },
      {
        // (6) Bettina — Medium Range
        name: "Medium",
        range: ["mid"],
        slots: {
          Muzzle: { fam: "Compensator", tier: "Common" },
          Underbarrel: { fam: "Angled Grip", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Vertical Grip", reason: "Can be used instead of Angled Grip III, but Angled is generally preferred" },
    ],
    conditionals: [
      { mod: "Angled Grip III", note: "Can be used instead of Horizontal Grip — less ADS penalty" },
      { mod: "Padded Stock", note: "Use Padded Stock if full-autoing; use Stable Stock if bursting" },
    ],
    tips: [
      "Extended Barrels are good for Bettina to avoid bloom — if not using Compensators, you are forced to burst the gun instead of full auto",
      "Muzzle Brakes can be an exception for Bettina, ONLY for close range",
      "Shooting long enough in mid-long range will spread your bullets A LOT",
      "Compensators still best overall",
      "Use Padded Stock if full-autoing; use Stable Stocks if bursting",
    ],
  },

  // ===========================================================================
  // SHOTGUN AMMO
  // ===========================================================================

  iltoro: {
    builds: [
      {
        // (1) Il Toro — close range with Kinetic Converter
        name: "Short",
        range: ["close"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Rare" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Rare" },
          Stock: { fam: "Kinetic Converter", tier: "Legendary" },
        },
      },
      {
        // (2) Il Toro — close range with Lightweight Stock
        name: "Short",
        range: ["close"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Rare" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Rare" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (3) Il Toro — short - medium
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Rare" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Rare" },
        },
      },
      {
        // (4) Il Toro — short
        name: "Short",
        range: ["close"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Uncommon" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Uncommon" },
        },
      },
      {
        // (5) Il Toro — short
        name: "Short",
        range: ["close"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Common" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Common" },
        },
      },
    ],
    avoid: [
      { mod: "Shotgun Silencer", reason: "Not useful on a shotgun" },
      { mod: "Padded Stock", reason: "Dispersion recovers naturally between pump cycles" },
      { mod: "Angled Grip", reason: "The gun doesn't have horizontal recoil issues between pump cycles" },
    ],
    conditionals: [
      { mod: "Lightweight Stock", note: "Can be used with Il Toro — makes ADS very fast for peek shots" },
    ],
    tips: [
      "Stable Stocks are pointless on Il Toro — the gun doesn't recover recoil after shots, dispersion recovers naturally on its own. A stock basically won't do anything since the gun shoots slowly",
      "Shotgun Chokes are EXTREMELY important — makes all pellets shoot tighter in the center",
      "Vertical Grips are pointless — the gun just kicks up, you have more than enough time to drag down between pump cycles",
      "If you struggle with vertical/horizontal recoil, put vertical/angled grip then",
    ],
  },

  vulcano: {
    builds: [
      {
        // (1) Vulcano — short
        name: "Short",
        range: ["close"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Uncommon" },
          Stock: { fam: "Kinetic Converter", tier: "Legendary" },
        },
      },
      {
        // (2) Vulcano — short
        name: "Short",
        range: ["close"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Rare" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Rare" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (3) Vulcano — short - medium
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Rare" },
          Underbarrel: { fam: "Angled Grip", tier: "Rare" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Rare" },
          Stock: { fam: "Stable Stock", tier: "Uncommon" },
        },
      },
      {
        // (4) Vulcano — short - medium
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Uncommon" },
          Underbarrel: { fam: "Angled Grip", tier: "Uncommon" },
          "Shotgun Magazine": { fam: "Shotgun Magazine", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Uncommon" },
        },
      },
    ],
    avoid: [
      { mod: "Shotgun Silencer", reason: "Not effective on Vulcano; does excessive fire rate for stealth" },
      { mod: "Padded Stock", reason: "Not effective on a semi-auto shotgun" },
    ],
    conditionals: [],
    tips: [
      "Stable Stocks work on Vulcano if you shoot fast enough, however they are not as effective as on other weapons",
      "Shotgun Chokes are EXTREMELY important — makes all pellets shoot tighter in the center",
      "Kinetic Converter is not that effective, but does increase fire rate for raw DPS",
    ],
  },

  // ===========================================================================
  // SPECIAL AMMO
  // ===========================================================================

  hullcracker: {
    builds: [
      {
        // (1) Hullcracker — Medium Range
        name: "Medium",
        range: ["mid"],
        slots: {
          Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" },
          Stock: { fam: "Kinetic Converter", tier: "Legendary" },
        },
      },
      {
        // (2) Hullcracker — Medium Range
        name: "Medium",
        range: ["mid"],
        slots: {
          Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Common" },
        },
      },
      {
        // (3) Hullcracker — Medium Range
        name: "Medium",
        range: ["mid"],
        slots: {
          Underbarrel: { fam: "Vertical Grip", tier: "Rare" },
          Stock: { fam: "Stable Stock", tier: "Uncommon" },
        },
      },
    ],
    avoid: [
      { mod: "Padded Stock", reason: "Not useful on a pump-action grenade launcher" },
      { mod: "Horizontal Grip", reason: "Hullcracker has no horizontal recoil" },
      { mod: "Angled Grip", reason: "The gun has vertical recoil only; use Vertical Grips" },
    ],
    conditionals: [],
    tips: [
      "The gun has vertical recoil and no horizontal recoil, making Vertical Grips useful",
      "It takes quite long to recover dispersion/recoil, making Stable Stock 3 best for medium/long range",
      "Lightweight Stock makes ADS very fast in short/medium ranges — works best with Vertical Grip 3",
      "However it's not that effective for medium range due to increased recoil recovery time from Lightweight Stock",
      "If you don't care about Kinetic Converters (or don't use them for PVP or anything else), they can be used for faster shots as a grenade launcher",
    ],
  },

  aphelion: {
    builds: [
      {
        // (1) Aphelion — Short/Medium Range
        name: "Short - Medium",
        range: ["close", "mid"],
        slots: {
          Underbarrel: { fam: "Vertical Grip", tier: "Rare" },
          Stock: { fam: "Lightweight Stock", tier: "Epic" },
        },
      },
      {
        // (2) Aphelion — Long/Medium Range
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" },
          Stock: { fam: "Stable Stock", tier: "Rare" },
        },
      },
      {
        // (3) Aphelion — Medium - Long Range
        name: "Medium - Long",
        range: ["mid", "long"],
        slots: {
          Underbarrel: { fam: "Vertical Grip", tier: "Common" },
          Stock: { fam: "Stable Stock", tier: "Uncommon" },
        },
      },
    ],
    avoid: [
      { mod: "Kinetic Converter", reason: "Terrible on Aphelion — only increases RPM by 7%, not worth the recoil penalty" },
      { mod: "Horizontal Grip", reason: "Aphelion has vertical recoil, not horizontal" },
      { mod: "Angled Grip", reason: "The gun has vertical recoil only; use Vertical Grips" },
      { mod: "Padded Stock", reason: "Not effective on a burst-fire weapon" },
    ],
    conditionals: [],
    tips: [
      "The gun has a lot of vertical recoil and no horizontal recoil — Vertical Grips are the way to go",
      "It takes long to recover dispersion/recoil, making Stable Stock 3 best for medium/long range",
      "Lightweight Stock makes ADS very fast in short/medium ranges — works best with Vertical Grip 3",
      "Kinetic Converter is terrible on Aphelion — only 7% RPM increase",
    ],
  },
};

