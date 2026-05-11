/**
 * Tests the toast recipe's pure output — outline/rich variant classes
 * and live-region role selection (polite → status, assertive → alert).
 */
import { describe, expect, it } from "vitest"
import { createToastRecipe } from "../../src/components/atoms/toast/toast-recipe"

describe("createToastRecipe", () => {
  it("default: className is mw-toast mw-toast--outline, tag=div, role=status", () => {
    const kit = createToastRecipe({})
    expect(kit.className).toBe("mw-toast mw-toast--outline")
    expect(kit.tag).toBe("div")
    expect(kit.a11y.role).toBe("status")
    expect(kit.a11y.ariaLive).toBe("polite")
    expect(kit.a11y.ariaAtomic).toBe(true)
  })

  it("variant outline: adds mw-toast--outline", () => {
    const kit = createToastRecipe({ variant: "outline" })
    expect(kit.className).toBe("mw-toast mw-toast--outline")
  })

  it("variant rich: adds mw-toast--rich", () => {
    const kit = createToastRecipe({ variant: "rich" })
    expect(kit.className).toBe("mw-toast mw-toast--rich")
  })

  it("ariaLive assertive → role=alert", () => {
    const kit = createToastRecipe({ ariaLive: "assertive" })
    expect(kit.a11y.role).toBe("alert")
    expect(kit.a11y.ariaLive).toBe("assertive")
  })

  it("ariaLive polite → role=status", () => {
    const kit = createToastRecipe({ ariaLive: "polite" })
    expect(kit.a11y.role).toBe("status")
  })

  it("vars is always empty object", () => {
    const kit = createToastRecipe({ variant: "rich" })
    expect(kit.vars).toEqual({})
  })
})
