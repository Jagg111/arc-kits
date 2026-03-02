// ============================================================================
// FILE: components/builder/WeaponIntel.tsx
// PURPOSE: Weapon-level intel display — weakness, tips, avoids, conditionals
// USED BY: WeaponBuilder.tsx (build list screen)
//
// RENDERING MODES:
//   Desktop (lg+): Always-visible sticky sidebar with callout panels
//   Mobile (<lg):  Collapsible accordion, collapsed by default
//
// Only renders callout panels that have content. If the guide has no
// weakness, tips, avoids, or conditionals, nothing renders.
// ============================================================================

import { useState } from "react";
import type { WeaponGuide } from "../../types";

interface WeaponIntelProps {
  guide: WeaponGuide;
}

// ---------------------------------------------------------------------------
// Callout panel sub-component
// ---------------------------------------------------------------------------

interface CalloutProps {
  title: string;
  icon: string;
  borderColor: string;
  children: React.ReactNode;
}

/** A styled callout card with colored left border, icon, and title. */
function Callout({ title, icon, borderColor, children }: CalloutProps) {
  return (
    <div
      className="bg-surface rounded-lg p-3"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Intel content (shared between desktop & mobile)
// ---------------------------------------------------------------------------

function IntelPanels({ guide }: WeaponIntelProps) {
  return (
    <div className="space-y-2">
      {/* Weakness */}
      {guide.weakness && (
        <Callout title="Known Weakness" icon="⚠️" borderColor="var(--color-accent)">
          <p className="text-sm text-text-secondary leading-relaxed">
            {guide.weakness}
          </p>
        </Callout>
      )}

      {/* Tips */}
      {guide.tips.length > 0 && (
        <Callout title="Tips" icon="💡" borderColor="var(--color-accent)">
          <ul className="space-y-1.5">
            {guide.tips.map((tip, i) => (
              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                <span className="text-text-faint shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Callout>
      )}

      {/* Avoid */}
      {guide.avoid.length > 0 && (
        <Callout title="Avoid" icon="🚫" borderColor="var(--color-danger-text)">
          <div className="space-y-1.5">
            {guide.avoid.map((entry, i) => (
              <p key={i} className="text-sm text-text-secondary leading-relaxed">
                <span className="font-semibold text-text-primary">{entry.mod}</span>
                {" — "}
                {entry.reason}
              </p>
            ))}
          </div>
        </Callout>
      )}

      {/* Conditionals */}
      {guide.conditionals.length > 0 && (
        <Callout title="Conditional" icon="ℹ️" borderColor="var(--color-warning)">
          <div className="space-y-1.5">
            {guide.conditionals.map((entry, i) => (
              <p key={i} className="text-sm text-text-secondary leading-relaxed">
                <span className="font-semibold text-text-primary">{entry.mod}</span>
                {" — "}
                {entry.note}
              </p>
            ))}
          </div>
        </Callout>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Count how many intel items exist (for the mobile badge)
// ---------------------------------------------------------------------------

function countIntelItems(guide: WeaponGuide): number {
  let count = 0;
  if (guide.weakness) count++;
  count += guide.tips.length;
  count += guide.avoid.length;
  count += guide.conditionals.length;
  return count;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function WeaponIntel({ guide }: WeaponIntelProps) {
  const [expanded, setExpanded] = useState(false);
  const total = countIntelItems(guide);

  // Nothing to show — skip rendering entirely
  if (total === 0) return null;

  return (
    <>
      {/* Desktop: always-visible sticky sidebar */}
      <aside className="hidden lg:block space-y-2">
        <h3 className="text-[12px] font-bold uppercase tracking-wide text-text-muted mb-2">
          Weapon Intel
        </h3>
        <IntelPanels guide={guide} />
      </aside>

      {/* Mobile: collapsible accordion */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between bg-surface-alt rounded-lg px-4 py-3 border border-border-subtle"
        >
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-text-muted">
              Weapon Intel
            </span>
            <span className="text-[10px] font-bold bg-surface rounded px-1.5 py-0.5 text-text-secondary">
              {total}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <div className="mt-2">
            <IntelPanels guide={guide} />
          </div>
        )}
      </div>
    </>
  );
}
