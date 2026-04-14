#!/usr/bin/env node

import { existsSync, readdirSync, statSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

function usage() {
  console.error("Usage: node scripts/render-pages.mjs <input-dir> [output-dir] [--skip-check]");
  process.exit(1);
}

const args = process.argv.slice(2);
const skipCheck = args.includes("--skip-check");
const positional = args.filter((arg) => arg !== "--skip-check");
const [inputArg, outputArg] = positional;

if (!inputArg) {
  usage();
}

const inputDir = path.resolve(process.cwd(), inputArg);
const outputDir = path.resolve(process.cwd(), outputArg || inputDir);

if (!existsSync(inputDir) || !statSync(inputDir).isDirectory()) {
  console.error(`Input directory not found: ${inputDir}`);
  process.exit(1);
}

const htmlFiles = readdirSync(inputDir)
  .filter((name) => /^page-\d+\.html$/i.test(name))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (htmlFiles.length === 0) {
  console.error(`No page-*.html files found in ${inputDir}`);
  process.exit(1);
}

if (!skipCheck) {
  const checkScript = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "check-layout.mjs"
  );

  const checkResult = spawnSync("node", [checkScript, inputDir], {
    stdio: "inherit",
    env: process.env,
  });

  if (checkResult.status !== 0) {
    console.error("Layout check failed. Fix HTML/CSS before rendering, or use --skip-check to bypass.");
    process.exit(checkResult.status ?? 1);
  }
}

await mkdir(outputDir, { recursive: true });

const tempDir = path.join(outputDir, ".render-tmp");
await rm(tempDir, { recursive: true, force: true });
await mkdir(tempDir, { recursive: true });

for (const file of htmlFiles) {
  const inputFile = path.join(inputDir, file);
  const outputFile = path.join(outputDir, file.replace(/\.html$/i, ".png"));
  const fileUrl = pathToFileURL(inputFile).href;

  const result = spawnSync(
    "npx",
    [
      "playwright",
      "screenshot",
      "--browser",
      "chromium",
      "--viewport-size",
      "1080,1440",
      "--wait-for-selector",
      ".xhs-page",
      "--wait-for-timeout",
      "300",
      fileUrl,
      outputFile,
    ],
    {
      stdio: "inherit",
      env: { ...process.env, TMPDIR: tempDir, TEMP: tempDir, TMP: tempDir },
    }
  );

  if (result.status !== 0) {
    console.error(`Failed to render ${file}`);
    process.exit(result.status ?? 1);
  }
}

await rm(tempDir, { recursive: true, force: true });
console.log(`Rendered ${htmlFiles.length} page(s) to ${outputDir}`);
