---
name: longform-html-infographic
description: Generate long-form infographic images with HTML/CSS and Playwright, optimized for whitespace, reading rhythm, and low-density information design instead of short-card carousel layouts.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [infographic, html, css, longform, playwright, visual-design]
---

# Longform HTML Infographic

Use this when the user wants **one tall infographic** instead of a multi-page carousel, especially when a previous carousel-style layout feels too dense or visually cramped.

This skill is primarily about:

- layout quality,
- whitespace,
- readability,
- section rhythm,
- visual hierarchy,
- mobile-friendly scanning,
- and polished longform presentation.

It should stay reusable across many subjects rather than binding itself to a single domain or workflow type.

## When to use

Trigger when the user asks for:

- 长信息图
- 超长图
- one long infographic
- 纵向长图
- an explanation that should be scannable top-to-bottom rather than page-by-page
- a redesign because the current layout is too dense / lacks breathing room / looks like stitched carousel pages

## Core principle

A long infographic is **not** just several carousel cards glued vertically.

If you reuse short-card Xiaohongshu layout patterns, the result often feels:

- too dense,
- too fragmented,
- visually noisy,
- lacking reading rhythm.

Instead, use **longform information design**:

1. fewer modules per screen-height,
2. larger vertical spacing between sections,
3. one main point per section,
4. bigger section headings,
5. fewer simultaneous highlight colors,
6. stronger narrative flow from top to bottom.

## Layout rules

### 0. Default visual direction: magazine feature, not dashboard

Unless the user explicitly asks for a louder social-media style, default to a **杂志特稿风 / editorial feature** direction:

- restrained palette,
- large headline hierarchy,
- generous whitespace,
- fewer boxes,
- fewer highlight colors,
- emphasis on reading flow over data-density,
- less "UI card board", more "designed article page".

This should feel closer to a premium feature story than to a slide deck or Xiaohongshu card wall.

### 1. Prefer section rhythm over card grids

Good structure:

- hero / framing
- section 1
- section 2
- section 3
- section 4
- conclusion

Avoid stacking many small dashboard cards in every section.

### 2. Increase breathing room aggressively

Default recommendations:

- outer padding: 64–84px
- section top spacing: 72–110px
- paragraph line-height: 1.65–1.85
- card radius: 24–36px
- keep max two columns per section unless data truly requires three

### 3. Lower same-screen density

For each major section, keep to one of these patterns:

- heading + paragraph + one 2-column container
- heading + paragraph + vertical timeline
- heading + paragraph + one large highlight box
- heading + paragraph + a few spacious list cards

Do **not** combine all of the above in the same immediate viewport region.

### 4. Use longform-specific visual hierarchy

Recommended hierarchy:

- small top tag / label
- large hero title (60–78px desktop output)
- generous intro paragraph
- section number chip + section title
- one intro paragraph per section
- content module beneath the intro

For the **magazine-feature** variant, prefer:

- 1 dominant headline block,
- 1 short deck / standfirst,
- 1 primary content container per section,
- occasional quote / note / pull-highlight,
- fewer repeated metric cards.

### 4.1 Rag control and line-length discipline

Longform layouts fail when long Chinese text wraps unpredictably and creates awkward height differences.

You must actively control text shape:

- keep section titles ideally within **2 lines**,
- keep support paragraphs ideally within **4–6 lines**,
- split long explanations into a short intro + bullets instead of one dense paragraph,
- keep comfortable line length around **14–24 Chinese characters per line equivalent zone**, depending on font size,
- constrain wide text blocks with `max-width`,
- avoid placing two text-heavy boxes side-by-side unless both are similarly short,
- if one column becomes much taller than the other, switch that section to a vertical stack.

Do not let layout symmetry depend on lucky text wrapping.

### 4.2 Height-balance rule for side-by-side modules

Before finalizing any 2-column section, check whether the two columns are visually balanced.

If one side is much taller because of line wraps, long links, or bullet count:

- rewrite the copy shorter,
- convert one side into a note block,
- move overflow content below both columns,
- or collapse the section into a single-column layout.

A calm vertical rhythm is more important than preserving a 2-column composition.

### 4.3 Left-rail alignment discipline

Longform graphics look messy when each block starts at a slightly different horizontal position.

Use a consistent left rail system:

- section heading row establishes the primary left rail,
- intro paragraph, quote, note, feature box, and list modules should share the same content start column,
- avoid ad-hoc `margin-left` variations between neighboring blocks,
- if a section uses a numbered chip column, all follow-up modules in that section should align to one shared text rail,
- if a block intentionally breaks the rail, it must look clearly intentional, not accidental.

The page should feel like it is built on one invisible grid.

### 4.5 Chinese headline line-break rules

Chinese hero titles often fail because the browser wraps them mechanically.

You must actively control headline breaks instead of leaving them entirely to automatic line wrapping.

Rules:

- avoid leaving a **single Chinese character** alone on a line,
- avoid splitting a tight phrase awkwardly,
- avoid one very long first line followed by one tiny second line,
- aim for visually balanced 2-line titles when the title is long,
- if the automatic wrap is ugly, insert a manual `<br>` at a semantically natural phrase boundary,
- prefer breaking by phrase rather than by raw character count,
- if a title still wraps badly after manual breaks, shorten the wording before shrinking the font.

Good examples:

- break before a complete trailing phrase,
- keep key noun phrases intact,
- let the second line feel intentional rather than leftover.

Bad examples:

- one orphan character on line 2,
- splitting a branded phrase into unnatural fragments,
- forcing 3+ short ragged lines in the hero when 2 balanced lines would work better.

Use:

- one warm accent or one cool accent,
- one optional secondary accent,
- soft tinted backgrounds,
- minimal decorative gradients.

For the **magazine-feature** mode, reduce visual noise further:

- background should be quiet and paper-like,
- avoid too many bordered cards in a row,
- prefer 1–2 accent surfaces per section max,
- let typography and spacing do more of the work than colored containers.

The long infographic should feel editorial, not like a promotional poster.

### 5.1 Mobile reading assumptions

Even if you render at 1080px wide, assume the final reading surface is a phone screen.

Design for mobile-first scanning:

- titles must remain readable when the image is zoomed to screen width,
- avoid 3-column layouts,
- avoid tiny labels that only work on desktop,
- leave enough vertical spacing that readers can pause naturally while scrolling,
- prefer strong section starts and obvious transitions,
- keep links / IDs / codes out of dense inline paragraphs when possible,
- if a URL is long, isolate it in its own block.

A good test is: if someone reads only by vertical scrolling on a phone, the narrative should still feel calm and understandable.

## Recommended canvas

- width: `1080px`
- height: auto based on content
- output often lands around `5000px` to `10000px` high

Render by screenshotting the root container rather than fixed viewport screenshots.

## HTML structure pattern

```html
<div class="longpage">
  <section class="hero">...</section>
  <section class="section">...</section>
  <section class="section">...</section>
  <section class="big-end">...</section>
</div>
```

Recommended semantic blocks:

- `.topline`
- `.tag`
- `.hero`
- `.section`
- `.meta`
- `.intro`
- `.big-card`
- `.timeline`
- `.t-item`
- `.callout`
- `.big-end`

## Content compression rules

When converting dense procedural or analytical content into longform infographic form:

1. Identify the 5–8 most important stages or claims.
2. Give each stage exactly one headline.
3. Write one explanatory paragraph per stage.
4. Add only one supporting module below that paragraph.
5. Merge minor details into bullets instead of creating new cards.

## Narrative adaptation rules

This skill is **content-agnostic**. Its job is not to force a specific subject matter (Agent logs, business analysis, research, etc.), but to turn any dense source material into a readable longform visual narrative.

When the source material is raw logs, notes, outlines, process records, or fragmented bullets:

1. identify the core story arc,
2. convert fragments into a few human-readable stages,
3. decide what should be emphasized as narrative vs what should be reduced to side notes,
4. preserve only the metrics that genuinely help comprehension,
5. remove low-value operational noise.

## Raw material translation rules

If the input contains low-level items such as commands, tool names, or process records, do **not** dump them directly into the graphic as the main content.

For execution-log visualizations, a strong reusable pattern is:

- keep a compact raw action snippet visible,
- place it in a narrow left column,
- translate it in a wider right column,
- explain in plain language what that action accomplished in the workflow.

This preserves the authenticity of the log while keeping the page readable to non-expert readers.

Instead, translate them into one of these roles:

- a stage in the story,
- a supporting proof point,
- a side-note metric,
- a compact example,
- or remove them entirely if they do not help reading.

Examples:

- raw action list → a human-readable sequence of stages
- repeated probes / checks → one summarized decision step
- long shell command → one plain-language explanation of what was being tested
- dense operational metadata → small side metrics, if truly useful

Avoid long raw command lines unless the user explicitly wants a technical appendix.

## Metrics discipline

Use metrics only when they help the story.

Good longform graphics are not dashboards. Even if data exists, do not overload the page with counters.

If exact telemetry such as total tokens, hidden model calls, or precise latency is unavailable, mark it as unavailable rather than inventing values.

## Story-first rule

Before laying out a longform infographic, answer this:

- Is this graphic primarily **narrative**, **explanatory**, **analytical**, or **documentary**?

Then let layout follow that mode.

For **narrative** longforms, prefer:

- clear beginning / middle / end,
- one major action per section,
- fewer metrics,
- more prose rhythm,
- more visual breathing room.

For **analytical** longforms, allow somewhat more structure and proof blocks.

But in all cases, this skill should remain a **layout and presentation skill**, not a content-domain skill.

## Bad pattern to avoid

Do **not** do this:

- start from 4–6 existing carousel pages,
- vertically concatenate all their card structures,
- keep the same short-card density,
- call the result a long infographic.

This produces a cramped result with poor breathing room.

## Rendering workflow

1. Create `styles.css`
2. Create `infographic.html`
3. Launch Playwright
4. Load the local HTML file
5. Wait for the root container (e.g. `.longpage`)
6. Screenshot the container element directly

Example pattern:

```js
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1000 } });
await page.goto('file://' + htmlPath, { waitUntil: 'load' });
await page.locator('.longpage').waitFor({ state: 'visible', timeout: 10000 });
await page.locator('.longpage').screenshot({ path: outPath });
await browser.close();
```

## Verification checklist

After rendering:

- confirm output PNG exists,
- check width/height with `sips -g pixelWidth -g pixelHeight <file>` on macOS or another image metadata tool,
- inspect the HTML source to confirm the new design truly uses longform structure rather than stitched short-card layout,
- compare section density qualitatively against the old version,
- inspect for title wrapping problems,
- inspect for uneven side-by-side box heights caused by long text,
- inspect whether any section feels cramped on a phone-width mental model,
- if the page still feels busy, remove modules before shrinking typography.

## Magazine-feature styling guidance

When the user explicitly asks for a more premium, restrained, feature-story visual language:

- use fewer visible boxes overall,
- allow some sections to be mostly typography + whitespace,
- increase outer margins and inter-section spacing,
- use muted neutrals and one restrained accent,
- make hero feel like a cover story, not a dashboard,
- use larger section titles and smaller supporting UI chrome,
- convert some metric groups into prose summaries if the metrics are not the real visual focus,
- prefer asymmetry with control rather than rigid card grids.

## Rewrite rule when layout feels messy

If a generated long infographic still feels messy, do not just tweak colors.

Instead, explicitly do at least 3 of the following:

1. remove one whole support module from each dense section,
2. turn 2-column sections into 1-column sections where text is long,
3. shorten titles and decks,
4. move long details into a quieter note block,
5. reduce repeated metric-card patterns,
6. increase top/bottom spacing between sections,
7. isolate URLs, IDs, or proof points into separate low-noise blocks,
8. normalize all section follow-up modules to one shared left rail.

## Language guidance for Chinese longform graphics

When writing Chinese narrative copy for the graphic:

- prefer direct declarative sentences,
- describe what happened in sequence,
- avoid repetitive AI-sounding contrast formulas such as “不是…而是…”,
- avoid over-explaining the same point twice,
- use shorter, cleaner transitions,
- let structure carry clarity instead of relying on rhetorical contrast.

Good tone:

- clear,
- calm,
- editorial,
- specific.

Bad tone:

- formulaic contrast,
- over-signposted AI copy,
- repetitive “本质上 / 真正 / 其实” stacking.

## Response guidance

When the user says the old long image is too dense, explicitly say you will:

- stop using the short-carousel layout pattern,
- redesign with longform reading rhythm,
- increase whitespace,
- reduce same-screen information density,
- regenerate and resend the image.

## Good outcome

A successful longform infographic should feel:

- calmer,
- easier to scroll,
- more editorial,
- more narrative,
- less like a page collage.
