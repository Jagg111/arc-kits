/**
 * Mod name abbreviation utility for compact gallery labels.
 *
 * Applied universally (not mobile-only) — the gallery's flex wrapping
 * handles text length at any viewport width. Abbreviation rules are
 * consistent between Builder and Advisor displays.
 */

/** Word-level substitutions applied left-to-right. Order matters for
 *  compound names like "Extended Light Magazine" → "Ext. Lt. Mag". */
const ABBREVIATIONS: [string, string][] = [
  ["Compensator", "Comp."],
  ["Extended", "Ext."],
  ["Magazine", "Mag"],
  ["Shotgun", "SG"],
  ["Vertical", "Vert."],
  ["Medium", "Med."],
  ["Lightweight", "Lt.weight"],
  ["Light", "Lt."],
];

/**
 * Shortens a mod family name for gallery labels.
 *
 * @example
 * abbreviateModName("Compensator")           // "Comp."
 * abbreviateModName("Extended Light Magazine") // "Ext. Lt. Mag"
 * abbreviateModName("Muzzle Brake")           // "Muzzle Brake"
 * abbreviateModName("Angled Grip")            // "Angled Grip"
 */
export function abbreviateModName(name: string): string {
  let result = name;
  for (const [full, short] of ABBREVIATIONS) {
    result = result.replace(full, short);
  }
  return result;
}
