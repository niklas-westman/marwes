/**
 * CSS contract: verifies the firstEdition accordion field stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const accordionFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/accordion-field.css")

describe("firstEdition accordion field css contract", () => {
  it("targets text typography classes for field labels, descriptions, and errors", () => {
    const css = readFileSync(accordionFieldCssPath, "utf8")

    expect(css).toContain(".mw-accordion-field__label .mw-text")
    expect(css).toContain(".mw-accordion-field__description .mw-text")
    expect(css).toContain(".mw-accordion-field__error .mw-text")
    expect(css).toContain(".mw-accordion-field--invalid .mw-accordion-field__label .mw-text")
    expect(css).toContain(".mw-accordion-field--invalid .mw-accordion-field__error .mw-text")
    expect(css).not.toContain(".mw-accordion-field--invalid .mw-accordion-field__label .mw-p")
    expect(css).not.toContain(".mw-accordion-field--invalid .mw-accordion-field__error .mw-p")
  })
})
