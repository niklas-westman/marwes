import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const css = readFileSync(resolve(__dirname, "../src/firstEdition/stat-tile.css"), "utf8")

describe("stat tile preset css contract", () => {
  it("styles stable stat tile classes with tokenized spacing", () => {
    expect(css).toContain(".mw-stat-tile")
    expect(css).toContain("width: var(--mw-stat-tile-width, 280px)")
    expect(css).toContain("gap: var(--mw-spacing-sp-8, 8px)")
    expect(css).toContain("padding: var(--mw-spacing-sp-24, 24px)")
    expect(css).toContain("border-radius: var(--mw-stat-tile-radius)")
  })

  it("maps Figma tone colors and trend part classes", () => {
    expect(css).toContain(".mw-stat-tile--brand")
    expect(css).toContain("#eeeeff")
    expect(css).toContain(".mw-stat-tile--success")
    expect(css).toContain("#e6f4ed")
    expect(css).toContain(".mw-stat-tile__trend")
    expect(css).toContain(".mw-stat-tile__trend-icon")
  })

  it("keeps semantic tone tiles independent from the dark theme neutral surface", () => {
    expect(css).not.toContain(".mw-theme--dark .mw-stat-tile {")
    expect(css).toContain(".mw-stat-tile:not(")
    expect(css).toContain(".mw-stat-tile--brand")
    expect(css).toContain(".mw-stat-tile--success")
    expect(css).toContain(".mw-stat-tile--warning")
    expect(css).toContain(".mw-stat-tile--danger")
  })
})
