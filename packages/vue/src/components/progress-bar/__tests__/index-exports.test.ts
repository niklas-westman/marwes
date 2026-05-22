import { describe, expect, it } from "vitest"
import { ProgressBar } from ".."

describe("vue progress-bar exports", () => {
  it("exports ProgressBar", () => {
    expect(ProgressBar).toBeTypeOf("object")
  })
})
