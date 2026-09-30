/**
 * CSS contract: verifies the firstEdition accordion stylesheets.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const accordionCssPath = resolve(pkgDir, "src/firstEdition/accordion.css")
const accordionFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/accordion-field.css")

describe("firstEdition accordion css contract", () => {
  it("keeps the atom aligned with the Figma reflection frame contract", () => {
    const css = readFileSync(accordionCssPath, "utf8")

    expect(css).toContain("--mw-accordion-icon: var(--mw-accordion-title)")
    expect(css).toContain(
      "--mw-accordion-content: color-mix(in srgb, var(--mw-color-text) 60%, transparent)",
    )
    expect(css).toContain("box-sizing: border-box")
    expect(css).toContain("-webkit-font-smoothing: antialiased")
    expect(css).toContain("letter-spacing: var(--mw-typography-text-label-letter-spacing, -0.42px)")
    expect(css).toContain("font-weight: 400")
  })
})

describe("firstEdition accordion field css contract", () => {
  it("spaces the native legend independently of the fieldset grid gap", () => {
    const css = readFileSync(accordionFieldCssPath, "utf8")
    const labelRule = css.match(/legend\.mw-accordion-field__label\s*\{([^}]+)\}/)?.[1]
    const sharedLabelRule = css.match(/\n\.mw-accordion-field__label\s*\{([^}]+)\}/)?.[1]

    expect(labelRule).toContain("margin-block-end: var(--mw-density-field-gap, 8px)")
    expect(sharedLabelRule).not.toContain("margin-block-end")
  })

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
