/**
 * React Segmented Control story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React segmented-control story taxonomy", () => {
  it("keeps component story under SegmentedControl/Atom", () => {
    expect(readStoryFile("segmented-control.stories.tsx")).toContain(
      'title: "SegmentedControl/Atom"',
    )
  })

  it("has an Introduction.mdx with correct title", () => {
    expect(readStoryFile("Introduction.mdx")).toContain('title="SegmentedControl/Introduction"')
  })
})
