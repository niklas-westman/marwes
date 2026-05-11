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

  it("keeps keyboard focus visible for checkbox field rows", () => {
    const css = readFileSync(checkboxFieldCssPath, "utf8")

    expect(css).toContain(".mw-checkbox-field__row:has(.mw-checkbox:focus-visible)")
    expect(css).toContain("outline: 2px solid var(--mw-color-focus);")
  })

  it("keeps checkbox group legends aligned and group rows keyboard-focusable", () => {
    const css = readFileSync(checkboxGroupFieldCssPath, "utf8")

    expect(css).toContain("min-inline-size: 0;")
    expect(css).toContain("padding: 0;")
    expect(css).toContain(".mw-checkbox-group-field__option:has(.mw-checkbox:focus-visible)")
    expect(css).toContain(".mw-checkbox-group-field__option .mw-p")
  })
})
