#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

function usage() {
  console.error("Usage: node scripts/check-layout.mjs <input-dir>");
  process.exit(1);
}

const [, , inputArg] = process.argv;

if (!inputArg) {
  usage();
}

const inputDir = path.resolve(process.cwd(), inputArg);

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

const cssPath = path.join(inputDir, "styles.css");
const cssText = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";

const absoluteClasses = new Set();
for (const match of cssText.matchAll(/\.([A-Za-z0-9_-]+)\s*\{[^}]*position\s*:\s*(absolute|fixed)/gms)) {
  absoluteClasses.add(match[1]);
}

const allowedDecorativeClasses = new Set([
  "hero-letter",
  "page-mark-bg",
  "bg-letter",
  "bg-shape",
  "decor-line",
  "decor-dot",
  "footer",
  "page-footer",
]);

const riskyFloatingClasses = new Set([
  "orbit",
  "bubble",
  "floating-card",
  "float-card",
  "scatter-card",
  "node-card",
]);

const majorBlockHints = new Set([
  "cover-bottom",
  "issue-grid",
  "big-quote",
  "grid-2",
  "grid-3",
  "compare-table",
  "loop-board",
  "feature-stack",
  "summary-grid",
  "mini-kpi",
  "case-top",
  "page-body",
]);

function extractElements(html) {
  const elements = [];
  const tagRegex = /<([a-zA-Z0-9-]+)([^>]*?)>/gms;

  for (const match of html.matchAll(tagRegex)) {
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    const classMatch = attrs.match(/\bclass\s*=\s*"([^"]*)"/);
    const classes = classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [];
    const dataBlock = /\bdata-block\b(?:\s*=\s*"[^"]*")?/.test(attrs);
    const decorative = /\bdata-decorative\s*=\s*"true"/.test(attrs);
    const inlineStyle = attrs.match(/\bstyle\s*=\s*"([^"]*)"/)?.[1] || "";
    elements.push({ tag, classes, dataBlock, decorative, inlineStyle });
  }

  return elements;
}

function lintFile(filePath) {
  const html = readFileSync(filePath, "utf8");
  const elements = extractElements(html);
  const errors = [];
  const warnings = [];

  const contentBlocks = elements.filter((el) => {
    if (el.dataBlock) return true;
    if (el.tag === "section" || el.tag === "article") return true;
    return el.classes.some((cls) => majorBlockHints.has(cls));
  });

  if (contentBlocks.length < 3) {
    warnings.push("Major content blocks are too few; page may look empty or leave large whitespace.");
  }

  const absoluteContent = elements.filter((el) => {
    const classAbsolute = el.classes.some((cls) => absoluteClasses.has(cls));
    const inlineAbsolute = /position\s*:\s*(absolute|fixed)/.test(el.inlineStyle);
    const isDecorative =
      el.decorative ||
      el.classes.every((cls) => allowedDecorativeClasses.has(cls)) ||
      el.classes.some((cls) => allowedDecorativeClasses.has(cls));

    return (classAbsolute || inlineAbsolute) && !isDecorative;
  });

  if (absoluteContent.length > 0) {
    errors.push(
      `Non-decorative absolute positioning detected: ${absoluteContent
        .slice(0, 6)
        .map((el) => el.classes.join(".") || el.tag)
        .join(", ")}`
    );
  }

  const riskyFloating = elements.filter((el) =>
    el.classes.some((cls) => riskyFloatingClasses.has(cls))
  );
  if (riskyFloating.length > 0) {
    errors.push(
      `Floating layout classes detected: ${riskyFloating
        .slice(0, 6)
        .map((el) => el.classes.join(".") || el.tag)
        .join(", ")}`
    );
  }

  const hasHero = /class\s*=\s*"[^"]*\bhero\b[^"]*"/.test(html);
  const hasLowerSection =
    /class\s*=\s*"[^"]*\bcover-bottom\b[^"]*"/.test(html) ||
    /class\s*=\s*"[^"]*\bissue-grid\b[^"]*"/.test(html) ||
    /class\s*=\s*"[^"]*\bsummary-grid\b[^"]*"/.test(html) ||
    /class\s*=\s*"[^"]*\bfeature-stack\b[^"]*"/.test(html) ||
    /class\s*=\s*"[^"]*\bloop-board\b[^"]*"/.test(html) ||
    /class\s*=\s*"[^"]*\bcompare-table\b[^"]*"/.test(html);

  if (hasHero && !hasLowerSection) {
    warnings.push("Cover-like page has no lower content section; risk of excessive bottom whitespace.");
  }

  const titleTextMatches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gim)];
  for (const match of titleTextMatches) {
    const text = match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (text.length > 34) {
      warnings.push(`Long title detected (${text.length} chars); consider shorter copy or manual line breaks.`);
    }
  }

  return { errors, warnings, blockCount: contentBlocks.length };
}

let hasError = false;

for (const file of htmlFiles) {
  const fullPath = path.join(inputDir, file);
  const report = lintFile(fullPath);

  for (const warning of report.warnings) {
    console.log(`WARN [${file}] ${warning}`);
  }

  if (report.errors.length > 0) {
    hasError = true;
    for (const error of report.errors) {
      console.error(`ERROR [${file}] ${error}`);
    }
  } else {
    console.log(`OK   [${file}] blockCount=${report.blockCount}`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`Layout lint passed for ${htmlFiles.length} page(s) in ${inputDir}`);
