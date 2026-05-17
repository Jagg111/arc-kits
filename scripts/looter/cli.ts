// ============================================================================
// FILE: scripts/looter/cli.ts
// PURPOSE: Headless runner for the Looter material-demand engine. Lets us
//          eyeball aggregator output without spinning the UI, and gives a hook
//          for future golden-case validation.
//
// USAGE (via the .mjs wrapper):
//   node scripts/looter/run-engine.mjs                 -> default sample state
//   node scripts/looter/run-engine.mjs --json          -> JSON output
//   node scripts/looter/run-engine.mjs --bench gunsmith:1   -> override target tier
// ============================================================================

import { buildHuntList } from "../../src/looter/engine";
import { allStages } from "../../src/looter/engine/stages";
import { CURRENT_EVENT } from "../../src/data/events";
import { PROJECTS, PROJECT_ORDER } from "../../src/data/projects";
import { WORKBENCHES } from "../../src/data/workbenches";
import type { Bucket } from "../../src/components/looter/types";

declare const process: { argv: string[]; exit: (code?: number) => never };

interface CliOptions {
  json: boolean;
  benchTargets: Record<string, number>;
  skipStage: Set<string>;
  promoteStage: Set<string>;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { json: false, benchTargets: {}, skipStage: new Set(), promoteStage: new Set() };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") opts.json = true;
    else if (a === "--bench") {
      const [id, tier] = (argv[++i] ?? "").split(":");
      if (id && tier) opts.benchTargets[id] = Number(tier);
    } else if (a === "--skip") opts.skipStage.add(argv[++i] ?? "");
    else if (a === "--promote") opts.promoteStage.add(argv[++i] ?? "");
  }
  return opts;
}

// Mirrors LooterPage.initialState() so the CLI gives a recognizable baseline.
function sampleState(opts: CliOptions) {
  const stageBucket: Record<string, Bucket> = {};
  const goalOn: Record<string, boolean> = {};
  const benchTargetTier: Record<string, number> = {};

  for (const projectId of PROJECT_ORDER) {
    const p = PROJECTS[projectId];
    if (!p) continue;
    goalOn[`proj:${p.id}`] = p.cycleScoped;
    for (const stage of p.stages) {
      const stageId = `proj:${p.id}:s${stage.level}`;
      if (p.id === "expedition") stageBucket[stageId] = stage.level <= 2 ? "soon" : "evt";
      else if (p.id === "avian_alarm") stageBucket[stageId] = stage.level === 1 ? "soon" : "evt";
      else stageBucket[stageId] = "evt";
    }
  }

  if (CURRENT_EVENT) {
    const goalId = `event:${CURRENT_EVENT.id}`;
    goalOn[goalId] = true;
    stageBucket[goalId] = "hi";
  }

  const activeBenches = new Set(["gunsmith", "gear_bench"]);
  for (const bench of Object.values(WORKBENCHES)) {
    goalOn[`bench:${bench.id}`] = activeBenches.has(bench.id);
    benchTargetTier[bench.id] = bench.maxTier;
    for (const tier of bench.tiers) {
      stageBucket[`bench:${bench.id}:t${tier.level}`] = tier.level === 1 ? "soon" : "evt";
    }
  }
  stageBucket["bench:gunsmith:t1"] = "hi";

  // CLI overrides
  for (const [b, t] of Object.entries(opts.benchTargets)) benchTargetTier[b] = t;
  for (const id of opts.skipStage) stageBucket[id] = "skip";
  for (const id of opts.promoteStage) stageBucket[id] = "hi";

  return { stageBucket, goalOn, benchTargetTier, lineDone: new Set<string>() };
}

function main(): number {
  const opts = parseArgs(process.argv.slice(2));
  const state = sampleState(opts);
  const hunt = buildHuntList({ stages: allStages(), ...state });

  if (opts.json) {
    console.log(JSON.stringify(hunt, null, 2));
    return 0;
  }

  console.log(`Looter engine — ${hunt.materials.length} ranked materials`);
  console.log(`benchTargetTier:`, state.benchTargetTier);
  console.log("");
  for (const m of hunt.materials) {
    const buckets = m.breakdown.map((b) => b.bucket).join("/");
    console.log(`  ${m.total.toString().padStart(4)}× ${m.itemName.padEnd(28)} [${buckets}]`);
    for (const b of m.breakdown) {
      console.log(`      · ${b.bucket} ${b.source} ×${b.qty}`);
    }
    if (m.dropPOIs && m.dropPOIs.length > 0) {
      console.log(`      drops at: ${m.dropPOIs.join(", ")}`);
    }
  }
  return 0;
}

process.exit(main());
