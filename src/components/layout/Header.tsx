// ============================================================================
// FILE: components/layout/Header.tsx
// PURPOSE: Sticky top bar with app title, weapon name, and "Change Weapon" button
// USED BY: App.tsx
// NOTE: Weapon name is shown inline on desktop (sm:inline) and below the title on mobile
// ============================================================================

interface HeaderProps {
  hasWeapon: boolean;
  weaponName?: string;
  onReset: () => void;
}

export default function Header({ hasWeapon, weaponName, onReset }: HeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent shrink-0">
            ARC RAIDERS Build Tool
          </h1>
          {hasWeapon && weaponName && (
            <span className="text-sm text-gray-400 font-medium truncate hidden sm:inline">
              {weaponName}
            </span>
          )}
        </div>
        {hasWeapon && (
          <button
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-white transition-colors shrink-0"
          >
            ← Change Weapon
          </button>
        )}
      </div>
      {/* Mobile weapon name - below title */}
      {hasWeapon && weaponName && (
        <div className="sm:hidden max-w-6xl mx-auto px-4 pb-2 -mt-1">
          <span className="text-sm text-gray-400 font-medium">
            {weaponName}
          </span>
        </div>
      )}
    </div>
  );
}
