/**
 * CSS contract: verifies the firstEdition stat-tile stylesheet.
 */
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
    expect(css).toContain("border: none;")
    expect(css).toContain("box-shadow: inset 0 0 0 1px var(--mw-stat-tile-border);")
  })

  it("maps tone colors through the shared status tokens used by badge and toast", () => {
    expect(css).toContain(".mw-stat-tile--brand")
    expect(css).toContain(
      "--mw-stat-tile-border: var(--mw-color-status-info-border-strong, #5859fc);",
    )
    expect(css).toContain(".mw-stat-tile--success")
    expect(css).toContain(
      "--mw-stat-tile-surface: var(--mw-color-status-success-background, #e6f4ed);",
    )
    expect(css).toContain(
      "--mw-stat-tile-border: var(--mw-color-status-warning-border-strong, #e46f00);",
    )
    expect(css).toContain(
      "--mw-stat-tile-border: var(--mw-color-status-error-border-strong, #ff2847);",
    )
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

  it("syncs semantic dark-mode tile outlines with badge and toast status tokens", () => {
    expect(css).toContain(
      ".mw-theme--dark .mw-stat-tile--brand {\n  --mw-stat-tile-surface: var(--mw-color-status-info-background, #040519);\n  --mw-stat-tile-border: var(--mw-color-status-info-border-strong, #252599);",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-stat-tile--success {\n  --mw-stat-tile-surface: var(--mw-color-status-success-background, #001a0c);\n  --mw-stat-tile-border: var(--mw-color-status-success-border-strong, #006d48);",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-stat-tile--warning {\n  --mw-stat-tile-surface: var(--mw-color-status-warning-background, #221004);\n  --mw-stat-tile-border: var(--mw-color-status-warning-border-strong, #b45308);",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-stat-tile--danger {\n  --mw-stat-tile-surface: var(--mw-color-status-error-background, #240006);\n  --mw-stat-tile-border: var(--mw-color-status-error-border-strong, #ff2847);",
    )
  })
})
