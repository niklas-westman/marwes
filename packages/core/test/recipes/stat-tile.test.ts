import { describe, expect, it } from "vitest"
import {
  createStatTileRecipe,
  resolveStatTileTrendLabel,
} from "../../src/components/atoms/stat-tile"

describe("createStatTileRecipe", () => {
  it("builds a neutral stat tile by default", () => {
    const kit = createStatTileRecipe()

    expect(kit.tag).toBe("article")
    expect(kit.className).toContain("mw-stat-tile")
    expect(kit.className).toContain("mw-stat-tile--neutral")
    expect(kit.dataAttributes["data-component"]).toBe("stat-tile")
    expect(kit.dataAttributes["data-tone"]).toBe("neutral")
    expect(kit.trendIcon).toBeNull()
  })

  it("maps Figma tone and trend state metadata", () => {
    const kit = createStatTileRecipe({
      tone: "success",
      trendDirection: "positive",
      trendValue: "12%",
    })

    expect(kit.className).toContain("mw-stat-tile--success")
    expect(kit.dataAttributes["data-tone"]).toBe("success")
    expect(kit.dataAttributes["data-trend"]).toBe("positive")
    expect(kit.trendDataAttributes["data-component"]).toBe("stat-tile-trend")
    expect(kit.trendDataAttributes["data-trend"]).toBe("positive")
    expect(kit.trendIcon).toBe("↑")
    expect(kit.a11y.trendAriaLabel).toBe("Increased by 12%")
  })

  it("supports negative trend labels", () => {
    expect(resolveStatTileTrendLabel("negative", "8%")).toBe("Decreased by 8%")
  })
})
