// ============================================================================
// FILE: components/builder/WeaponBuilder.tsx
// PURPOSE: Main builder screen — build list (guide builds) or customizer (slot grid)
// USED BY: App.tsx (shown when a weapon is selected)
//
// RENDERING STATES:
//   1. No slots (e.g. Jupiter, Equalizer) — "No Attachment Slots" message
//   2. Has slots but no guide (e.g. Hairpin) — "No attachment guide" lockdown
//   3. Has guide + showBuildList — build list (suggested builds + Build Manually link)
//   4. Has guide + !showBuildList — full customizer (slot grid, sidebar, ModDrawer)
//
// BUILD LIST LAYOUT:
//   Desktop (lg+): 2-column grid (1fr 280px) — build cards left, intel sidebar right
//   Mobile (<lg):  Single column — intel accordion (collapsed) above build cards
//
// Local state: showBuildList (true = list of builds, false = slot editor).
// No persistent "active build" — applying a build just sets equipped state.
// ============================================================================

import { useState, useEffect } from "react";
import type { Weapon, EquippedState, SlotType, Rarity, CumulativeEffect, WeaponGuide } from "../../types";
import { MATERIAL_INFO, RARITY_COLORS } from "../../data/constants";
import WeaponHeader from "./WeaponHeader";
import BuildCard from "./BuildCard";
import WeaponIntel from "./WeaponIntel";
import AttachmentSlot from "./AttachmentSlot";
import ModDrawer from "./ModDrawer";
import StatsSummaryBar from "./StatsSummaryBar";

interface WeaponBuilderProps {
  weapon: Weapon;
  guide: WeaponGuide | null;
  equipped: EquippedState;
  buildCost: Record<string, number>;
  cumulativeEffects: CumulativeEffect[];
  onApplyGuideBuild: (buildIndex: number) => void;
  onEquip: (slot: string, fam: string, tier: Rarity) => void;
  onRemove: (slot: string) => void;
  onClearAll: () => void;
  onBackToBuilds: () => void;
}

export default function WeaponBuilder({
  weapon,
  guide,
  equipped,
  buildCost,
  cumulativeEffects,
  onApplyGuideBuild,
  onEquip,
  onRemove,
  onClearAll,
  onBackToBuilds,
}: WeaponBuilderProps) {
  const [activeSlot, setActiveSlot] = useState<SlotType | null>(null);
  /** When true, show build list; when false, show slot grid (customizer). */
  const [showBuildList, setShowBuildList] = useState(true);

  const hasEquipped = Object.keys(equipped).length > 0;
  const hasCost = Object.keys(buildCost).length > 0;
  const totalSlots = weapon.slots.length;

  // When URL or external state loads with mods already equipped, show customizer
  useEffect(() => {
    if (guide && hasEquipped) setShowBuildList(false);
  }, [guide, hasEquipped]);

  // -- Handlers ---------------------------------------------------------------

  const handleSelectBuild = (buildIndex: number) => {
    onApplyGuideBuild(buildIndex);
    setShowBuildList(false);
  };

  const handleBuildManually = () => {
    setShowBuildList(false);
  };

  const handleBackToBuilds = () => {
    onBackToBuilds();
    setShowBuildList(true);
  };

  const handleClearAll = () => {
    onClearAll();
    // Stay in customizer with empty slots; "Back to builds" returns to list
  };

  const showBuildListView = guide && showBuildList;

  return (
    <div className="space-y-6">
      <WeaponHeader weapon={weapon} />

      {/* STATE 1: No attachment slots */}
      {totalSlots === 0 ? (
        <div className="bg-surface rounded-xl border border-border-subtle p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-xl text-text-secondary font-semibold mb-2">
            No Attachment Slots
          </p>
          <p className="text-sm text-text-muted">
            This weapon cannot be modified
          </p>
        </div>

      /* STATE 2: Has slots but no guide */
      ) : !guide ? (
        <div className="bg-surface rounded-xl border border-border-subtle p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-xl text-text-secondary font-semibold mb-2">
            No attachment guide
          </p>
          <p className="text-sm text-text-muted">
            This weapon has no curated builds. You can still build manually from the weapon picker.
          </p>
        </div>

      /* STATE 3: Build list screen */
      ) : showBuildListView ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Left column: build list header + build cards */}
          <div className="space-y-4">
            {/* Mobile intel accordion (above cards on small screens) */}
            <div className="lg:hidden">
              <WeaponIntel weapon={weapon} guide={guide} />
            </div>

            {/* Build list header */}
            <div>
              <span className="text-[14px] font-bold uppercase text-text-muted tracking-wide">
                Suggested Attachments
              </span>
              <p className="text-[12px] text-text-muted mt-0.5">
                Select a set to enter builder, or{" "}
                <button
                  type="button"
                  onClick={handleBuildManually}
                  className="text-accent-text hover:text-accent-hover font-medium underline"
                >
                  build manually
                </button>
              </p>
            </div>

            {/* Build cards */}
            <div className="space-y-2">
              {guide.builds.map((build, i) => (
                <BuildCard
                  key={i}
                  index={i + 1}
                  build={build}
                  allSlots={weapon.slots}
                  onSelect={() => handleSelectBuild(i)}
                />
              ))}
            </div>
          </div>

          {/* Right column: desktop intel sidebar (sticky) */}
          <div className="hidden lg:block lg:sticky lg:top-[76px] lg:self-start">
            <WeaponIntel weapon={weapon} guide={guide} />
          </div>
        </div>

      /* STATE 4: Full builder/customizer screen */
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar — "Back to builds" + effects + cost + clear */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 lg:sticky lg:top-28 lg:self-start">
            {/* Back to builds */}
            <div className="bg-surface rounded-xl border border-border-subtle p-4">
              <button
                onClick={handleBackToBuilds}
                className="w-full text-left text-sm text-accent-text hover:text-accent-hover font-semibold transition-colors"
              >
                ← Back to builds
              </button>
            </div>

            {/* Cumulative Effects */}
            {cumulativeEffects.length > 0 && (
              <div className="bg-surface rounded-xl border border-border-subtle p-4">
                <h4 className="text-sm text-text-secondary font-semibold mb-3">
                  Cumulative Effects
                </h4>
                <div className="space-y-3">
                  {cumulativeEffects.map((effect) => (
                    <div key={effect.stat} className="bg-surface-alt rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-text-primary">
                          {effect.stat}
                        </span>
                        <span className="text-sm font-bold text-accent-text">
                          {effect.unit === "%"
                            ? `${effect.total}%`
                            : `+${effect.total}`}
                        </span>
                      </div>
                      {effect.mods.length > 1 && (
                        <div className="space-y-1">
                          {effect.mods.map((mod, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs text-text-secondary"
                            >
                              <span>{mod.name}</span>
                              <span>{mod.effect}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cost Breakdown */}
            {hasCost && (
              <div className="bg-surface rounded-xl border border-border-subtle p-4">
                <h4 className="text-sm text-text-secondary font-semibold mb-3">
                  Total Cost
                </h4>
                <div className="space-y-2">
                  {Object.entries(buildCost).map(([item, qty]) => {
                    const info = MATERIAL_INFO[item];
                    const color = info ? RARITY_COLORS[info.rarity] : "#9ca3af";
                    return (
                      <div
                        key={item}
                        className="flex items-center justify-between text-sm bg-surface-alt rounded-lg px-3 py-2"
                      >
                        <span className="flex items-center gap-2 text-text-secondary">
                          {info?.img && (
                            <img src={info.img} alt={item} loading="lazy" className="w-5 h-5 object-contain" />
                          )}
                          {item}
                        </span>
                        <span className="font-bold" style={{ color }}>{qty}x</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clear All */}
            {hasEquipped && (
              <button
                onClick={handleClearAll}
                className="w-full px-4 py-3 rounded-lg bg-danger-bg hover:bg-danger-bg-hover text-danger-text font-semibold transition-colors"
              >
                Clear All Attachments
              </button>
            )}
          </div>

          {/* Attachment Slots */}
          <div className="lg:col-span-2 space-y-4">
            {/* Back to builds — mobile */}
            <div className="lg:hidden">
              <button
                onClick={handleBackToBuilds}
                className="text-sm text-accent-text hover:text-accent-hover font-semibold"
              >
                ← Back to builds
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weapon.slots.map((slot) => (
                <AttachmentSlot
                  key={slot}
                  slot={slot as SlotType}
                  weaponId={weapon.id}
                  equipped={equipped[slot]}
                  onEquip={onEquip}
                  onRemove={onRemove}
                  onOpenDrawer={setActiveSlot}
                />
              ))}
            </div>

            {hasEquipped && (
              <button
                onClick={handleClearAll}
                className="lg:hidden w-full px-4 py-3 rounded-lg bg-danger-bg hover:bg-danger-bg-hover text-danger-text font-semibold transition-colors"
              >
                Clear All Attachments
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Stats Summary Bar — only in customizer, not build list */}
      {!showBuildListView && (
        <StatsSummaryBar
          totalSlots={totalSlots}
          buildCost={buildCost}
          cumulativeEffects={cumulativeEffects}
          hasEquipped={hasEquipped}
          onClearAll={handleClearAll}
        />
      )}

      {activeSlot && (
        <ModDrawer
          slot={activeSlot}
          weaponId={weapon.id}
          equippedMod={equipped[activeSlot]}
          avoid={guide?.avoid}
          onEquip={onEquip}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  );
}
