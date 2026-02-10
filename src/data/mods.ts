import type { ModFamilies } from "../types";
import { WEAPONS } from "./weapons";

const ALL_IDS = WEAPONS.map((w) => w.id);

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

const MOST_UB = ALL_IDS.filter(
  (x) =>
    !["hairpin", "burletta", "anvil", "torrente", "jupiter", "equalizer"].includes(x),
);

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

export const MOD_FAMILIES: ModFamilies = {
  Muzzle: [
    {
      fam: "Compensator",
      desc: "Reduces bloom",
      tiers: {
        1: { e: "25% Reduced Per-Shot Dispersion", cr: "6x Metal Parts, 1x Wire" },
        2: { e: "35% Reduced Per-Shot Dispersion", cr: "2x Mechanical Components, 4x Wire" },
        3: { e: "50% Reduced Per-Shot Dispersion", cr: "2x Mod Components, 8x Wire" },
      },
      w: MOST_MUZZLE,
      poor: ["ferro"],
    },
    {
      fam: "Muzzle Brake",
      desc: "Reduces recoil",
      tiers: {
        1: { e: "15% Reduced Recoil", cr: "6x Metal Parts, 1x Wire" },
        2: { e: "20% Reduced Recoil", cr: "2x Mechanical Components, 4x Wire" },
        3: { e: "25% Reduced Recoil", cr: "2x Mod Components, 8x Wire" },
      },
      w: MOST_MUZZLE,
      poor: ["ferro"],
    },
    {
      fam: "Silencer",
      desc: "Reduces noise",
      tiers: {
        2: { e: "20% Reduced Noise", cr: "2x Mechanical Components, 4x Wire" },
        3: { e: "40% Reduced Noise", cr: "2x Mod Components, 8x Wire" },
        "3+": { e: "60% Reduced Noise", cr: "3x Mod Components, 15x Wire" },
      },
      w: MOST_MUZZLE,
    },
    {
      fam: "Extended Barrel",
      desc: "Increases velocity",
      tiers: {
        3: { e: "+25% Bullet Velocity", cr: "2x Mod Components, 8x Wire" },
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
        1: { e: "20% Reduced Dispersion", cr: "6x Metal Parts, 1x Wire" },
        2: { e: "30% Reduced Dispersion", cr: "2x Mechanical Components, 4x Wire" },
        3: { e: "40% Reduced Dispersion", cr: "2x Mod Components, 8x Wire" },
      },
      w: ["vulcano", "iltoro"],
    },
    {
      fam: "Shotgun Silencer",
      desc: "Reduces noise",
      tiers: {
        3: { e: "50% Reduced Noise", cr: "2x Mod Components, 8x Wire" },
      },
      w: ["vulcano", "iltoro"],
    },
  ],
  Underbarrel: [
    {
      fam: "Angled Grip",
      desc: "Reduces horizontal recoil",
      tiers: {
        1: { e: "20% Reduced H-Recoil", cr: "6x Plastic Parts, 1x Duct Tape" },
        2: { e: "30% Reduced H-Recoil", cr: "2x Mechanical Components, 3x Duct Tape" },
        3: { e: "40% Reduced H-Recoil", cr: "2x Mod Components, 5x Duct Tape" },
      },
      w: MOST_UB,
      poor: ["ferro"],
    },
    {
      fam: "Vertical Grip",
      desc: "Reduces vertical recoil",
      tiers: {
        1: { e: "20% Reduced V-Recoil", cr: "6x Plastic Parts, 1x Duct Tape" },
        2: { e: "30% Reduced V-Recoil", cr: "2x Mechanical Components, 3x Duct Tape" },
        3: { e: "40% Reduced V-Recoil", cr: "2x Mod Components, 5x Duct Tape" },
      },
      w: MOST_UB,
      poor: ["ferro"],
    },
    {
      fam: "Horizontal Grip",
      desc: "Both recoil directions",
      leg: true,
      tiers: {
        3: { e: "30% Reduced Recoil", cr: "2x Mod Components, 5x Duct Tape" },
      },
      w: MOST_UB,
      poor: ["ferro"],
    },
    {
      fam: "Kinetic Converter",
      desc: "+15% Fire Rate",
      leg: true,
      tiers: {
        3: { e: "+15% Fire Rate" },
      },
      w: [
        "arpeggio", "rattler", "kettle", "vulcano", "osprey", "torrente",
        "ferro", "iltoro", "bettina", "stitcher", "bobcat", "tempest", "renegade",
      ],
      poor: ["ferro"],
    },
  ],
  "Light Magazine": [
    {
      fam: "Extended Light Magazine",
      desc: "More rounds",
      tiers: {
        1: { e: "+5 Magazine Size", cr: "6x Plastic Parts, 1x Steel Spring" },
        2: { e: "+10 Magazine Size", cr: "2x Mechanical Components, 3x Steel Spring" },
        3: { e: "+15 Magazine Size", cr: "2x Mod Components, 5x Steel Spring" },
      },
      w: ["bobcat", "stitcher", "kettle", "hairpin", "burletta"],
    },
  ],
  "Medium Magazine": [
    {
      fam: "Extended Medium Magazine",
      desc: "More rounds",
      tiers: {
        1: { e: "+4 Magazine Size", cr: "6x Plastic Parts, 1x Steel Spring" },
        2: { e: "+8 Magazine Size", cr: "2x Mechanical Components, 3x Steel Spring" },
        3: { e: "+12 Magazine Size", cr: "2x Mod Components, 5x Steel Spring" },
      },
      w: ["arpeggio", "venator", "torrente", "renegade", "osprey", "tempest"],
    },
  ],
  "Shotgun Magazine": [
    {
      fam: "Extended Shotgun Magazine",
      desc: "More shells",
      tiers: {
        1: { e: "+2 Magazine Size", cr: "6x Plastic Parts, 1x Steel Spring" },
        2: { e: "+4 Magazine Size", cr: "2x Mechanical Components, 3x Steel Spring" },
        3: { e: "+6 Magazine Size", cr: "2x Mod Components, 5x Steel Spring" },
      },
      w: ["iltoro", "vulcano"],
    },
  ],
  Stock: [
    {
      fam: "Stable Stock",
      desc: "Faster recovery",
      tiers: {
        1: { e: "40% Recovery", cr: "7x Rubber Parts, 1x Duct Tape" },
        2: { e: "60% Recovery", cr: "2x Mechanical Components, 3x Duct Tape" },
        3: { e: "50% Recovery", cr: "2x Mod Components, 5x Duct Tape" },
      },
      w: MOST_STOCK,
    },
    {
      fam: "Padded Stock",
      desc: "All-in-one stability",
      tiers: {
        3: { e: "30% Reduced Recoil/Dispersion", cr: "2x Mod Components, 5x Duct Tape" },
      },
      w: MOST_STOCK,
    },
    {
      fam: "Lightweight Stock",
      desc: "Fast ADS",
      tiers: {
        3: { e: "+200% ADS Speed", cr: "2x Mod Components, 5x Duct Tape" },
      },
      w: MOST_STOCK,
    },
  ],
  "Tech Mod": [
    {
      fam: "Anvil Splitter",
      desc: "Spread shot",
      leg: true,
      tiers: {
        3: { e: "+3 Projectiles" },
      },
      w: ["anvil"],
    },
  ],
};
