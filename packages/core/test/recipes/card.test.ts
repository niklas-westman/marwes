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
})
