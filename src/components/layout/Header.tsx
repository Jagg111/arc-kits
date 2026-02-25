// ============================================================================
// FILE: components/layout/Header.tsx
// PURPOSE: Sticky top bar with app title, Weapons/Advisor tabs, and theme toggle.
//          When a weapon is selected, the Weapons tab transforms into a back-nav
//          link (‹ Weapons) that returns to the weapon picker.
// USED BY: App.tsx
// ============================================================================

import type { AppView } from "../../types";

interface HeaderProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  hasWeapon: boolean;
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
  onReset,
  theme,
  toggleTheme,
}: HeaderProps) {
  const isWeaponBuilder = activeView === "weapons" && hasWeapon;

  const themeButton = (
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
  );

  const tabs = (
    <div className="flex bg-surface-alt rounded-lg p-0.5">
      {isWeaponBuilder ? (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-border text-accent-text transition-colors cursor-pointer"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Weapons
        </button>
      ) : (
        <button className={tabClass(activeView === "weapons")} onClick={() => onChangeView("weapons")}>
          Weapons
        </button>
      )}
      <button className={tabClass(activeView === "advisor")} onClick={() => onChangeView("advisor")}>
        Advisor
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border-subtle bg-surface/80 backdrop-blur-md">
      {/* ── Desktop View ── */}
      <div className="hidden sm:block max-w-[80rem] mx-auto">
        <div className="flex px-4 h-14 items-center gap-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent shrink-0">
            ARC RAIDERS
          </h1>
          {tabs}
          <div className="ml-auto flex items-center gap-2">
            {themeButton}
          </div>
        </div>
      </div>

      {/* ── Mobile View ── */}
      <div className="sm:hidden flex flex-col">
        <div className="flex items-center justify-between px-4 h-12 border-b border-border-subtle/30">
          <h1 className="text-lg font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
            ARC RAIDERS
          </h1>
          {themeButton}
        </div>
        <div className="flex items-center px-4 h-11 bg-surface-alt/10">
          {tabs}
        </div>
      </div>
    </header>
  );
}
