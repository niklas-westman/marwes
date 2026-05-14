/**
 * Vue Date Picker introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { describe, expect, it } from "vitest"
import introduction from "../Introduction.mdx?raw"

describe("Date Picker introduction docs", () => {
  it("documents the core day-state contract", () => {
    expect(introduction).toContain('data-component="date-picker"')
    expect(introduction).toContain("selected")
    expect(introduction).toContain("range-hover")
  })
})
