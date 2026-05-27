/**
 * Tests the text recipe's pure output for non-heading typography variants.
 */
import { describe, expect, it } from "vitest"
import { textRecipe } from "../../src/components/atoms/text/text-recipe"
import { resolveThemeInput } from "../../src/theme/theme-normalize"

const testTheme = resolveThemeInput({})

describe("textRecipe", () => {
  it("uses caption styling by default", () => {
    const renderKit = textRecipe({}, testTheme)

    expect(renderKit.tag).toBe("span")
    expect(renderKit.className).toContain("mw-text--caption")
    expect(renderKit.vars["--mw-text-size"]).toBe("12px")
    expect(renderKit.vars["--mw-text-line-height"]).toBe("1.3333333333")
    expect(renderKit.vars["--mw-text-weight"]).toBe("500")
    expect(renderKit.vars["--mw-text-letter-spacing"]).toBe("0px")
    expect(renderKit.vars["--mw-text-transform"]).toBe("none")
  })

  it("supports overline transform and custom tag", () => {
    const renderKit = textRecipe({ variant: "overline", as: "div", id: "eyebrow" }, testTheme)

    expect(renderKit.tag).toBe("div")
    expect(renderKit.className).toContain("mw-text--overline")
    expect(renderKit.a11y.id).toBe("eyebrow")
    expect(renderKit.vars["--mw-text-size"]).toBe("11px")
    expect(renderKit.vars["--mw-text-line-height"]).toBe("1.4545454545")
    expect(renderKit.vars["--mw-text-weight"]).toBe("500")
    expect(renderKit.vars["--mw-text-letter-spacing"]).toBe("0.88px")
    expect(renderKit.vars["--mw-text-transform"]).toBe("uppercase")
  })

  it("supports label typography variants", () => {
    const labelKit = textRecipe({ variant: "label" }, testTheme)
    const smallLabelKit = textRecipe({ variant: "label-small" }, testTheme)

    expect(labelKit.className).toContain("mw-text--label")
    expect(labelKit.vars["--mw-text-size"]).toBe("14px")
    expect(labelKit.vars["--mw-text-line-height"]).toBe("1.1428571429")
    expect(labelKit.vars["--mw-text-weight"]).toBe("500")
    expect(labelKit.vars["--mw-text-letter-spacing"]).toBe("-0.42px")
    expect(labelKit.vars["--mw-text-transform"]).toBe("none")

    expect(smallLabelKit.className).toContain("mw-text--label-small")
    expect(smallLabelKit.vars["--mw-text-size"]).toBe("12px")
    expect(smallLabelKit.vars["--mw-text-line-height"]).toBe("1")
    expect(smallLabelKit.vars["--mw-text-weight"]).toBe("500")
    expect(smallLabelKit.vars["--mw-text-letter-spacing"]).toBe("-0.36px")
    expect(smallLabelKit.vars["--mw-text-transform"]).toBe("none")
  })
})
