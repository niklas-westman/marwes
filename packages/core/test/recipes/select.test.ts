/**
 * Tests the select recipe's pure output — Marwes vs native appearance modes,
 * validation state, and the native boolean shorthand alias.
 */
import { describe, expect, it } from "vitest"
import { createSelectRecipe } from "../../src/components/atoms/input/select-recipe"

describe("createSelectRecipe", () => {
  // Default select uses the custom Marwes appearance, not native browser chrome
  it("returns the select contract with Marwes classes by default", () => {
    const kit = createSelectRecipe({
      ariaLabel: "Country",
      options: [
        { value: "se", label: "Sweden" },
        { value: "us", label: "United States" },
      ],
    })

    expect(kit.tag).toBe("select")
    expect(kit.className).toContain("mw-select")
    expect(kit.className).toContain("mw-select--default")
    expect(kit.className).toContain("mw-select--marwes")
    expect(kit.className).toContain("is-valid")
    expect(kit.a11y.ariaLabel).toBe("Country")
  })

  it("marks invalid selects through className and aria", () => {
    const kit = createSelectRecipe({
      ariaLabel: "Plan",
      invalid: true,
      options: [{ value: "pro", label: "Pro" }],
    })

    expect(kit.className).toContain("is-invalid")
    expect(kit.a11y.ariaInvalid).toBe(true)
  })

  it("supports opting into the native appearance", () => {
    const kit = createSelectRecipe({
      ariaLabel: "Language",
      appearance: "native",
      options: [{ value: "en", label: "English" }],
    })

    expect(kit.className).toContain("mw-select--native")
  })

  it("supports the native boolean alias", () => {
    const kit = createSelectRecipe({
      ariaLabel: "Country",
      native: true,
      options: [{ value: "se", label: "Sweden" }],
    })

    expect(kit.className).toContain("mw-select--native")
  })

  it("uses label as an accessible-name alias", () => {
    const kit = createSelectRecipe({
      label: "Plan",
      options: [{ value: "starter", label: "Starter" }],
    })

    expect(kit.a11y.ariaLabel).toBe("Plan")
  })

  it("lets native override a conflicting legacy appearance", () => {
    const kit = createSelectRecipe({
      ariaLabel: "Workspace",
      native: false,
      appearance: "native",
      options: [{ value: "starter", label: "Starter" }],
    })

    expect(kit.className).toContain("mw-select--marwes")
    expect(kit.className).not.toContain("mw-select--native")
  })
})
