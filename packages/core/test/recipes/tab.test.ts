/**
 * Tests the tab recipe's pure output — selected/disabled modifier classes,
 * tabIndex management, and the rule that disabled wins over selected for focus.
 */
import { describe, expect, it } from "vitest"
import { createTabRecipe } from "../../src/components/atoms/tab/tab-recipe"

describe("createTabRecipe", () => {
  it("default: className is mw-tab, ariaSelected=false, tabIndex=-1", () => {
    const kit = createTabRecipe({})
    expect(kit.className).toBe("mw-tab")
    expect(kit.a11y.ariaSelected).toBe(false)
    expect(kit.a11y.tabIndex).toBe(-1)
    expect(kit.a11y.ariaDisabled).toBeUndefined()
  })

  it("selected: adds mw-tab--selected, tabIndex=0", () => {
    const kit = createTabRecipe({ selected: true })
    expect(kit.className).toBe("mw-tab mw-tab--selected")
    expect(kit.a11y.ariaSelected).toBe(true)
    expect(kit.a11y.tabIndex).toBe(0)
  })

  it("disabled: adds mw-tab--disabled, tabIndex=-1, ariaDisabled=true", () => {
    const kit = createTabRecipe({ disabled: true })
    expect(kit.className).toBe("mw-tab mw-tab--disabled")
    expect(kit.a11y.tabIndex).toBe(-1)
    expect(kit.a11y.ariaDisabled).toBe(true)
  })

  it("selected + disabled: tabIndex stays -1 (disabled wins)", () => {
    const kit = createTabRecipe({ selected: true, disabled: true })
    expect(kit.className).toBe("mw-tab mw-tab--selected mw-tab--disabled")
    expect(kit.a11y.tabIndex).toBe(-1)
    expect(kit.a11y.ariaDisabled).toBe(true)
  })

  it("ariaControls is passed through", () => {
    const kit = createTabRecipe({ ariaControls: "panel-1" })
    expect(kit.a11y.ariaControls).toBe("panel-1")
  })

  it("ariaLabel is passed through", () => {
    const kit = createTabRecipe({ ariaLabel: "Overview tab" })
    expect(kit.a11y.ariaLabel).toBe("Overview tab")
  })

  it("tag is always button", () => {
    const kit = createTabRecipe({})
    expect(kit.tag).toBe("button")
  })
})
