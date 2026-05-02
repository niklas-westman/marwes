import { describe, expect, it } from "vitest"
import { headingRecipe } from "../../src/components/atoms/heading/heading-recipe"
import { resolveThemeInput } from "../../src/theme/theme-normalize"

const testTheme = resolveThemeInput({})

describe("headingRecipe", () => {
  it("uses heading level for semantic tag and visual size by default", () => {
    const renderKit = headingRecipe({ level: 2 }, testTheme)

    expect(renderKit.tag).toBe("h2")
    expect(renderKit.className).toContain("mw-heading")
    expect(renderKit.className).toContain("mw-heading--h2")
    expect(renderKit.vars["--mw-heading-size"]).toBe("24px")
    expect(renderKit.vars["--mw-heading-line-height"]).toBe("1.25")
    expect(renderKit.vars["--mw-heading-weight"]).toBe("500")
    expect(renderKit.vars["--mw-heading-letter-spacing"]).toBe("-0.72px")
  })

  it("supports visual size override and heading metadata", () => {
    const renderKit = headingRecipe(
      {
        level: 3,
        size: "h1",
        id: "hero-title",
        ariaLabel: "Hero title",
      },
      testTheme,
    )

    expect(renderKit.tag).toBe("h3")
    expect(renderKit.className).toContain("mw-heading--h1")
    expect(renderKit.a11y.id).toBe("hero-title")
    expect(renderKit.a11y.ariaLabel).toBe("Hero title")
    expect(renderKit.vars["--mw-heading-size"]).toBe("32px")
    expect(renderKit.vars["--mw-heading-line-height"]).toBe("1.1875")
    expect(renderKit.vars["--mw-heading-weight"]).toBe("700")
    expect(renderKit.vars["--mw-heading-letter-spacing"]).toBe("-0.96px")
  })
})
