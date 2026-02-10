interface HeaderProps {
  hasWeapon: boolean;
  onReset: () => void;
}

export default function Header({ hasWeapon, onReset }: HeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          ARC RAIDERS Build Tool
        </h1>
        {hasWeapon && (
          <button
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Change Weapon
          </button>
        )}
      </div>
    </div>
  );
}
