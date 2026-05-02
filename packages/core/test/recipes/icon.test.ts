import { describe, expect, it } from "vitest"
import { IconName } from "../../src/components/atoms/icon"
import { createIconRecipe } from "../../src/components/atoms/icon/icon-recipe"

describe("createIconRecipe", () => {
  it("creates decorative icon output by default", () => {
    const renderKit = createIconRecipe({
      name: IconName.Search,
    })

    expect(renderKit.tag).toBe("svg")
    expect(renderKit.className).toContain("mw-icon")
    expect(renderKit.a11y.ariaHidden).toBe(true)
    expect(renderKit.svg.width).toBe(24)
    expect(renderKit.svg.height).toBe(24)
  })

  it("supports labelled icons with size and stroke variants", () => {
    const renderKit = createIconRecipe({
      name: IconName.Search,
      ariaLabel: "Search",
      size: "lg",
      strokeWidth: "lg",
      color: "primary",
    })

    expect(renderKit.a11y.role).toBe("img")
    expect(renderKit.a11y.ariaLabel).toBe("Search")
    expect(renderKit.className).toContain("mw-icon--40")
    expect(renderKit.className).toContain("mw-icon--primary")
    expect(renderKit.vars["--mw-icon-stroke-width"]).toBe("4")
  })
})
