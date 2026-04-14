---
name: content-to-pdf
description: Use when the user wants to convert Markdown or structured written content into a polished PDF with good typography, cover metadata, optional table of contents, and print-ready layout. Trigger on requests like "转成 PDF", "排版成 PDF", "导出 PDF", "做成报告 PDF", "把内容排好版", or when the main need is formatting and exporting content rather than writing the content itself.
---

# Content To PDF

## Overview

This skill turns general written content into polished PDF documents. It is designed for Markdown-first workflows where the user already has content, notes, an article, a report, or a guide and wants a reliable path to clean layout, stable hierarchy, and printable output.

## Best-Fit Use Cases

Use this skill for:

- articles,
- reports,
- briefs,
- proposals,
- internal guides,
- lightweight manuals,
- content packages that need PDF delivery.

Do not use this skill when the main problem is writing the manuscript itself. In that case, use a writing skill first, then use this one for layout and export.

## Workflow

### 1. Normalize The Source

Prefer Markdown with YAML frontmatter.

Useful frontmatter fields:

- `title`
- `subtitle`
- `summary`
- `author`
- `date`
- `keywords`
- `document_type`
- `version`
- `toc`
- `theme`

### 2. Choose The Output Mode

Default to one of these generic document modes:

- `article`: clean reading flow, lighter metadata.
- `report`: stronger structure, clearer metadata blocks.
- `guide`: slightly more instructional and section-led.

If the user does not specify, infer from the content and pick the most natural one.

### 3. Keep The Structure Visible

The PDF should make hierarchy obvious:

- title and subtitle,
- optional summary,
- optional table of contents,
- section headings,
- callouts, quotes, tables, and code blocks when present.

Use clear heading levels instead of overdesigning.

### 4. Preserve Readability In Print

When exporting:

- use stable margins,
- avoid cramped typography,
- keep headings from getting stranded at the page bottom,
- preserve table readability,
- preserve code block contrast,
- keep backgrounds subtle enough for print.

### 5. Use The Bundled Exporter

This skill includes a Playwright-based exporter for Markdown to PDF.

- Template: [template.html](./assets/template.html)
- Styles: [styles.css](./assets/styles.css)
- Formatting reference: [format-guide.md](./references/format-guide.md)
- Presets reference: [layout-presets.md](./references/layout-presets.md)
- Example source: [sample-content.md](./examples/sample-content.md)
- Exporter: [export_pdf.mjs](./scripts/export_pdf.mjs)

Example:

```bash
node content-to-pdf/scripts/export_pdf.mjs \
  --input content-to-pdf/examples/sample-content.md \
  --output output/pdf/content-to-pdf-sample.pdf
```

## Markup Conventions

- Frontmatter controls cover metadata and options.
- `# Heading` and `## Heading` are used to build the optional TOC.
- Use normal Markdown for paragraphs, lists, tables, blockquotes, and code.
- Use raw HTML only for special layout needs.
- Use `<div class="page-break"></div>` when a forced page break is necessary.

## Quality Bar

Before delivering, verify:

- hierarchy is easy to scan,
- the cover looks intentional when metadata exists,
- the body feels like a designed document rather than a browser printout,
- tables and code blocks are readable,
- page breaks do not produce obvious visual defects.
