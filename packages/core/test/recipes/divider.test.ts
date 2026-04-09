import { describe, expect, it } from "vitest"
import { createDividerRecipe } from "../../src/components/atoms/divider/divider-recipe"

describe("createDividerRecipe", () => {
  it("builds a horizontal separator by default", () => {
    const kit = createDividerRecipe()

    expect(kit.tag).toBe("hr")
    expect(kit.className).toContain("mw-divider")
    expect(kit.a11y.role).toBe("separator")
    expect(kit.a11y["aria-orientation"]).toBe("horizontal")
    expect(kit.dataAttributes["data-component"]).toBe("divider")
    expect(kit.dataAttributes["data-orientation"]).toBe("horizontal")
    expect(kit.vars["--mw-divider-line-thickness"]).toBe("1px")
    expect(kit.vars["--mw-divider-spacing"]).toBe("32px")
  })

  it("maps spacing modes to the synced Figma values", () => {
    expect(createDividerRecipe({ size: "xxs" }).vars["--mw-divider-spacing"]).toBe("1px")
    expect(createDividerRecipe({ size: "xs" }).vars["--mw-divider-spacing"]).toBe("8px")
    expect(createDividerRecipe({ size: "sm" }).vars["--mw-divider-spacing"]).toBe("16px")
    expect(createDividerRecipe({ size: "md" }).vars["--mw-divider-spacing"]).toBe("32px")
    expect(createDividerRecipe({ size: "lg" }).vars["--mw-divider-spacing"]).toBe("48px")
    expect(createDividerRecipe({ size: "xl" }).vars["--mw-divider-spacing"]).toBe("64px")
    expect(createDividerRecipe({ size: "xxl" }).vars["--mw-divider-spacing"]).toBe("80px")
  })

  it("supports vertical orientation and size metadata", () => {
    const kit = createDividerRecipe({ orientation: "vertical", size: "xl", id: "section-divider" })

    expect(kit.className).toContain("mw-divider--vertical")
    expect(kit.className).toContain("mw-divider--xl")
    expect(kit.a11y.id).toBe("section-divider")
    expect(kit.dataAttributes["data-size"]).toBe("xl")
  })
})
