import { describe, expect, it } from "vitest"
import { createDividerRecipe } from "../../src/components/atoms/divider/divider-recipe"

describe("createDividerRecipe", () => {
  it("builds a horizontal separator by default", () => {
    const kit = createDividerRecipe()

    expect(kit.tag).toBe("hr")
    expect(kit.className).toContain("mw-divider")
    expect(kit.a11y.role).toBe("separator")
    expect(kit.a11y["aria-orientation"]).toBe("horizontal")
    expect(kit.dataAttributes["data-orientation"]).toBe("horizontal")
  })

  it("supports vertical orientation and size metadata", () => {
    const kit = createDividerRecipe({ orientation: "vertical", size: "xl" })
    expect(kit.className).toContain("mw-divider--vertical")
    expect(kit.className).toContain("mw-divider--xl")
    expect(kit.dataAttributes["data-size"]).toBe("xl")
  })
})
