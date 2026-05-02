import { describe, expect, it } from "vitest"
import { createTextareaRecipe } from "../../src/components/atoms/input/textarea-recipe"

describe("createTextareaRecipe", () => {
  it("creates invalid state class and a11y wiring", () => {
    const kit = createTextareaRecipe({
      ariaLabel: "About you",
      invalid: true,
      describedBy: "about-help",
      rows: 5,
      resize: "none",
    })

    expect(kit.tag).toBe("textarea")
    expect(kit.className).toContain("mw-textarea")
    expect(kit.className).toContain("is-invalid")
    expect(kit.a11y.ariaLabel).toBe("About you")
    expect(kit.a11y.ariaDescribedBy).toBe("about-help")
    expect(kit.a11y.rows).toBe(5)
    expect(kit.vars["--mw-textarea-resize"]).toBe("none")
  })
})
