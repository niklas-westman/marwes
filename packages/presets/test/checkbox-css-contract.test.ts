/**
 * CSS contract: verifies the firstEdition checkbox stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const checkboxCssPath = resolve(pkgDir, "src/firstEdition/checkbox.css")
const checkboxFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/checkbox-field.css")
const checkboxGroupFieldCssPath = resolve(
  pkgDir,
  "src/firstEdition/molecules/checkbox-group-field.css",
)

describe("firstEdition checkbox css contract", () => {
  it("uses the primary label token for the checked indicator", () => {
    const css = readFileSync(checkboxCssPath, "utf8")

    expect(css).toContain("--mw-checkbox-check: var(--mw-color-primary-label);")
  })

  it("keeps keyboard focus visible on the checkbox control", () => {
    const checkboxCss = readFileSync(checkboxCssPath, "utf8")
    const css = readFileSync(checkboxFieldCssPath, "utf8")

    expect(checkboxCss).toContain(".mw-checkbox:focus-visible")
    expect(checkboxCss).toContain("outline: 2px solid var(--mw-color-focus);")
    expect(css).not.toContain(".mw-checkbox-field__row:has(.mw-checkbox:focus-visible)")
    expect(css).toContain(".mw-checkbox-field__description .mw-text")
    expect(css).toContain(".mw-checkbox-field__error .mw-text")
    expect(css).toContain(".mw-checkbox-field--invalid .mw-checkbox-field__label .mw-text")
  })

  it("keeps checkbox group legends aligned without stretching focus rings to full rows", () => {
    const css = readFileSync(checkboxGroupFieldCssPath, "utf8")

    expect(css).toContain("min-inline-size: 0;")
    expect(css).toContain("padding: 0;")
    expect(css).not.toContain(".mw-checkbox-group-field__option:has(.mw-checkbox:focus-visible)")
    expect(css).toContain(".mw-checkbox-group-field__option-content")
    expect(css).toContain(".mw-checkbox-group-field__option-label")
    expect(css).toContain(".mw-checkbox-group-field__option-description")
    expect(css).toContain(
      ".mw-checkbox-group-field--invalid .mw-checkbox-group-field__label .mw-text",
    )
    expect(css).not.toContain(".mw-checkbox-group-field__option .mw-p")
  })
})
