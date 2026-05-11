/**
 * CSS contract: verifies the firstEdition toast stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const toastCssPath = resolve(pkgDir, "src/firstEdition/toast.css")

describe("firstEdition toast css contract", () => {
  it("keeps toast typography light and aligned with Figma text rhythm", () => {
    const css = readFileSync(toastCssPath, "utf8")

    expect(css).toContain(".mw-toast__text")
    expect(css).toContain("font-weight: 400;")
    expect(css).toContain("letter-spacing: 0;")
  })

  it("keeps toast icon and dismiss glyph strokes lightweight", () => {
    const css = readFileSync(toastCssPath, "utf8")

    expect(css).toContain(".mw-toast__icon svg")
    expect(css).toContain("stroke-width: 1.5;")
    expect(css).toContain("stroke-width='1.5'")
  })

  it("renders inline actions as underlined focusable text actions", () => {
    const css = readFileSync(toastCssPath, "utf8")

    expect(css).toContain(".mw-toast__action")
    expect(css).toContain("text-decoration-line: underline;")
    expect(css).toContain(".mw-toast__action-button")
    expect(css).toContain("appearance: none;")
    expect(css).toContain(".mw-toast__action-button:focus-visible")
    expect(css).toContain(".mw-toast__action :where(a, button):focus-visible")
  })

  it("uses readable status tokens for semantic toast intents", () => {
    const css = readFileSync(toastCssPath, "utf8")

    expect(css).toContain("--mw-toast-text: var(--mw-color-status-warning-text, #b45309);")
    expect(css).toContain("--mw-toast-surface: var(--mw-color-status-warning-background, #fff8e6);")
    expect(css).toContain('.mw-toast--outline[data-intent="info"]')
    expect(css).toContain('.mw-toast--rich[data-intent="info"]')
    expect(css).toContain(
      ".mw-theme--dark .mw-toast--outline {\n  --mw-toast-surface: var(--mw-color-background, #0f0f0f);\n  --mw-toast-border: var(--mw-color-border-brand, #5859fc);\n  --mw-toast-icon: var(--mw-color-text-brand, #8182fc);",
    )
    expect(css).toContain("--mw-toast-text: var(--mw-color-status-error-text, #ff5566);")
  })
})
