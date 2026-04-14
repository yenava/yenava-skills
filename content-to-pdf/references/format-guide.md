# Format Guide

Use this reference when preparing content for the `content-to-pdf` exporter.

## Recommended Input Format

Write the source as Markdown with YAML frontmatter.

Example:

```yaml
---
title: Example Report
subtitle: Q2 review and next steps
summary: A short one-paragraph summary for the cover.
author: Team Alpha
date: 2026-04-14
keywords: Strategy · Delivery · Metrics
document_type: report
version: v1.0
toc: true
theme: slate
---
```

## Supported Content Blocks

- headings,
- paragraphs,
- lists,
- blockquotes,
- tables,
- fenced code blocks,
- inline code,
- horizontal structure via standard Markdown.

## TOC Rules

- The exporter can generate a TOC from `#` and `##` headings.
- Use concise headings.
- Do not overload the document with too many deep heading levels if the TOC should stay readable.

## Manual Page Breaks

If you need a forced page break, use:

```html
<div class="page-break"></div>
```

## Frontmatter Notes

- `toc: true` enables the table of contents.
- `theme` controls the color accent and atmosphere.
- `document_type` helps the renderer choose the right tone for the cover metadata.

## Best Practices

- Keep paragraphs reasonably short.
- Use tables only when comparison matters.
- Provide a summary when the PDF needs a more polished cover.
- Avoid deeply nested lists if the document is meant for print.
