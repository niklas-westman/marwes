import type { RichTextFormat } from "./rich-text-types"

const blockTagPattern = /<(?:div|section|article|header|footer|main)(?:\s[^>]*)?>/gi
const closingBlockTagPattern = /<\/(?:div|section|article|header|footer|main)>/gi
const disallowedTagPattern =
  /<\/(?!(?:p|br|strong|em|u)\b)[^>]+>|<(?!\/)(?!(?:p|br|strong|em|u)\b)[^>]+>/gi
const openingParagraphPattern = /<p(?:\s[^>]*)?>/gi
const openingStrongPattern = /<strong(?:\s[^>]*)?>/gi
const openingEmphasisPattern = /<em(?:\s[^>]*)?>/gi
const openingUnderlinePattern = /<u(?:\s[^>]*)?>/gi
const lineBreakPattern = /<br\s*\/?>/gi
const unsupportedAnglePattern = /<(?!\/?(?:p|br|strong|em|u)\b)/gi

export const richTextCommandByFormat: Record<RichTextFormat, string> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
}

export function escapeRichTextHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function normalizeRichTextHtml(rawHtml: string | undefined): string {
  if (!rawHtml) {
    return ""
  }

  const trimmedHtml = rawHtml.replaceAll("\u200B", "").trim()

  if (trimmedHtml.length === 0) {
    return ""
  }

  if (!trimmedHtml.includes("<")) {
    return escapeRichTextHtml(trimmedHtml)
  }

  const normalizedHtml = trimmedHtml
    .replace(/<b(?:\s[^>]*)?>/gi, "<strong>")
    .replace(/<\/b>/gi, "</strong>")
    .replace(/<i(?:\s[^>]*)?>/gi, "<em>")
    .replace(/<\/i>/gi, "</em>")
    .replace(blockTagPattern, "<p>")
    .replace(closingBlockTagPattern, "</p>")
    .replace(openingParagraphPattern, "<p>")
    .replace(openingStrongPattern, "<strong>")
    .replace(openingEmphasisPattern, "<em>")
    .replace(openingUnderlinePattern, "<u>")
    .replace(lineBreakPattern, "<br>")
    .replace(disallowedTagPattern, "")
    .replace(unsupportedAnglePattern, "&lt;")
    .replace(/\s+/g, " ")
    .trim()

  return isRichTextHtmlEmpty(normalizedHtml) ? "" : normalizedHtml
}

export function isRichTextHtmlEmpty(rawHtml: string | undefined): boolean {
  if (!rawHtml) {
    return true
  }

  const collapsedText = rawHtml
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<\/?p>/gi, "")
    .replace(/<\/?strong>/gi, "")
    .replace(/<\/?em>/gi, "")
    .replace(/<\/?u>/gi, "")
    .replace(/&nbsp;/gi, "")
    .replaceAll("\u200B", "")
    .replace(/\s+/g, "")
    .trim()

  return collapsedText.length === 0
}
