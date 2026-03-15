import { describe, expect, it } from "vitest"
import { paragraphRecipe } from "../../src/components/atoms/paragraph/paragraph-recipe"
import { defaultTheme } from "../../src/theme/theme-defaults"

describe("paragraphRecipe", () => {
  it("builds paragraph output with default md size", () => {
    const renderKit = paragraphRecipe({}, defaultTheme)

    expect(renderKit.tag).toBe("p")
    expect(renderKit.className).toContain("mw-p")
    expect(renderKit.className).toContain("mw-p--md")
  })

  it("supports explicit size variant and id metadata", () => {
    const renderKit = paragraphRecipe({ size: "lg", id: "body-copy" }, defaultTheme)

    expect(renderKit.className).toContain("mw-p--lg")
    expect(renderKit.a11y.id).toBe("body-copy")
  })
})
