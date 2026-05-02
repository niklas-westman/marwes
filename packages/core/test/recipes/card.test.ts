import { describe, expect, it } from "vitest"
import { createCardRecipe } from "../../src/components/atoms/card/card-recipe"

describe("createCardRecipe", () => {
  it("default: className is mw-card, tag is div", () => {
    const kit = createCardRecipe()
    expect(kit.className).toBe("mw-card")
    expect(kit.tag).toBe("div")
  })

  it("vars is always empty object", () => {
    const kit = createCardRecipe()
    expect(kit.vars).toEqual({})
  })

  it("accepts empty options object", () => {
    const kit = createCardRecipe({})
    expect(kit.className).toBe("mw-card")
  })

  it("always includes the card component marker", () => {
    const kit = createCardRecipe()

    expect(kit.dataAttributes).toEqual({ "data-component": "card" })
  })

  it("merges custom data attributes into the render kit", () => {
    const kit = createCardRecipe({
      dataAttributes: { "data-purpose": "product-card" },
    })

    expect(kit.dataAttributes).toEqual({
      "data-component": "card",
      "data-purpose": "product-card",
    })
  })
})
