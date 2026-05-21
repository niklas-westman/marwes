import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React banner introduction docs", () => {
  it("documents the Banner introduction page", () => {
    const docs = readFileSync(path.join(storiesDir, "Introduction.mdx"), "utf8")

    expect(docs).toContain('title="Banner/Introduction"')
    expect(docs).toContain("dismissible")
  })
})
