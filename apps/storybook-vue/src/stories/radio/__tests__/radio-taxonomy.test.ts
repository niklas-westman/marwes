import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue radio story taxonomy", () => {
  it("keeps atom, molecule, and purpose titles", () => {
    expect(readStoryFile("radio.stories.ts")).toContain('title: "Radio/Atom"')
    expect(readStoryFile("radio-group-field.stories.ts")).toContain('title: "Radio/Molecule"')
    expect(readStoryFile("yes-no-radio-group.stories.ts")).toContain('title: "Radio/Purpose/YesNo"')
    expect(readStoryFile("rating-radio-group.stories.ts")).toContain(
      'title: "Radio/Purpose/Rating"',
    )
    expect(readStoryFile("option-radio-group.stories.ts")).toContain(
      'title: "Radio/Purpose/Option"',
    )
  })
})
