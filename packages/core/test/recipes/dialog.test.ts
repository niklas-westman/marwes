import { describe, expect, it } from "vitest"
import { createDialogRecipe } from "../../src/components/atoms/dialog/dialog-recipe"

describe("createDialogRecipe", () => {
  it("defaults to a medium dismissible dialog with footer", () => {
    const kit = createDialogRecipe({})

    expect(kit.tag).toBe("section")
    expect(kit.className).toBe(
      "mw-dialog mw-dialog--medium mw-dialog--with-footer mw-dialog--dismissible",
    )
    expect(kit.size).toBe("medium")
    expect(kit.showFooter).toBe(true)
    expect(kit.showCloseButton).toBe(true)
    expect(kit.a11y.role).toBe("dialog")
    expect(kit.a11y.ariaModal).toBe(true)
    expect(kit.dataAttributes).toEqual({
      "data-component": "dialog",
      "data-size": "medium",
      "data-footer": "true",
      "data-dismissible": "true",
    })
  })

  it("supports small and large size modifiers", () => {
    expect(createDialogRecipe({ size: "small" }).className).toContain("mw-dialog--small")
    expect(createDialogRecipe({ size: "large" }).className).toContain("mw-dialog--large")
  })

  it("supports content-only dialogs without footer or dismiss affordance", () => {
    const kit = createDialogRecipe({ showFooter: false, dismissible: false })

    expect(kit.className).toContain("mw-dialog--without-footer")
    expect(kit.className).not.toContain("mw-dialog--dismissible")
    expect(kit.showFooter).toBe(false)
    expect(kit.showCloseButton).toBe(false)
    expect(kit.dataAttributes["data-footer"]).toBe("false")
    expect(kit.dataAttributes["data-dismissible"]).toBe("false")
  })

  it("passes through dialog labelling attributes", () => {
    const kit = createDialogRecipe({
      ariaLabelledBy: "dialog-title",
      ariaDescribedBy: "dialog-description",
    })

    expect(kit.a11y.ariaLabelledBy).toBe("dialog-title")
    expect(kit.a11y.ariaDescribedBy).toBe("dialog-description")
  })
})
