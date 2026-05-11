/**
 * Vue adapter: Verifies that the Badge barrel re-exports all public symbols
 * from both the component directory and the package root.
 */
import { BadgeVariant } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"
import * as badgeComponents from ".."
import * as publicApi from "../../../index"

describe("badge barrel exports", () => {
  it("exports BadgeVariant from the badge domain barrel", () => {
    expect(badgeComponents.BadgeVariant).toBe(BadgeVariant)
    expect(badgeComponents.BadgeVariant.success).toBe("success")
  })

  it("re-exports BadgeVariant from the package root", () => {
    expect(publicApi.BadgeVariant).toBe(BadgeVariant)
    expect(publicApi.BadgeVariant.success).toBe("success")
  })
})
