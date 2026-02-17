// ============================================================================
// FILE: scripts/advisor/cli.ts
// PURPOSE: Command-line matrix runner for advisor engine validation.
// WHAT IT CHECKS:
// - Global invariants (2-or-0 results, filter compliance, etc.)
// - Exact critical scenario pair keys
// - Tie-bucket shuffle progression
// - URL round-trip state fidelity
// ============================================================================

import { WEAPONS } from "../../src/data/weapons";
import { ADVISOR_CRITICAL_EXACT_CASE_IDS, ADVISOR_GOLDEN_CASES } from "../../src/data/advisor_golden_cases";
import { buildWeaponFeatureMap } from "../../src/advisor/engine/feature-map";
import { buildRankedRecommendations, getShuffleBatch, recommendLoadouts } from "../../src/advisor/engine";
import { parseAdvisorQuery, serializeAdvisorQuery } from "../../src/advisor/engine/url-state";
import type { GoldenScenarioCase, ShuffleState } from "../../src/types";

declare const process: {
  argv: string[];
  exit: (code?: number) => never;
};

interface ScenarioOutcome {
  id: string;
  title: string;
  passed: boolean;
  errors: string[];
}

interface CliOptions {
  json: boolean;
  scenarioId?: string;
}

// Minimal arg parser for:
// --json
// --scenario Sxx
function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--json") {
      options.json = true;
      continue;
    }
    if (token === "--scenario") {
      options.scenarioId = argv[i + 1];
      i += 1;
    }
  }
  return options;
}

// Static maps to avoid rebuilding for each scenario.
const FEATURE_MAP = buildWeaponFeatureMap();
const WEAPON_BY_ID = Object.fromEntries(WEAPONS.map((weapon) => [weapon.id, weapon]));

// Invariants that should hold across almost all scenarios.
function assertGlobalInvariants(scenario: GoldenScenarioCase, errors: string[]): void {
  const runtimeResult = recommendLoadouts(scenario.inputs, {
    batchSize: 2,
    forceDebug: scenario.requireDebug,
  });
  const rankedResult = buildRankedRecommendations(scenario.inputs);
  const recommendations = runtimeResult.recommendations;

  // The product contract is either 2 cards or an explicit empty-state.
  if (!(recommendations.length === 0 || recommendations.length === 2)) {
    errors.push(`Expected output length of 0 or 2, received ${recommendations.length}`);
  }

  if (scenario.expectEmpty) {
    if (recommendations.length !== 0) errors.push("Scenario expects empty-state, but recommendations were returned");
    if (!runtimeResult.emptyState) errors.push("Scenario expects empty-state metadata, but it is missing");
  } else if (runtimeResult.emptyState) {
    errors.push(`Unexpected empty state: ${runtimeResult.emptyState.message}`);
  }

  for (const recommendation of recommendations) {
    if (recommendation.primaryWeaponId === recommendation.secondaryWeaponId) {
      errors.push(`Duplicate primary/secondary weapon in ${recommendation.pairKey}`);
    }

    const primary = WEAPON_BY_ID[recommendation.primaryWeaponId];
    const secondary = WEAPON_BY_ID[recommendation.secondaryWeaponId];

    if (!scenario.inputs.allowedWeaponRarities.includes(primary.rarity)) {
      errors.push(`Primary ${primary.id} violates rarity filter`);
    }
    if (!scenario.inputs.allowedWeaponRarities.includes(secondary.rarity)) {
      errors.push(`Secondary ${secondary.id} violates rarity filter`);
    }

    if (scenario.inputs.stealthImportant) {
      if (!FEATURE_MAP[primary.id]?.stealthEligible) errors.push(`Primary ${primary.id} violates stealth eligibility`);
      if (!FEATURE_MAP[secondary.id]?.stealthEligible) errors.push(`Secondary ${secondary.id} violates stealth eligibility`);
    }

    const hasDebug = Boolean(recommendation.debug);
    if (scenario.requireDebug && !hasDebug) {
      errors.push("Debug breakdown is required but missing");
    }
    if (!scenario.requireDebug && hasDebug) {
      errors.push("Debug breakdown should be hidden but is present");
    }
  }

  // Pool checks are softer than exact key checks, useful during tuning.
  if (rankedResult.ranked.length > 0 && scenario.expectedPrimaryPool?.length) {
    const topPrimary = rankedResult.ranked[0].primaryWeaponId;
    if (!scenario.expectedPrimaryPool.includes(topPrimary)) {
      errors.push(`Top primary ${topPrimary} is outside expected pool`);
    }
  }

  if (rankedResult.ranked.length > 0 && scenario.expectedSecondaryPool?.length) {
    const topSecondary = rankedResult.ranked[0].secondaryWeaponId;
    if (!scenario.expectedSecondaryPool.includes(topSecondary)) {
      errors.push(`Top secondary ${topSecondary} is outside expected pool`);
    }
  }
}

// Exact key checks for critical scenarios only.
function assertExactCases(scenario: GoldenScenarioCase, errors: string[]): void {
  if (!ADVISOR_CRITICAL_EXACT_CASE_IDS.has(scenario.id)) return;
  const rankedResult = buildRankedRecommendations(scenario.inputs);

  if (scenario.expectEmpty) {
    if (rankedResult.ranked.length !== 0) {
      errors.push(`Exact-case ${scenario.id} should be empty but returned ranked pairs`);
    }
    return;
  }

  if (!scenario.exactExpectedPairKey) {
    errors.push(`Exact-case ${scenario.id} is missing exactExpectedPairKey`);
    return;
  }

  const topPair = rankedResult.ranked[0]?.pairKey;
  if (topPair !== scenario.exactExpectedPairKey) {
    errors.push(`Exact mismatch: expected ${scenario.exactExpectedPairKey}, got ${topPair ?? "none"}`);
  }
}

// Validate shuffle behavior for tie buckets.
function assertTieCycling(scenario: GoldenScenarioCase, errors: string[]): void {
  if (!scenario.requireTieCycling) return;
  const rankedResult = buildRankedRecommendations(scenario.inputs);
  const ranked = rankedResult.ranked;
  if (ranked.length < 3) {
    errors.push("Tie-cycle scenario requires at least 3 ranked pairs");
    return;
  }

  const firstBucket = ranked[0].tieBucketId;
  const bucketSize = ranked.filter((entry) => entry.tieBucketId === firstBucket).length;
  if (bucketSize < 1) {
    errors.push("Tie-cycle scenario requires at least one pair in the top tie bucket");
    return;
  }

  const seenFromFirstBucket = new Set<string>();
  let state: ShuffleState = { bucketIndex: 0, seenPairKeys: [], cycle: 0 };
  for (let i = 0; i < bucketSize; i += 1) {
    const step = getShuffleBatch(ranked, state, 1);
    const rec = step.batch[0];
    if (!rec) {
      errors.push("Shuffle produced empty batch unexpectedly while exhausting first bucket");
      return;
    }
    if (rec.tieBucketId !== firstBucket) {
      errors.push("Shuffle moved to another bucket before exhausting first bucket");
      return;
    }
    if (seenFromFirstBucket.has(rec.pairKey)) {
      errors.push("Shuffle repeated a pair before exhausting first bucket");
      return;
    }
    seenFromFirstBucket.add(rec.pairKey);
    state = step.state;
  }

  const next = getShuffleBatch(ranked, state, 1);
  const nextRec = next.batch[0];
  if (!nextRec) {
    errors.push("Shuffle produced empty batch after exhausting first bucket");
    return;
  }
  const hasMultipleBuckets = ranked.some((entry) => entry.tieBucketId !== firstBucket);
  if (hasMultipleBuckets && nextRec.tieBucketId === firstBucket) {
    errors.push("Shuffle did not advance to next tie bucket after exhausting first bucket");
  }
}

// Parse->serialize->parse consistency check for shareable URLs.
function assertUrlRoundTrip(scenario: GoldenScenarioCase, errors: string[]): void {
  if (!scenario.requireUrlRoundTrip) return;
  const serialized = serializeAdvisorQuery(scenario.inputs, { bucket: 1, offset: 2 });
  const parsed = parseAdvisorQuery(serialized);

  if (parsed.location !== scenario.inputs.location) errors.push("URL round-trip mismatch: location");
  if (parsed.squad !== scenario.inputs.squad) errors.push("URL round-trip mismatch: squad");
  if (parsed.focus !== scenario.inputs.focus) errors.push("URL round-trip mismatch: focus");
  if (parsed.preferredRange !== scenario.inputs.preferredRange) errors.push("URL round-trip mismatch: preferredRange");
  if (parsed.stealthImportant !== scenario.inputs.stealthImportant) errors.push("URL round-trip mismatch: stealth");
  if (parsed.debug !== scenario.inputs.debug) errors.push("URL round-trip mismatch: debug flag");
  if ((parsed.shuffle?.bucket ?? -1) !== 1) errors.push("URL round-trip mismatch: shuffle bucket");
  if ((parsed.shuffle?.offset ?? -1) !== 2) errors.push("URL round-trip mismatch: shuffle offset");
}

// Run all assertion groups for one scenario.
function runScenario(scenario: GoldenScenarioCase): ScenarioOutcome {
  const errors: string[] = [];
  assertGlobalInvariants(scenario, errors);
  assertExactCases(scenario, errors);
  assertTieCycling(scenario, errors);
  assertUrlRoundTrip(scenario, errors);

  return {
    id: scenario.id,
    title: scenario.title,
    passed: errors.length === 0,
    errors,
  };
}

// Pretty text output for terminal use.
function formatHuman(outcomes: ScenarioOutcome[]): string {
  const lines: string[] = [];
  const passes = outcomes.filter((outcome) => outcome.passed).length;
  lines.push(`Advisor matrix: ${passes}/${outcomes.length} passed`);
  for (const outcome of outcomes) {
    lines.push(`${outcome.passed ? "PASS" : "FAIL"} ${outcome.id} - ${outcome.title}`);
    for (const error of outcome.errors) {
      lines.push(`  - ${error}`);
    }
  }
  return lines.join("\n");
}

// CLI entrypoint.
function main(): number {
  const options = parseArgs(process.argv.slice(2));
  const selected = options.scenarioId
    ? ADVISOR_GOLDEN_CASES.filter((scenario) => scenario.id === options.scenarioId)
    : ADVISOR_GOLDEN_CASES;

  if (selected.length === 0) {
    console.error(`No scenario found for "${options.scenarioId ?? ""}"`);
    return 2;
  }

  const outcomes = selected.map(runScenario);
  if (options.json) {
    console.log(JSON.stringify(outcomes, null, 2));
  } else {
    console.log(formatHuman(outcomes));
  }

  return outcomes.every((outcome) => outcome.passed) ? 0 : 1;
}

process.exit(main());
