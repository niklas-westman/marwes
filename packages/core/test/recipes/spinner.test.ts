import { describe, expect, it } from "vitest"
import { createSpinnerRecipe } from "../../src/components/atoms/spinner/spinner-recipe"

describe("createSpinnerRecipe", () => {
  it("builds a decorative classic spinner by default", () => {
    const kit = createSpinnerRecipe()

    expect(kit.tag).toBe("span")
    expect(kit.className).toContain("mw-spinner")
    expect(kit.className).toContain("mw-spinner--classic")
    expect(kit.a11y.ariaHidden).toBe(true)
    expect(kit.dataAttributes["data-component"]).toBe("spinner")
    expect(kit.dataAttributes["data-variant"]).toBe("classic")
    expect(kit.dataAttributes["data-size"]).toBe("sm")
    expect(kit.vars["--mw-spinner-size"]).toBe("24px")
    expect(kit.svg.nodes).toHaveLength(2)
  })

  it("supports all synced spinner variants", () => {
    const ringSpinner = createSpinnerRecipe({ variant: "ring" })
    const dualSpinner = createSpinnerRecipe({ variant: "dual" })
    const roundDotsSpinner = createSpinnerRecipe({ variant: "dots-round" })
    const squareDotsSpinner = createSpinnerRecipe({ variant: "dots-square" })
    const linesSpinner = createSpinnerRecipe({ variant: "lines" })
    const crossSpinner = createSpinnerRecipe({ variant: "cross" })

    expect(ringSpinner.svg.nodes).toHaveLength(1)
    expect(dualSpinner.svg.nodes).toHaveLength(3)
    expect(roundDotsSpinner.svg.nodes).toHaveLength(8)
    expect(squareDotsSpinner.svg.nodes).toHaveLength(8)
    expect(linesSpinner.svg.nodes).toHaveLength(8)
    expect(crossSpinner.svg.nodes).toHaveLength(4)
  })

  it("supports token and custom pixel sizes", () => {
    expect(createSpinnerRecipe({ size: "xs" }).vars["--mw-spinner-size"]).toBe("16px")
    expect(createSpinnerRecipe({ size: "md" }).vars["--mw-spinner-size"]).toBe("32px")
    expect(createSpinnerRecipe({ size: "lg" }).vars["--mw-spinner-size"]).toBe("40px")
    expect(createSpinnerRecipe({ size: 56 }).vars["--mw-spinner-size"]).toBe("56px")
    expect(createSpinnerRecipe({ size: 56 }).dataAttributes["data-size"]).toBe("custom")
  })

  it("becomes a status element when an aria label is provided", () => {
    const kit = createSpinnerRecipe({ ariaLabel: "Loading account data", id: "loading-spinner" })

    expect(kit.a11y.role).toBe("status")
    expect(kit.a11y.ariaLabel).toBe("Loading account data")
    expect(kit.a11y.ariaLive).toBe("polite")
    expect(kit.a11y.ariaHidden).toBeUndefined()
    expect(kit.a11y.id).toBe("loading-spinner")
  })
})
