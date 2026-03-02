// ============================================================================
// FILE: components/advisor/WeaponBlock.tsx
// PURPOSE: Displays a single weapon within a pairing card - image, name with
//          inline rarity, centered attachment gallery, and a bottom-right
//          "Customize ->" action.
// USED BY: PairingCard.tsx
// ============================================================================

import { WEAPONS } from "../../data/weapons";
import { RARITY_COLORS, WEAPON_IMAGES } from "../../data/constants";
import ModGallery from "../shared/ModGallery";
import type { GuideBuild, EquippedState } from "../../types";

interface WeaponBlockProps {
  weaponId: string;
  role: "Primary" | "Secondary";
  /** When provided, "Customize ->" opens Builder with this build pre-equipped and URL encoded. */
  onOpenBuilder?: (weaponId: string, build?: GuideBuild | null) => void;
  /** Recommended attachment build from the advisor selection engine. Undefined = no guide. */
  attachmentBuild?: GuideBuild;
}

export default function WeaponBlock({ weaponId, role, onOpenBuilder, attachmentBuild }: WeaponBlockProps) {
  const weapon = WEAPONS.find((w) => w.id === weaponId);
  if (!weapon) return null;

  const imgUrl = WEAPON_IMAGES[weaponId];
  const rarityColor = RARITY_COLORS[weapon.rarity];
  const hasSlots = weapon.slots.length > 0;
  const displayMods: EquippedState = attachmentBuild?.slots ?? {};

  return (
    <div className="bg-surface-alt rounded-lg px-2.5 py-2.5 pb-2.5 relative flex flex-col">
      {/* Role label floating above card */}
      <div className="absolute -top-1.5 left-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-text-secondary bg-surface-alt px-1">
        {role}
      </div>

      {/* Row 1: Weapon image + name with inline rarity */}
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
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-text-primary">{weapon.name}</span>
            <span className="text-[0.65rem] font-semibold" style={{ color: rarityColor }}>
              {weapon.rarity}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Attachment gallery (filled and empty placeholders) */}
      {hasSlots && (
        <div className="mt-2">
          <ModGallery
            mods={displayMods}
            allSlots={weapon.slots}
            labelMode="full"
            layout="centered"
            size="advisor"
          />
        </div>
      )}

      {/* Row 3: Bottom-right customize action */}
      {onOpenBuilder && (
        <div className="mt-1.5 flex justify-end">
          <button
            onClick={() => onOpenBuilder(weaponId, attachmentBuild)}
            className="btn-customize px-1.5 py-0.5 rounded text-[0.6rem] font-semibold uppercase tracking-wide text-text-muted cursor-pointer transition-all"
          >
            Customize &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
