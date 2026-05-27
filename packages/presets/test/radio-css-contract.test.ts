/**
 * CSS contract: verifies the firstEdition radio stylesheets.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const radioGroupFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/radio-group-field.css")

describe("firstEdition radio css contract", () => {
  it("targets text typography classes for radio group field labels", () => {
    const css = readFileSync(radioGroupFieldCssPath, "utf8")

    expect(css).toContain(".mw-radio-group-field__option-content")
    expect(css).toContain(".mw-radio-group-field__option-label")
    expect(css).toContain(".mw-radio-group-field__option-description")
    expect(css).toContain(".mw-radio-group-field__description .mw-text")
    expect(css).toContain(".mw-radio-group-field--invalid .mw-radio-group-field__label .mw-text")
    expect(css).not.toContain(".mw-radio-group-field__option .mw-p")
  })
})
