// ============================================================================
// FILE: scripts/looter/run-engine.mjs
// PURPOSE: Bundle + run the Looter engine CLI. Uses esbuild (already a Vite
//          dependency) so we don't need a separate TS compiler config or to
//          rewrite the source tree's imports with file extensions.
//
// USAGE:
//   node scripts/looter/run-engine.mjs                       (default sample)
//   node scripts/looter/run-engine.mjs --json                (JSON output)
//   node scripts/looter/run-engine.mjs --bench gunsmith:1    (target T1 only)
//   node scripts/looter/run-engine.mjs --skip <stageId>      (force skip)
//   node scripts/looter/run-engine.mjs --promote <stageId>   (force hi)
// ============================================================================

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "esbuild";

const root = process.cwd();
const outDir = resolve(root, ".tmp/looter-harness");
const outFile = resolve(outDir, "cli.cjs");

mkdirSync(outDir, { recursive: true });

await build({
  entryPoints: [resolve(root, "scripts/looter/cli.ts")],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  outfile: outFile,
  logLevel: "error",
  define: {
    "import.meta.env.DEV": "false",
  },
});

const rawArgs = process.argv.slice(2);
const keepBuild = rawArgs.includes("--keep-build");
const forwardedArgs = rawArgs.filter((a) => a !== "--keep-build");

const result = spawnSync("node", [outFile, ...forwardedArgs], {
  stdio: "inherit",
  cwd: root,
  shell: false,
});

if (!keepBuild && existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}

process.exit(result.status ?? 1);
