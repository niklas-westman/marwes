import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React switch story taxonomy", () => {
  it("keeps atom story under Switch/Atom", () => {
    expect(readStoryFile("switch.stories.tsx")).toContain('title: "Switch/Atom"')
  })

  it("uses Molecule title for SwitchField story", () => {
    expect(readStoryFile("switch-field.stories.tsx")).toContain('title: "Switch/Molecule"')
  })

  it("keeps purpose component stories under Switch/Purpose", () => {
    expect(readStoryFile("feature-toggle.stories.tsx")).toContain(
      'title: "Switch/Purpose/FeatureToggle"',
    )
    expect(readStoryFile("preference-switch.stories.tsx")).toContain(
      'title: "Switch/Purpose/Preference"',
    )
    expect(readStoryFile("permission-switch.stories.tsx")).toContain(
      'title: "Switch/Purpose/Permission"',
    )
  })
})
