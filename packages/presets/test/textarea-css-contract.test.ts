/**
 * CSS contract: verifies the firstEdition textarea stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const textareaCssPath = resolve(pkgDir, "src/firstEdition/textarea.css")
const inputFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/input-field.css")

describe("firstEdition textarea css contract", () => {
  it("matches the Figma textarea atom height and hides native resize chrome by default", () => {
    const css = readFileSync(textareaCssPath, "utf8")

    expect(css).toContain("min-height: 100px;")
    expect(css).toContain("line-height: 16px;")
    expect(css).toContain("resize: var(--mw-textarea-resize, none);")
  })

  it("supports helper and counter metadata on one field footer row", () => {
    const css = readFileSync(inputFieldCssPath, "utf8")

    expect(css).toContain(".mw-input-field__meta")
    expect(css).toContain("justify-content: space-between;")
    expect(css).toContain(".mw-input-field__counter")
    expect(css).toContain(".mw-input-field__counter .mw-text")
  })
})
