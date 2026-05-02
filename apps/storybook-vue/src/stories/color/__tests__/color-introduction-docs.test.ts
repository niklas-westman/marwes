import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue color introduction docs", () => {
  it("documents the color system and story coverage", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Color System")
    expect(introDoc).toContain("Token Architecture")
    expect(introDoc).toContain("Recommended Usage")
    expect(introDoc).toContain("Story Coverage")
    expect(introDoc).toContain("AllColors")
    expect(introDoc).toContain("PrimaryOnly")
    expect(introDoc).toContain("SemanticOnly")
  })
})
