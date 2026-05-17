// ============================================================================
// FILE: src/looter/engine/stages.ts
// PURPOSE: Derive Stage[] from the static data files. Pure — used by both the
//          UI (LooterPage) and the CLI harness.
// ============================================================================

import { ITEMS } from "../../data/items";
import { CURRENT_EVENT } from "../../data/events";
import { PROJECTS, PROJECT_ORDER } from "../../data/projects";
import { WORKBENCHES } from "../../data/workbenches";
import type { Stage } from "../../components/looter/types";

export function projectStages(): Stage[] {
  const out: Stage[] = [];
  for (const projectId of PROJECT_ORDER) {
    const project = PROJECTS[projectId];
    if (!project) continue;
    const goalId = `proj:${project.id}`;
    for (const stage of project.stages) {
      const stageId = `${goalId}:s${stage.level}`;
      const stageLabel = `Stage ${stage.level} · ${stage.name}`;
      const r = stage.requirement;
      if (r.kind === "items") {
        out.push({
          stageId,
          goalId,
          goalName: project.name,
          goalKind: "project",
          stageLabel,
          kind: "items",
          lines: r.items.map((it) => ({
            lineId: `${stageId}:${it.itemId}`,
            kind: "item" as const,
            itemId: it.itemId,
            itemName: ITEMS[it.itemId]?.name ?? it.itemId,
            qty: it.qty,
          })),
        });
      } else if (r.kind === "task") {
        out.push({
          stageId,
          goalId,
          goalName: project.name,
          goalKind: "project",
          stageLabel,
          kind: "task",
          lines: [
            {
              lineId: `${stageId}:task`,
              kind: "task" as const,
              label: r.description,
              mapId: r.mapId,
            },
          ],
        });
      } else {
        out.push({
          stageId,
          goalId,
          goalName: project.name,
          goalKind: "project",
          stageLabel,
          kind: "value_by_category",
          lines: r.buckets.map((b, i) => ({
            lineId: `${stageId}:bucket${i}`,
            kind: "bucket" as const,
            label: `${b.category} commit`,
            coins: b.coins,
          })),
        });
      }
    }
  }
  return out;
}

export function eventStages(): Stage[] {
  if (!CURRENT_EVENT) return [];
  const goalId = `event:${CURRENT_EVENT.id}`;
  return [
    {
      stageId: goalId,
      goalId,
      goalName: CURRENT_EVENT.name,
      goalKind: "event",
      stageLabel: "Ship Models · extract with any",
      kind: "event",
      lines: CURRENT_EVENT.prioritizeItemIds.map((id) => ({
        lineId: `${goalId}:${id}`,
        kind: "item" as const,
        itemId: id,
        itemName: ITEMS[id]?.name ?? id,
        qty: 1,
      })),
    },
  ];
}

export function benchStages(): Stage[] {
  const out: Stage[] = [];
  for (const bench of Object.values(WORKBENCHES)) {
    const goalId = `bench:${bench.id}`;
    for (const tier of bench.tiers) {
      const stageId = `${goalId}:t${tier.level}`;
      out.push({
        stageId,
        goalId,
        goalName: bench.name,
        goalKind: "bench",
        stageLabel: `T${tier.level}`,
        kind: "items",
        lines: tier.cost.map((c) => ({
          lineId: `${stageId}:${c.itemId}`,
          kind: "item" as const,
          itemId: c.itemId,
          itemName: ITEMS[c.itemId]?.name ?? c.itemId,
          qty: c.qty,
        })),
      });
    }
  }
  return out;
}

export function allStages(): Stage[] {
  return [...eventStages(), ...projectStages(), ...benchStages()];
}
