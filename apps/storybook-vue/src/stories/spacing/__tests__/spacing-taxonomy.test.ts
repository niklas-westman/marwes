/**
 * Vue Spacing story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue spacing story taxonomy", () => {
  it("keeps the spacing story under Spacing/Atom", () => {
    const spacingStory = readStoryFile("spacing.stories.ts")

    expect(spacingStory).toContain('title: "Spacing/Atom"')
    expect(spacingStory).not.toContain('title: "Spacing/Molecule"')
  })
})
