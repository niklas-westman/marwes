import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue checkbox story taxonomy", () => {
  it("keeps atom story under Checkbox/Atom", () => {
    const atomStory = readStoryFile("checkbox.stories.ts")

    expect(atomStory).toContain('title: "Checkbox/Atom"')
  })

  it("uses molecule title for CheckboxField story", () => {
    const fieldStory = readStoryFile("checkbox-field.stories.ts")

    expect(fieldStory).toContain('title: "Checkbox/Molecule/CheckboxField"')
    expect(fieldStory).not.toContain('title: "Checkbox/Field"')
  })
})
