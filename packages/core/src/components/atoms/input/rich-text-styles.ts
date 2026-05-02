import type { RichTextFormat, RichTextOptions } from "./rich-text-types"

const richTextFormats: RichTextFormat[] = ["bold", "italic", "underline"]

export function resolveRichTextAllowedFormats(
  allowedFormats: RichTextOptions["allowedFormats"],
): RichTextFormat[] {
  if (!allowedFormats || allowedFormats.length === 0) {
    return richTextFormats
  }

  const nextFormats = allowedFormats.filter((format): format is RichTextFormat =>
    richTextFormats.includes(format),
  )

  return nextFormats.length > 0 ? Array.from(new Set(nextFormats)) : richTextFormats
}

export function resolveRichTextClassName(opts: RichTextOptions): string {
  const tone = opts.tone ?? "default"
  const invalid = opts.invalid === true ? "is-invalid" : "is-valid"

  return ["mw-rich-text", `mw-rich-text--${tone}`, invalid].join(" ")
}

export function resolveRichTextDataAttributes(
  opts: RichTextOptions,
  allowedFormats: RichTextFormat[],
): Record<string, string | boolean | undefined> {
  return {
    "data-component": "rich-text",
    "data-disabled": opts.disabled ? "true" : undefined,
    "data-readonly": opts.readOnly ? "true" : undefined,
    "data-invalid": opts.invalid ? "true" : undefined,
    "data-formats": allowedFormats.join(" "),
  }
}
