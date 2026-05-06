import { describe, expect, it } from "vitest"
import { createSkeletonRecipe } from "../../src/components/atoms/skeleton/skeleton-recipe"

describe("createSkeletonRecipe", () => {
  it("builds a decorative text skeleton by default", () => {
    const kit = createSkeletonRecipe()

    expect(kit.tag).toBe("span")
    expect(kit.className).toContain("mw-skeleton")
    expect(kit.className).toContain("mw-skeleton--text")
    expect(kit.className).toContain("mw-skeleton--pulse")
    expect(kit.a11y.ariaHidden).toBe(true)
    expect(kit.dataAttributes["data-component"]).toBe("skeleton")
    expect(kit.dataAttributes["data-variant"]).toBe("text")
    expect(kit.dataAttributes["data-animation"]).toBe("pulse")
    expect(kit.vars["--mw-skeleton-width"]).toBe("120px")
    expect(kit.vars["--mw-skeleton-height"]).toBe("12px")
    expect(kit.vars["--mw-skeleton-radius"]).toBe("4px")
  })

  it("supports circular and rectangular Figma defaults", () => {
    const circular = createSkeletonRecipe({ variant: "circular" })
    const rectangular = createSkeletonRecipe({ variant: "rectangular" })

    expect(circular.vars["--mw-skeleton-width"]).toBe("40px")
    expect(circular.vars["--mw-skeleton-height"]).toBe("40px")
    expect(circular.vars["--mw-skeleton-radius"]).toBe("9999px")
    expect(rectangular.vars["--mw-skeleton-width"]).toBe("120px")
    expect(rectangular.vars["--mw-skeleton-height"]).toBe("120px")
    expect(rectangular.vars["--mw-skeleton-radius"]).toBe("4px")
  })

  it("supports custom dimensions, radius, and wave animation", () => {
    const kit = createSkeletonRecipe({
      variant: "rectangular",
      width: 240,
      height: "8rem",
      radius: 12,
      animation: "wave",
    })

    expect(kit.className).toContain("mw-skeleton--wave")
    expect(kit.vars["--mw-skeleton-width"]).toBe("240px")
    expect(kit.vars["--mw-skeleton-height"]).toBe("8rem")
    expect(kit.vars["--mw-skeleton-radius"]).toBe("12px")
  })

  it("becomes a status element when an aria label is provided", () => {
    const kit = createSkeletonRecipe({ ariaLabel: "Loading dashboard panel", id: "panel" })

    expect(kit.a11y.role).toBe("status")
    expect(kit.a11y.ariaLabel).toBe("Loading dashboard panel")
    expect(kit.a11y.ariaLive).toBe("polite")
    expect(kit.a11y.ariaHidden).toBeUndefined()
    expect(kit.a11y.id).toBe("panel")
  })

  it("keeps static skeletons free from animation modifier classes", () => {
    const kit = createSkeletonRecipe({ animation: "none" })

    expect(kit.dataAttributes["data-animation"]).toBe("none")
    expect(kit.className).not.toContain("mw-skeleton--pulse")
    expect(kit.className).not.toContain("mw-skeleton--wave")
  })
})
