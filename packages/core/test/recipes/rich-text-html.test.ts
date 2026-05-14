/**
 * Tests the rich-text HTML sanitizer — strips unsafe tags and event handlers,
 * preserves allowed formatting tags, and escapes plain text to prevent XSS
 * when content is rendered via innerHTML.
 */
import { describe, expect, it } from "vitest"
import { normalizeRichTextHtml } from "../../src/components/atoms/input/index"

describe("normalizeRichTextHtml", () => {
  it("keeps only the supported rich-text tags and strips unsafe attributes", () => {
    const normalized = normalizeRichTextHtml(
      '<p onclick="alert(1)"><strong onmouseover="alert(1)">Safe</strong><img src=x onerror="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">link</a><svg onload="alert(1)"></svg></p>',
    )

    expect(normalized).toBe("<p><strong>Safe</strong>alert(1)link</p>")
    expect(normalized).not.toContain("<img")
    expect(normalized).not.toContain("<script")
    expect(normalized).not.toContain("<svg")
    expect(normalized).not.toContain("<a")
    expect(normalized).not.toContain("onerror")
    expect(normalized).not.toContain("onclick")
    expect(normalized).not.toContain("javascript:")
  })

  it("escapes plain text before it reaches adapter innerHTML sinks", () => {
    expect(normalizeRichTextHtml("<hello")).toBe("&lt;hello")
    expect(normalizeRichTextHtml("hello < world")).toBe("hello &lt; world")
    expect(normalizeRichTextHtml("hello & goodbye")).toBe("hello &amp; goodbye")
  })
})
