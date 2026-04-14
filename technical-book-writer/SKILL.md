---
name: technical-book-writer
description: Use when the user wants to write a Chinese technical book, handbook, long-form guide, playbook, or "from beginner to mastery" manual with strong narrative structure, chapter rhythm, comparisons, scenarios, and actionable conclusions. Trigger on requests like "写一本技术书", "从入门到精通", "技术手册", "方法论书稿", "出一本 PDF 书", or when asked to turn a technical topic into a structured manuscript.
---

# Technical Book Writer

## Overview

This skill turns proven technical-handbook patterns into a reusable workflow for creating Chinese long-form books and manuals. It is optimized for "concept + mechanism + setup + use cases + judgment" books that need to feel readable, opinionated, and executable instead of academic or generic.

## What This Skill Produces

- A strong book positioning statement with subtitle, keywords, target readers, and version framing.
- A multi-part table of contents that moves from concept to mechanics to hands-on setup to scenarios to judgment.
- Chapters that combine explanation, examples, comparison tables, and practical advice.
- A stable narrative voice: conversational, authoritative, direct, and written for smart practitioners.

## Core Writing Model

The target output is not just "good prose". It follows a repeatable editorial system:

1. Start with a sharp thesis.
2. Translate abstract ideas into concrete user value.
3. Break the system into named modules.
4. Explain each module through scenarios, contrasts, and operational details.
5. End sections with advice, judgment, or decision guidance.

Read [writing-blueprint.md](./references/writing-blueprint.md) when you need the full execution recipe, chapter template, and quality checklist.

Read [editorial-patterns.md](./references/editorial-patterns.md) when you need the distilled methodology behind strong technical books: information architecture, chapter rhythm, tone, and narrative devices.

Read [style-guide.md](./references/style-guide.md) when the task includes visual layout, PDF aesthetics, chapter pages, cover quality, or export requirements.

## When To Use This Skill

Use this skill when the user wants to:

- Write a technical book, handbook, playbook, or long-form guide in Chinese.
- Produce a polished Chinese PDF book or long-form guide about a product, framework, toolchain, engineering method, or domain workflow.
- Turn a technical topic into a readable series of chapters with strong structure and story.
- Create a "从入门到精通", "完全指南", "实战手册", or "深度拆解" style manuscript.

Do not use this skill for:

- Academic papers.
- Pure fiction or narrative essays.
- Short blog posts without book-like structure.
- API reference documentation that should stay terse and exhaustive.

## Workflow

### 1. Lock The Book Thesis

Define four things up front:

- What category the book is in.
- What problem or misconception the book is correcting.
- Who the primary reader is.
- Why this topic matters right now.

The book needs a point of view, not just a topic. Favor framing like:

- "This is not just another X."
- "The real shift is Y, not Z."
- "What changed is not the model, but the surrounding system."

### 2. Design The Macro Structure

Default to a five-part spine unless the user gives a better structure:

1. Concepts: what this thing is and why it matters.
2. Core mechanisms: the engine, architecture, memory, tools, workflows.
3. Hands-on setup: installation, configuration, first use, extension points.
4. Real scenarios: knowledge work, coding, content, automation, collaboration.
5. Deep judgment: comparisons, trade-offs, risks, limitations, future direction.

This structure works because it mirrors how readers build conviction:

- First they need orientation.
- Then they need mechanism.
- Then they need operation.
- Then they need proof through use cases.
- Finally they need judgment.

### 3. Draft The Cover And Front Matter

Prepare:

- Main title.
- Subtitle.
- One-line promise.
- Keywords.
- Suitable readers.
- Version number or scope note.
- Author identity line if helpful.
- Short warning that the ecosystem changes fast.

The front matter should make the book feel like a designed artifact, not a pasted document.

### 4. Write Each Chapter With A Fixed Internal Rhythm

Default chapter rhythm:

1. Chapter title in Chinese.
2. Short English subtitle if it improves product feel.
3. Hook: an objection, pain point, surprise, or trend.
4. Plain-language explanation of the core claim.
5. Named breakdown: components, steps, or layers.
6. Concrete scenario or walkthrough.
7. Comparison table, metrics, or architecture summary when useful.
8. "Core advice" or equivalent closing judgment.

Not every chapter needs every element, but most should contain at least:

- A hook.
- A system breakdown.
- An example.
- A takeaway.

### 5. Keep The Voice Tight

Write in a voice that is:

- Conversational, not casual.
- Opinionated, not arrogant.
- Technical, but readable without jargon overload.
- Reader-facing: use "你" naturally when making decisions vivid.

Prefer short paragraphs. One paragraph should usually do one job.

### 6. Preserve Cross-Chapter Continuity

Track these across the whole manuscript:

- Repeated metaphors.
- Reader persona.
- Terminology choices.
- Comparisons to neighboring tools or categories.
- Previously introduced concepts that should not be re-explained from zero.

The book should feel cumulative, as if the author is building a mental model layer by layer.

### 7. Finish With Judgment, Not Just Information

A chapter is incomplete if it only explains. It should also answer:

- Why should the reader care?
- When is this approach better?
- What are the trade-offs?
- What should the reader do next?

## Chapter Template

Use this template when the user asks for a new chapter:

```markdown
§NN 章节名：一句话说清这一章解决什么问题
English subtitle if useful

[Hook]
从一个认知冲突、用户痛点、行业误解或趋势变化切入。

[Core claim]
先用朴素语言给出结论，再解释为什么。

[Breakdown]
把能力拆成 3-5 个模块、步骤、层次或机制。

[Scenario]
给一个真实工作场景，说明系统怎样被使用、为什么比旧方法更顺。

[Comparison]
必要时用表格、指标、对比维度说明和旧方案/竞品/替代路径的差异。

[Core advice]
收束到一个判断、建议或行动方向。
```

## Style Constraints

- Favor strong section names.
- Favor declarative statements over fluffy transitions.
- Use rhetorical questions sparingly but effectively.
- Use tables when comparing systems, not for decoration.
- Use numbers only when they support persuasion or orientation.
- Avoid empty praise like "非常强大" unless you immediately show why.
- Avoid academic over-definition. Name the concept, then operationalize it.

## Quality Bar

Before delivering, verify that the manuscript has:

- A visible point of view.
- A reader journey from confusion to clarity.
- Concrete mechanisms instead of vague praise.
- At least one scenario in major chapters.
- At least one comparison lens in evaluative chapters.
- Closing advice or judgment in most chapters.
- Consistent naming and terminology.

If the writing feels like a collection of notes, it is not done yet.

## Rendering Workflow

This skill includes a local rendering pipeline for HTML/CSS-based PDF generation.

- Use [template.html](./assets/template.html) as the base document shell.
- Use [styles.css](./assets/styles.css) for the default editorial technical-book visual language.
- Put manuscript source in Markdown with YAML frontmatter.
- Use [sample-book.md](./examples/sample-book.md) as the structural example.
- Export with [export_pdf.mjs](./scripts/export_pdf.mjs).

Recommended workflow:

1. Draft the manuscript in Markdown.
2. Keep metadata in frontmatter: title, subtitle, tagline, keywords, readers, version, author.
3. Use `# Part ...` for part dividers.
4. Use `## §NN ...` for chapter starts.
5. Use raw HTML blocks for special visual components such as flow cards when needed.
6. Render to PDF with Chromium via Playwright.

Example:

```bash
node technical-book-writer/scripts/export_pdf.mjs \
  --input technical-book-writer/examples/sample-book.md \
  --output output/pdf/hermes-sample.pdf
```
