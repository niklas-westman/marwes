/**
 * Tests the Stack and StackItem recipes' pure output — defaults, gap/padding
 * precedence, every enum value reaching a data attribute, token-only vars and
 * the TypeError guard for values outside the allowed sets.
 */
import { describe, expect, it } from "vitest"
import { createStackItemRecipe } from "../../src/components/atoms/stack/stack-item.recipe"
import { createStackRecipe } from "../../src/components/atoms/stack/stack.recipe"
import type { StackItemOptions, StackOptions } from "../../src/components/atoms/stack/stack.types"
import {
  stackAlignItemsValues,
  stackAsValues,
  stackDirections,
  stackItemAsValues,
  stackJustifyContentValues,
  stackSizings,
  stackWraps,
} from "../../src/components/atoms/stack/stack.values"

describe("createStackRecipe", () => {
  it("resolves column/start/start/nowrap/hug/hug and sp-0 by default", () => {
    const kit = createStackRecipe()

    expect(kit.tag).toBe("div")
    expect(kit.className).toBe("mw-stack")
    expect(kit.dataAttributes).toEqual({
      "data-component": "stack",
      "data-direction": "column",
      "data-row-gap": "sp-0",
      "data-column-gap": "sp-0",
      "data-padding-top": "sp-0",
      "data-padding-right": "sp-0",
      "data-padding-bottom": "sp-0",
      "data-padding-left": "sp-0",
      "data-align-items": "start",
      "data-justify-content": "start",
      "data-wrap": "nowrap",
      "data-horizontal-sizing": "hug",
      "data-vertical-sizing": "hug",
    })
    expect(kit.vars).toEqual({
      "--mw-stack-row-gap": "var(--mw-spacing-sp-0)",
      "--mw-stack-column-gap": "var(--mw-spacing-sp-0)",
      "--mw-stack-padding-top": "var(--mw-spacing-sp-0)",
      "--mw-stack-padding-right": "var(--mw-spacing-sp-0)",
      "--mw-stack-padding-bottom": "var(--mw-spacing-sp-0)",
      "--mw-stack-padding-left": "var(--mw-spacing-sp-0)",
    })
  })

  it("lets rowGap and columnGap win over gap", () => {
    const shorthand = createStackRecipe({ gap: "sp-16" })
    expect(shorthand.dataAttributes["data-row-gap"]).toBe("sp-16")
    expect(shorthand.dataAttributes["data-column-gap"]).toBe("sp-16")

    const specific = createStackRecipe({ gap: "sp-16", rowGap: "sp-8", columnGap: "sp-24" })
    expect(specific.dataAttributes["data-row-gap"]).toBe("sp-8")
    expect(specific.dataAttributes["data-column-gap"]).toBe("sp-24")
    expect(specific.vars["--mw-stack-row-gap"]).toBe("var(--mw-spacing-sp-8)")
    expect(specific.vars["--mw-stack-column-gap"]).toBe("var(--mw-spacing-sp-24)")
  })

  it("resolves each padding side as side ?? axis ?? padding ?? sp-0", () => {
    const kit = createStackRecipe({
      padding: "sp-4",
      paddingX: "sp-8",
      paddingY: "sp-12",
      paddingTop: "sp-16",
      paddingLeft: "sp-24",
    })

    expect(kit.dataAttributes["data-padding-top"]).toBe("sp-16")
    expect(kit.dataAttributes["data-padding-right"]).toBe("sp-8")
    expect(kit.dataAttributes["data-padding-bottom"]).toBe("sp-12")
    expect(kit.dataAttributes["data-padding-left"]).toBe("sp-24")

    const onlyPadding = createStackRecipe({ padding: "sp-32" })
    expect(onlyPadding.vars["--mw-stack-padding-top"]).toBe("var(--mw-spacing-sp-32)")
    expect(onlyPadding.vars["--mw-stack-padding-right"]).toBe("var(--mw-spacing-sp-32)")
    expect(onlyPadding.vars["--mw-stack-padding-bottom"]).toBe("var(--mw-spacing-sp-32)")
    expect(onlyPadding.vars["--mw-stack-padding-left"]).toBe("var(--mw-spacing-sp-32)")
  })

  it.each(stackDirections)("emits direction %s", (direction) => {
    expect(createStackRecipe({ direction }).dataAttributes["data-direction"]).toBe(direction)
  })

  it.each(stackAlignItemsValues)("emits alignItems %s", (alignItems) => {
    expect(createStackRecipe({ alignItems }).dataAttributes["data-align-items"]).toBe(alignItems)
  })

  it.each(stackJustifyContentValues)("emits justifyContent %s", (justifyContent) => {
    expect(createStackRecipe({ justifyContent }).dataAttributes["data-justify-content"]).toBe(
      justifyContent,
    )
  })

  it.each(stackWraps)("emits wrap %s", (wrap) => {
    expect(createStackRecipe({ wrap }).dataAttributes["data-wrap"]).toBe(wrap)
  })

  it.each(stackSizings)("emits horizontal and vertical sizing %s", (sizing) => {
    const kit = createStackRecipe({ horizontalSizing: sizing, verticalSizing: sizing })
    expect(kit.dataAttributes["data-horizontal-sizing"]).toBe(sizing)
    expect(kit.dataAttributes["data-vertical-sizing"]).toBe(sizing)
  })

  it.each(stackAsValues)("renders as %s", (as) => {
    expect(createStackRecipe({ as }).tag).toBe(as)
  })

  it("emits only var(--mw-spacing-*) values with no px or calc", () => {
    const kit = createStackRecipe({ gap: "sp-120", padding: "sp-2" })

    for (const value of Object.values(kit.vars)) {
      expect(value).toMatch(/^var\(--mw-spacing-sp-\d+\)$/)
      expect(value).not.toContain("px")
      expect(value).not.toContain("calc")
    }
  })

  it("throws a TypeError for a non-token gap or padding", () => {
    expect(() => createStackRecipe({ gap: "12px" } as unknown as StackOptions)).toThrow(TypeError)
    expect(() => createStackRecipe({ rowGap: "sp-6" } as unknown as StackOptions)).toThrow(
      "Stack rowGap must be one of",
    )
    expect(() => createStackRecipe({ paddingLeft: "1rem" } as unknown as StackOptions)).toThrow(
      TypeError,
    )
  })

  it("throws a TypeError for an invalid enum value or as", () => {
    expect(() => createStackRecipe({ direction: "horizontal" } as unknown as StackOptions)).toThrow(
      "Stack direction must be one of row, column, got horizontal",
    )
    expect(() =>
      createStackRecipe({ direction: "row-reverse" } as unknown as StackOptions),
    ).toThrow(TypeError)
    expect(() =>
      createStackRecipe({ justifyContent: "stretch" } as unknown as StackOptions),
    ).toThrow(TypeError)
    expect(() => createStackRecipe({ as: "script" } as unknown as StackOptions)).toThrow(TypeError)
    expect(() => createStackRecipe({ as: "form" } as unknown as StackOptions)).toThrow(TypeError)
  })
})

describe("createStackItemRecipe", () => {
  it("defaults to a div with hug/hug sizing", () => {
    const kit = createStackItemRecipe()

    expect(kit.tag).toBe("div")
    expect(kit.className).toBe("mw-stack-item")
    expect(kit.vars).toEqual({})
    expect(kit.dataAttributes).toEqual({
      "data-component": "stack-item",
      "data-horizontal-sizing": "hug",
      "data-vertical-sizing": "hug",
    })
  })

  it.each(stackSizings)("emits sizing %s", (sizing) => {
    const kit = createStackItemRecipe({ horizontalSizing: sizing, verticalSizing: sizing })
    expect(kit.dataAttributes["data-horizontal-sizing"]).toBe(sizing)
    expect(kit.dataAttributes["data-vertical-sizing"]).toBe(sizing)
  })

  it.each(stackItemAsValues)("renders as %s", (as) => {
    expect(createStackItemRecipe({ as }).tag).toBe(as)
  })

  it("throws a TypeError for an invalid sizing or as", () => {
    expect(() =>
      createStackItemRecipe({ horizontalSizing: "fixed" } as unknown as StackItemOptions),
    ).toThrow("StackItem horizontalSizing must be one of fix, hug, fill, got fixed")
    expect(() => createStackItemRecipe({ as: "span" } as unknown as StackItemOptions)).toThrow(
      TypeError,
    )
  })
})
