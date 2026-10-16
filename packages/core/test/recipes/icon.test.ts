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

describe("RefreshCw canonical stroke geometry", () => {
  it.each(["sm", 2] as const)("uses the Figma outline at canonical width %s", (strokeWidth) => {
    const kit = createIconRecipe({ name: IconName.RefreshCw, strokeWidth })
    expect(kit.vars["--mw-icon-stroke-width"]).toBe("2")
    expect(kit.svg.nodes).toHaveLength(1)
    expect(kit.svg.nodes[0]?.attrs.fill).toBe("var(--mw-icon-color, currentColor)")
    expect(kit.svg.nodes[0]?.attrs.stroke).toBe("none")
  })

  it.each(["xs", "md", "lg", 0, 1, 1.5, 3, 4] as const)(
    "preserves configurable stroked geometry for explicit width %s",
    (strokeWidth) => {
      const kit = createIconRecipe({ name: IconName.RefreshCw, strokeWidth })
      expect(kit.svg.nodes[0]?.tag).toBe("path")
      expect(kit.svg.nodes[0]?.attrs.fill).toBeUndefined()
      expect(kit.svg.nodes[0]?.attrs.stroke).toBeUndefined()
      expect(kit.svg.nodes[0]?.attrs.d).toBe(
        "M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2",
      )
      const expected = { xs: 1, md: 3, lg: 4 }
      expect(kit.vars["--mw-icon-stroke-width"]).toBe(
        String(typeof strokeWidth === "number" ? strokeWidth : expected[strokeWidth]),
      )
    },
  )

  it("keeps the public default stroke at md rather than silently selecting width 2", () => {
    const kit = createIconRecipe({ name: IconName.RefreshCw })
    expect(kit.vars["--mw-icon-stroke-width"]).toBe("3")
    expect(kit.svg.nodes[0]?.attrs.stroke).toBeUndefined()
    expect(kit.svg.nodes[0]?.attrs.fill).toBeUndefined()
  })
})
