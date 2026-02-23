// ============================================================================
// FILE: components/advisor/WeaponBlock.tsx
// PURPOSE: Displays a single weapon within a pairing card (image + name + badges)
// USED BY: PairingCard.tsx
// ============================================================================

import { WEAPONS } from "../../data/weapons";
import { CLASS_LABELS, CLASS_COLORS, RARITY_COLORS, WEAPON_IMAGES } from "../../data/constants";
import Badge from "../shared/Badge";

interface WeaponBlockProps {
  weaponId: string;
  role: "Primary" | "Secondary";
}

export default function WeaponBlock({ weaponId, role }: WeaponBlockProps) {
  const weapon = WEAPONS.find((w) => w.id === weaponId);
  if (!weapon) return null;

  const imgUrl = WEAPON_IMAGES[weaponId];

  return (
    <div className="bg-surface-alt rounded-lg px-2.5 py-2.5 pb-3 relative">
      <div className="absolute -top-1.5 left-2.5 text-[0.52rem] uppercase tracking-wider text-text-muted bg-surface-alt px-1">
        {role}
      </div>
      <div className="flex items-center gap-2.5 mt-0.5">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={weapon.name}
            className="h-[52px] w-auto shrink-0 drop-shadow-md"
            loading="lazy"
          />
        ) : (
          <div
            className="h-[52px] w-[52px] shrink-0 rounded flex items-center justify-center text-lg font-bold opacity-40"
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
              color: "var(--color-accent-text)",
            }}
          >
            {weapon.name[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-text-primary mb-0.5">{weapon.name}</div>
          <div className="flex gap-1">
            <Badge label={CLASS_LABELS[weapon.weaponClass]} color={CLASS_COLORS[weapon.weaponClass]} />
            <Badge label={weapon.rarity} color={RARITY_COLORS[weapon.rarity]} />
          </div>
        </div>
      </div>
    </div>
  );
}
