// ============================================================================
// FILE: components/builder/ModDrawer.tsx
// PURPOSE: Slide-in drawer for selecting a mod for a specific slot
// USED BY: WeaponBuilder.tsx (opened when user clicks an AttachmentSlot)
//
// ANIMATION: Uses a two-step approach for the slide-in:
//   1. Component mounts with `isOpen = false` (drawer is off-screen via translate-x-full)
//   2. `requestAnimationFrame` sets `isOpen = true` on next frame (triggers CSS transition)
//   3. On close, sets `isOpen = false` first, then removes component after 300ms delay
//
// SCROLL LOCK: Sets `document.body.style.overflow = "hidden"` to prevent background scrolling
// while the drawer is open. Restored on unmount via the useEffect cleanup function.
// ============================================================================

import { useState, useEffect, useRef } from "react";
import type { SlotType, Rarity, ModFamily, EquippedMod } from "../../types";
import { MOD_FAMILIES } from "../../data/mods";
import ModFamilySection from "./ModFamilySection";

interface ModDrawerProps {
  slot: SlotType;
  weaponId: string;
  equippedMod?: EquippedMod;
  onEquip: (slot: string, fam: string, tier: Rarity) => void;
  onClose: () => void;
}

export default function ModDrawer({ slot, weaponId, equippedMod, onEquip, onClose }: ModDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const families = (MOD_FAMILIES[slot] ?? []).filter((f: ModFamily) =>
    f.w.includes(weaponId),
  );

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
    document.body.style.overflow = "hidden";

    // After slide-in animation completes, scroll to equipped mod's family section
    const scrollTimer = equippedMod
      ? setTimeout(() => {
          const target = scrollRef.current?.querySelector(
            `[data-mod-family="${equippedMod.fam}"]`,
          );
          target?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 350)
      : undefined;

    return () => {
      document.body.style.overflow = "";
      clearTimeout(scrollTimer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const handleSelect = (fam: string, tier: Rarity) => {
    onEquip(slot, fam, tier);
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-backdrop transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`absolute inset-y-0 right-0 w-full lg:w-[440px] bg-surface border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h3 className="font-bold text-lg text-text-primary">{slot}</h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
          {families.map((fam: ModFamily) => (
            <ModFamilySection
              key={fam.fam}
              mod={fam}
              equippedTier={fam.fam === equippedMod?.fam ? equippedMod.tier : undefined}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
