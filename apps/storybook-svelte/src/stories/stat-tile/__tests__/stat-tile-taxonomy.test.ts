/**
 * Svelte Stat Tile story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and expected compositions.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Svelte stat tile story taxonomy", () => {
  it("keeps atom story under StatTile/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "stat-tile.stories.ts"), "utf8")

    expect(story).toContain('title: "StatTile/Atom"')
    expect(story).toContain("ToneMatrix")
  })
})
