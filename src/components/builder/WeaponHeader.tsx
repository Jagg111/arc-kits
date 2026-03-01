// ============================================================================
// FILE: components/builder/WeaponHeader.tsx
// PURPOSE: Weapon identity banner at the top of the builder screen
// USED BY: WeaponBuilder.tsx
//
// DISPLAY: Weapon image + name (with inline rarity label) + description.
// Badges for class, ammo, PVP/ARC grades are intentionally removed —
// those data fields remain in weapons.ts but are not surfaced here.
// The weakness callout is also removed from the header; it now lives
// in the Weapon Intel sidebar/accordion (see WeaponIntel.tsx).
// ============================================================================

import type { Weapon } from "../../types";
import { WEAPON_IMAGES, RARITY_COLORS } from "../../data/constants";

interface WeaponHeaderProps {
  weapon: Weapon;
}

export default function WeaponHeader({ weapon }: WeaponHeaderProps) {
  const img = WEAPON_IMAGES[weapon.id];
  const rarityColor = RARITY_COLORS[weapon.rarity];

  return (
    <div className="bg-gradient-to-r from-surface to-surface-alt rounded-xl border border-border p-6">
      <div className="flex items-center gap-5">
        {/* Weapon image — 120px desktop, 80px mobile */}
        {img && (
          <img
            src={img}
            alt={weapon.name}
            className="w-20 lg:w-[120px] h-auto object-contain shrink-0"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
          />
        )}

        <div className="min-w-0">
          {/* Name + inline rarity label on the same baseline */}
          <h2 className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl lg:text-[28px] font-bold leading-tight">
              {weapon.name}
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: rarityColor }}
            >
              {weapon.rarity}
            </span>
          </h2>

          {weapon.desc && (
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              {weapon.desc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
