import { describe, expect, it } from "vitest"
import { parseStaticValue, parseTokenValue } from "../../../../scripts/react-native-token-extractor"

describe("React Native token extractor", () => {
  it("resolves theme variable references to native theme paths", () => {
    expect(parseTokenValue("var(--mw-color-primary-base)")).toEqual({
      kind: "theme",
      path: "color.primary.base",
    })
  })

  it("resolves theme variable references with static fallback values", () => {
    expect(parseTokenValue("var(--mw-color-primary-base, 12px)")).toEqual({
      kind: "theme",
      path: "color.primary.base",
      fallback: 12,
    })
  })

  it("converts px values to numbers", () => {
    expect(parseStaticValue("12.5px")).toBe(12.5)
  })

  it("converts ms values to numbers", () => {
    expect(parseStaticValue("850ms")).toBe(850)
  })

  it("passes plain numbers through as numbers", () => {
    expect(parseStaticValue("1.25")).toBe(1.25)
  })

  it("fails loudly for unsupported theme variables", () => {
    expect(() => parseTokenValue("var(--mw-color-unknown)")).toThrow(
      "No native theme mapping for --mw-color-unknown",
    )
  })
})
