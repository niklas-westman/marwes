/**
 * CSS contract: verifies the firstEdition date-picker stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const css = readFileSync(resolve(__dirname, "../src/firstEdition/date-picker.css"), "utf8")

describe("firstEdition date picker CSS contract", () => {
  it("styles stable date picker classes and day state hooks", () => {
    expect(css).toContain(".mw-date-picker")
    expect(css).toContain(".mw-date-picker__day--selected")
    expect(css).toContain(".mw-date-picker__day--range")
    expect(css).toContain(".mw-date-picker__day--disabled")
    expect(css).toContain(".mw-date-picker__day--null")
  })

  it("keeps the compact v2 reference calendar geometry", () => {
    expect(css).toContain("inline-size: 18.375rem")
    expect(css).toContain("grid-template-columns: repeat(7, 2.125rem)")
    expect(css).toContain("min-block-size: 2.5rem")
  })
})
