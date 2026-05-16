// ============================================================================
// FILE: components/looter/HuntBrief.tsx
// PURPOSE: Sticky right-rail recommendation card. Shows "Queue into [map]"
//          with the active condition + per-material hunt list. The runner-up
//          map accordion below it is a Phase 3 PLACEHOLDER for #4 (live
//          map-conditions pipeline). Same for the "switch primary" link and
//          any Looter → Advisor cross-link with map pre-filter.
// ============================================================================

import { ITEMS, itemImgUrl } from "../../data/items";
import type { Bucket, HuntList } from "./types";

interface HuntBriefProps {
  huntList: HuntList;
}

const BUCKET_COLOR: Record<Exclude<Bucket, "skip">, string> = {
  hi: "var(--color-bucket-hi)",
  soon: "var(--color-bucket-soon)",
  evt: "var(--color-bucket-evt)",
};

const BUCKET_ICON: Record<Exclude<Bucket, "skip">, string> = {
  hi: "🔥",
  soon: "⏱",
  evt: "🌱",
};

export default function HuntBrief({ huntList }: HuntBriefProps) {
  const primary = huntList.primaryMap;

  return (
    <div>
      <div className="rounded-lg border bg-surface overflow-hidden mb-4" style={{ borderColor: "var(--color-accent)" }}>
        <div className="px-4 pt-3 pb-2.5 border-b border-border-subtle">
          <div
            className="text-[10px] uppercase tracking-wide font-semibold"
            style={{ color: "var(--color-accent-text)" }}
          >
            Queue into
          </div>
          {primary ? (
            <>
              <div className="text-xl font-semibold flex items-baseline gap-2 flex-wrap my-0.5">
                <span>{primary.name}</span>
                {primary.condition && (
                  <span
                    className="text-xs font-normal px-2 py-0.5 rounded-full border"
                    style={{
                      color: "var(--color-warning)",
                      backgroundColor: "color-mix(in srgb, var(--color-warning) 12%, transparent)",
                      borderColor: "color-mix(in srgb, var(--color-warning) 40%, transparent)",
                    }}
                  >
                    {primary.condition}
                  </span>
                )}
              </div>
              {primary.focusPOIs && primary.focusPOIs.length > 0 && (
                <div className="text-xs text-text-secondary mt-1">
                  Focus on{" "}
                  {primary.focusPOIs.map((poi, i) => (
                    <span key={poi}>
                      <em className="not-italic font-medium text-text-primary">{poi}</em>
                      {i < primary.focusPOIs!.length - 1 ? " and " : ""}
                    </span>
                  ))}{" "}
                  POIs
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-text-muted py-3 italic">
              Map recommendations come with live conditions (#4).
            </div>
          )}
        </div>

        <div className="px-4 pb-3 pt-2">
          <div className="text-[10px] uppercase tracking-wide text-text-muted py-1">
            Hunt list · weighted by bucket (🔥 High &gt; ⏱ Soon &gt; 🌱 Eventual)
          </div>
          {huntList.materials.length === 0 && (
            <div className="text-xs text-text-muted italic py-3">
              Nothing prioritized yet. Promote stages to 🔥 High or ⏱ Soon to populate this list.
            </div>
          )}
          {huntList.materials.map((mat) => {
            const item = ITEMS[mat.itemId];
            return (
              <div key={mat.itemId} className="py-2 border-b border-dashed border-border-subtle last:border-b-0 text-xs">
                <div className="flex items-baseline gap-2.5">
                  {item && (
                    <img
                      src={itemImgUrl(item.img, 100)}
                      alt={item.name}
                      loading="lazy"
                      className="object-contain shrink-0 self-center"
                      style={{ width: 28, height: 28 }}
                    />
                  )}
                  <span className="font-semibold text-[13px]" style={{
                    color: item ? `var(--color-rarity-${item.rarity.toLowerCase()})` : "var(--color-text-primary)"
                  }}>
                    {mat.itemName}
                  </span>
                  <span className="flex-1 border-b border-dotted border-border self-center mx-0.5" />
                  <span className="font-bold text-sm">
                    <span className="text-[11px] font-normal text-text-muted mr-1">need</span>
                    {mat.total}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted mt-1 pl-0.5">
                  {mat.breakdown.map((b, i) => (
                    <span key={i}>
                      <span style={{ color: BUCKET_COLOR[b.bucket] }}>{BUCKET_ICON[b.bucket]}</span>{" "}
                      <span className="text-text-secondary">{b.source}</span> ×{b.qty}
                      {i < mat.breakdown.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Runner-up map accordion — DEFERRED placeholder for #4 ── */}
      <div className="rounded-lg border border-border-subtle bg-surface px-3.5 py-3 mb-4 opacity-70">
        <div className="text-[10px] uppercase tracking-wide text-text-muted mb-1">Runner-up map</div>
        <div className="text-xs text-text-secondary">
          Coming with live conditions (<a
            href="https://github.com/Jagg111/arc-kits/issues/4"
            target="_blank"
            rel="noreferrer"
            className="underline"
            style={{ color: "var(--color-accent-text)" }}
          >#4</a>) — ranked alternative map, trade-off summary, and a "switch primary to X" escape hatch.
        </div>
      </div>

      {/* ── Cross-link to Advisor with map pre-filter — DEFERRED placeholder for #4 ── */}
      <div className="rounded-lg border border-border-subtle bg-surface px-3.5 py-3 opacity-70">
        <div className="text-[10px] uppercase tracking-wide text-text-muted mb-1">Loadout for this map</div>
        <div className="text-xs text-text-secondary">
          "Open Advisor pre-filtered to this map" lands with live conditions (<a
            href="https://github.com/Jagg111/arc-kits/issues/4"
            target="_blank"
            rel="noreferrer"
            className="underline"
            style={{ color: "var(--color-accent-text)" }}
          >#4</a>).
        </div>
      </div>
    </div>
  );
}
