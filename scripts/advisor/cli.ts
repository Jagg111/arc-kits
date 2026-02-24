// ============================================================================
// FILE: scripts/advisor/cli.ts
// PURPOSE: Command-line matrix runner for advisor engine validation.
// WHAT IT CHECKS:
// - Global invariants (2-3 results or empty, filter compliance, tiers, tags)
// - Exact critical scenario pair keys
// - Pool membership for flexible scenarios
// ============================================================================

import { WEAPONS } from "../../src/data/weapons";
import { ADVISOR_CRITICAL_EXACT_CASE_IDS, ADVISOR_GOLDEN_CASES } from "../../src/data/advisor_golden_cases";
import { recommendLoadouts } from "../../src/advisor/engine";
import type { AdvisorResult, GoldenScenarioCase } from "../../src/types";

declare const process: {
  argv: string[];
  exit: (code?: number) => never;
};

interface ScenarioOutcome {
  id: string;
  title: string;
  passed: boolean;
  errors: string[];
  pairs?: ScenarioPairSummary[];
  emptyStateCode?: NonNullable<AdvisorResult["emptyState"]>["code"];
}

interface CliOptions {
  json: boolean;
  scenarioId?: string;
  showPairs: boolean;
}

interface ScenarioPairSummary {
  pairKey: string;
  primaryWeaponId: string;
  secondaryWeaponId: string;
  pairScore: number;
  primaryScore: number;
  secondaryScore: number;
  tier: string;
  synergyTags: string[];
}

// Minimal arg parser.
function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { json: false, showPairs: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--json") {
      options.json = true;
      continue;
    }
    if (token === "--scenario") {
      options.scenarioId = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === "--show-pairs") {
      options.showPairs = true;
    }
  }
  return options;
}

// Static maps to avoid rebuilding for each scenario.
const WEAPON_BY_ID = Object.fromEntries(WEAPONS.map((weapon) => [weapon.id, weapon]));

// Invariants that should hold across all scenarios.
function assertGlobalInvariants(
  scenario: GoldenScenarioCase,
  result: AdvisorResult,
  errors: string[],
): void {
  const recommendations = result.recommendations;

  // V1 contract: 2-3 results or empty state.
  if (scenario.expectEmpty) {
    if (recommendations.length !== 0) errors.push("Scenario expects empty-state, but recommendations were returned");
    if (!result.emptyState) errors.push("Scenario expects empty-state metadata, but it is missing");
    if (result.status !== "empty") errors.push(`Expected status 'empty', got '${result.status}'`);
  } else {
    if (result.emptyState) errors.push(`Unexpected empty state: ${result.emptyState.message}`);
    if (recommendations.length < 1 || recommendations.length > 3) {
      errors.push(`Expected 1-3 results, received ${recommendations.length}`);
    }
    if (result.status !== "results") errors.push(`Expected status 'results', got '${result.status}'`);
  }

  // Tier invariant: exactly 1 top_pick, rest are strong_option.
  const topPicks = recommendations.filter((r) => r.tier === "top_pick");
  if (recommendations.length > 0 && topPicks.length !== 1) {
    errors.push(`Expected exactly 1 top_pick, found ${topPicks.length}`);
  }

  for (const recommendation of recommendations) {
    // No duplicate weapons in a pair.
    if (recommendation.primaryWeaponId === recommendation.secondaryWeaponId) {
      errors.push(`Duplicate primary/secondary weapon in ${recommendation.pairKey}`);
    }

    // Rarity filter compliance.
    const primary = WEAPON_BY_ID[recommendation.primaryWeaponId];
    const secondary = WEAPON_BY_ID[recommendation.secondaryWeaponId];

    if (!scenario.inputs.allowedWeaponRarities.includes(primary.rarity)) {
      errors.push(`Primary ${primary.id} violates rarity filter`);
    }
    if (!scenario.inputs.allowedWeaponRarities.includes(secondary.rarity)) {
      errors.push(`Secondary ${secondary.id} violates rarity filter`);
    }

    // Synergy tags must be present.
    if (!recommendation.synergyTags || recommendation.synergyTags.length === 0) {
      errors.push(`Pair ${recommendation.pairKey} is missing synergy tags`);
    }

    // Tier must be valid.
    if (recommendation.tier !== "top_pick" && recommendation.tier !== "strong_option") {
      errors.push(`Pair ${recommendation.pairKey} has invalid tier '${recommendation.tier}'`);
    }
  }

  // Pool checks (softer than exact key checks, useful during tuning).
  if (recommendations.length > 0 && scenario.expectedPrimaryPool?.length) {
    const topPrimary = recommendations[0].primaryWeaponId;
    if (!scenario.expectedPrimaryPool.includes(topPrimary)) {
      errors.push(`Top primary '${topPrimary}' is outside expected pool [${scenario.expectedPrimaryPool.join(", ")}]`);
    }
  }

  if (recommendations.length > 0 && scenario.expectedSecondaryPool?.length) {
    const topSecondary = recommendations[0].secondaryWeaponId;
    if (!scenario.expectedSecondaryPool.includes(topSecondary)) {
      errors.push(`Top secondary '${topSecondary}' is outside expected pool [${scenario.expectedSecondaryPool.join(", ")}]`);
    }
  }
}

// Exact key checks for anchor scenarios.
function assertExactCases(scenario: GoldenScenarioCase, result: AdvisorResult, errors: string[]): void {
  if (!ADVISOR_CRITICAL_EXACT_CASE_IDS.has(scenario.id)) return;

  if (scenario.expectEmpty) {
    if (result.recommendations.length !== 0) {
      errors.push(`Anchor scenario ${scenario.id} should be empty but returned results`);
    }
    return;
  }

  if (!scenario.exactExpectedPairKey) {
    errors.push(`Anchor scenario ${scenario.id} is missing exactExpectedPairKey`);
    return;
  }

  const topPair = result.recommendations[0]?.pairKey;
  if (topPair !== scenario.exactExpectedPairKey) {
    errors.push(`Exact mismatch: expected '${scenario.exactExpectedPairKey}', got '${topPair ?? "none"}'`);
  }
}

// Determinism check: running the same inputs twice must produce identical output.
function assertDeterminism(scenario: GoldenScenarioCase, errors: string[]): void {
  if (scenario.expectEmpty) return;
  const result1 = recommendLoadouts(scenario.inputs);
  const result2 = recommendLoadouts(scenario.inputs);

  if (result1.recommendations.length !== result2.recommendations.length) {
    errors.push("Determinism failure: different result count on re-run");
    return;
  }

  for (let i = 0; i < result1.recommendations.length; i++) {
    if (result1.recommendations[i].pairKey !== result2.recommendations[i].pairKey) {
      errors.push(`Determinism failure: pair ${i} differs on re-run`);
    }
  }
}

// Run all assertion groups for one scenario.
function runScenario(scenario: GoldenScenarioCase, showPairs: boolean): ScenarioOutcome {
  const errors: string[] = [];
  const result = recommendLoadouts(scenario.inputs);

  assertGlobalInvariants(scenario, result, errors);
  assertExactCases(scenario, result, errors);
  assertDeterminism(scenario, errors);

  const pairs = showPairs
    ? result.recommendations.map((r) => ({
        pairKey: r.pairKey,
        primaryWeaponId: r.primaryWeaponId,
        secondaryWeaponId: r.secondaryWeaponId,
        pairScore: r.pairScore,
        primaryScore: r.primaryScore,
        secondaryScore: r.secondaryScore,
        tier: r.tier,
        synergyTags: r.synergyTags.map((t) => `${t.type === "positive" ? "+" : "!"}${t.label}`),
      }))
    : undefined;

  return {
    id: scenario.id,
    title: scenario.title,
    passed: errors.length === 0,
    errors,
    pairs,
    emptyStateCode: showPairs ? result.emptyState?.code : undefined,
  };
}

// Pretty text output for terminal use.
function formatHuman(outcomes: ScenarioOutcome[], showPairs: boolean): string {
  const lines: string[] = [];
  const passes = outcomes.filter((o) => o.passed).length;
  lines.push(`Advisor matrix: ${passes}/${outcomes.length} passed`);
  for (const outcome of outcomes) {
    lines.push(`${outcome.passed ? "PASS" : "FAIL"} ${outcome.id} - ${outcome.title}`);
    if (showPairs) {
      if (outcome.pairs && outcome.pairs.length > 0) {
        for (const pair of outcome.pairs) {
          const tags = pair.synergyTags.join(", ");
          lines.push(
            `  [${pair.tier}] ${pair.pairKey} (pair=${pair.pairScore.toFixed(4)}, p=${pair.primaryScore.toFixed(4)}, s=${pair.secondaryScore.toFixed(4)}) ${tags}`,
          );
        }
      } else {
        lines.push(`  pairs: EMPTY (${outcome.emptyStateCode ?? "NO_DATA"})`);
      }
    }
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
    ? ADVISOR_GOLDEN_CASES.filter((s) => s.id === options.scenarioId)
    : ADVISOR_GOLDEN_CASES;

  if (selected.length === 0) {
    console.error(`No scenario found for "${options.scenarioId ?? ""}"`);
    return 2;
  }

  const outcomes = selected.map((s) => runScenario(s, options.showPairs));
  if (options.json) {
    console.log(JSON.stringify(outcomes, null, 2));
  } else {
    console.log(formatHuman(outcomes, options.showPairs));
  }

  return outcomes.every((o) => o.passed) ? 0 : 1;
}

process.exit(main());
