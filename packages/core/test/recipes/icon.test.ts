/**
 * Tests the icon recipe's pure output — decorative (aria-hidden) vs labelled
 * (role=img) modes, size classes, and stroke width CSS variable.
 */
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
    expect(renderKit.className).toContain("mw-icon--lg")
    expect(renderKit.className).toContain("mw-icon--primary")
    expect(renderKit.vars["--mw-icon-stroke-width"]).toBe("4")
  })

  it("uses the preset size class for tokens and a custom marker for pixel sizes", () => {
    expect(createIconRecipe({ name: IconName.Search }).className).toContain("mw-icon--sm")
    expect(createIconRecipe({ name: IconName.Search, size: "xs" }).className).toContain(
      "mw-icon--xs",
    )

    const custom = createIconRecipe({ name: IconName.Search, size: 14, strokeWidth: 1.5 })
    expect(custom.className).toContain("mw-icon--custom")
    expect(custom.vars["--mw-icon-size"]).toBe("14px")
    expect(custom.vars["--mw-icon-stroke-width"]).toBe("1.5")
    expect(custom.svg.width).toBe(14)
  })

  it("defaults the colour class to currentColor", () => {
    expect(createIconRecipe({ name: IconName.Search }).className).toContain("mw-icon--currentColor")
  })

  it("hides the icon from assistive technology when ariaHidden is true, even with a label", () => {
    const renderKit = createIconRecipe({
      name: IconName.Search,
      ariaLabel: "Search",
      ariaHidden: true,
    })

    expect(renderKit.a11y).toEqual({ ariaHidden: true })
  })
})
