export interface Weapon {
  id: string;
  name: string;
  weaponClass: WeaponClass;
  ammoType: AmmoType;
  fireMode: string;
  damage: number;
  rateOfFire: number;
  dps: number;
  range: number;
  slots: SlotType[];
  rarity: Rarity;
  pvp: string;
  arc: string;
  desc: string;
  weakness: string;
}

export type WeaponClass =
  | "AR"
  | "BR"
  | "SMG"
  | "SG"
  | "Pistol"
  | "HC"
  | "LMG"
  | "SR"
  | "Special";

export type AmmoType = "Light" | "Medium" | "Heavy" | "Shotgun" | "Special";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export type SlotType =
  | "Muzzle"
  | "Shotgun Muzzle"
  | "Underbarrel"
  | "Light Magazine"
  | "Medium Magazine"
  | "Shotgun Magazine"
  | "Stock"
  | "Tech Mod";

export type TierKey = 1 | 2 | 3 | "3+";

export interface TierData {
  e: string;
  cr?: string;
}

export interface ModFamily {
  fam: string;
  desc: string;
  leg?: boolean;
  tiers: Partial<Record<TierKey, TierData>>;
  w: string[];
  poor?: string[];
}

export type ModFamilies = Record<SlotType, ModFamily[]>;

export interface EquippedMod {
  fam: string;
  tier: TierKey;
}

export type EquippedState = Record<string, EquippedMod>;

export interface GoalBuild {
  slots: EquippedState;
  fix: string;
}

export interface GoalPreset {
  icon: string;
  name: string;
  desc: string;
  builds: Record<string, GoalBuild>;
}

export type GoalPresets = Record<string, GoalPreset>;

export interface CumulativeEffect {
  stat: string;
  mods: { name: string; effect: string; value: number }[];
  total: number;
  unit: string;
}
