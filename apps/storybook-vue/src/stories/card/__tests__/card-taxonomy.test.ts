/**
 * Vue Card story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue card story taxonomy", () => {
  it("keeps atom story under Card/Atom", () => {
    expect(readStoryFile("card.stories.ts")).toContain('title: "Card/Atom"')
  })

  it("keeps purpose component stories under Card/Purpose", () => {
    expect(readStoryFile("product-card.stories.ts")).toContain('title: "Card/Purpose/ProductCard"')
    expect(readStoryFile("profile-card.stories.ts")).toContain('title: "Card/Purpose/ProfileCard"')
    expect(readStoryFile("stat-card.stories.ts")).toContain('title: "Card/Purpose/StatCard"')
  })
})
