// ============================================================================
// FILE: components/shared/ModGallery.tsx
// PURPOSE: Reusable row of mod icons with abbreviated labels. Renders all
//          weapon slots — filled slots show the mod image + name, empty slots
//          show a dashed placeholder with the slot type label.
// USED BY: BuildCard.tsx (Builder), WeaponBlock.tsx (Advisor)
//
// LAYOUT: Horizontal flex row. Each item is a vertical column (icon on top,
// label below). Icons have a 2px solid rarity-colored border. Sizing adapts
// via the `compact` prop for mobile contexts.
//
// IMAGE SOURCE: Wiki thumbnails from mods.ts tier data — specifically
// MOD_FAMILIES[slot].find(f => f.fam === family).tiers[tier].img
// Falls back to a solid rarity-colored square when no image is available.
// ============================================================================

import { MOD_FAMILIES } from "../../data/mods";
import { RARITY_COLORS, RARITY_LABELS } from "../../data/constants";
import { abbreviateModName } from "../../utils/abbreviate";
import type { Rarity, SlotType, EquippedState } from "../../types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ModGalleryProps {
  /** The build's mod selections keyed by slot name */
  mods: EquippedState;
  /** Full list of the weapon's available slots (so empties can be rendered) */
  allSlots: string[];
  /** Compact sizing for mobile contexts (30px icons, 9px labels) */
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Look up the wiki thumbnail URL for a specific mod tier. */
function getModImage(slot: string, family: string, tier: Rarity): string | undefined {
  const families = MOD_FAMILIES[slot as SlotType];
  if (!families) return undefined;
  const match = families.find((f) => f.fam === family);
  return match?.tiers[tier]?.img;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** A filled slot: mod icon with rarity border + abbreviated label. */
function FilledSlot({
  slot,
  family,
  tier,
  iconSize,
  labelSize,
  compact,
}: {
  slot: string;
  family: string;
  tier: Rarity;
  iconSize: number;
  labelSize: number;
  compact: boolean;
}) {
  const img = getModImage(slot, family, tier);
  const color = RARITY_COLORS[tier];
  const displayName = compact ? abbreviateModName(family) : family;
  const families = MOD_FAMILIES[slot as SlotType];
  const modFamily = families?.find((f) => f.fam === family);
  const isSingleTier = modFamily ? Object.keys(modFamily.tiers).length === 1 : false;
  const label = isSingleTier ? displayName : `${displayName} ${RARITY_LABELS[tier]}`;

  return (
    <div className="flex flex-col items-center min-w-0 flex-1">
      {img ? (
        <img
          src={img}
          alt={`${family} ${tier}`}
          className="rounded object-contain"
          loading="lazy"
          decoding="async"
          style={{
            width: iconSize,
            height: iconSize,
            border: `2px solid ${color}`,
          }}
        />
      ) : (
        /* Fallback: solid rarity-colored square when no image is available */
        <div
          className="rounded"
          style={{
            width: iconSize,
            height: iconSize,
            border: `2px solid ${color}`,
            backgroundColor: `color-mix(in srgb, ${color} 25%, transparent)`,
          }}
        />
      )}
      <span
        className="text-center leading-tight mt-0.5"
        style={{ fontSize: labelSize, color }}
      >
        {label}
      </span>
    </div>
  );
}

/** An empty/unequipped slot: dashed border placeholder with slot type label. */
function EmptySlot({
  slot,
  iconSize,
  labelSize,
}: {
  slot: string;
  iconSize: number;
  labelSize: number;
}) {
  return (
    <div className="flex flex-col items-center min-w-0 flex-1">
      <div
        className="rounded flex items-center justify-center"
        style={{
          width: iconSize,
          height: iconSize,
          border: "2px dashed var(--color-border-subtle)",
        }}
      />
      <span
        className="text-center leading-tight mt-0.5 text-text-faint truncate"
        style={{ fontSize: labelSize }}
      >
        {slot}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ModGallery({ mods, allSlots, compact = false }: ModGalleryProps) {
  const iconSize = compact ? 36 : 48;
  const labelSize = compact ? 10 : 11;

  return (
    <div className="flex items-start gap-1">
      {allSlots.map((slot) => {
        const equipped = mods[slot];
        return equipped ? (
          <FilledSlot
            key={slot}
            slot={slot}
            family={equipped.fam}
            tier={equipped.tier}
            iconSize={iconSize}
            labelSize={labelSize}
            compact={compact}
          />
        ) : (
          <EmptySlot key={slot} slot={slot} iconSize={iconSize} labelSize={labelSize} />
        );
      })}
    </div>
  );
}
