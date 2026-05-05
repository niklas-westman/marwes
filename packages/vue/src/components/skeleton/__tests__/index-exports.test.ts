import { describe, expect, it } from "vitest"
import { Skeleton } from ".."

describe("vue skeleton exports", () => {
  it("exports Skeleton", () => {
    expect(Skeleton).toBeTypeOf("object")
  })
})
