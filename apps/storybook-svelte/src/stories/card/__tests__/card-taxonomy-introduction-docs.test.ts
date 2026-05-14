import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Svelte card story taxonomy and introduction docs", () => {
  it("keeps stories titled and documents the family", () => {
    const introDoc = readFileSync(path.join(storiesDir, "Introduction.mdx"), "utf8")
    const storyFiles = readdirSync(storiesDir).filter((file) => file.endsWith(".stories.ts"))

    expect(introDoc).toMatch(/card/i)
    expect(storyFiles).toContain("card.stories.ts")

    for (const storyFile of storyFiles) {
      expect(readFileSync(path.join(storiesDir, storyFile), "utf8")).toContain("title:")
    }
  })
})
