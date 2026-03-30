import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue input story taxonomy", () => {
  it("uses Atom title for Input story", () => {
    const inputStory = readStoryFile("input.stories.ts")

    expect(inputStory).toContain('title: "Input/Atom/Input"')
    expect(inputStory).toContain("component: Input")
    expect(inputStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Atom title for Textarea story", () => {
    const textareaStory = readStoryFile("textarea.stories.ts")

    expect(textareaStory).toContain('title: "Input/Atom/Textarea"')
    expect(textareaStory).toContain("component: Textarea")
    expect(textareaStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Atom title for Select story", () => {
    const selectStory = readStoryFile("select.stories.ts")

    expect(selectStory).toContain('title: "Input/Atom/Select"')
    expect(selectStory).toContain("component: Select")
    expect(selectStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Molecule title for InputField story", () => {
    const inputFieldStory = readStoryFile("input-field.stories.ts")

    expect(inputFieldStory).toContain('title: "Input/Molecule/InputField"')
  })

  it("uses Molecule title for TextareaField story", () => {
    const textareaFieldStory = readStoryFile("textarea-field.stories.ts")

    expect(textareaFieldStory).toContain('title: "Input/Molecule/TextareaField"')
  })

  it("uses Molecule title for SelectField story", () => {
    const selectFieldStory = readStoryFile("select-field.stories.ts")

    expect(selectFieldStory).toContain('title: "Input/Molecule/SelectField"')
  })

  it("keeps purpose stories under Input/Purpose", () => {
    const purposeStories = [
      "dropdown-field.stories.ts",
      "search-field.stories.ts",
      "password-field.stories.ts",
      "email-field.stories.ts",
      "date-of-birth-field.stories.ts",
      "zip-code-field.stories.ts",
      "phone-field.stories.ts",
      "url-field.stories.ts",
      "currency-field.stories.ts",
    ]

    for (const storyName of purposeStories) {
      const content = readStoryFile(storyName)

      expect(content).toMatch(/title:\s*"Input\/Purpose\/[A-Za-z]+"/)
      expect(content).not.toContain('title: "Input/General/')
    }
  })
})
