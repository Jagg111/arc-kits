// ============================================================================
// FILE: components/advisor/AdvisorOnboarding.tsx
// PURPOSE: Initial idle state shown before the user selects a location
// USED BY: AdvisorPage.tsx
// ============================================================================

export default function AdvisorOnboarding() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4 opacity-40">&#9965;</div>
      <div className="text-lg font-semibold text-text-primary mb-2">Choose your map</div>
      <div className="text-sm text-text-muted max-w-md leading-relaxed">
        Select a location above and the advisor will recommend weapon pairings tailored to your
        preferences.
      </div>
      <div className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-dashed border-border text-xs text-text-muted">
        <span className="text-accent-text text-sm">&uarr;</span>
        Choose a location to get started
      </div>
    </div>
  );
}
