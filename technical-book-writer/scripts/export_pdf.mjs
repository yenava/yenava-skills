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
      const key = token.slice(2);
      const value = argv[i + 1];
      args[key] = value;
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

function splitMetaList(value) {
  return String(value ?? "")
    .split(/[·|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePartHeading(heading, fallbackIndex = 0) {
  const match = heading.match(/^Part\s+(\d+)\s*:\s*(.+)$/i);
  if (match) {
    return {
      partNumber: match[1],
      partLabel: `Part ${match[1]}`,
      partTitle: match[2].trim(),
      rawHeading: heading,
    };
  }

  return {
    partNumber: String(fallbackIndex + 1),
    partLabel: `Part ${fallbackIndex + 1}`,
    partTitle: heading,
    rawHeading: heading,
  };
}

function buildCover(data) {
  const keywordItems = splitMetaList(data.keywords);
  const keywordHtml = keywordItems.length
    ? keywordItems.map((item) => `<span class="cover-keyword">${escapeHtml(item)}</span>`).join("")
    : `<span class="cover-keyword">${escapeHtml(data.keywords || "")}</span>`;

  return `
    <section class="page cover-page">
      <div class="cover-backdrop">
        <div class="cover-glow cover-glow-one"></div>
        <div class="cover-glow cover-glow-two"></div>
        <div class="cover-grid-lines"></div>
      </div>
      <div class="cover-layout">
        <div class="cover-main">
          <div class="cover-series-row">
            <span class="cover-series-rule"></span>
            <div class="cover-series">${escapeHtml(data.series || "橙皮书")}</div>
          </div>
          <div class="cover-kicker">A systems handbook for AI builders</div>
          <h1 class="cover-title">${escapeHtml(data.title || "未命名手册")}</h1>
          <div class="cover-subtitle">${escapeHtml(data.subtitle || "")}</div>
          <p class="cover-tagline">${escapeHtml(data.tagline || "")}</p>
          <div class="cover-keywords">${keywordHtml}</div>
        </div>
        <aside class="cover-side">
          <div class="cover-stamp">Orange Book</div>
          <div class="cover-meta-card">
            <div class="cover-meta-row">
              <div class="cover-meta-label">适合读者</div>
              <div class="cover-meta-value">${escapeHtml(data.readers || "")}</div>
            </div>
            <div class="cover-meta-row">
              <div class="cover-meta-label">版本</div>
              <div class="cover-meta-value">${escapeHtml(data.version || "")}</div>
            </div>
            <div class="cover-meta-row">
              <div class="cover-meta-label">作者</div>
              <div class="cover-meta-value">${escapeHtml(data.author || "")}</div>
            </div>
          </div>
        </aside>
      </div>
      <div class="cover-note">${escapeHtml(data.note || "")}</div>
    </section>
  `;
}

function extractBlocks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let current = null;

  const pushCurrent = () => {
    if (current) {
      current.content = current.content.join("\n").trim();
      blocks.push(current);
    }
  };

  for (const line of lines) {
    if (line.startsWith("# ")) {
      pushCurrent();
      current = { type: "part", heading: line.slice(2).trim(), content: [] };
      continue;
    }
    if (line.startsWith("## ")) {
      pushCurrent();
      current = { type: "chapter", heading: line.slice(3).trim(), content: [] };
      continue;
    }
    if (!current) {
      current = { type: "body", heading: "", content: [] };
    }
    current.content.push(line);
  }

  pushCurrent();
  return blocks.filter((block) => block.heading || block.content);
}

function parseChapter(block) {
  const match = block.heading.match(/^(§\d+)\s*(.+)$/);
  const chapterId = match ? match[1] : "";
  const chapterTitle = match ? match[2] : block.heading;
  const contentLines = block.content.split("\n");
  let subtitle = "";

  while (contentLines.length > 0 && contentLines[0].trim() === "") {
    contentLines.shift();
  }

  const firstLine = contentLines[0]?.trim() || "";
  if (
    (firstLine.startsWith("*") && firstLine.endsWith("*")) ||
    (firstLine.startsWith("_") && firstLine.endsWith("_"))
  ) {
    subtitle = firstLine.slice(1, -1).trim();
    contentLines.shift();
  }

  const content = contentLines.join("\n").trim();
  return { chapterId, chapterTitle, subtitle, content };
}

function renderPart(block, index) {
  const part = parsePartHeading(block.heading, index);
  const bodyHtml = block.content ? md.render(block.content) : "";
  return `
    <section class="page part-page">
      <div class="part-backdrop">${escapeHtml(part.partNumber)}</div>
      <div class="part-kicker">${escapeHtml(part.partLabel)}</div>
      <h1 class="part-title">${escapeHtml(part.partTitle)}</h1>
      <div class="part-body">${bodyHtml}</div>
    </section>
  `;
}

function renderChapter(block) {
  const { chapterId, chapterTitle, subtitle, content } = parseChapter(block);
  const bodyHtml = md.render(content);
  return `
    <section class="page chapter-page">
      <header class="chapter-header">
        <div class="chapter-title-row">
          <span class="chapter-id">${escapeHtml(chapterId)}</span>
          <span class="chapter-title">${escapeHtml(chapterTitle)}</span>
        </div>
        ${subtitle ? `<div class="chapter-subtitle">${escapeHtml(subtitle)}</div>` : ""}
      </header>
      <div class="chapter-body">${bodyHtml}</div>
    </section>
  `;
}

function buildToc(blocks) {
  const parts = [];
  let currentPart = null;
  let partIndex = 0;

  for (const block of blocks) {
    if (block.type === "part") {
      const parsedPart = parsePartHeading(block.heading, partIndex);
      currentPart = { ...parsedPart, chapters: [] };
      parts.push(currentPart);
      partIndex += 1;
      continue;
    }
    if (block.type === "chapter" && currentPart) {
      const { chapterId, chapterTitle } = parseChapter(block);
      currentPart.chapters.push({ chapterId, chapterTitle });
    }
  }

  const partsHtml = parts
    .map(
      (part) => `
        <div class="toc-part">
          <div class="toc-part-head">
            <span class="toc-part-kicker">${escapeHtml(part.partLabel)}</span>
            <div class="toc-part-title">${escapeHtml(part.partTitle)}</div>
          </div>
          ${part.chapters
            .map(
              (chapter) => `
                <div class="toc-entry">
                  <span class="toc-number">${escapeHtml(chapter.chapterId)}</span>
                  <span class="toc-entry-title">${escapeHtml(chapter.chapterTitle)}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      `,
    )
    .join("");

  return `
    <section class="page toc-page">
      <div class="toc-eyebrow">Contents</div>
      <h1>目录</h1>
      <div class="toc-list">${partsHtml}</div>
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
    console.error("Usage: node export_pdf.mjs --input <manuscript.md> --output <file.pdf>");
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
  const blocks = extractBlocks(content);
  const htmlBlocks = [buildCover(data), buildToc(blocks)];

  let partIndex = 0;
  for (const block of blocks) {
    if (block.type === "part") {
      htmlBlocks.push(renderPart(block, partIndex));
      partIndex += 1;
    } else if (block.type === "chapter") {
      htmlBlocks.push(renderChapter(block));
    } else if (block.type === "body") {
      htmlBlocks.push(`<section class="page body-page">${md.render(block.content)}</section>`);
    }
  }

  const html = template
    .replace("{{title}}", escapeHtml(data.title || "Orange Book"))
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
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
  });
  await browser.close();

  console.log(`Rendered ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
