// ============================================================================
// FILE: src/looter/engine/drop-pois.ts
// PURPOSE: Per-item drop-POI derivation. Translates an ItemId → list of named
//          POIs across all maps where the item's category plausibly drops,
//          using the ZoneCategory → ItemCategory bridge from loot_zones.ts.
//
// This is the Phase 4 implementation of the previously-unused `dropPOIs` slot
// on HuntListLine. The map-ranker (#4) will produce a sharper per-map version;
// this one is map-agnostic and shows the player "where in the world this drops"
// regardless of today's rotation.
// ============================================================================

import { ITEMS } from "../../data/items";
import type { ItemCategory } from "../../data/items";
import {
  LOOT_ZONES,
  ZONE_CATEGORY_TO_ITEM_CATEGORIES,
  type LootZone,
  type ZoneCategory,
} from "../../data/loot_zones";

const ZONE_CATS_BY_ITEM_CATEGORY: Record<ItemCategory, ZoneCategory[]> = (() => {
  const out = {} as Record<ItemCategory, ZoneCategory[]>;
  for (const [zc, itemCats] of Object.entries(ZONE_CATEGORY_TO_ITEM_CATEGORIES) as [
    ZoneCategory,
    ItemCategory[],
  ][]) {
    for (const ic of itemCats) {
      (out[ic] ??= []).push(zc);
    }
  }
  return out;
})();

/**
 * Return up to `cap` distinct POI names where the item's category plausibly
 * drops. Names are deduped across maps (same name on two maps counts once).
 *
 * Order: zones that match more of the item's eligible zone-categories first,
 * then alphabetical for stability. Determinism matters — Phase 4 has no
 * golden test matrix yet, but the CLI relies on stable output.
 */
export function dropPOIsForItem(itemId: string, cap = 4): string[] {
  const item = ITEMS[itemId];
  if (!item) return [];
  // Non-zone categories (recyclable, etc.) and any unknown bucket: skip.
  if (!(item.category in ZONE_CATS_BY_ITEM_CATEGORY)) return [];
  const eligible = new Set(ZONE_CATS_BY_ITEM_CATEGORY[item.category] ?? []);
  if (eligible.size === 0) return [];

  const byName = new Map<string, { matches: number; zone: LootZone }>();
  for (const catalog of LOOT_ZONES) {
    for (const zone of catalog.zones) {
      const cats = zone.categories ?? [];
      let matches = 0;
      for (const c of cats) if (eligible.has(c)) matches += 1;
      if (matches === 0) continue;
      const prev = byName.get(zone.name);
      if (!prev || matches > prev.matches) {
        byName.set(zone.name, { matches, zone });
      }
    }
  }

  return [...byName.entries()]
    .sort((a, b) => {
      if (b[1].matches !== a[1].matches) return b[1].matches - a[1].matches;
      return a[0].localeCompare(b[0]);
    })
    .slice(0, cap)
    .map(([name]) => name);
}
