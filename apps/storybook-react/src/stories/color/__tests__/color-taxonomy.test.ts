/**
 * React Color story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React color story taxonomy", () => {
  it("keeps color stories under the design system colors taxonomy", () => {
    const colorStory = readStoryFile("color.stories.tsx")

    expect(colorStory).toContain('title: "Design System/Colors"')
    expect(colorStory).toContain("export const AllColors")
    expect(colorStory).toContain("export const PrimaryOnly")
    expect(colorStory).toContain("export const SemanticOnly")
  })
})
