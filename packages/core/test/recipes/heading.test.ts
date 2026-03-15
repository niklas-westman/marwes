import { describe, expect, it } from "vitest"
import { headingRecipe } from "../../src/components/atoms/heading/heading-recipe"
import { defaultTheme } from "../../src/theme/theme-defaults"

describe("headingRecipe", () => {
  it("uses heading level for semantic tag and visual size by default", () => {
    const renderKit = headingRecipe({ level: 2 }, defaultTheme)

    expect(renderKit.tag).toBe("h2")
    expect(renderKit.className).toContain("mw-heading")
    expect(renderKit.className).toContain("mw-heading--h2")
  })

  it("supports visual size override and heading metadata", () => {
    const renderKit = headingRecipe(
      {
        level: 3,
        size: "h1",
        id: "hero-title",
        ariaLabel: "Hero title",
      },
      defaultTheme,
    )

    expect(renderKit.tag).toBe("h3")
    expect(renderKit.className).toContain("mw-heading--h1")
    expect(renderKit.a11y.id).toBe("hero-title")
    expect(renderKit.a11y.ariaLabel).toBe("Hero title")
  })
})
