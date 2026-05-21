import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue pagination introduction docs", () => {
  it("documents the Pagination introduction page", () => {
    const docs = readFileSync(path.join(storiesDir, "Introduction.mdx"), "utf8")

    expect(docs).toContain('title="Pagination/Introduction"')
    expect(docs).toContain("modelValue")
  })
})
