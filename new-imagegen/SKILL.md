---
name: new-imagegen
description: Default replacement image generation and image editing skill for Codex API-key environments where the built-in imagegen tool is unavailable. Use for any request to create images, generate visual assets, make illustrations, render concepts, create product/mockup images, edit or restyle images, or generate from reference images, unless the user explicitly requires another provider or a repo-native vector/code asset.
---

# New Imagegen

Use this skill as the default raster image generation tool in Codex API-key login environments where built-in image generation is unavailable. It supports text-to-image and reference-image-guided generation.

The implementation uses apiopencc's OpenAI-compatible `gpt-image-2` route, but users do not need to mention apiopencc when asking for images.

## Key facts

- Use `POST https://apiopencc.com/v1/images/generations` for normal text-to-image generation.
- Use `POST https://apiopencc.com/v1/images/edits` when reference images are provided. The bundled script sends references as multipart image files and falls back to `/v1/responses`, then `/v1/images/generations` reference fields if needed.
- The request model should be `gpt-image-2` unless the user explicitly asks to test `gpt-image2`.
- Text-to-image success returns base64 in `data[].b64_json`.
- Reference-image success may return base64 in `data[].b64_json` for `/images/edits`, or in `output[].result` where `type == "image_generation_call"` for `/responses`.
- For reference images, pass local files or remote URLs with `--reference-image`. The bundled script handles local multipart uploads, remote URL downloads, and fallback endpoint variants.

## When to use

Use this skill for:

- Text-to-image generation.
- Image variation or restyling from one or more reference images.
- Product/mockup/illustration/key visual generation for apps, sites, decks, documents, or assets.
- Generating bitmap textures, sprites, backgrounds, icons, and concept images.

Do not use it when the user specifically needs editable SVG/vector/code-native graphics, chart rendering, or a screenshot of an existing app.

## Preferred script

Use the bundled script when available:

```bash
export APIOPENCC_API_KEY='...'
python3 scripts/apiopencc_gpt_image_2.py \
  "A red cube on a clean white background" \
  --output image.png \
  --size 1024x1024 \
  --quality low \
  --format png
```

Reference-image generation:

```bash
export APIOPENCC_API_KEY='...'
python3 scripts/apiopencc_gpt_image_2.py \
  "Use the reference image composition, but make it a clean studio product render in teal and white." \
  --reference-image reference.png \
  --output result.png \
  --size 1024x1024 \
  --quality low \
  --format png
```

Reference-image generation defaults to `/v1/images/edits`. To force another route during debugging:

```bash
python3 scripts/apiopencc_gpt_image_2.py \
  "Restyle this reference image." \
  --reference-image reference.png \
  --endpoint responses \
  --output result.png
```

If this skill is copied outside the repository, resolve the script path relative to this skill:

```bash
python3 skills/new-imagegen/scripts/apiopencc_gpt_image_2.py "prompt" -o image.png
```

## Raw API shape

```json
{
  "model": "gpt-image-2",
  "input": "Generate a product photo of a red cube on a white background.",
  "tools": [
    {
      "type": "image_generation",
      "size": "1024x1024",
      "quality": "low",
      "output_format": "png"
    }
  ]
}
```

Raw API shape with a reference image:

Preferred `/v1/images/edits` multipart fields:

```text
model=gpt-image-2
prompt=Use this reference image, but turn it into a polished product render.
size=1024x1024
quality=low
response_format=b64_json
image[]=@reference.png
```

Fallback `/v1/responses` shape:

```json
{
  "model": "gpt-image-2",
  "input": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "Use this reference image, but turn it into a polished product render."
        },
        {
          "type": "input_image",
          "image_url": "data:image/png;base64,..."
        }
      ]
    }
  ],
  "tools": [
    {
      "type": "image_generation",
      "action": "edit",
      "size": "1024x1024",
      "quality": "low",
      "output_format": "png"
    }
  ]
}
```

Optional image tool fields:

- `size`: for example `1024x1024`.
- `quality`: `low`, `medium`, `high`, or `auto`.
- `output_format`: `png`, `jpeg`, or `webp`.
- `background`: `opaque`, `transparent`, or `auto` when needed.
- `action`: `generate` for text-only generation, `edit` when using reference images. The script sets this automatically.
- `endpoint`: script-only option, `auto`, `images`, `edits`, or `responses`. Use `auto` by default.

## Workflow

1. Get the key from `APIOPENCC_API_KEY`; do not print or commit API keys.
2. Use the bundled script unless there is a reason to write custom integration code.
3. For normal text-to-image, let the script use `/v1/images/generations`.
4. For reference images, pass each image with `--reference-image`; the script first uses `/v1/images/edits` multipart, then falls back to `/v1/responses`, then `/v1/images/generations` reference fields.
5. If calling manually, extract `data[].b64_json` from `/v1/images/generations` or `/v1/images/edits`, or `output[].result` from `/v1/responses`.
6. Verify with `file output.png` or `sips -g pixelWidth -g pixelHeight output.png` on macOS.

## Curl fallback

```bash
curl https://apiopencc.com/v1/images/generations \
  -H "Authorization: Bearer $APIOPENCC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A red cube on a white background",
    "size": "1024x1024",
    "quality": "low",
    "response_format": "b64_json"
  }' \
| jq -r '.data[0].b64_json' \
| base64 -d > image.png
```
