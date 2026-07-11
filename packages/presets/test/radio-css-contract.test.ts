/**
 * CSS contract: verifies the firstEdition radio stylesheets.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const radioCssPath = resolve(pkgDir, "src/firstEdition/radio.css")
const radioGroupFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/radio-group-field.css")

describe("firstEdition radio css contract", () => {
  it("keeps the checked default radio ring on the radio border token", () => {
    const css = readFileSync(radioCssPath, "utf8")
    const rootBlock = css.match(/\.mw-radio\s*\{[^}]+\}/)?.[0]
    const checkedBlock = css.match(/\.mw-radio:checked\s*\{[^}]+\}/)?.[0]

    expect(rootBlock).toContain("border: 1px solid var(--mw-radio-border);")
    expect(checkedBlock).toContain("border-color: var(--mw-radio-border);")
    expect(checkedBlock).not.toContain("border-color: var(--mw-color-border-brand);")
  })

  it("keeps the pressed radio ring mapped to the brand border token", () => {
    const css = readFileSync(radioCssPath, "utf8")
    const activeBlock = css.match(/\.mw-radio:active:not\(:disabled\)\s*\{[^}]+\}/)?.[0]

    expect(activeBlock).toContain("border-color: var(--mw-color-border-brand);")
  })

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
