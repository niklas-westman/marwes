import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const selectCssPath = resolve(pkgDir, "src/firstEdition/select.css")

describe("firstEdition select css contract", () => {
  it("styles the native control with shared input tokens and custom chrome", () => {
    const css = readFileSync(selectCssPath, "utf8")

    expect(css).toContain("appearance: none;")
    expect(css).toContain("border: 1px solid var(--mw-color-border);")
    expect(css).toContain("color: var(--mw-color-text);")
    expect(css).toContain("var(--mw-color-text-muted)")
  })

  it("maps the custom dropdown state to named Marwes dropdown tokens", () => {
    const css = readFileSync(selectCssPath, "utf8")

    expect(css).toContain("--mw-dropdown-list-surface")
    expect(css).toContain("--mw-dropdown-list-border")
    expect(css).toContain("--mw-dropdown-item-surface")
    expect(css).toContain("--mw-dropdown-item-label")
    expect(css).toContain("--mw-dropdown-item-check")
  })

  it("keeps selected dropdown options neutral while using compact menu spacing", () => {
    const css = readFileSync(selectCssPath, "utf8")

    expect(css).toContain("padding: var(--mw-spacing-xxs) 0;")
    expect(css).toContain("padding: var(--mw-spacing-xs) var(--mw-spacing-sm);")
    expect(css).toContain("font-family: var(--mw-font-primary, inherit);")
    expect(css).toContain("font-size: 14px;")
    expect(css).toContain("line-height: 16px;")
    expect(css).toContain(
      ".mw-select-field__option--active:not(.mw-select-field__option--selected)",
    )
    expect(css).toContain(".mw-select-field__option:hover:not(.mw-select-field__option--selected)")
  })
})
