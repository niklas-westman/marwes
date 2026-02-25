import { describe, expect, it } from "vitest"
import { createButtonRecipe } from "../../src/components/atoms/button/button-recipe"
import { defaultTheme } from "../../src/theme/theme-defaults"

describe("createButtonRecipe", () => {
  it("builds button render kit with default metadata", () => {
    const kit = createButtonRecipe(defaultTheme, {
      as: "button",
      ariaLabel: "Save",
      iconOnly: true,
    })

    expect(kit.tag).toBe("button")
    expect(kit.className).toContain("mw-btn")
    expect(kit.dataAttributes?.["data-component"]).toBe("button")
    expect(kit.a11y.title).toBe("Save")
  })

  it("builds anchor render kit and marks navigation action", () => {
    const kit = createButtonRecipe(defaultTheme, { as: "a", href: "/docs" })

    expect(kit.tag).toBe("a")
    expect(kit.a11y.href).toBe("/docs")
    expect(kit.dataAttributes?.["data-action"]).toBe("navigate")
  })
})
