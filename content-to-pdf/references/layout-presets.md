# Layout Presets

The `content-to-pdf` skill supports a few generic visual presets through the `theme` field.

## Themes

### `slate`

- neutral blue-gray accent,
- best for reports, briefs, and internal documents,
- default option.

### `ember`

- warm orange accent,
- best for essays, guides, and narrative long-form content,
- slightly more editorial.

### `forest`

- deep green accent,
- best for strategy docs, policy docs, and reflective long-form pieces,
- calm and formal.

## Document Types

### `article`

- reader-first hierarchy,
- lighter metadata,
- softer cover.

### `report`

- stronger cover structure,
- better for executive summaries and internal review docs,
- recommended for most business and project documents.

### `guide`

- slightly more instructional,
- section hierarchy matters more,
- useful for onboarding docs and procedural PDFs.

## Recommendation

If the content is mixed and no specific tone is requested:

- use `document_type: report`
- use `theme: slate`

That combination is the safest general default.
