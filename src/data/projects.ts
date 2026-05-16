// ============================================================================
// FILE: data/projects.ts
// PURPOSE: Multi-stage build projects in Speranza. Three known projects:
//          - Expedition: cycle-scoped, ends with the current expedition cycle
//          - Avian Alarm: cycle-scoped but shorter window (~10d vs ~37d)
//          - Trophy Display: persistent (no deadline — carries across cycles)
//
//          Each project has 5 stages. Stages can require one of three things:
//          item commits, a location-tagged task, or bulk value-by-category coin
//          commits. The Looter prioritizer reads `endsAt` and the active stage's
//          requirements to recommend "what to loot right now."
//
// SOURCE: In-game screenshots, May 15 2026 (current expedition cycle). When a
//          new cycle rolls, replace stage requirements + bump endsAt timestamps.
//          Trophy Display is stable across cycles.
// ============================================================================

import { ITEMS, type ItemCategory } from "./items";

// One of three shapes per stage.
export type StageRequirement =
  | { kind: "items"; items: { itemId: string; qty: number }[] }
  | { kind: "task"; description: string; mapId?: string }
  | { kind: "value_by_category"; buckets: { category: ItemCategory; coins: number }[] };

export interface ProjectStage {
  level: number;            // 1..5 (currently always 5 stages but kept open-ended)
  name: string;             // verbatim in-game display, e.g. "FOUNDATION"
  requirement: StageRequirement;
}

export interface Project {
  id: string;
  name: string;             // display name, e.g. "Expedition"
  // True if the project resets each expedition cycle. Cycle-scoped projects
  // carry an `endsAt`; persistent ones (Trophy Display) do not.
  cycleScoped: boolean;
  endsAt?: string;          // ISO 8601 UTC; absent for persistent projects
  // Optional "season" grouping shown on the main menu card. Multiple data rows
  // can share the same umbrella to link them (e.g. Avian Alarm project +
  // Miniature Voyages event both share umbrella "Last Resort").
  umbrella?: string;
  stages: ProjectStage[];
}

// Endpoints captured 2026-05-15T22:25Z from in-game timer readouts. Approximate
// — re-grab from in-game when next a cycle rolls. Times do not need to be
// minute-perfect for the prioritizer; whole-hour precision is fine.
const EXPEDITION_ENDS_AT = "2026-06-22T05:00:00Z";
const AVIAN_ALARM_ENDS_AT = "2026-05-26T04:00:00Z";

export const PROJECTS: Record<string, Project> = {
  expedition: {
    id: "expedition",
    name: "Expedition",
    cycleScoped: true,
    endsAt: EXPEDITION_ENDS_AT,
    stages: [
      {
        level: 1,
        name: "FOUNDATION",
        requirement: {
          kind: "items",
          items: [
            { itemId: "metal_parts", qty: 150 },
            { itemId: "chemicals", qty: 100 },
            { itemId: "arc_alloy", qty: 80 },
            { itemId: "canister", qty: 15 },
          ],
        },
      },
      {
        level: 2,
        name: "CORE SYSTEMS",
        requirement: {
          kind: "items",
          items: [
            { itemId: "durable_cloth", qty: 30 },
            { itemId: "oil", qty: 25 },
            { itemId: "electrical_components", qty: 20 },
            { itemId: "industrial_charger", qty: 3 },
          ],
        },
      },
      {
        level: 3,
        name: "FRAMEWORK",
        requirement: {
          kind: "items",
          items: [
            { itemId: "arc_motion_core", qty: 20 },
            { itemId: "speaker_component", qty: 15 },
            { itemId: "turbine_compressor", qty: 5 },
            { itemId: "exodus_modules", qty: 2 },
          ],
        },
      },
      {
        level: 4,
        name: "OUTFITTING",
        requirement: {
          kind: "items",
          items: [
            { itemId: "portable_tv", qty: 1 },
            { itemId: "advanced_electrical_components", qty: 5 },
            { itemId: "sirena_dorata_ship_model", qty: 2 },
            { itemId: "vaporizer_regulator", qty: 3 },
          ],
        },
      },
      {
        level: 5,
        name: "LOAD STAGE",
        requirement: {
          kind: "value_by_category",
          buckets: [
            // Categories below are best-effort mappings from the in-game labels:
            //   Combat Items   → quick_use (grenades, mines, traps, etc.)
            //   Survival Items → quick_use (heals, shields, binoculars) — distinct
            //                    in-game category but our ItemCategory doesn't split
            //                    them yet; revisit if a tighter mapping matters.
            //   Provisions     → nature
            //   Materials      → basic + topside + refined (raw crafting input)
            // The prioritizer can treat each bucket independently regardless.
            { category: "quick_use", coins: 200_000 }, // Combat Items
            { category: "quick_use", coins: 100_000 }, // Survival Items — overlap; see note
            { category: "nature", coins: 150_000 },    // Provisions
            { category: "basic", coins: 300_000 },     // Materials — see note
          ],
        },
      },
    ],
  },

  avian_alarm: {
    id: "avian_alarm",
    name: "Avian Alarm",
    cycleScoped: true,
    endsAt: AVIAN_ALARM_ENDS_AT,
    umbrella: "Last Resort",  // grouped with Miniature Voyages event (same timer)
    stages: [
      {
        level: 1,
        name: "INITIAL FLOCK INTAKE",
        requirement: {
          kind: "task",
          description: "Lay a bird trap next to the buoys along the Seabed in Riven Tides",
          mapId: "riven_tides",
        },
      },
      {
        level: 2,
        name: "PRELIMINARY SIGNAL BIRDS",
        requirement: {
          kind: "items",
          items: [
            { itemId: "tick_pod", qty: 7 },
            { itemId: "canister", qty: 20 },
            { itemId: "moss", qty: 12 },
            { itemId: "twilight_compass_ship_model", qty: 5 },
          ],
        },
      },
      {
        level: 3,
        name: "SECONDARY VALIDATION BIRDS",
        requirement: {
          kind: "items",
          items: [
            { itemId: "comet_igniter", qty: 3 },
            { itemId: "fertilizer", qty: 10 },
            { itemId: "rusted_tools", qty: 8 },
            { itemId: "velocity_ship_model", qty: 5 },
          ],
        },
      },
      {
        level: 4,
        name: "HEIGHTENED ALERT BIRDS",
        requirement: {
          kind: "items",
          items: [
            { itemId: "vaporizer_regulator", qty: 1 },
            { itemId: "water_filter", qty: 3 },
            { itemId: "agave", qty: 8 },
            { itemId: "sirena_dorata_ship_model", qty: 5 },
          ],
        },
      },
      {
        level: 5,
        name: "CRITICAL WARNING BIRDS",
        requirement: {
          kind: "items",
          items: [
            { itemId: "turbine_compressor", qty: 2 },
            { itemId: "red_coral_jewelry", qty: 3 },
            { itemId: "roots", qty: 4 },
            { itemId: "leviathans_crown_ship_model", qty: 1 },
          ],
        },
      },
    ],
  },

  trophy_display: {
    id: "trophy_display",
    name: "Trophy Display",
    cycleScoped: false,
    // No endsAt — persistent across cycles.
    stages: [
      {
        level: 1,
        name: "ROAMING THREATS",
        requirement: {
          kind: "items",
          items: [
            { itemId: "rusted_bolts", qty: 3 },
            { itemId: "pop_trigger", qty: 15 },
            { itemId: "tick_pod", qty: 15 },
            { itemId: "surveyor_vault", qty: 5 },
          ],
        },
      },
      {
        level: 2,
        name: "SOARING MENACES",
        requirement: {
          kind: "items",
          items: [
            { itemId: "spotter_relay", qty: 10 },
            { itemId: "expired_respirator", qty: 3 },
            { itemId: "wasp_driver", qty: 20 },
            { itemId: "hornet_driver", qty: 15 },
          ],
        },
      },
      {
        level: 3,
        name: "FEROCIOUS FOES",
        requirement: {
          kind: "items",
          items: [
            { itemId: "arc_performance_steel", qty: 10 },
            { itemId: "shredder_gyro", qty: 5 },
            { itemId: "leaper_pulse_unit", qty: 10 },
            { itemId: "bastion_cell", qty: 5 },
          ],
        },
      },
      {
        level: 4,
        name: "DOMINANT DANGERS",
        requirement: {
          kind: "items",
          items: [
            { itemId: "arc_synthetic_resin", qty: 10 },
            { itemId: "magnetic_accelerator", qty: 10 },
            { itemId: "rocketeer_driver", qty: 8 },
            { itemId: "queen_reactor", qty: 3 },
          ],
        },
      },
      {
        level: 5,
        name: "IMPOSING BEHEMOTHS",
        requirement: {
          kind: "items",
          items: [
            { itemId: "exodus_modules", qty: 5 },
            { itemId: "geiger_counter", qty: 3 },
            { itemId: "bombardier_cell", qty: 8 },
            { itemId: "matriarch_reactor", qty: 3 },
          ],
        },
      },
    ],
  },
};

// Display order for the Looter UI / project picker.
export const PROJECT_ORDER: string[] = ["expedition", "avian_alarm", "trophy_display"];

/**
 * Hours remaining until a project's deadline. Returns null for persistent
 * projects (no deadline) or unknown project ids.
 */
export function hoursUntilEnd(projectId: string, now: Date = new Date()): number | null {
  const p = PROJECTS[projectId];
  if (!p || !p.endsAt) return null;
  const ms = Date.parse(p.endsAt) - now.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60)));
}

/**
 * Days remaining (floored) until a project's deadline. Returns null for
 * persistent projects or unknown ids.
 */
export function daysUntilEnd(projectId: string, now: Date = new Date()): number | null {
  const h = hoursUntilEnd(projectId, now);
  return h === null ? null : Math.floor(h / 24);
}

// Dev-time sanity check: every stage that asks for items must reference an
// existing ITEMS key. Throws at module load on typos/renames.
if (import.meta.env?.DEV) {
  for (const project of Object.values(PROJECTS)) {
    for (const stage of project.stages) {
      if (stage.requirement.kind !== "items") continue;
      for (const ref of stage.requirement.items) {
        if (!ITEMS[ref.itemId]) {
          throw new Error(
            `PROJECTS: ${project.id} stage ${stage.level} references unknown item "${ref.itemId}"`,
          );
        }
      }
    }
  }
}
