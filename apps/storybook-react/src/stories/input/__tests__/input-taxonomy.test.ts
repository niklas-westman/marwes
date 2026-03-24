import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React input story taxonomy", () => {
  it("uses Atom title for Input story", () => {
    const inputStory = readStoryFile("input.stories.tsx")

    expect(inputStory).toContain('title: "Input/Atom/Input"')
    expect(inputStory).toContain("component: Input")
    expect(inputStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Molecule title for InputField story", () => {
    const inputFieldStory = readStoryFile("input-field.stories.tsx")

    expect(inputFieldStory).toContain('title: "Input/Molecule/InputField"')
  })

  it("keeps purpose stories under Input/Purpose", () => {
    const purposeStories = [
      "search-field.stories.tsx",
      "password-field.stories.tsx",
      "email-field.stories.tsx",
      "phone-field.stories.tsx",
      "url-field.stories.tsx",
      "currency-field.stories.tsx",
    ]

    for (const storyName of purposeStories) {
      const content = readStoryFile(storyName)

      expect(content).toMatch(/title:\s*"Input\/Purpose\/[A-Za-z]+"/)
      expect(content).not.toContain('title: "Input/General/')
    }
  })
})
