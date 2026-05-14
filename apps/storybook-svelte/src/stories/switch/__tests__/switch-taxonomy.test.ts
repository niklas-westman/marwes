/**
 * Svelte Switch story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and expected compositions.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Svelte switch story taxonomy", () => {
  it("keeps atom, molecule, and purpose titles", () => {
    expect(readStoryFile("switch.stories.ts")).toContain('title: "Switch/Atom"')
    expect(readStoryFile("switch-field.stories.ts")).toContain('title: "Switch/Molecule"')
    expect(readStoryFile("feature-toggle.stories.ts")).toContain(
      'title: "Switch/Purpose/FeatureToggle"',
    )
    expect(readStoryFile("preference-switch.stories.ts")).toContain(
      'title: "Switch/Purpose/Preference"',
    )
    expect(readStoryFile("permission-switch.stories.ts")).toContain(
      'title: "Switch/Purpose/Permission"',
    )
  })

  it("keeps multi-state atom stories wired to the Svelte showcase", () => {
    const atomStory = readStoryFile("switch.stories.ts")

    expect(atomStory).toContain("SwitchShowcase")
    expect(atomStory).toContain('showcase: "states"')
    expect(atomStory).toContain('showcase: "sizes"')
  })
})
