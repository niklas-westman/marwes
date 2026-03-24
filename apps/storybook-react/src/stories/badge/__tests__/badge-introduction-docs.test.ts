import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React badge introduction docs", () => {
  it("documents atom, molecule, and context variants", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Badge (Atom)")
    expect(introDoc).toContain("BadgeGroup (Molecule)")

    const variants = ["StatusBadge", "PriorityBadge", "NotificationBadge"]

    for (const variantName of variants) {
      expect(introDoc).toContain(variantName)
    }
  })
})
