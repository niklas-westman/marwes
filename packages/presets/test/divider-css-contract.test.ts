/**
 * CSS contract: verifies the firstEdition divider stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const dividerCssPath = resolve(pkgDir, "src/firstEdition/divider.css")

describe("firstEdition divider css contract", () => {
  it("keeps the divider line at 20% of the current theme text color", () => {
    const css = readFileSync(dividerCssPath, "utf8")

    expect(css).toContain(
      "--mw-divider-color: color-mix(in srgb, var(--mw-color-text, #141414) 20%, transparent);",
    )
  })

  it("uses content-box painting so spacing modes keep a 1px line", () => {
    const css = readFileSync(dividerCssPath, "utf8")

    expect(css).toContain("background-clip: content-box;")
    expect(css).toContain(
      "(var(--mw-divider-spacing, 1px) - var(--mw-divider-line-thickness, 1px)) / 2",
    )
  })
})
