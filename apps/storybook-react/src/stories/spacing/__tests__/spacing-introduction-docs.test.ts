import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React spacing introduction docs", () => {
  it("documents the spacing atom and token-based usage", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Spacing (Atom)")
    expect(introDoc).toContain("Spacings")
    expect(introDoc).toContain("Token Scale")
    expect(introDoc).toContain("Story Coverage")
  })
})
