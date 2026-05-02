import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue badge introduction docs", () => {
  it("documents all badge layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const componentNames = [
      "Badge",
      "BadgeGroup",
      "StatusBadge",
      "PriorityBadge",
      "NotificationBadge",
    ]

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }

    expect(introDoc).toContain("Accessibility notes")
    expect(introDoc).toContain("Numeric-only badges always need")
    expect(introDoc).toContain("ariaLabel")
    expect(introDoc).toContain("label quality matters")
    expect(introDoc).toContain("passive span")
  })
})
