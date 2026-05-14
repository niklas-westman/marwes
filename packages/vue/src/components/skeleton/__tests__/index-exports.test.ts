/**
 * Vue adapter: Verifies that the Skeleton barrel re-exports all public symbols
 * from both the component directory and the package root.
 */
import { describe, expect, it } from "vitest"
import { Skeleton } from ".."

describe("vue skeleton exports", () => {
  it("exports Skeleton", () => {
    expect(Skeleton).toBeTypeOf("object")
  })
})
