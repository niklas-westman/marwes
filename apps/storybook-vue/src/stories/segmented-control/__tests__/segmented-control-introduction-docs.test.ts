import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const introPath = path.resolve(__dirname, "..", "Introduction.mdx")

describe("Vue segmented control introduction docs", () => {
  it("documents usage, Figma references, and accessibility expectations", () => {
    const content = readFileSync(introPath, "utf8")

    expect(content).toContain(".figma/marwes/components/segmented-control.json")
    expect(content).toContain("docs/guides/adding-components.md")
    expect(content).toContain('role="radio"')
    expect(content).toContain("Arrow keys")
  })
})
