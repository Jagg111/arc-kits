// ============================================================================
// FILE: components/layout/Header.tsx
// PURPOSE: Sticky top bar with app title, Weapons/Advisor tabs, weapon name,
//          "Change Weapon" button, and dark/light mode toggle
// USED BY: App.tsx
// ============================================================================

import type { AppView } from "../../types";

interface HeaderProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  hasWeapon: boolean;
  weaponName?: string;
  onReset: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const tabClass = (active: boolean) =>
  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
    active ? "bg-border text-text-primary" : "text-text-secondary hover:text-text-primary"
  }`;

export default function Header({
  activeView,
  onChangeView,
  hasWeapon,
  weaponName,
  onReset,
  theme,
  toggleTheme,
}: HeaderProps) {
  const showWeaponControls = activeView === "weapons";

  return (
    <div className="border-b border-border-subtle bg-surface/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-[80rem] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent shrink-0">
            ARC RAIDERS Build Tool
          </h1>

          {/* Tab switcher */}
          <div className="flex bg-surface-alt rounded-lg p-0.5">
            <button className={tabClass(activeView === "weapons")} onClick={() => onChangeView("weapons")}>
              Weapons
            </button>
            <button className={tabClass(activeView === "advisor")} onClick={() => onChangeView("advisor")}>
              Advisor
            </button>
          </div>

          {showWeaponControls && hasWeapon && weaponName && (
            <span className="text-sm text-text-secondary font-medium truncate hidden sm:inline">
              {weaponName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Dark / light mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {showWeaponControls && hasWeapon && (
            <button
              onClick={onReset}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Change Weapon
            </button>
          )}
        </div>
      </div>
      {/* Mobile weapon name - below title */}
      {showWeaponControls && hasWeapon && weaponName && (
        <div className="sm:hidden max-w-[80rem] mx-auto px-4 pb-2 -mt-1">
          <span className="text-sm text-text-secondary font-medium">
            {weaponName}
          </span>
        </div>
      )}
    </div>
  );
}
