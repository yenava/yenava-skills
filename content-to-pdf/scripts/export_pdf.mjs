#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { chromium } from "playwright";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
});

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      args[token.slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=\[\]{};:'",.<>/?\\|]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitList(value) {
  return String(value ?? "")
    .split(/[·|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCover(data) {
  const chips = splitList(data.keywords);
  const chipHtml = chips.map((item) => `<span class="cover-chip">${escapeHtml(item)}</span>`).join("");
  return `
    <section class="page cover-page">
      <div class="cover-inner">
        <div class="cover-main">
          <div class="cover-kicker">${escapeHtml(data.series || "PDF Document")}</div>
          <h1 class="cover-title">${escapeHtml(data.title || "Untitled Document")}</h1>
          ${data.subtitle ? `<div class="cover-subtitle">${escapeHtml(data.subtitle)}</div>` : ""}
          ${data.summary ? `<p class="cover-summary">${escapeHtml(data.summary)}</p>` : ""}
          ${chipHtml ? `<div class="cover-chip-row">${chipHtml}</div>` : ""}
        </div>
        <aside class="cover-side">
          <div class="cover-type">${escapeHtml(data.document_type || "document")}</div>
          <div class="cover-meta">
            ${data.author ? `<div class="cover-meta-row"><div class="cover-meta-label">Author</div><div class="cover-meta-value">${escapeHtml(data.author)}</div></div>` : ""}
            ${data.date ? `<div class="cover-meta-row"><div class="cover-meta-label">Date</div><div class="cover-meta-value">${escapeHtml(data.date)}</div></div>` : ""}
            ${data.version ? `<div class="cover-meta-row"><div class="cover-meta-label">Version</div><div class="cover-meta-value">${escapeHtml(data.version)}</div></div>` : ""}
          </div>
        </aside>
      </div>
      ${data.note ? `<div class="cover-note">${escapeHtml(data.note)}</div>` : ""}
    </section>
  `;
}

function collectHeadings(source) {
  const tokens = md.parse(source, {});
  const headings = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === "heading_open") {
      const level = Number(token.tag.slice(1));
      const textToken = tokens[i + 1];
      if (textToken?.type === "inline") {
        const text = textToken.content.trim();
        const id = slugify(text);
        token.attrSet("id", id);
        if (level <= 2) {
          headings.push({ level, text, id });
        }
      }
    }
  }
  return { headings, renderedHtml: md.renderer.render(tokens, md.options, {}) };
}

function buildToc(headings) {
  if (!headings.length) {
    return "";
  }

  const items = headings
    .map(
      (heading, index) => `
        <div class="toc-entry toc-level-${heading.level}">
          <span class="toc-title"><span class="toc-marker">${String(index + 1).padStart(2, "0")}</span> ${escapeHtml(heading.text)}</span>
          <span class="toc-link">${heading.level === 1 ? "Section" : "Subsection"}</span>
        </div>
      `,
    )
    .join("");

  return `
    <section class="page toc-page">
      <div class="toc-eyebrow">Contents</div>
      <h1>目录</h1>
      <div class="toc-list">${items}</div>
    </section>
  `;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const args = parseArgs(process.argv);
  const input = args.input;
  const output = args.output;

  if (!input || !output) {
    console.error("Usage: node export_pdf.mjs --input <content.md> --output <file.pdf>");
    process.exit(1);
  }

  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const skillDir = path.resolve(scriptDir, "..");
  const templatePath = path.join(skillDir, "assets", "template.html");
  const stylesPath = path.join(skillDir, "assets", "styles.css");

  const [template, styles, source] = await Promise.all([
    fs.readFile(templatePath, "utf8"),
    fs.readFile(stylesPath, "utf8"),
    fs.readFile(path.resolve(input), "utf8"),
  ]);

  const { data, content } = matter(source);
  const { headings, renderedHtml } = collectHeadings(content);
  const htmlBlocks = [];

  if (data.title || data.subtitle || data.summary) {
    htmlBlocks.push(buildCover(data));
  }

  if (data.toc) {
    htmlBlocks.push(buildToc(headings));
  }

  htmlBlocks.push(`<section class="page body-page"><article class="prose">${renderedHtml}</article></section>`);

  const html = template
    .replace("{{title}}", escapeHtml(data.title || "PDF Document"))
    .replace("{{theme}}", escapeHtml(data.theme || "slate"))
    .replace("{{document_type}}", escapeHtml(data.document_type || "document"))
    .replace("{{styles}}", styles)
    .replace("{{content}}", htmlBlocks.join("\n"));

  await ensureDir(path.resolve(output));

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: path.resolve(output),
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await browser.close();

  console.log(`Rendered ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
