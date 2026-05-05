import { describe, expect, it } from "vitest"
import { Skeleton } from ".."

describe("react skeleton exports", () => {
  it("exports Skeleton", () => {
    expect(Skeleton).toBeTypeOf("function")
  })
})
