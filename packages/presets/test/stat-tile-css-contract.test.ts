import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const css = readFileSync(resolve(__dirname, "../src/firstEdition/stat-tile.css"), "utf8")

describe("stat tile preset css contract", () => {
  it("styles stable stat tile classes and Figma dimensions", () => {
    expect(css).toContain(".mw-stat-tile")
    expect(css).toContain("width: 164px")
    expect(css).toContain("padding: 20px")
    expect(css).toContain("border-radius: 12px")
  })

  it("maps Figma tone colors and trend part classes", () => {
    expect(css).toContain(".mw-stat-tile--brand")
    expect(css).toContain("#eeeeff")
    expect(css).toContain(".mw-stat-tile--success")
    expect(css).toContain("#e6f4ed")
    expect(css).toContain(".mw-stat-tile__trend")
    expect(css).toContain(".mw-stat-tile__trend-icon")
  })
})
