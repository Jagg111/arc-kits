// ============================================================================
// FILE: components/shared/Badge.tsx
// PURPOSE: Reusable colored label pill used for weapon class, ammo type, rarity, grades
// USED BY: WeaponHeader.tsx
//
// COLOR PATTERN: Uses `color + "22"` for the background — "22" is a hex alpha value
// (~13% opacity) appended to the hex color string. This creates a subtle tinted background
// while using the full color for the text. Example: "#3b82f6" + "22" = "#3b82f622"
// ============================================================================

interface BadgeProps {
  label: string;
  color: string;
}

export default function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="text-xs px-2 py-1 rounded"
      style={{ backgroundColor: color + "22", color }}
    >
      {label}
    </span>
  );
}
