import { describe, expect, it } from "vitest"
import { requireValue } from "./require-value.js"

describe("required proof values", () => {
  it.each([undefined, null])("rejects absent %s with the supplied context", (value) => {
    expect(() => requireValue(value, "Missing selected source node")).toThrow(
      "Missing selected source node",
    )
  })
  it("preserves present falsy values and object identity", () => {
    const source = { id: "source" }
    expect(requireValue(0)).toBe(0)
    expect(requireValue(false)).toBe(false)
    expect(requireValue("")).toBe("")
    expect(requireValue(source)).toBe(source)
  })
})
