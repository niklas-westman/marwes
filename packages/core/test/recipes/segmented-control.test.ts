import { describe, expect, it } from "vitest"
import {
  SegmentedControlVariant,
  createSegmentedControlItemRecipe,
  createSegmentedControlRecipe,
  moveSegmentedControlSelection,
  resolveSegmentedControlValue,
} from "../../src/components/atoms/segmented-control"

describe("createSegmentedControlRecipe", () => {
  it("returns a radiogroup render kit", () => {
    const kit = createSegmentedControlRecipe({ ariaLabel: "View density" })

    expect(kit.tag).toBe("div")
    expect(kit.className).toBe("mw-segmented-control mw-segmented-control--surface")
    expect(kit.a11y.role).toBe("radiogroup")
    expect(kit.a11y.ariaLabel).toBe("View density")
    expect(kit.dataAttributes).toMatchObject({
      "data-component": "segmented-control",
      "data-layer": "atom",
    })
  })

  it("adds contrast variant and disabled modifiers", () => {
    const kit = createSegmentedControlRecipe({
      variant: SegmentedControlVariant.contrast,
      disabled: true,
    })

    expect(kit.className).toBe(
      "mw-segmented-control mw-segmented-control--contrast mw-segmented-control--disabled",
    )
    expect(kit.a11y.ariaDisabled).toBe(true)
    expect(kit.dataAttributes["data-variant"]).toBe("contrast")
  })
})

describe("createSegmentedControlItemRecipe", () => {
  it("returns a radio-like button render kit", () => {
    const kit = createSegmentedControlItemRecipe({ selected: true, ariaLabel: "Grid" })

    expect(kit.tag).toBe("button")
    expect(kit.className).toBe(
      "mw-segmented-control__item mw-segmented-control__item--surface mw-segmented-control__item--selected",
    )
    expect(kit.a11y.role).toBe("radio")
    expect(kit.a11y.ariaChecked).toBe(true)
    expect(kit.a11y.ariaLabel).toBe("Grid")
    expect(kit.a11y.tabIndex).toBe(0)
  })

  it("removes disabled items from roving focus", () => {
    const kit = createSegmentedControlItemRecipe({ selected: true, disabled: true })

    expect(kit.className).toContain("mw-segmented-control__item--disabled")
    expect(kit.a11y.ariaDisabled).toBe(true)
    expect(kit.a11y.tabIndex).toBe(-1)
  })
})

describe("segmented control value helpers", () => {
  const items = [{ value: "list" }, { value: "grid", disabled: true }, { value: "cards" }]

  it("resolves to the requested enabled value", () => {
    expect(resolveSegmentedControlValue(items, "cards")).toBe("cards")
  })

  it("falls back to the first enabled value", () => {
    expect(resolveSegmentedControlValue(items, "grid")).toBe("list")
  })

  it("skips disabled items during keyboard movement", () => {
    expect(moveSegmentedControlSelection(items, "list", "next")).toBe("cards")
    expect(moveSegmentedControlSelection(items, "cards", "previous")).toBe("list")
  })
})
