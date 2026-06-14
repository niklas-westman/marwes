/**
 * CSS contract: verifies the firstEdition select stylesheet.
 */
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
    expect(css).not.toContain("-webkit-appearance: menulist;")
    expect(css).not.toContain(
      "padding: 12px; /* off-scale — native select keeps browser arrow padding */",
    )
  })

  it("keeps the standalone atom on the compact 32px Figma frame", () => {
    const css = readFileSync(selectCssPath, "utf8")

    expect(css).toContain("height: 32px;")
    expect(css).toContain("min-height: 32px;")
    expect(css).toContain(
      "padding: 0 calc(var(--mw-spacing-sp-12) + 16px + var(--mw-spacing-sp-4)) 0",
    )
    expect(css).toContain("right: var(--mw-spacing-sp-12);")
    expect(css).toContain("width: 16px;")
    expect(css).toContain("height: 16px;")
    expect(css).not.toContain(
      ".mw-theme--dark .mw-select {\n  background-color: var(--mw-color-surface-elevated);",
    )
  })

  it("maps the custom dropdown state to named Marwes dropdown tokens", () => {
    const css = readFileSync(selectCssPath, "utf8")

    expect(css).toContain("--mw-dropdown-list-surface")
    expect(css).toContain("--mw-dropdown-list-border")
    expect(css).toContain("--mw-dropdown-item-surface")
    expect(css).toContain("--mw-dropdown-item-surface-hover")
    expect(css).toContain("--mw-dropdown-item-surface-pressed")
    expect(css).toContain("--mw-dropdown-item-label")
    expect(css).toContain("--mw-dropdown-item-check")
  })

  it("keeps dropdown options compact while matching hover and pressed states", () => {
    const css = readFileSync(selectCssPath, "utf8")

    expect(css).toContain("padding: var(--mw-spacing-sp-4) 0;")
    expect(css).toContain("padding: var(--mw-spacing-sp-8) var(--mw-spacing-sp-16);")
    expect(css).toContain("font-family: var(--mw-font-primary, inherit);")
    expect(css).toContain("font-size: 14px;")
    expect(css).toContain("line-height: 16px;")
    expect(css).toContain(
      ".mw-select-field__option--active:not(.mw-select-field__option--disabled)",
    )
    expect(css).toContain(".mw-select-field__option:hover:not(.mw-select-field__option--disabled)")
    expect(css).toContain("background-color: var(--mw-dropdown-item-surface-hover);")
    expect(css).toContain(".mw-select-field__option:active:not(.mw-select-field__option--disabled)")
    expect(css).toContain("background-color: var(--mw-dropdown-item-surface-pressed);")
    expect(css).toContain("height: var(--mw-density-height);")
  })

  it("targets text typography classes for date select field copy", () => {
    const css = readFileSync(selectCssPath, "utf8")

    expect(css).toContain(".mw-input-field--select-date .mw-input-field__label .mw-text")
    expect(css).toContain(".mw-input-field--select-date .mw-input-field__helper .mw-text")
    expect(css).toContain(".mw-input-field--select-date .mw-input-field__error .mw-text")
    expect(css).not.toContain(".mw-input-field--select-date .mw-input-field__label p")
    expect(css).not.toContain(".mw-input-field--select-date .mw-input-field__helper p")
    expect(css).not.toContain(".mw-input-field--select-date .mw-input-field__error p")
  })
})
