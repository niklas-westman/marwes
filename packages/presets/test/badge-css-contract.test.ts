import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const badgeCssPath = resolve(
  fileURLToPath(new URL("..", import.meta.url)),
  "src/firstEdition/badge.css",
)

describe("badge.css font parity contract", () => {
  const css = readFileSync(badgeCssPath, "utf8")

  it("sets font-family to paragraph font token on .mw-badge", () => {
    expect(css).toContain("font-family: var(--mw-font-primary, inherit);")
  })

  it("retains all variant class hooks", () => {
    const expectedVariants = [
      ".mw-badge--neutral",
      ".mw-badge--brand",
      ".mw-badge--info",
      ".mw-badge--success",
      ".mw-badge--warning",
      ".mw-badge--error",
    ]

    for (const variant of expectedVariants) {
      expect(css).toContain(variant)
    }
  })

  it("retains dark mode overrides", () => {
    expect(css).toContain(".mw-theme--dark .mw-badge--neutral")
    expect(css).toContain(".mw-theme--dark .mw-badge--error")
  })
})
