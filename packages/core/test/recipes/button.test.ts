/**
 * Tests the button recipe's pure output — className, a11y attributes, loading
 * state normalization, and anchor-mode interaction blocking.
 * No DOM or framework involved; adapter tests verify the rendered result.
 */
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
    // Consumer explicitly opts out of disableWhileLoading
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

    // Button stays interactive — no disabled/aria-disabled attributes
    expect(kit.a11y.ariaBusy).toBe(true)
    expect(kit.a11y.ariaDisabled).toBeUndefined()
    expect(kit.a11y.disabled).toBeUndefined()
    expect(kit.blockClick).toBe(false)
    expect(kit.dataAttributes?.["data-has-affordance"]).toBe("true")
  })

  it("marks buttons with icons as having an affordance for label layout", () => {
    const kit = createButtonRecipe({
      as: "button",
      iconLeft: "plus",
    })

    expect(kit.dataAttributes?.["data-has-affordance"]).toBe("true")
  })

  it("marks icon-only buttons for square control styling", () => {
    const kit = createButtonRecipe({
      as: "button",
      ariaLabel: "Close",
      iconOnly: true,
      iconLeft: "x",
    })

    expect(kit.dataAttributes?.["data-icon-only"]).toBe("true")
  })

  it("builds anchor render kit and blocks navigation when loading disables interaction", () => {
    // Anchor button with default disableWhileLoading=true
    const kit = createButtonRecipe({
      as: "a",
      href: "/docs",
      loading: {
        isLoading: true,
      },
    })

    expect(kit.tag).toBe("a")

    // href removed so the browser won't navigate
    expect(kit.a11y.href).toBeUndefined()

    // Assistive tech sees the busy + disabled state
    expect(kit.a11y.ariaBusy).toBe(true)
    expect(kit.a11y.ariaDisabled).toBe(true)
    expect(kit.a11y.tabIndex).toBe(-1)

    // Adapter should block the click handler
    expect(kit.blockClick).toBe(true)
    expect(kit.dataAttributes?.["data-action"]).toBe("navigate")
  })
})
