import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const docs = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

describe("Vue breadcrumb introduction docs", () => {
  it("documents usage and accessibility", () => {
    expect(docs).toContain("Marwes provides `Breadcrumb`")
    expect(docs).toContain("aria-current")
    expect(docs).toContain("ordered list")
  })
})
