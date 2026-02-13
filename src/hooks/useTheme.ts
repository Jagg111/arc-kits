// ============================================================================
// FILE: hooks/useTheme.ts
// PURPOSE: Theme state management — dark/light mode toggle with OS preference
//          detection and localStorage persistence
// USED BY: App.tsx (consumed at root, theme/toggleTheme passed to Header)
//
// On first visit, the theme defaults to the user's OS color-scheme preference.
// Once the user manually toggles, their choice is stored in localStorage and
// takes precedence on subsequent visits.
//
// The hook sets a `data-theme` attribute on <html> so CSS custom properties
// defined in index.css can switch between dark and light palettes.
// ============================================================================

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "arckit-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage for a previously persisted preference
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;

    // Fall back to the operating system's color-scheme preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Sync the data-theme attribute and localStorage whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, toggleTheme } as const;
}
