/**
 * Tests the family a11y-to-HTML mappers adapters spread onto their elements.
 */
import { describe, expect, it } from "vitest"
import {
  checkboxRecipe,
  createInputRecipe,
  createSliderRecipe,
  createSwitchRecipe,
  toCheckboxHtmlAttributes,
  toInputHtmlAttributes,
  toSliderHtmlAttributes,
  toSwitchHtmlAttributes,
} from "../../src/components/atoms"
import { defineHtmlAttributeMapper } from "../../src/shared/html-attributes"

describe("defineHtmlAttributeMapper", () => {
  const mapper = defineHtmlAttributeMapper<{ ariaLabel?: string; tabIndex?: number | undefined }>()(
    {
      ariaLabel: "aria-label",
      tabIndex: "tabindex",
    },
  )

  it("renames fields and omits undefined but keeps falsy values", () => {
    expect(mapper({ ariaLabel: "Save", tabIndex: 0 })).toEqual({
      "aria-label": "Save",
      tabindex: 0,
    })
    expect(mapper({ tabIndex: undefined })).toEqual({})
  })
})

describe("family HTML attribute mappers", () => {
  it("maps input a11y including lowercase readonly, inputmode and autocomplete", () => {
    const kit = createInputRecipe({
      id: "email",
      readOnly: true,
      inputMode: "email",
      autoComplete: "email",
      invalid: true,
      ariaLabel: "Email",
    })

    expect(toInputHtmlAttributes(kit.a11y)).toMatchObject({
      id: "email",
      readonly: true,
      inputmode: "email",
      autocomplete: "email",
      "aria-invalid": true,
      "aria-label": "Email",
    })
  })

  it("maps slider a11y including aria-valuetext and aria-orientation", () => {
    const kit = createSliderRecipe({ min: 0, max: 10, ariaValueText: "five", ariaLabel: "Level" })

    expect(toSliderHtmlAttributes(kit.a11y)).toMatchObject({
      type: "range",
      min: 0,
      max: 10,
      "aria-valuetext": "five",
      "aria-label": "Level",
    })
  })

  it("maps checkbox a11y including mixed aria-checked", () => {
    const kit = checkboxRecipe({ indeterminate: true, ariaLabel: "All" })

    expect(toCheckboxHtmlAttributes(kit.a11y)).toMatchObject({
      type: "checkbox",
      "aria-checked": "mixed",
      "aria-label": "All",
    })
  })

  it("keeps aria-checked=false for an unchecked switch", () => {
    const kit = createSwitchRecipe({ checked: false, ariaLabel: "Notifications" })

    expect(toSwitchHtmlAttributes(kit.a11y)).toMatchObject({
      role: "switch",
      "aria-checked": false,
      "aria-label": "Notifications",
    })
  })
})
