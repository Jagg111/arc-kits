// ============================================================================
// FILE: scripts/advisor/run-matrix.mjs
// PURPOSE: Build-and-run wrapper for advisor CLI matrix checks.
// FLOW:
// 1) Compile harness TS to temp JS output
// 2) Execute compiled CLI with forwarded args
// 3) Cleanup temp output unless --keep-build is set
// ============================================================================

import { spawnSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const outDir = resolve(root, ".tmp/advisor-harness");
const tscBin = resolve(root, "node_modules/typescript/bin/tsc");
const cliOut = resolve(outDir, "scripts/advisor/cli.js");

const rawArgs = process.argv.slice(2);
const keepBuild = rawArgs.includes("--keep-build");
const forwardedArgs = rawArgs.filter((arg) => arg !== "--keep-build");

// Small helper to run child processes with inherited stdio.
function run(command, args) {
  return spawnSync(command, args, { stdio: "inherit", cwd: root, shell: false });
}

// Compile TS harness files.
const compile = run("node", [tscBin, "-p", "scripts/advisor/tsconfig.harness.json"]);
if (compile.status !== 0) {
  process.exit(compile.status ?? 1);
}

// Force CommonJS in temp output folder for predictable runtime loading.
writeFileSync(resolve(outDir, "package.json"), JSON.stringify({ type: "commonjs" }));

// Execute compiled CLI with forwarded args.
const execResult = run("node", [cliOut, ...forwardedArgs]);
const exitCode = execResult.status ?? 1;

// Remove temp output by default.
if (!keepBuild && existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}

process.exit(exitCode);
