// ============================================================================
// FILE: components/advisor/AdvisorEmptyState.tsx
// PURPOSE: Empty state shown when filter combination yields zero viable pairings
// USED BY: AdvisorPage.tsx
// ============================================================================

export default function AdvisorEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4 opacity-50" style={{ color: "var(--color-warning)" }}>
        &#9888;
      </div>
      <div className="text-lg font-semibold text-text-primary mb-2">
        No pairings match these filters
      </div>
      <div className="text-sm text-text-muted max-w-md leading-relaxed">
        The current combination is too restrictive to produce a solid recommendation. Try broadening
        your search.
      </div>
      <div
        className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-dashed text-xs text-text-muted"
        style={{ borderColor: "color-mix(in srgb, var(--color-warning) 30%, transparent)" }}
      >
        Unlock more rarities or widen your range preference
      </div>
    </div>
  );
}
