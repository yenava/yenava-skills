# Style Guide

Use this guide when the user wants the manuscript to look like a polished editorial technical-book PDF rather than merely sound like one.

## Design Goal

The page should feel like a polished technical handbook:

- calm,
- spacious,
- editorial,
- slightly productized,
- strongly structured.

It should not look like:

- default Markdown export,
- corporate Word document,
- academic paper,
- slide deck pasted into PDF.

## Core Visual System

### Color

Use a restrained palette:

- Accent orange: chapter numbers, rules, outlines, key highlights.
- Near-black: primary headings and body emphasis.
- Soft gray: English subtitle, secondary metadata, dividers.
- Warm white background.

Suggested tokens:

- `--accent: #cf4e14`
- `--accent-soft: #f7ede7`
- `--ink: #202124`
- `--muted: #8a8f98`
- `--line: #d9dde3`
- `--paper: #ffffff`
- `--paper-warm: #fcfaf7`

### Typography

Chinese body text should read cleanly in long-form PDF export.

Recommended stack:

- Chinese: `PingFang SC`, `Noto Sans SC`, `Source Han Sans SC`
- English support: `Helvetica Neue`, `Arial`, `sans-serif`

Hierarchy:

- Chapter title: bold, large, compact.
- English subtitle: italic, light gray.
- Section heading: dark, compact, heavier than body.
- Body: medium size, generous line-height.

### Spacing

Use whitespace as structure.

- Wide page margins.
- Clear gap between chapter heading and first paragraph.
- Large gap before secondary section headings.
- Loose but not airy body line-height.

## Visual Direction

The upgraded template follows an editorial-industrial direction:

- white paper with warm undertones,
- restrained orange as a structural accent,
- strong geometry but not brutalism,
- product-handbook precision with magazine-like hierarchy.

The goal is not visual noise. The goal is to make the PDF feel authored.

## Page Types

The system should have three visual page modes:

### 1. Cover

Needs:

- series or label line,
- main title,
- subtitle,
- positioning sentence,
- keyword chips,
- a structured metadata card,
- version note,
- author line.

The cover should feel branded but restrained. Prefer asymmetry, a right-side metadata panel, subtle grid lines, and one or two atmospheric orange glows. It should look like a crafted object, not a centered title page.

### 2. TOC

Needs:

- clear part grouping,
- chapter numbering,
- compact but readable list rhythm.

The TOC should read like an editorial index:

- small English eyebrow,
- strong part title,
- lighter chapter text,
- enough line rhythm to scan quickly.

### 3. Chapter Page

Each chapter should open with:

- top orange rule,
- orange `§NN`,
- large bold Chinese title,
- italic English subtitle,
- generous breathing room before the first paragraph.

This is the most recognizable page pattern from the source PDF.

The upgraded system also adds:

- a subtle title underline,
- tighter number-title relationship,
- more refined subtitle typography.

### 4. Part Divider

Each part divider should feel ceremonial, not merely functional.

Use:

- a large faded background number,
- clear `Part N` kicker,
- oversized Chinese part title,
- light narrative copy if available.

## Component Rules

### Top Rule

Use a single orange horizontal line near the top of every chapter opening page.

### Chapter ID

The `§NN` prefix should be orange and visually separated from the title text.

### English Subtitle

Keep it:

- lighter,
- italic,
- smaller than the body,
- close enough to the title to read as one unit.

### Flow Cards

For process chains such as:

`策划记忆 -> 创建 Skill -> Skill 自改进 -> FTS5 召回 -> 用户建模`

Use outlined capsules with:

- orange border,
- small radius,
- white fill,
- centered bold text,
- gray arrows between items.

### Tables

Tables should look editorial, not spreadsheet-like:

- light borders,
- strong header row,
- compact cells,
- enough padding to breathe.

## Content Markup Conventions

The renderer assumes:

- `# Part X: ...` starts a part divider.
- `## §NN ...` starts a chapter.
- the first italic line under a chapter heading becomes the English subtitle.
- `### ...` becomes an internal section heading.
- raw HTML can be used for special components such as flow cards.

## Print Constraints

When exporting to PDF:

- use A4,
- keep generous top and side margins,
- prevent awkward heading widows,
- force page breaks before part and chapter openings,
- preserve vector-like crispness for lines and borders.

## Quality Checklist

Before approving the PDF, verify:

- chapter opening pages look visually intentional,
- orange accent is present but not noisy,
- subtitles are legible but secondary,
- body text is not cramped,
- flow cards align cleanly,
- TOC hierarchy is obvious,
- the PDF does not look like a browser printout of plain Markdown.
