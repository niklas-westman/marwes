/**
 * Tests the input recipe's pure output — invalid state className and a11y wiring.
 * The input recipe is a thin contract; most behavior is in the adapter layer.
 */
import { describe, expect, it } from "vitest"
import { createInputRecipe } from "../../src/components/atoms/input/input-recipe"

describe("createInputRecipe", () => {
  // Verifies that invalid state produces both visual (className) and semantic (aria) signals
  it("creates invalid state class and a11y wiring", () => {
    const kit = createInputRecipe({
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

  it("uses label as an accessible-name alias", () => {
    const kit = createInputRecipe({
      label: "Search",
    })

    expect(kit.a11y.ariaLabel).toBe("Search")
  })
})
