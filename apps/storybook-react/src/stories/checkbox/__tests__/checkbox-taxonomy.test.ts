/**
 * React Checkbox story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React checkbox story taxonomy", () => {
  it("keeps atom story under Checkbox/Atom", () => {
    const atomStory = readStoryFile("checkbox.stories.tsx")

    expect(atomStory).toContain('title: "Checkbox/Atom"')
  })

  it("uses molecule title for CheckboxField story", () => {
    const fieldStory = readStoryFile("checkbox-field.stories.tsx")

    expect(fieldStory).toContain('title: "Checkbox/Molecule/CheckboxField"')
    expect(fieldStory).not.toContain('title: "Checkbox/Field"')
  })

  it("uses molecule title for CheckboxGroupField story", () => {
    const groupStory = readStoryFile("checkbox-group-field.stories.tsx")

    expect(groupStory).toContain('title: "Checkbox/Molecule/CheckboxGroupField"')
    expect(groupStory).not.toContain('title: "Checkbox/Field"')
  })
})
