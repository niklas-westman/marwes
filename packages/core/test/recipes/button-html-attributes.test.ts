/**
 * Tests the pure a11y-to-HTML mapping every Button adapter spreads onto its element.
 */
import { describe, expect, it } from "vitest"
import { createButtonRecipe, toButtonHtmlAttributes } from "../../src/components/atoms"

describe("toButtonHtmlAttributes", () => {
  it("maps every a11y field to its HTML attribute name", () => {
    expect(
      toButtonHtmlAttributes({
        ariaLabel: "Save",
        ariaLabelledBy: "label-id",
        ariaBusy: true,
        ariaDisabled: true,
        ariaPressed: false,
        ariaExpanded: true,
        ariaControls: "panel",
        title: "Tip",
        disabled: true,
        type: "submit",
        href: "/docs",
        role: "link",
        tabIndex: -1,
      }),
    ).toEqual({
      "aria-label": "Save",
      "aria-labelledby": "label-id",
      "aria-busy": true,
      "aria-disabled": true,
      "aria-pressed": false,
      "aria-expanded": true,
      "aria-controls": "panel",
      title: "Tip",
      disabled: true,
      type: "submit",
      href: "/docs",
      role: "link",
      tabindex: -1,
    })
  })

  it("omits undefined fields but keeps falsy values", () => {
    expect(toButtonHtmlAttributes({ ariaPressed: false, tabIndex: 0, title: undefined })).toEqual({
      "aria-pressed": false,
      tabindex: 0,
    })
  })

  it("renders a button recipe's a11y as button attributes", () => {
    const kit = createButtonRecipe({ toggle: true, pressed: true, loading: true, label: "Save" })

    expect(toButtonHtmlAttributes(kit.a11y)).toEqual({
      type: "button",
      disabled: true,
      "aria-label": "Save",
      "aria-busy": true,
      "aria-disabled": true,
      "aria-pressed": true,
    })
  })
})
