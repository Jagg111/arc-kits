// ============================================================================
// FILE: components/advisor/WeaponBlock.tsx
// PURPOSE: Displays a single weapon within a pairing card — image, name with
//          inline rarity, "Customize →" button, and recommended attachment gallery.
// USED BY: PairingCard.tsx
//
// LAYOUT (per plan Step 12):
// - Row 1: Weapon image + name column (name + inline rarity text on same baseline)
// - Row 2: "Customize →" button as sole meta row element
// - Row 3: ModGallery showing the recommended build's attachments (or italic
//          "No attachment guide" when no guide data exists for the weapon)
// ============================================================================

import { WEAPONS } from "../../data/weapons";
import { RARITY_COLORS, WEAPON_IMAGES } from "../../data/constants";
import ModGallery from "../shared/ModGallery";
import type { GuideBuild } from "../../types";

interface WeaponBlockProps {
  weaponId: string;
  role: "Primary" | "Secondary";
  /** When provided, "Customize →" opens Builder with this build pre-equipped and URL encoded. */
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

  return (
    <div className="bg-surface-alt rounded-lg px-2.5 py-2.5 pb-3 relative">
      {/* Role label floating above card */}
      <div className="absolute -top-1.5 left-2.5 text-[0.52rem] uppercase tracking-wider text-text-muted bg-surface-alt px-1">
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
          {/* Name + rarity on same baseline */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-text-primary">{weapon.name}</span>
            <span className="text-[0.65rem] font-semibold" style={{ color: rarityColor }}>
              {weapon.rarity}
            </span>
          </div>

          {/* Row 2: "Customize →" button */}
          {onOpenBuilder && (
            <div className="mt-1">
              <button
                onClick={() => onOpenBuilder(weaponId, attachmentBuild)}
                className="btn-customize px-1.5 py-0.5 rounded text-[0.6rem] font-semibold uppercase tracking-wide text-text-muted cursor-pointer transition-all"
              >
                Customize &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Attachment gallery or no-guide message */}
      {hasSlots && (
        <div className="mt-2">
          {attachmentBuild ? (
            <ModGallery
              mods={attachmentBuild.slots}
              allSlots={weapon.slots}
              compact
            />
          ) : (
            <span className="text-[0.7rem] italic text-text-faint">
              No attachment guide
            </span>
          )}
        </div>
      )}
    </div>
  );
}
