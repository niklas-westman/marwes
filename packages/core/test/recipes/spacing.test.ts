import { describe, expect, it } from "vitest"
import { createSpacingRecipe } from "../../src/components/atoms/spacing/spacing.recipe"
import { Spacings } from "../../src/components/atoms/spacing/spacing.types"

describe("createSpacingRecipe", () => {
  it("builds decorative spacing output with default sp-24 size", () => {
    const renderKit = createSpacingRecipe()

    expect(renderKit.tag).toBe("div")
    expect(renderKit.className).toBe("mw-spacing")
    expect(renderKit.a11y["aria-hidden"]).toBe("true")
    expect(renderKit.dataAttributes["data-component"]).toBe("spacing")
    expect(renderKit.dataAttributes["data-size"]).toBe("sp-24")
    expect(renderKit.vars["--mw-spacing-value"]).toBe("var(--mw-spacing-sp-24)")
  })

  it("supports size tokens and scale multipliers", () => {
    const renderKit = createSpacingRecipe({ size: Spacings.sp32, scale: 2 })

    expect(renderKit.dataAttributes["data-size"]).toBe("sp-32")
    expect(renderKit.vars["--mw-spacing-value"]).toBe("calc(var(--mw-spacing-sp-32) * 2)")
  })

  it("keeps bracket-key spacing tokens available for backward compatibility", () => {
    expect(Spacings.sp24).toBe("sp-24")
    expect(Spacings["sp-24"]).toBe("sp-24")
  })
})
