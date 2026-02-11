interface HeaderProps {
  hasWeapon: boolean;
  weaponName?: string;
  buildProgress?: string;
  onReset: () => void;
}

export default function Header({ hasWeapon, weaponName, buildProgress, onReset }: HeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent shrink-0">
            ARC RAIDERS Build Tool
          </h1>
          {hasWeapon && weaponName && (
            <span className="text-sm text-gray-400 font-medium truncate hidden sm:inline">
              {weaponName}{buildProgress ? ` — ${buildProgress}` : ""}
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
            {weaponName}{buildProgress ? ` — ${buildProgress}` : ""}
          </span>
        </div>
      )}
    </div>
  );
}
