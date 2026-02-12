// ============================================================================
// FILE: data/mods.ts
// PURPOSE: All mod families organized by attachment slot type
// USED BY: AttachmentSlot (filters mods for a slot), ModDrawer (lists available mods),
//          useBuildCost (looks up crafting costs), useCumulativeEffects (reads effect strings)
// IMPORTS FROM: types (ModFamilies), weapons.ts (for building weapon compatibility lists)
//
// HOW WEAPON COMPATIBILITY WORKS:
// Each mod family has a `w` array listing which weapon IDs can equip that mod.
// Helper arrays like MOST_MUZZLE exclude weapons that lack a muzzle slot.
// The `poor` array (optional) marks weapons where the mod gives little benefit.
// ============================================================================

import type { ModFamilies } from "../types";
import { WEAPONS } from "./weapons";

// Build helper arrays of weapon IDs for common compatibility patterns.
// These start with ALL weapon IDs and exclude the ones that don't have the relevant slot.
const ALL_IDS = WEAPONS.map((w) => w.id);

// Weapons that have a standard Muzzle slot (excludes shotguns, specials, hairpin, venator)
const MOST_MUZZLE = ALL_IDS.filter(
  (x) =>
    ![
      "hairpin",
      "venator",
      "iltoro",
      "vulcano",
      "aphelion",
      "hullcracker",
      "jupiter",
      "equalizer",
    ].includes(x),
);

// Weapons that have an Underbarrel slot
const MOST_UB = ALL_IDS.filter(
  (x) =>
    !["hairpin", "burletta", "anvil", "torrente", "jupiter", "equalizer"].includes(x),
);

// Weapons that have a Stock slot
const MOST_STOCK = ALL_IDS.filter(
  (x) =>
    ![
      "hairpin",
      "burletta",
      "venator",
      "anvil",
      "tempest",
      "jupiter",
      "equalizer",
    ].includes(x),
);

// Build a wiki thumbnail URL at 96px (retina-ready for 48px display).
// `hash` is the wiki image path hash, `file` is the filename.
const W = (hash: string, file: string) =>
  `https://arcraiders.wiki/w/images/thumb/${hash}/${file}/96px-${file}.webp`;

// The main mod data structure. Keyed by SlotType, each entry is an array of ModFamily objects.
// Each ModFamily has: fam (name), desc, tiers (with effects + costs), w (compatible weapons).
export const MOD_FAMILIES: ModFamilies = {
  Muzzle: [
    {
      fam: "Compensator",
      desc: "Reduces bloom",
      tiers: {
        Common: {
          e: ["20% Reduced Per-Shot Dispersion", "10% Reduced Max Shot Dispersion"],
          cr: "6x Metal Parts, 1x Wires",
          img: W("5/5f", "Compensator_I.png"),
        },
        Uncommon: {
          e: ["40% Reduced Per-Shot Dispersion", "20% Reduced Max Shot Dispersion"],
          cr: "2x Mechanical Components, 4x Wires",
          img: W("0/0a", "Compensator_II.png"),
        },
        Rare: {
          e: ["60% Reduced Per-Shot Dispersion", "30% Reduced Max Shot Dispersion", "20% Increased Durability Burn Rate"],
          cr: "2x Mod Components, 8x Wires",
          img: W("a/af", "Compensator_III.png"),
        },
      },
      w: MOST_MUZZLE,
      poor: ["ferro"],
    },
    {
      fam: "Muzzle Brake",
      desc: "Reduces recoil",
      tiers: {
        Common: {
          e: ["15% Reduced Horizontal Recoil", "15% Reduced Vertical Recoil"],
          cr: "6x Metal Parts, 1x Wires",
          img: W("4/4f", "Muzzle_Brake_I.png"),
        },
        Uncommon: {
          e: ["20% Reduced Horizontal Recoil", "20% Reduced Vertical Recoil"],
          cr: "2x Mechanical Components, 4x Wires",
          img: W("2/23", "Muzzle_Brake_II.png"),
        },
        Rare: {
          e: ["25% Reduced Horizontal Recoil", "25% Reduced Vertical Recoil", "20% Increased Durability Burn Rate"],
          cr: "2x Mod Components, 8x Wires",
          img: W("a/a2", "Muzzle_Brake_III.png"),
        },
      },
      w: MOST_MUZZLE,
      poor: ["ferro"],
    },
    {
      fam: "Silencer",
      desc: "Reduces noise",
      tiers: {
        Uncommon: {
          e: ["20% Reduced Noise"],
          cr: "2x Mechanical Components, 4x Wires",
          img: W("f/f7", "Silencer_I.png"),
        },
        Rare: {
          e: ["40% Reduced Noise"],
          cr: "2x Mod Components, 8x Wires",
          img: W("c/c0", "Silencer_II.png"),
        },
        Epic: {
          e: ["60% Reduced Noise", "20% Increased Durability Burn Rate"],
          img: W("3/3e", "Silencer_III.png"),
        },
      },
      w: MOST_MUZZLE,
    },
    {
      fam: "Extended Barrel",
      desc: "Increases velocity",
      tiers: {
        Rare: {
          e: ["25% Increased Bullet Velocity", "15% Increased Vertical Recoil"],
          cr: "2x Mod Components, 8x Wires",
          img: W("2/2f", "Extended_Barrel.png"),
        },
      },
      w: [
        "osprey", "stitcher", "ferro", "arpeggio", "anvil", "burletta",
        "kettle", "renegade", "rattler", "bettina", "tempest", "bobcat", "torrente",
      ],
    },
  ],
  "Shotgun Muzzle": [
    {
      fam: "Shotgun Choke",
      desc: "Tightens spread",
      tiers: {
        Common: {
          e: ["10% Reduced Base Dispersion"],
          cr: "6x Metal Parts, 1x Wires",
          img: W("0/07", "Shotgun_Choke_I.png"),
        },
        Uncommon: {
          e: ["20% Reduced Base Dispersion"],
          cr: "2x Mechanical Components, 4x Wires",
          img: W("6/63", "Shotgun_Choke_II.png"),
        },
        Rare: {
          e: ["30% Reduced Base Dispersion", "20% Increased Durability Burn Rate"],
          cr: "2x Mod Components, 8x Wires",
          img: W("3/36", "Shotgun_Choke_III.png"),
        },
      },
      w: ["vulcano", "iltoro"],
    },
    {
      fam: "Shotgun Silencer",
      desc: "Reduces noise",
      tiers: {
        Rare: {
          e: ["50% Reduced Noise"],
          cr: "2x Mod Components, 8x Wires",
          img: W("4/4d", "Shotgun_Silencer.png"),
        },
      },
      w: ["vulcano", "iltoro"],
    },
  ],
  Underbarrel: [
    {
      fam: "Angled Grip",
      desc: "Reduces horizontal recoil",
      tiers: {
        Common: {
          e: ["20% Reduced Horizontal Recoil"],
          cr: "6x Plastic Parts, 1x Duct Tape",
          img: W("b/b5", "Angled_Grip_I.png"),
        },
        Uncommon: {
          e: ["30% Reduced Horizontal Recoil"],
          cr: "2x Mechanical Components, 3x Duct Tape",
          img: W("2/2b", "Angled_Grip_II.png"),
        },
        Rare: {
          e: ["40% Reduced Horizontal Recoil", "30% Reduced ADS Speed"],
          cr: "2x Mod Components, 5x Duct Tape",
          img: W("0/0f", "Angled_Grip_III.png"),
        },
      },
      w: MOST_UB,
      poor: ["ferro"],
    },
    {
      fam: "Vertical Grip",
      desc: "Reduces vertical recoil",
      tiers: {
        Common: {
          e: ["20% Reduced Vertical Recoil"],
          cr: "6x Plastic Parts, 1x Duct Tape",
          img: W("4/4d", "Vertical_Grip_I.png"),
        },
        Uncommon: {
          e: ["30% Reduced Vertical Recoil"],
          cr: "2x Mechanical Components, 3x Duct Tape",
          img: W("3/3c", "Vertical_Grip_II.png"),
        },
        Rare: {
          e: ["40% Reduced Vertical Recoil", "30% Reduced ADS Speed"],
          cr: "2x Mod Components, 5x Duct Tape",
          img: W("2/20", "Vertical_Grip_III.png"),
        },
      },
      w: MOST_UB,
      poor: ["ferro"],
    },
    {
      fam: "Horizontal Grip",
      desc: "Both recoil directions",
      leg: true,
      tiers: {
        Legendary: {
          e: ["30% Reduced Horizontal Recoil", "30% Reduced Vertical Recoil", "30% Reduced ADS Speed"],
          img: W("8/89", "Horizontal_Grip.png"),
        },
      },
      w: MOST_UB,
      poor: ["ferro"],
    },
  ],
  "Light Magazine": [
    {
      fam: "Extended Light Magazine",
      desc: "More rounds",
      tiers: {
        Common: {
          e: ["+5 Magazine Size"],
          cr: "6x Plastic Parts, 1x Steel Spring",
          img: W("2/23", "Extended_Light_Mag_I.png"),
        },
        Uncommon: {
          e: ["+10 Magazine Size"],
          cr: "2x Mechanical Components, 3x Steel Spring",
          img: W("c/cf", "Extended_Light_Mag_II.png"),
        },
        Rare: {
          e: ["+15 Magazine Size"],
          cr: "2x Mod Components, 5x Steel Spring",
          img: W("4/40", "Extended_Light_Mag_III.png"),
        },
      },
      w: ["bobcat", "stitcher", "kettle", "hairpin", "burletta"],
    },
  ],
  "Medium Magazine": [
    {
      fam: "Extended Medium Magazine",
      desc: "More rounds",
      tiers: {
        Common: {
          e: ["+4 Magazine Size"],
          cr: "6x Plastic Parts, 1x Steel Spring",
          img: W("4/44", "Extended_Medium_Mag_I.png"),
        },
        Uncommon: {
          e: ["+8 Magazine Size"],
          cr: "2x Mechanical Components, 3x Steel Spring",
          img: W("5/50", "Extended_Medium_Mag_II.png"),
        },
        Rare: {
          e: ["+12 Magazine Size"],
          cr: "2x Mod Components, 5x Steel Spring",
          img: W("a/a1", "Extended_Medium_Mag_III.png"),
        },
      },
      w: ["arpeggio", "venator", "torrente", "renegade", "osprey", "tempest"],
    },
  ],
  "Shotgun Magazine": [
    {
      fam: "Extended Shotgun Magazine",
      desc: "More shells",
      tiers: {
        Common: {
          e: ["+2 Magazine Size"],
          cr: "6x Plastic Parts, 1x Steel Spring",
          img: W("9/9b", "Extended_Shotgun_Mag_I.png"),
        },
        Uncommon: {
          e: ["+4 Magazine Size"],
          cr: "2x Mechanical Components, 3x Steel Spring",
          img: W("4/4f", "Extended_Shotgun_Mag_II.png"),
        },
        Rare: {
          e: ["+6 Magazine Size"],
          cr: "2x Mod Components, 5x Steel Spring",
          img: W("7/77", "Extended_Shotgun_Mag_III.png"),
        },
      },
      w: ["iltoro", "vulcano"],
    },
  ],
  Stock: [
    {
      fam: "Stable Stock",
      desc: "Faster recovery",
      tiers: {
        Common: {
          e: ["20% Reduced Recoil Recovery Duration", "20% Reduced Dispersion Recovery Time"],
          cr: "7x Rubber Parts, 1x Duct Tape",
          img: W("8/8d", "Stable_Stock_I.png"),
        },
        Uncommon: {
          e: ["35% Reduced Recoil Recovery Duration", "35% Reduced Dispersion Recovery Time"],
          cr: "2x Mechanical Components, 3x Duct Tape",
          img: W("b/b4", "Stable_Stock_II.png"),
        },
        Rare: {
          e: ["50% Reduced Recoil Recovery Duration", "50% Reduced Dispersion Recovery Time", "20% Increased Equip Time", "20% Increased Unequip Time"],
          cr: "2x Mod Components, 5x Duct Tape",
          img: W("e/eb", "Stable_Stock_III.png"),
        },
      },
      w: MOST_STOCK,
    },
    {
      fam: "Padded Stock",
      desc: "All-in-one stability",
      tiers: {
        Rare: {
          e: ["15% Reduced Vertical Recoil", "15% Reduced Horizontal Recoil", "20% Reduced Per-Shot Dispersion", "20% Increased Equip Time", "20% Increased Unequip Time", "30% Reduced ADS Speed"],
          cr: "2x Mod Components, 5x Duct Tape",
          img: W("4/4b", "Padded_Stock.png"),
        },
      },
      w: MOST_STOCK,
    },
    {
      fam: "Lightweight Stock",
      desc: "Fast ADS",
      tiers: {
        Rare: {
          e: ["200% Increased ADS Speed", "30% Reduced Equip Time", "30% Reduced Unequip Time", "50% Increased Vertical Recoil", "50% Increased Recoil Recovery Time"],
          cr: "2x Mod Components, 5x Duct Tape",
          img: W("c/cb", "Lightweight_Stock.png"),
        },
      },
      w: MOST_STOCK,
    },
    {
      fam: "Kinetic Converter",
      desc: "+15% Fire Rate",
      leg: true,
      tiers: {
        Legendary: {
          e: ["15% Increased Fire Rate", "20% Increased Horizontal Recoil", "20% Increased Vertical Recoil"],
          img: W("7/71", "Kinetic_Converter.png"),
        },
      },
      w: [
        "arpeggio", "rattler", "kettle", "vulcano", "osprey", "torrente",
        "ferro", "iltoro", "bettina", "stitcher", "bobcat", "tempest", "renegade",
      ],
      poor: ["ferro"],
    },
  ],
  "Tech Mod": [
    {
      fam: "Anvil Splitter",
      desc: "Spread shot",
      leg: true,
      tiers: {
        Legendary: {
          e: ["+3 Projectiles Per Shot", "70% Reduced Projectile Damage"],
          img: W("e/ef", "Anvil_Splitter.png"),
        },
      },
      w: ["anvil"],
    },
  ],
};
