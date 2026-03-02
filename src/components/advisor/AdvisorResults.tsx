// ============================================================================
// FILE: components/advisor/AdvisorResults.tsx
// PURPOSE: Results header + 3-column grid of pairing cards
// USED BY: AdvisorPage.tsx
// ============================================================================

import type { PairRecommendation, GuideBuild } from "../../types";
import PairingCard from "./PairingCard";

interface AdvisorResultsProps {
  recommendations: PairRecommendation[];
  /** (weaponId, optional recommended build for deep link). When build is provided, Builder opens with those attachments and URL is encoded. */
  onOpenBuilder?: (weaponId: string, build?: GuideBuild | null) => void;
  /** Pre-computed best attachment build per weaponId (null = no guide data). */
  buildsByWeapon?: Record<string, GuideBuild | null>;
}

export default function AdvisorResults({ recommendations, onOpenBuilder, buildsByWeapon }: AdvisorResultsProps) {
  return (
    <div>
      {/* 3-column grid on desktop, single column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:max-w-none max-w-md mx-auto md:mx-0">
        {recommendations.map((rec) => (
          <PairingCard key={rec.pairKey} recommendation={rec} onOpenBuilder={onOpenBuilder} buildsByWeapon={buildsByWeapon} />
        ))}
      </div>
    </div>
  );
}
