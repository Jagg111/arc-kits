// ============================================================================
// FILE: components/shared/Badge.tsx
// PURPOSE: Reusable colored label pill used for weapon class, ammo type, rarity, grades
// USED BY: WeaponHeader.tsx
//
// COLOR PATTERN: Uses color-mix() for a ~13% opacity tinted background while using
// the full color for the text. Colors are CSS custom properties that adapt per theme.
// ============================================================================

interface BadgeProps {
  label: string;
  color: string;
}

export default function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="text-xs px-2 py-1 rounded"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 13%, transparent)`, color }}
    >
      {label}
    </span>
  );
}
