import { describe, expect, it } from "vitest"
import { createSwitchRecipe } from "../../src/components/atoms/switch/switch-recipe"

describe("createSwitchRecipe", () => {
  it("default: className is mw-switch, ariaChecked=false, tag=button", () => {
    const kit = createSwitchRecipe({})
    expect(kit.className).toBe("mw-switch")
    expect(kit.tag).toBe("button")
    expect(kit.a11y.role).toBe("switch")
    expect(kit.a11y.ariaChecked).toBe(false)
    expect(kit.a11y.ariaDisabled).toBeUndefined()
  })

  it("checked: adds mw-switch--checked, ariaChecked=true", () => {
    const kit = createSwitchRecipe({ checked: true })
    expect(kit.className).toBe("mw-switch mw-switch--checked")
    expect(kit.a11y.ariaChecked).toBe(true)
  })

  it("disabled: adds mw-switch--disabled, ariaDisabled=true", () => {
    const kit = createSwitchRecipe({ disabled: true })
    expect(kit.className).toBe("mw-switch mw-switch--disabled")
    expect(kit.a11y.ariaDisabled).toBe(true)
  })

  it("checked + disabled: both modifier classes present", () => {
    const kit = createSwitchRecipe({ checked: true, disabled: true })
    expect(kit.className).toBe("mw-switch mw-switch--checked mw-switch--disabled")
    expect(kit.a11y.ariaChecked).toBe(true)
    expect(kit.a11y.ariaDisabled).toBe(true)
  })

  it("ariaLabel is passed through", () => {
    const kit = createSwitchRecipe({ ariaLabel: "Enable notifications" })
    expect(kit.a11y.ariaLabel).toBe("Enable notifications")
  })

  it("ariaLabel is undefined when not supplied", () => {
    const kit = createSwitchRecipe({})
    expect(kit.a11y.ariaLabel).toBeUndefined()
  })

  it("ariaLabelledby is passed through", () => {
    const kit = createSwitchRecipe({ ariaLabelledby: "switch-label" })
    expect(kit.a11y.ariaLabelledby).toBe("switch-label")
  })

  it("ariaDescribedBy is passed through", () => {
    const kit = createSwitchRecipe({ ariaDescribedBy: "switch-desc" })
    expect(kit.a11y.ariaDescribedBy).toBe("switch-desc")
  })

  it("vars is always empty object", () => {
    const kit = createSwitchRecipe({ checked: true })
    expect(kit.vars).toEqual({})
  })
})
