/**
 * CSS contract: verifies the firstEdition switch field stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const switchFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/switch-field.css")

describe("firstEdition switch field css contract", () => {
  it("targets text typography classes for field labels, descriptions, and errors", () => {
    const css = readFileSync(switchFieldCssPath, "utf8")

    expect(css).toContain(".mw-switch-field__label .mw-text")
    expect(css).toContain(".mw-switch-field__description .mw-text")
    expect(css).toContain(".mw-switch-field__error .mw-text")
    expect(css).toContain(".mw-switch-field--invalid .mw-switch-field__label .mw-text")
    expect(css).toContain(".mw-switch-field--invalid .mw-switch-field__error .mw-text")
    expect(css).not.toContain(".mw-switch-field--invalid .mw-switch-field__label .mw-p")
    expect(css).not.toContain(".mw-switch-field--invalid .mw-switch-field__error .mw-p")
  })
})
