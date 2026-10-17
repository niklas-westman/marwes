import { describe, expect, it } from "vitest"
import { IconName, createButtonRecipe, resolveButtonIcons } from "../../src"

// Canonical icon placements selected from the October 14 Figma purpose frames.
const selections = [
  ["confirm", IconName.Check, "right"],
  ["success", IconName.Check, "right"],
  ["destructive", IconName.X, "right"],
  ["verify", IconName.CheckCircle, "left"],
  ["edit", IconName.Edit, "left"],
  ["upload", IconName.Upload, "left"],
  ["download", IconName.Download, "left"],
  ["search", IconName.Search, "left"],
  // Purpose instances 3978:38909 (light) and 3978:39216 (dark).
  ["refresh", IconName.RefreshCw, "left"],
] as const

describe("Button purpose icons", () => {
  it.each(selections)("resolves %s to its Figma icon on the %s side", (purpose, icon, side) => {
    const options = { dataAttributes: { "data-purpose": purpose } }
    expect(resolveButtonIcons(options)).toEqual({
      [side === "left" ? "iconLeft" : "iconRight"]: icon,
    })
    expect(createButtonRecipe(options).dataAttributes?.["data-has-affordance"]).toBe("true")
  })

  it.each(selections)("preserves explicit icons for %s without injecting a default", (purpose) => {
    const dataAttributes = { "data-purpose": purpose }
    expect(resolveButtonIcons({ dataAttributes, iconLeft: IconName.ArrowLeft })).toEqual({
      iconLeft: IconName.ArrowLeft,
      iconRight: undefined,
    })
    expect(resolveButtonIcons({ dataAttributes, iconRight: IconName.ArrowRight })).toEqual({
      iconLeft: undefined,
      iconRight: IconName.ArrowRight,
    })
    expect(
      resolveButtonIcons({
        dataAttributes,
        iconLeft: IconName.ArrowLeft,
        iconRight: IconName.ArrowRight,
      }),
    ).toEqual({
      iconLeft: IconName.ArrowLeft,
      iconRight: IconName.ArrowRight,
    })
  })

  it("does not add an icon to an unconfigured purpose or a plain button", () => {
    for (const options of [{}, { dataAttributes: { "data-purpose": "create" } }]) {
      expect(resolveButtonIcons(options)).toEqual({ iconLeft: undefined, iconRight: undefined })
      expect(createButtonRecipe(options).dataAttributes?.["data-has-affordance"]).toBeUndefined()
    }
  })
})
