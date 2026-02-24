// ============================================================================
// FILE: components/advisor/AdvisorResults.tsx
// PURPOSE: Results header + 3-column grid of pairing cards
// USED BY: AdvisorPage.tsx
// ============================================================================

import type { PairRecommendation } from "../../types";
import PairingCard from "./PairingCard";

interface AdvisorResultsProps {
  recommendations: PairRecommendation[];
  contextLine: string;
  onOpenBuilder?: (weaponId: string) => void;
}

export default function AdvisorResults({ recommendations, contextLine, onOpenBuilder }: AdvisorResultsProps) {
  return (
    <div>
      {/* Results header with context echo */}
      <div className="flex items-baseline gap-2 py-1 mb-2.5">
        <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-text-muted">
          Recommendations
        </span>
        <span className="text-xs text-text-faint">&mdash; {contextLine}</span>
      </div>

      {/* 3-column grid on desktop, single column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:max-w-none max-w-md mx-auto md:mx-0">
        {recommendations.map((rec) => (
          <PairingCard key={rec.pairKey} recommendation={rec} onOpenBuilder={onOpenBuilder} />
        ))}
      </div>
    </div>
  );
}
