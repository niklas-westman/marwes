import { describe, expect, it } from "vitest"
import { createInputRecipe } from "../../src/components/atoms/input/input-recipe"
import { defaultTheme } from "../../src/theme/theme-defaults"

describe("createInputRecipe", () => {
  it("creates invalid state class and a11y wiring", () => {
    const kit = createInputRecipe(defaultTheme, {
      ariaLabel: "Email",
      invalid: true,
      describedBy: "email-help",
    })

    expect(kit.tag).toBe("input")
    expect(kit.className).toContain("mw-input")
    expect(kit.className).toContain("is-invalid")
    expect(kit.a11y.ariaLabel).toBe("Email")
    expect(kit.a11y.ariaDescribedBy).toBe("email-help")
  })
})
