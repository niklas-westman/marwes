/**
 * CSS contract: verifies the firstEdition personality stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const personalityCssPath = resolve(pkgDir, "src/firstEdition/personality.css")
const stylesCssPath = resolve(pkgDir, "src/firstEdition/styles.css")

describe("firstEdition personality css contract", () => {
  it("imports personality css from the preset entrypoint", () => {
    const css = readFileSync(stylesCssPath, "utf8")

    expect(css).toContain('@import "./personality.css";')
  })

  it("exposes an attribute selector for each non-flat personality", () => {
    const css = readFileSync(personalityCssPath, "utf8")

    expect(css).toContain('[data-marwes-personality="glow"]')
    expect(css).toContain('[data-marwes-personality="print"]')
    expect(css).toContain('[data-marwes-personality="soft"]')
    expect(css).toContain('[data-marwes-personality="outlined"]')
  })

  it("ships no CSS rules for the flat personality", () => {
    const css = readFileSync(personalityCssPath, "utf8")

    expect(css).not.toMatch(/\[data-marwes-personality="flat"\][^\n]*\{/)
  })

  it("attaches signature effects to design-system class names", () => {
    const css = readFileSync(personalityCssPath, "utf8")

    expect(css).toContain(".mw-btn--primary")
    expect(css).toContain(".mw-switch__thumb")
    expect(css).toContain(".mw-card")
  })

  it("resolves signature colors via theme CSS variables — no literal palette hexes", () => {
    const css = readFileSync(personalityCssPath, "utf8")

    expect(css).toContain("var(--mw-color-primary-base")
    expect(css).toContain("var(--mw-color-text")
    expect(css).toContain("var(--mw-color-border-strong")
    expect(css).toContain("var(--mw-card-border")
    expect(css).not.toMatch(/#[0-9a-fA-F]{6}(?![0-9a-fA-F])/)
  })

  it("guards print personality motion behind reduced-motion opt-out", () => {
    const css = readFileSync(personalityCssPath, "utf8")

    expect(css).toContain("@media (not (prefers-reduced-motion: reduce))")
    expect(css).toContain('[data-marwes-personality="print"] .mw-btn--primary:hover')
  })
})
