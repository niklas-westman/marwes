/**
 * Vue adapter: Verifies that the Tooltip barrel re-exports all public symbols
 * from both the component directory and the package root.
 */
import { describe, expect, it } from "vitest"
import * as tooltipComponents from ".."
import * as publicApi from "../../../index"

describe("tooltip barrel exports", () => {
  it("exports the tooltip atom and molecule", () => {
    expect(tooltipComponents.Tooltip).toBeDefined()
    expect(tooltipComponents.TooltipGroup).toBeDefined()
  })

  it("re-exports the tooltip symbols from the package root", () => {
    expect(publicApi.Tooltip).toBe(tooltipComponents.Tooltip)
    expect(publicApi.TooltipGroup).toBe(tooltipComponents.TooltipGroup)
  })
})
