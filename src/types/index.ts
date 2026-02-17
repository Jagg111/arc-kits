// ============================================================================
// FILE: types/index.ts
// PURPOSE: Central type definitions for the entire app
// USED BY: Nearly every file — data, hooks, and components all import from here
// ============================================================================

// A single weapon in the game (one entry per gun in weapons.ts)
export interface Weapon {
  id: string;           // Lowercase unique key, must match keys in presets.ts and URL params
  name: string;         // Display name shown in the UI
  weaponClass: WeaponClass;
  ammoType: AmmoType;
  fireMode: string;     // e.g. "Full-Auto", "Semi-Auto", "Bolt"
  damage: number;
  rateOfFire: number;
  dps: number;          // Damage per second (damage × rateOfFire)
  range: number;
  slots: SlotType[];    // Which attachment slots this weapon has (empty = no mods possible)
  rarity: Rarity;
  pvp: string;          // Letter grade for PVP effectiveness (S/A/B/C/D/F)
  arc: string;          // Letter grade for ARC (robot) combat effectiveness
  desc: string;         // Flavor/strategy description
  weakness: string;     // Known weakness text shown in the builder
}

// Short codes for weapon classes — expanded to full names via CLASS_LABELS in constants.ts
export type WeaponClass =
  | "AR"       // Assault Rifle
  | "BR"       // Battle Rifle
  | "SMG"      // Submachine Gun
  | "SG"       // Shotgun
  | "Pistol"
  | "HC"       // Hand Cannon
  | "LMG"      // Light Machine Gun
  | "SR"       // Sniper Rifle
  | "Special";

export type AmmoType = "Light" | "Medium" | "Heavy" | "Shotgun" | "Special";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

// The physical attachment slot on a weapon where a mod can be installed
export type SlotType =
  | "Muzzle"
  | "Shotgun Muzzle"
  | "Underbarrel"
  | "Light Magazine"
  | "Medium Magazine"
  | "Shotgun Magazine"
  | "Stock"
  | "Tech Mod";

// Data for a single tier (rarity level) of a mod family
export interface TierData {
  e: string[];    // Effects array — human-readable strings like "20% Reduced Vertical Recoil"
  cr?: string;    // Crafting cost string like "6x Metal Parts, 1x Wires" (parsed by useBuildCost)
  img?: string;   // Wiki thumbnail URL for this tier's icon
}

// A mod "family" — e.g. "Compensator" is one family with Common/Uncommon/Rare tiers
export interface ModFamily {
  fam: string;                              // Family name (e.g. "Compensator", "Angled Grip")
  desc: string;                             // Short description shown in the mod picker
  leg?: boolean;                            // True if this mod only comes in Legendary rarity
  tiers: Partial<Record<Rarity, TierData>>; // Available tiers — not every rarity exists for every mod
  w: string[];                              // Weapon compatibility — list of weapon IDs that can use this mod
  poor?: string[];                          // Weapons where this mod is a poor choice (shown as warning)
}

// Maps each slot type to an array of mod families available for that slot
export type ModFamilies = Record<SlotType, ModFamily[]>;

// Represents a mod the user has equipped in a specific slot
export interface EquippedMod {
  fam: string;    // Which mod family is equipped (e.g. "Compensator")
  tier: Rarity;   // Which rarity tier is selected (e.g. "Rare")
}

// The full equipped state — maps slot names to the mod equipped in that slot
// Example: { "Muzzle": { fam: "Compensator", tier: "Rare" }, "Stock": { fam: "Stable Stock", tier: "Common" } }
export type EquippedState = Record<string, EquippedMod>;

// A preset build for a specific weapon within a goal (e.g. "Fix This Gun" for the Tempest)
export interface GoalBuild {
  slots: EquippedState;  // Which mods to equip in which slots
  fix: string;           // Short description like "Controls vertical climb"
}

// A goal preset — contains a recommended build for multiple weapons
export interface GoalPreset {
  icon: string;                         // Emoji icon shown on the goal card
  name: string;                         // Display name (e.g. "Fix This Gun", "Budget Build")
  desc: string;                         // Short description of the goal's philosophy
  builds: Record<string, GoalBuild>;    // Keyed by weapon ID — each weapon gets its own build
}

// Maps goal keys (e.g. "fix", "budget", "recoil") to their GoalPreset definitions
export type GoalPresets = Record<string, GoalPreset>;

// Aggregated stat bonus from combining multiple mods (computed by useCumulativeEffects hook)
export interface CumulativeEffect {
  stat: string;                                           // Stat name (e.g. "Horizontal Recoil")
  mods: { name: string; effect: string; value: number }[]; // Which mods contribute to this stat
  total: number;                                          // Sum of all contributing values
  unit: string;                                           // "%" or "" (for flat bonuses like magazine size)
}

// Advisor questionnaire enums
export type AdvisorLocationId =
  | "buried_city"
  | "spaceport"
  | "dam"
  | "blue_gate"
  | "stella_montis";

export type AdvisorSquadMode = "solo" | "squad";
export type AdvisorFocus = "pve" | "pvp" | "mixed";
export type AdvisorPreferredRange = "close" | "mid" | "long" | "any";

export interface AdvisorInputs {
  location: AdvisorLocationId;
  squad: AdvisorSquadMode;
  focus: AdvisorFocus;
  preferredRange: AdvisorPreferredRange;
  stealthImportant: boolean;
  allowedWeaponRarities: Rarity[];
  debug: boolean;
}

export interface ShuffleState {
  bucketIndex: number;
  seenPairKeys: string[];
  cycle: number;
}

export interface AdvisorScoreBreakdown {
  locationFit: number;
  focusFit: number;
  rangeFit: number;
  soloSquadFit: number;
  stealthPreferenceFit: number;
  weightedTotal: number;
}

export interface AdvisorComplementBreakdown {
  baseSecondaryFit: number;
  ammoComplement: number;
  rangeComplement: number;
  roleComplement: number;
  weightedTotal: number;
}

export interface PairRecommendation {
  rank: number;
  pairKey: string;
  primaryWeaponId: string;
  secondaryWeaponId: string;
  primaryScore: number;
  secondaryScore: number;
  pairScore: number;
  tieBucketId: string;
  reasons: string[];
  debug?: {
    primaryBreakdown: AdvisorScoreBreakdown;
    secondaryBreakdown: AdvisorScoreBreakdown;
    complementBreakdown: AdvisorComplementBreakdown;
  };
}

export interface AdvisorEmptyState {
  code: "INSUFFICIENT_VALID_WEAPONS" | "NO_VALID_PAIRS";
  message: string;
}

export interface AdvisorResult {
  recommendations: PairRecommendation[];
  emptyState?: AdvisorEmptyState;
  shuffleState: ShuffleState;
}

export interface AdvisorQueryState extends AdvisorInputs {
  tab: "advisor";
  shuffle?: {
    bucket: number;
    offset: number;
  };
}

export interface GoldenScenarioCase {
  id: string;
  title: string;
  inputs: AdvisorInputs;
  requireDebug: boolean;
  exactExpectedPairKey?: string;
  expectedPrimaryPool?: string[];
  expectedSecondaryPool?: string[];
  expectEmpty?: boolean;
  requireTieCycling?: boolean;
  requireUrlRoundTrip?: boolean;
}
