import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue segmented-control introduction docs", () => {
  it("documents the Segmented Control introduction page", () => {
    const docs = readFileSync(path.join(storiesDir, "Introduction.mdx"), "utf8")

    expect(docs).toContain('title="Segmented Control/Introduction"')
    expect(docs).toContain("SegmentedControl")
  })
})
