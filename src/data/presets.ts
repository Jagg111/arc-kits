// ============================================================================
// FILE: data/presets.ts
// PURPOSE: Pre-built recommended loadouts organized by build goal
// USED BY: useWeaponBuilder (applies a preset), WeaponBuilder + GoalCard (displays goals),
//          StatsSummaryBar (mobile goal picker)
// NOTE: The keys inside each goal's `builds` object MUST match weapon `id` values from weapons.ts.
//       If a weapon ID isn't listed under a goal, that goal won't appear for that weapon.
// ============================================================================

import type { GoalPresets } from "../types";

// Each goal preset provides a recommended mod loadout per weapon.
// Goals: fix (address weakness), budget (cheap), recoil (stability), stealth, pvp, arc (robots)
export const GOAL_PRESETS: GoalPresets = {
  fix: {
    icon: "🎯",
    name: "Fix This Gun",
    desc: "Addresses biggest weakness",
    builds: {
      burletta: { slots: { Muzzle: { fam: "Compensator", tier: "Uncommon" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Uncommon" } }, fix: "Fixes tiny mag + bloom" },
      kettle: { slots: { Muzzle: { fam: "Compensator", tier: "Uncommon" }, Underbarrel: { fam: "Vertical Grip", tier: "Common" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Rare" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Eliminates bloom" },
      stitcher: { slots: { Muzzle: { fam: "Compensator", tier: "Uncommon" }, Underbarrel: { fam: "Horizontal Grip", tier: "Uncommon" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Rare" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Bigger mag and tighter dispersion" },
      bobcat: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Uncommon" }, Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Rare" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Controls extreme recoil" },
      rattler: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Uncommon" }, Underbarrel: { fam: "Vertical Grip", tier: "Common" }, Stock: { fam: "Stable Stock", tier: "Common" } }, fix: "Basic improvements" },
      arpeggio: { slots: { Muzzle: { fam: "Compensator", tier: "Uncommon" }, Underbarrel: { fam: "Vertical Grip", tier: "Common" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Uncommon" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Speeds burst recovery" },
      renegade: { slots: { Muzzle: { fam: "Extended Barrel", tier: "Rare" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Uncommon" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Fixes sluggish velocity" },
      venator: { slots: { Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Rare" } }, fix: "Extends mag, controls kick" },
      torrente: { slots: { Muzzle: { fam: "Compensator", tier: "Rare" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Uncommon" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Fixes terrible dispersion" },
      osprey: { slots: { Muzzle: { fam: "Extended Barrel", tier: "Rare" }, Stock: { fam: "Lightweight Stock", tier: "Rare" } }, fix: "Velocity + snap-aim" },
      tempest: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Uncommon" }, Underbarrel: { fam: "Vertical Grip", tier: "Rare" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Rare" } }, fix: "Controls vertical climb" },
      ferro: { slots: { Stock: { fam: "Lightweight Stock", tier: "Rare" } }, fix: "Fixes sluggish ADS" },
      anvil: { slots: { Muzzle: { fam: "Compensator", tier: "Uncommon" } }, fix: "Tighten dispersion" },
      bettina: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Rare" }, Underbarrel: { fam: "Horizontal Grip", tier: "Legendary" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Controls full-auto" },
      iltoro: { slots: { "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Uncommon" }, "Shotgun Magazine": { fam: "Extended Shotgun Magazine", tier: "Uncommon" } }, fix: "Tightens spread" },
      vulcano: { slots: { "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Rare" }, "Shotgun Magazine": { fam: "Extended Shotgun Magazine", tier: "Rare" } }, fix: "Reliable pellets" },
      hullcracker: { slots: { Underbarrel: { fam: "Vertical Grip", tier: "Common" }, Stock: { fam: "Stable Stock", tier: "Common" } }, fix: "Better handling" },
      aphelion: { slots: { Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Smooths bursts" },
      jupiter: { slots: {}, fix: "No slots available" },
      equalizer: { slots: {}, fix: "No slots available" },
    },
  },
  budget: {
    icon: "💰",
    name: "Budget Build",
    desc: "Common attachments only",
    builds: {
      stitcher: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Common" }, Underbarrel: { fam: "Vertical Grip", tier: "Common" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Common" } }, fix: "Cheap but effective" },
      tempest: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Common" }, Underbarrel: { fam: "Angled Grip", tier: "Common" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Common" } }, fix: "T2 meta setup" },
      rattler: { slots: { Muzzle: { fam: "Compensator", tier: "Common" }, Underbarrel: { fam: "Angled Grip", tier: "Common" }, Stock: { fam: "Stable Stock", tier: "Common" } }, fix: "Basic improvements" },
      ferro: { slots: { Stock: { fam: "Stable Stock", tier: "Common" } }, fix: "Cheapest ARC killer" },
      bobcat: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Common" }, Underbarrel: { fam: "Vertical Grip", tier: "Common" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Common" } }, fix: "Budget stable" },
      vulcano: { slots: { "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Common" }, "Shotgun Magazine": { fam: "Extended Shotgun Magazine", tier: "Common" } }, fix: "Essentials only" },
      iltoro: { slots: { "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Common" }, "Shotgun Magazine": { fam: "Extended Shotgun Magazine", tier: "Common" } }, fix: "Minimal cost" },
      kettle: { slots: { Muzzle: { fam: "Compensator", tier: "Common" }, Underbarrel: { fam: "Angled Grip", tier: "Common" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Common" }, Stock: { fam: "Stable Stock", tier: "Common" } }, fix: "Basic stabilization for trigger spam" },
      burletta: { slots: { Muzzle: { fam: "Silencer", tier: "Uncommon" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Common" } }, fix: "Cheap stealth pistol" },
    },
  },
  recoil: {
    icon: "⚡",
    name: "Zero Recoil",
    desc: "Maximum stability",
    builds: {
      stitcher: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Rare" }, Underbarrel: { fam: "Vertical Grip", tier: "Rare" }, Stock: { fam: "Padded Stock", tier: "Rare" } }, fix: "Laser accuracy" },
      bobcat: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Rare" }, Underbarrel: { fam: "Horizontal Grip", tier: "Legendary" }, Stock: { fam: "Padded Stock", tier: "Rare" } }, fix: "Full control" },
      tempest: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Rare" }, Underbarrel: { fam: "Horizontal Grip", tier: "Legendary" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Uncommon" } }, fix: "Max stability" },
      bettina: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Rare" }, Underbarrel: { fam: "Vertical Grip", tier: "Rare" }, Stock: { fam: "Padded Stock", tier: "Rare" } }, fix: "Tames heavy" },
      torrente: { slots: { Muzzle: { fam: "Compensator", tier: "Rare" }, Stock: { fam: "Padded Stock", tier: "Rare" } }, fix: "Laser beam" },
    },
  },
  stealth: {
    icon: "🔇",
    name: "Stealth",
    desc: "Silencers, low noise",
    builds: {
      osprey: { slots: { Muzzle: { fam: "Silencer", tier: "Uncommon" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Silent snipes" },
      anvil: { slots: { Muzzle: { fam: "Silencer", tier: "Rare" } }, fix: "Quiet power" },
      vulcano: { slots: { "Shotgun Muzzle": { fam: "Shotgun Silencer", tier: "Rare" }, "Shotgun Magazine": { fam: "Extended Shotgun Magazine", tier: "Rare" } }, fix: "Silent clear" },
      burletta: { slots: { Muzzle: { fam: "Silencer", tier: "Uncommon" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Uncommon" } }, fix: "High-capacity stealth sidearm" },
      kettle: { slots: { Muzzle: { fam: "Silencer", tier: "Uncommon" }, Underbarrel: { fam: "Angled Grip", tier: "Rare" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Uncommon" }, Stock: { fam: "Stable Stock", tier: "Rare" } }, fix: "Quiet, accurate fire for picking off enemies from cover" },
    },
  },
  pvp: {
    icon: "🏆",
    name: "Meta PVP",
    desc: "Player combat proven",
    builds: {
      tempest: { slots: { Muzzle: { fam: "Muzzle Brake", tier: "Uncommon" }, Underbarrel: { fam: "Vertical Grip", tier: "Rare" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Rare" } }, fix: "AR king" },
      vulcano: { slots: { "Shotgun Muzzle": { fam: "Shotgun Choke", tier: "Rare" }, "Shotgun Magazine": { fam: "Extended Shotgun Magazine", tier: "Rare" } }, fix: "Fastest TTK" },
      stitcher: { slots: { Muzzle: { fam: "Compensator", tier: "Rare" }, "Light Magazine": { fam: "Extended Light Magazine", tier: "Rare" } }, fix: "High DPS" },
      venator: { slots: { Underbarrel: { fam: "Horizontal Grip", tier: "Legendary" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Rare" } }, fix: "Top pistol" },
    },
  },
  arc: {
    icon: "🤖",
    name: "ARC Hunter",
    desc: "Robot combat optimized",
    builds: {
      ferro: { slots: { Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "Boss killer" },
      bettina: { slots: { Muzzle: { fam: "Compensator", tier: "Rare" }, Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" }, Stock: { fam: "Stable Stock", tier: "Rare" } }, fix: "Heavy accuracy" },
      tempest: { slots: { Muzzle: { fam: "Compensator", tier: "Uncommon" }, Underbarrel: { fam: "Vertical Grip", tier: "Uncommon" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Rare" } }, fix: "Sustained DPS" },
      renegade: { slots: { Muzzle: { fam: "Compensator", tier: "Uncommon" }, "Medium Magazine": { fam: "Extended Medium Magazine", tier: "Rare" }, Stock: { fam: "Stable Stock", tier: "Uncommon" } }, fix: "ARC breaking" },
    },
  },
};
