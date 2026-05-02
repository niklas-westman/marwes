import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue card introduction docs", () => {
  it("documents the atom and purpose card components", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Card (Atom)")
    expect(introDoc).toContain("ProductCard")
    expect(introDoc).toContain("ProfileCard")
    expect(introDoc).toContain("StatCard")
    expect(introDoc).toContain("cardWhyPurposeComponents")
    expect(introDoc).toContain("cardPurposeComponentReference")
    expect(introDoc).toContain("Accessibility notes")
    expect(introDoc).toContain("passive")
    expect(introDoc).toContain("not a heading")
    expect(introDoc).toContain("Interactive card pattern")
  })
})
