import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React radio story taxonomy", () => {
  it("keeps atom story under Radio/Atom", () => {
    const atomStory = readStoryFile("radio.stories.tsx")

    expect(atomStory).toContain('title: "Radio/Atom"')
  })

  it("uses Molecule title for RadioGroupField story", () => {
    const moleculeStory = readStoryFile("radio-group-field.stories.tsx")

    expect(moleculeStory).toContain('title: "Radio/Molecule"')
  })

  it("keeps purpose component stories under Radio/Purpose", () => {
    expect(readStoryFile("yes-no-radio-group.stories.tsx")).toContain(
      'title: "Radio/Purpose/YesNo"',
    )
    expect(readStoryFile("rating-radio-group.stories.tsx")).toContain(
      'title: "Radio/Purpose/Rating"',
    )
    expect(readStoryFile("option-radio-group.stories.tsx")).toContain(
      'title: "Radio/Purpose/Option"',
    )
  })
})
