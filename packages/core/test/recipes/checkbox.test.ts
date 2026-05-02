import { describe, expect, it } from "vitest"
import { checkboxRecipe } from "../../src/components/atoms/checkbox/checkbox-recipe"

describe("checkboxRecipe", () => {
  it("returns controlled checked state when checked is provided", () => {
    const kit = checkboxRecipe({ checked: true, ariaLabel: "Accept" })
    expect(kit.checked).toBe(true)
    expect(kit.defaultChecked).toBeUndefined()
  })

  it("returns uncontrolled defaultChecked when checked is absent", () => {
    const kit = checkboxRecipe({ defaultChecked: true, ariaLabel: "Accept" })
    expect(kit.defaultChecked).toBe(true)
    expect(kit.checked).toBeUndefined()
  })
})
