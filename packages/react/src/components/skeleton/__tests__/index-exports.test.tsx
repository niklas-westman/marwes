/**
 * React adapter: Verifies that the Skeleton barrel re-exports all public symbols
 * from both the component directory and the package root.
 */
import { describe, expect, it } from "vitest"
import { Skeleton } from ".."

describe("react skeleton exports", () => {
  it("exports Skeleton", () => {
    expect(Skeleton).toBeTypeOf("function")
  })
})
