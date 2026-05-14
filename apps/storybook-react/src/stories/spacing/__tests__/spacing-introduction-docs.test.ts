/**
 * React Spacing introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React spacing introduction docs", () => {
  it("documents the spacing atom and token-based usage", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Spacing / Spacer (Atom)")
    expect(introDoc).toContain("Spacings")
    expect(introDoc).toContain("Token Scale")
    expect(introDoc).toContain("Accessibility notes")
    expect(introDoc).toContain("Spacing is decorative only")
    expect(introDoc).toContain("Prefer parent-owned layout")
    expect(introDoc).toContain("`scale` is an escape hatch")
    expect(introDoc).toContain("Large gaps should not imply hidden semantics")
    expect(introDoc).toContain("Story Coverage")
  })
})
