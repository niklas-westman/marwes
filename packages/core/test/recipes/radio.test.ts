import { describe, expect, it } from "vitest"
import { radioRecipe } from "../../src/components/atoms/radio/radio-recipe"

describe("radioRecipe", () => {
  it("default: className is mw-radio, tag is input", () => {
    const kit = radioRecipe({})
    expect(kit.className).toBe("mw-radio")
    expect(kit.tag).toBe("input")
    expect(kit.a11y.type).toBe("radio")
    expect(kit.a11y.disabled).toBeUndefined()
    expect(kit.a11y.ariaInvalid).toBeUndefined()
  })

  it("disabled: adds mw-radio--disabled, a11y.disabled=true", () => {
    const kit = radioRecipe({ disabled: true })
    expect(kit.className).toBe("mw-radio mw-radio--disabled")
    expect(kit.a11y.disabled).toBe(true)
  })

  it("invalid: adds mw-radio--invalid, a11y.ariaInvalid=true", () => {
    const kit = radioRecipe({ invalid: true })
    expect(kit.className).toBe("mw-radio mw-radio--invalid")
    expect(kit.a11y.ariaInvalid).toBe(true)
  })

  it("disabled + invalid: both modifier classes present", () => {
    const kit = radioRecipe({ disabled: true, invalid: true })
    expect(kit.className).toBe("mw-radio mw-radio--disabled mw-radio--invalid")
  })

  it("checked=true is passed through to kit.checked", () => {
    const kit = radioRecipe({ checked: true })
    expect(kit.checked).toBe(true)
    expect(kit.defaultChecked).toBeUndefined()
  })

  it("defaultChecked is used when checked is not set", () => {
    const kit = radioRecipe({ defaultChecked: true })
    expect(kit.defaultChecked).toBe(true)
    expect(kit.checked).toBeUndefined()
  })

  it("id, name, value are passed through to a11y", () => {
    const kit = radioRecipe({ id: "opt-1", name: "group", value: "a" })
    expect(kit.a11y.id).toBe("opt-1")
    expect(kit.a11y.name).toBe("group")
    expect(kit.a11y.value).toBe("a")
  })

  it("ariaLabel is passed through", () => {
    const kit = radioRecipe({ ariaLabel: "Option A" })
    expect(kit.a11y.ariaLabel).toBe("Option A")
  })

  it("ariaLabelledBy and ariaDescribedBy are passed through", () => {
    const kit = radioRecipe({ ariaLabelledBy: "label-1", ariaDescribedBy: "desc-1" })
    expect(kit.a11y.ariaLabelledBy).toBe("label-1")
    expect(kit.a11y.ariaDescribedBy).toBe("desc-1")
  })

  it("vars is always empty object", () => {
    const kit = radioRecipe({ checked: true })
    expect(kit.vars).toEqual({})
  })
})
