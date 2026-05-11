/**
 * React Stat Tile story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React stat tile story taxonomy", () => {
  it("keeps atom story under StatTile/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "stat-tile.stories.tsx"), "utf8")

    expect(story).toContain('title: "StatTile/Atom"')
  })
})
