/**
 * Tests the drawer recipe's pure output: size, placement, footer/scrim
 * controls, dismiss affordance, and dialog labelling attributes.
 */
import { describe, expect, it } from "vitest"
import { createDrawerRecipe } from "../../src/components/atoms/drawer/drawer-recipe"

describe("createDrawerRecipe", () => {
  it("defaults to a medium right drawer with footer, scrim, and dismiss affordance", () => {
    const kit = createDrawerRecipe({})

    expect(kit.tag).toBe("div")
    expect(kit.className).toBe(
      "mw-drawer mw-drawer--right mw-drawer--medium mw-drawer--with-footer mw-drawer--with-scrim mw-drawer--dismissible",
    )
    expect(kit.size).toBe("medium")
    expect(kit.placement).toBe("right")
    expect(kit.showFooter).toBe(true)
    expect(kit.showCloseButton).toBe(true)
    expect(kit.showScrim).toBe(true)
    expect(kit.panel.tag).toBe("div")
    expect(kit.panel.a11y.role).toBe("dialog")
    expect(kit.dataAttributes).toEqual({
      "data-component": "drawer",
      "data-size": "medium",
      "data-placement": "right",
      "data-footer": "true",
      "data-dismissible": "true",
      "data-scrim": "true",
    })
  })

  it("supports Figma size modifiers", () => {
    expect(createDrawerRecipe({ size: "small" }).className).toContain("mw-drawer--small")
    expect(createDrawerRecipe({ size: "medium" }).className).toContain("mw-drawer--medium")
    expect(createDrawerRecipe({ size: "large" }).className).toContain("mw-drawer--large")
  })

  it("supports left and right placement modifiers", () => {
    expect(createDrawerRecipe({ placement: "left" }).className).toContain("mw-drawer--left")
    expect(createDrawerRecipe({ placement: "right" }).className).toContain("mw-drawer--right")
  })

  it("supports content-only drawers without footer, scrim, or dismiss affordance", () => {
    const kit = createDrawerRecipe({
      showFooter: false,
      showScrim: false,
      dismissible: false,
    })

    expect(kit.className).toContain("mw-drawer--without-footer")
    expect(kit.className).not.toContain("mw-drawer--with-scrim")
    expect(kit.className).not.toContain("mw-drawer--dismissible")
    expect(kit.showFooter).toBe(false)
    expect(kit.showScrim).toBe(false)
    expect(kit.showCloseButton).toBe(false)
    expect(kit.dataAttributes["data-footer"]).toBe("false")
    expect(kit.dataAttributes["data-scrim"]).toBe("false")
    expect(kit.dataAttributes["data-dismissible"]).toBe("false")
  })

  it("passes through drawer labelling attributes", () => {
    const kit = createDrawerRecipe({
      ariaLabelledBy: "drawer-title",
      ariaDescribedBy: "drawer-description",
    })

    expect(kit.panel.a11y.ariaLabelledBy).toBe("drawer-title")
    expect(kit.panel.a11y.ariaDescribedBy).toBe("drawer-description")
  })

  it("only applies aria-modal when marked modal", () => {
    expect(createDrawerRecipe({ modal: true }).panel.a11y.ariaModal).toBe(true)
    expect(createDrawerRecipe({ modal: false }).panel.a11y.ariaModal).toBeUndefined()
  })
})
