/**
 * Svelte Radio story taxonomy/parity guard — verifies that atom stories expose
 * the same rendered group/state showcases as the React baseline.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")
const reactStoriesDir = path.resolve(__dirname, "../../../../../storybook-react/src/stories/radio")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

function readReactStoryFile(fileName: string): string {
  return readFileSync(path.join(reactStoriesDir, fileName), "utf8")
}

describe("Svelte radio story taxonomy", () => {
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

  it("keeps atom rendered-showcase stories aligned with React", () => {
    const reactAtomStory = readReactStoryFile("radio.stories.tsx")
    const svelteAtomStory = readStoryFile("radio.stories.ts")
    const svelteShowcase = readStoryFile("RadioShowcase.svelte")

    expect(reactAtomStory).toContain("export const RadioGroup")
    expect(reactAtomStory).toContain("export const AllStates")
    expect(svelteAtomStory).toContain("export const RadioGroup")
    expect(svelteAtomStory).toContain("export const AllStates")
    expect(svelteAtomStory).toContain("RadioShowcase")
    expect(svelteShowcase).toContain('showcase: "all-states" | "radio-group"')
    expect(svelteShowcase.match(/value: "[abc]"/g)).toHaveLength(3)
  })
})
