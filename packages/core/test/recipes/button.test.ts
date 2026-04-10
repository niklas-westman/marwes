import { describe, expect, it } from "vitest"
import { SpinnerVariants, createButtonRecipe } from "../../src/components/atoms"

describe("createButtonRecipe", () => {
  it("builds button render kit with default metadata", () => {
    const kit = createButtonRecipe({
      as: "button",
      ariaLabel: "Save",
      iconOnly: true,
    })

    expect(kit.tag).toBe("button")
    expect(kit.className).toContain("mw-btn")
    expect(kit.dataAttributes?.["data-component"]).toBe("button")
    expect(kit.a11y.title).toBe("Save")
    expect(kit.loading).toEqual({
      isLoading: false,
      disableWhileLoading: true,
      spinnerVariant: SpinnerVariants.classic,
    })
  })

  it("normalizes object loading without forcing disabled state when opted out", () => {
    const kit = createButtonRecipe({
      as: "button",
      loading: {
        isLoading: true,
        disableWhileLoading: false,
        spinnerVariant: SpinnerVariants.dual,
        loadingLabel: "Saving…",
      },
    })

    expect(kit.loading).toEqual({
      isLoading: true,
      disableWhileLoading: false,
      spinnerVariant: SpinnerVariants.dual,
      loadingLabel: "Saving…",
    })
    expect(kit.a11y.ariaBusy).toBe(true)
    expect(kit.a11y.ariaDisabled).toBeUndefined()
    expect(kit.a11y.disabled).toBeUndefined()
    expect(kit.blockClick).toBe(false)
  })

  it("builds anchor render kit and blocks navigation when loading disables interaction", () => {
    const kit = createButtonRecipe({
      as: "a",
      href: "/docs",
      loading: {
        isLoading: true,
      },
    })

    expect(kit.tag).toBe("a")
    expect(kit.a11y.href).toBeUndefined()
    expect(kit.a11y.ariaBusy).toBe(true)
    expect(kit.a11y.ariaDisabled).toBe(true)
    expect(kit.a11y.tabIndex).toBe(-1)
    expect(kit.blockClick).toBe(true)
    expect(kit.dataAttributes?.["data-action"]).toBe("navigate")
  })
})
