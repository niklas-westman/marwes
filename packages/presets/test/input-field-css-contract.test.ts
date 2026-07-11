/**
 * CSS contract: verifies the firstEdition input field molecule stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const inputFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/input-field.css")

describe("firstEdition input field css contract", () => {
  it("targets text typography classes for field labels, helper text, and errors", () => {
    const css = readFileSync(inputFieldCssPath, "utf8")

    expect(css).toContain(".mw-input-field__label .mw-text")
    expect(css).toContain(".mw-input-field__helper .mw-text")
    expect(css).toContain(".mw-input-field__error .mw-text")
    expect(css).toContain(".mw-input-field--invalid .mw-input-field__label .mw-text")
    expect(css).toContain(".mw-input-field--invalid .mw-input-field__error .mw-text")
    expect(css).not.toContain(".mw-input-field--invalid .mw-input-field__label .mw-p")
    expect(css).not.toContain(".mw-input-field--invalid .mw-input-field__error .mw-p")
  })
})
