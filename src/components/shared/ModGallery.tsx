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
import { RARITY_COLORS, RARITY_LABELS, SLOT_ICONS } from "../../data/constants";
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
  /** How mod labels should be rendered. */
  labelMode?: "abbrev" | "full";
  /** Slot row layout mode. */
  layout?: "stretch" | "centered";
  /** Size profile for icon and label scale. */
  size?: "default" | "compact" | "advisor";
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
  iconClass,
  labelClass,
  labelMode,
  slotClassName,
}: {
  slot: string;
  family: string;
  tier: Rarity;
  iconClass: string;
  labelClass: string;
  labelMode: "abbrev" | "full";
  slotClassName: string;
}) {
  const img = getModImage(slot, family, tier);
  const color = RARITY_COLORS[tier];
  const displayName = labelMode === "abbrev" ? abbreviateModName(family) : family;
  const families = MOD_FAMILIES[slot as SlotType];
  const modFamily = families?.find((f) => f.fam === family);
  const isSingleTier = modFamily ? Object.keys(modFamily.tiers).length === 1 : false;
  const label = isSingleTier ? displayName : `${displayName} ${RARITY_LABELS[tier]}`;

  return (
    <div className={slotClassName}>
      {img ? (
        <img
          src={img}
          alt={`${family} ${tier}`}
          className={`rounded object-contain ${iconClass}`}
          loading="lazy"
          decoding="async"
          style={{
            border: `2px solid ${color}`,
          }}
        />
      ) : (
        /* Fallback: solid rarity-colored square when no image is available */
        <div
          className={`rounded ${iconClass}`}
          style={{
            border: `2px solid ${color}`,
            backgroundColor: `color-mix(in srgb, ${color} 25%, transparent)`,
          }}
        />
      )}
      <span
        className={`text-center leading-tight mt-0.5 ${labelClass}`}
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

/** An empty/unequipped slot: dashed border placeholder with slot type label. */
function EmptySlot({
  slot,
  iconClass,
  labelClass,
  slotClassName,
  iconInnerClass,
  labelMode,
}: {
  slot: string;
  iconClass: string;
  labelClass: string;
  slotClassName: string;
  iconInnerClass: string;
  labelMode: "abbrev" | "full";
}) {
  const slotLabel = labelMode === "abbrev" ? abbreviateModName(slot) : slot;

  return (
    <div className={slotClassName}>
      <div
        className={`rounded flex items-center justify-center ${iconClass}`}
        style={{
          border: "2px dashed var(--color-border-subtle)",
        }}
      >
        <img
          src={SLOT_ICONS[slot as SlotType]}
          alt={slot}
          loading="lazy"
          decoding="async"
          className={`object-contain opacity-30 ${iconInnerClass}`}
        />
      </div>
      <span
        className={`text-center leading-tight mt-0.5 text-text-faint ${labelClass}`}
      >
        {slotLabel}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ModGallery({
  mods,
  allSlots,
  compact = false,
  labelMode = "abbrev",
  layout = "stretch",
  size,
}: ModGalleryProps) {
  const resolvedSize = size ?? (compact ? "compact" : "default");
  const rowClassName =
    layout === "centered"
      ? "flex items-start justify-center gap-3 sm:gap-3.5 flex-wrap"
      : "flex items-start gap-1";
  const slotClassName =
    layout === "centered"
      ? "flex flex-col items-center min-w-0 shrink-0 w-[4.25rem]"
      : "flex flex-col items-center min-w-0 flex-1";

  const iconClass =
    resolvedSize === "advisor"
      ? "w-11 h-11 sm:w-14 sm:h-14"
      : resolvedSize === "compact"
        ? "w-9 h-9"
        : "w-12 h-12";
  const iconInnerClass =
    resolvedSize === "advisor"
      ? "w-[60%] h-[60%]"
      : resolvedSize === "compact"
        ? "w-[60%] h-[60%]"
        : "w-[60%] h-[60%]";
  const labelClass =
    resolvedSize === "advisor"
      ? "text-[11px]"
      : resolvedSize === "compact"
        ? "text-[10px]"
        : "text-[11px]";

  return (
    <div className={rowClassName}>
      {allSlots.map((slot) => {
        const equipped = mods[slot];
        return equipped ? (
          <FilledSlot
            key={slot}
            slot={slot}
            family={equipped.fam}
            tier={equipped.tier}
            iconClass={iconClass}
            labelClass={labelClass}
            labelMode={labelMode}
            slotClassName={slotClassName}
          />
        ) : (
          <EmptySlot
            key={slot}
            slot={slot}
            iconClass={iconClass}
            labelClass={labelClass}
            slotClassName={slotClassName}
            iconInnerClass={iconInnerClass}
            labelMode={labelMode}
          />
        );
      })}
    </div>
  );
}
