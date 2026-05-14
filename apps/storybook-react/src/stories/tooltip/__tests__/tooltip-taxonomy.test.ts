/**
 * React Tooltip story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React tooltip story taxonomy", () => {
  it("keeps atom and molecule stories in the correct tiers", () => {
    expect(readStoryFile("tooltip.stories.tsx")).toContain('title: "Tooltip/Atom"')
    expect(readStoryFile("tooltip-group.stories.tsx")).toContain(
      'title: "Tooltip/Molecule/TooltipGroup"',
    )
  })
})
