# Writing Blueprint

Use this blueprint when drafting a new technical handbook, long-form guide, or structured book manuscript.

## Step 1: Define The Editorial Thesis

Write a one-sentence thesis in this shape:

- "This is not just another X. It changes Y because Z."

Then define:

- Topic.
- Reader.
- Primary pain point.
- Differentiator.
- Why now.

If the thesis is weak, the whole book will feel generic.

## Step 2: Design The Book Skeleton

Use a five-part structure by default:

1. Why this category matters.
2. How the system works.
3. How to set it up and extend it.
4. Where it delivers value in practice.
5. Where it fails, what it replaces, and how to judge it.

Recommended chapter counts:

- 2 chapters for Part 1.
- 4 chapters for Part 2.
- 4 chapters for Part 3.
- 4 chapters for Part 4.
- 2 to 3 chapters for Part 5.

## Step 3: Create A Strong TOC

Good chapter titles in this style have two jobs:

- State the topic.
- State the angle.

Examples of title shapes:

- `不是又一个 X：真正变化发生在哪`
- `Y 全景：60 秒看懂`
- `三层 Z：从 A 到 B`
- `自定义能力：教系统新技能`
- `实战场景：从调研到成稿`
- `边界：它能走多远`

## Step 4: Write Each Chapter In Six Moves

### Move 1: Hook

Open with one of:

- A reader objection.
- A trend.
- A common confusion.
- A concrete pain point.
- A surprising contrast.

### Move 2: Plain-Language Claim

State the chapter's conclusion early in ordinary language.

Bad:

- "本章将系统介绍多层记忆架构。"

Better:

- "真正的差别不是它能记住，而是它知道该记住什么。"

### Move 3: Mechanism Breakdown

Break the topic into named modules, layers, steps, or loops. Three to five parts is usually enough.

Readers should leave the chapter able to repeat the model from memory.

### Move 4: Real Scenario

Use a realistic work example:

- writing code,
- creating content,
- managing research,
- running automation,
- coordinating sub-agents,
- integrating tools.

The scenario should prove the mechanism, not just decorate it.

### Move 5: Comparison

Compare with:

- manual workflow,
- old toolchain,
- mainstream alternative,
- neighboring product,
- naive expectation.

Use a table when several dimensions matter at once.

### Move 6: Judgment

End with a strong interpretation:

- when to use it,
- who should care,
- what the limitation is,
- what the next decision should be.

## Step 5: Keep A Shared Memory For The Book

Track this while drafting:

- Preferred metaphors.
- Canonical terms.
- Reader assumptions.
- Repeated examples.
- Things already explained.
- Differentiators versus alternatives.

This prevents each chapter from feeling like it was written in isolation.

## Step 6: Use A Stable Language Style

Preferred language traits:

- Short to medium paragraphs.
- High density, low fluff.
- Occasional rhetorical questions.
- Direct address to the reader.
- Clear judgments instead of hedging.

Avoid:

- abstract academic phrasing,
- vague praise,
- repetitive "首先/其次/最后" structure,
- overlong background sections before making the point.

## Front Matter Template

Use this when preparing the cover or first page:

```markdown
[Series label or brand]
[Main title]
[Subtitle]
[One-line positioning statement]

关键词：A · B · C · D
适合读者：一句话说明
版本：vYYYYMMDD
[Author / organization line]

[Fast-changing ecosystem disclaimer]
```

## Chapter Draft Prompt Template

Use this prompt shape when drafting:

```text
用“橙皮书技术手册”风格写第 X 章。

主题：
本章要回答的问题：
目标读者此刻最关心什么：
上一章已经讲过什么：
这一章需要引入哪些新概念：
需要对比的对象：
需要包含的真实场景：

要求：
1. 先用一个冲突或误解开场。
2. 尽快给出结论。
3. 把机制拆成 3-5 个部分。
4. 用真实工作流举例。
5. 如果有多个维度，请给表格。
6. 结尾给“核心建议”。
7. 保持中文主写，必要时可加英文副标题。
```

## Final Review Checklist

Before the manuscript is done, confirm:

- Every major chapter has a clear angle, not just a topic.
- Core concepts are named and reused consistently.
- The reader can tell how this system differs from alternatives.
- Scenarios feel plausible and specific.
- The book accumulates understanding chapter by chapter.
- The ending sections add judgment, not repetition.

If any chapter could be dropped into another unrelated book without much change, it is still too generic.
