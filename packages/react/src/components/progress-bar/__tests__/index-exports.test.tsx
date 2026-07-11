import { describe, expect, it } from "vitest"
import { ProgressBar } from ".."

describe("react progress-bar exports", () => {
  it("exports ProgressBar", () => {
    expect(ProgressBar).toBeTypeOf("function")
  })
})
