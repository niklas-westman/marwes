import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue progress-bar introduction docs", () => {
  it("documents progress semantics and slider distinction", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    for (const expected of [
      "ProgressBar",
      "determinate progress indicator",
      "not an input",
      "SliderField",
      'role="progressbar"',
      "aria-valuenow",
      "ariaLabel",
    ]) {
      expect(introDoc).toContain(expected)
    }
  })
})
