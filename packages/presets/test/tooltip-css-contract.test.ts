/**
 * CSS contract: verifies the firstEdition tooltip stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const tooltipCssPath = resolve(pkgDir, "src/firstEdition/tooltip.css")

describe("firstEdition tooltip css contract", () => {
  it("places the help trigger above the tooltip bubble with the Figma icon size", () => {
    const css = readFileSync(tooltipCssPath, "utf8")

    expect(css).toContain("flex-direction: column-reverse;")
    expect(css).toContain(".mw-tooltip-group__trigger {\n  display: inline-flex;\n  width: 12px;")
    expect(css).toContain(".mw-tooltip-group__trigger svg {\n  width: 12px;\n  height: 12px;")
  })
})
