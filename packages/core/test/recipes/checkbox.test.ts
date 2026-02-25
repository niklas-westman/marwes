import { describe, expect, it } from "vitest"
import { checkboxRecipe } from "../../src/components/atoms/checkbox/checkbox-recipe"
import { defaultTheme } from "../../src/theme/theme-defaults"

describe("checkboxRecipe", () => {
  it("returns controlled checked state when checked is provided", () => {
    const kit = checkboxRecipe({ theme: defaultTheme, checked: true, ariaLabel: "Accept" })
    expect(kit.checked).toBe(true)
    expect(kit.defaultChecked).toBeUndefined()
  })

  it("returns uncontrolled defaultChecked when checked is absent", () => {
    const kit = checkboxRecipe({ theme: defaultTheme, defaultChecked: true, ariaLabel: "Accept" })
    expect(kit.defaultChecked).toBe(true)
    expect(kit.checked).toBeUndefined()
  })
})
