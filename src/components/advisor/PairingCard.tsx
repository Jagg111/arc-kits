// ============================================================================
// FILE: components/advisor/PairingCard.tsx
// PURPOSE: Single weapon pairing recommendation card with tier badge, weapon blocks, and synergy tags
// USED BY: AdvisorResults.tsx
// ============================================================================

import type { PairRecommendation, GuideBuild } from "../../types";
import WeaponBlock from "./WeaponBlock";
import SynergyTagList from "./SynergyTagList";

interface PairingCardProps {
  recommendation: PairRecommendation;
  /** (weaponId, optional build for deep link). Passed through to WeaponBlock. */
  onOpenBuilder?: (weaponId: string, build?: GuideBuild | null) => void;
  /** Pre-computed best attachment build per weaponId (null = no guide data). */
  buildsByWeapon?: Record<string, GuideBuild | null>;
}

export default function PairingCard({ recommendation, onOpenBuilder, buildsByWeapon }: PairingCardProps) {
  const isTopPick = recommendation.tier === "top_pick";

  return (
    <div
      className={`bg-surface border rounded-xl overflow-hidden flex flex-col ${
        isTopPick
          ? "border-border-subtle border-t-2 border-t-accent"
          : "border-border-subtle border-t-2"
      }`}
      style={
        isTopPick
          ? { background: "linear-gradient(180deg, color-mix(in srgb, var(--color-accent) 4%, transparent) 0%, var(--color-surface) 40%)" }
          : undefined
      }
    >
      {/* Tier badge header */}
      <div className="flex items-center px-3 py-2 border-b border-border-subtle">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide"
          style={{
            backgroundColor: isTopPick
              ? "color-mix(in srgb, var(--color-accent) 15%, transparent)"
              : "color-mix(in srgb, var(--color-text-muted) 8%, transparent)",
            color: isTopPick ? "var(--color-accent-text)" : "var(--color-text-muted)",
          }}
        >
          {isTopPick ? "Top Pick" : "Strong Option"}
        </span>
      </div>

      {/* Weapon blocks + synergy */}
      <div className="p-2.5 flex flex-col gap-2.5 flex-1">
        <WeaponBlock
          weaponId={recommendation.primaryWeaponId}
          role="Primary"
          onOpenBuilder={onOpenBuilder}
          attachmentBuild={buildsByWeapon?.[recommendation.primaryWeaponId] ?? undefined}
        />
        <WeaponBlock
          weaponId={recommendation.secondaryWeaponId}
          role="Secondary"
          onOpenBuilder={onOpenBuilder}
          attachmentBuild={buildsByWeapon?.[recommendation.secondaryWeaponId] ?? undefined}
        />
        <SynergyTagList tags={recommendation.synergyTags} />
      </div>
    </div>
  );
}
