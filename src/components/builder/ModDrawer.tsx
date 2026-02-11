import { useState, useEffect } from "react";
import type { SlotType, Rarity, ModFamily } from "../../types";
import { MOD_FAMILIES } from "../../data/mods";
import ModFamilyAccordion from "./ModFamilyAccordion";

interface ModDrawerProps {
  slot: SlotType;
  weaponId: string;
  onEquip: (slot: string, fam: string, tier: Rarity) => void;
  onClose: () => void;
}

export default function ModDrawer({ slot, weaponId, onEquip, onClose }: ModDrawerProps) {
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const families = (MOD_FAMILIES[slot] ?? []).filter((f: ModFamily) =>
    f.w.includes(weaponId),
  );

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
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
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`absolute inset-y-0 right-0 w-full lg:w-[440px] bg-gray-900 border-l border-gray-700 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 shrink-0">
          <h3 className="font-bold text-lg text-white">{slot}</h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {families.map((fam: ModFamily) => (
            <ModFamilyAccordion
              key={fam.fam}
              mod={fam}
              isExpanded={expandedFamily === fam.fam}
              onToggle={() =>
                setExpandedFamily((prev) => (prev === fam.fam ? null : fam.fam))
              }
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
