import { describe, expect, it } from "vitest"
import { BadgeVariant } from "../../src/components/atoms/badge"
import { createBadgeRecipe } from "../../src/components/atoms/badge/badge-recipe"

describe("createBadgeRecipe", () => {
  it("default: className is mw-badge mw-badge--neutral, tag is span", () => {
    const kit = createBadgeRecipe({})
    expect(kit.className).toBe("mw-badge mw-badge--neutral")
    expect(kit.tag).toBe("span")
  })

  it("variant info: adds mw-badge--info", () => {
    const kit = createBadgeRecipe({ variant: BadgeVariant.info })
    expect(kit.className).toBe("mw-badge mw-badge--info")
  })

  it("variant success: adds mw-badge--success", () => {
    const kit = createBadgeRecipe({ variant: BadgeVariant.success })
    expect(kit.className).toBe("mw-badge mw-badge--success")
  })

  it("variant warning: adds mw-badge--warning", () => {
    const kit = createBadgeRecipe({ variant: BadgeVariant.warning })
    expect(kit.className).toBe("mw-badge mw-badge--warning")
  })

  it("variant error: adds mw-badge--error", () => {
    const kit = createBadgeRecipe({ variant: BadgeVariant.error })
    expect(kit.className).toBe("mw-badge mw-badge--error")
  })

  it("ariaLabel is passed through to a11y", () => {
    const kit = createBadgeRecipe({ ariaLabel: "3 notifications" })
    expect(kit.a11y.ariaLabel).toBe("3 notifications")
  })

  it("ariaLabel is undefined when not supplied", () => {
    const kit = createBadgeRecipe({})
    expect(kit.a11y.ariaLabel).toBeUndefined()
  })

  it("vars is always empty object (no inline vars for badge)", () => {
    const kit = createBadgeRecipe({ variant: BadgeVariant.success })
    expect(kit.vars).toEqual({})
  })
})
