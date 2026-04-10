import { describe, expect, it } from "vitest"
import { createTooltipRecipe } from "../../src/components/atoms/tooltip/tooltip-recipe"

describe("createTooltipRecipe", () => {
  it("returns the tooltip atom render kit", () => {
    const kit = createTooltipRecipe()

    expect(kit.tag).toBe("span")
    expect(kit.className).toBe("mw-tooltip")
    expect(kit.a11y.role).toBe("tooltip")
    expect(kit.dataAttributes["data-component"]).toBe("tooltip")
    expect(kit.vars).toEqual({})
  })

  it("passes the id through to tooltip accessibility props", () => {
    const kit = createTooltipRecipe({ id: "help-tooltip" })

    expect(kit.a11y.id).toBe("help-tooltip")
  })
})
