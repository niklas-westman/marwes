/**
 * CSS contract: verifies the firstEdition button stylesheet contains
 * the expected CSS custom properties, selectors, and design tokens.
 */
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

  it("provides a first-class danger variant for destructive actions", () => {
    const css = readFileSync(buttonCssPath, "utf8")

    expect(css).toContain(".mw-btn--danger")
    expect(css).toContain("background: var(--mw-color-danger-base);")
    expect(css).toContain("color: var(--mw-color-danger-label);")
    expect(css).toContain("border-color: var(--mw-color-danger-base);")
  })

  it("keeps text button overlays aligned to the Figma state-layer geometry", () => {
    const css = readFileSync(buttonCssPath, "utf8")

    expect(css).toContain("color: var(--mw-color-text);")
    expect(css).toContain(".mw-btn.mw-btn--text::before")
    expect(css).toContain("inset: -0.25rem -0.5rem;")
    expect(css).toContain(".mw-btn--text:hover:not(:disabled)::before")
    expect(css).toContain(".mw-btn--text:active:not(:disabled)::before")
    expect(css).toContain(
      "background: color-mix(in srgb, var(--mw-color-border-full) 10%, transparent);",
    )
    expect(css).toContain(
      "background: color-mix(in srgb, var(--mw-color-border-full) 20%, transparent);",
    )

    expect(css).not.toContain("color-mix(in srgb, var(--mw-color-primary-base) 8%, transparent)")
    expect(css).not.toContain("color-mix(in srgb, var(--mw-color-primary-base) 12%, transparent)")
  })

  it("renders navigation text buttons as compact underlined links", () => {
    const css = readFileSync(buttonCssPath, "utf8")

    expect(css).toContain('.mw-btn.mw-btn--text[data-action="navigate"]')
    expect(css).toContain('.mw-btn.mw-btn--text[data-action="navigate"]::before')
    expect(css).toContain("content: none;")
    expect(css).toContain("padding: 0.125rem 0;")
    expect(css).toContain("text-decoration: underline;")
    expect(css).toContain("text-underline-offset: 2px;")
  })

  it("truncates the label slot when an icon or spinner affordance is present", () => {
    const css = readFileSync(buttonCssPath, "utf8")

    expect(css).toContain(".mw-btn__label")
    expect(css).toContain('.mw-btn[data-has-affordance="true"] .mw-btn__label')
    expect(css).toContain("display: block;")
    expect(css).toContain("line-height: inherit;")
    expect(css).toContain("letter-spacing: inherit;")
    expect(css).toContain("min-inline-size: 0;")
    expect(css).toContain("overflow: hidden;")
    expect(css).toContain("text-overflow: ellipsis;")
    expect(css).toContain("white-space: nowrap;")
  })

  it("sizes icon-only buttons to the density control height", () => {
    const css = readFileSync(buttonCssPath, "utf8")

    expect(css).toContain('.mw-btn[data-icon-only="true"]')
    expect(css).toContain("width: var(--mw-density-height);")
    expect(css).toContain("min-width: var(--mw-density-height);")
    expect(css).toContain("padding: 0;")
  })
})
