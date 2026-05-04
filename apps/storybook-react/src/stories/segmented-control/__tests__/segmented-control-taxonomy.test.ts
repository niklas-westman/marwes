import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React segmented control story taxonomy", () => {
  it("keeps introduction and atom stories under Segmented Control", () => {
    expect(readStoryFile("Introduction.mdx")).toContain(
      '<Meta title="SegmentedControl/Introduction" />',
    )
    expect(readStoryFile("segmented-control.stories.tsx")).toContain(
      'title: "SegmentedControl/Atom"',
    )
  })
})
