/**
 * Tests the accordion recipe's pure output — open/disabled modifier classes,
 * aria expansion state, and trigger/panel ID derivation from the base ID.
 */
import { describe, expect, it } from "vitest"
import { createAccordionRecipe } from "../../src/components/atoms/accordion/accordion-recipe"

describe("createAccordionRecipe", () => {
  it("default: className is mw-accordion, ariaExpanded=false, tag=div", () => {
    const kit = createAccordionRecipe({ id: "acc-1" })
    expect(kit.className).toBe("mw-accordion")
    expect(kit.tag).toBe("div")
    expect(kit.a11y.ariaExpanded).toBe(false)
    expect(kit.a11y.ariaDisabled).toBeUndefined()
  })

  it("open: adds mw-accordion--open, ariaExpanded=true", () => {
    const kit = createAccordionRecipe({ id: "acc-1", open: true })
    expect(kit.className).toBe("mw-accordion mw-accordion--open")
    expect(kit.a11y.ariaExpanded).toBe(true)
  })

  it("disabled: adds mw-accordion--disabled, ariaDisabled=true", () => {
    const kit = createAccordionRecipe({ id: "acc-1", disabled: true })
    expect(kit.className).toBe("mw-accordion mw-accordion--disabled")
    expect(kit.a11y.ariaDisabled).toBe(true)
  })

  it("open + disabled: both modifier classes present", () => {
    const kit = createAccordionRecipe({ id: "acc-1", open: true, disabled: true })
    expect(kit.className).toBe("mw-accordion mw-accordion--open mw-accordion--disabled")
  })

  it("derives triggerId and panelId from id", () => {
    const kit = createAccordionRecipe({ id: "faq-1" })
    expect(kit.a11y.triggerId).toBe("faq-1-trigger")
    expect(kit.a11y.panelId).toBe("faq-1-panel")
  })

  it("vars is always empty object", () => {
    const kit = createAccordionRecipe({ id: "acc-1" })
    expect(kit.vars).toEqual({})
  })
})
