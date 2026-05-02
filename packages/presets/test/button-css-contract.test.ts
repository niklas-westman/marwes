import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const buttonCssPath = resolve(pkgDir, "src/firstEdition/button.css")

describe("firstEdition button css contract", () => {
  it("uses the primary label token for filled primary buttons", () => {
    const css = readFileSync(buttonCssPath, "utf8")

    expect(css).toContain("color: var(--mw-color-primary-label);")
  })

  it("uses emitted theme color vars for text buttons", () => {
    const css = readFileSync(buttonCssPath, "utf8")

    expect(css).toContain("color: var(--mw-color-text);")
    expect(css).toContain("color-mix(in srgb, var(--mw-color-text) 8%, transparent)")
    expect(css).toContain("color-mix(in srgb, var(--mw-color-text) 12%, transparent)")

    expect(css).not.toContain("--mw-color-text-label")
    expect(css).not.toContain("--mw-color-text-surface")
    expect(css).not.toContain("--mw-color-text-surface-pressed")
  })

  it("renders navigation text buttons as compact underlined links", () => {
    const css = readFileSync(buttonCssPath, "utf8")

    expect(css).toContain('.mw-btn.mw-btn--text[data-action="navigate"]')
    expect(css).toContain("padding: 0.125rem 0;")
    expect(css).toContain("text-decoration: underline;")
    expect(css).toContain("text-underline-offset: 2px;")
  })
})
