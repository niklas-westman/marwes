import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue button story taxonomy", () => {
  it("uses Atom title for Button story", () => {
    const buttonStory = readStoryFile("button.stories.ts")

    expect(buttonStory).toContain('title: "Buttons/Atom/Button"')
    expect(buttonStory).toContain("component: Button")
    expect(buttonStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Variant titles for visual wrapper buttons", () => {
    const primary = readStoryFile("primary-button.stories.ts")
    const secondary = readStoryFile("secondary-button.stories.ts")
    const text = readStoryFile("text-button.stories.ts")

    expect(primary).toContain('title: "Buttons/Variant/PrimaryButton"')
    expect(secondary).toContain('title: "Buttons/Variant/SecondaryButton"')
    expect(text).toContain('title: "Buttons/Variant/TextButton"')
  })

  it("keeps semantic wrappers under Buttons/Purpose", () => {
    const purposeStories = [
      "cancel-button.stories.ts",
      "close-button.stories.ts",
      "confirm-button.stories.ts",
      "create-button.stories.ts",
      "danger-button.stories.ts",
      "edit-button.stories.ts",
      "link-button.stories.ts",
      "refresh-button.stories.ts",
      "save-button.stories.ts",
      "submit-button.stories.ts",
      "verify-button.stories.ts",
    ]

    for (const storyName of purposeStories) {
      const content = readStoryFile(storyName)
      expect(content).toMatch(/title:\s*"Buttons\/Purpose\/[A-Za-z]+"/)
    }
  })

  it("does not use deprecated Buttons/General grouping", () => {
    const files = [
      "button.stories.ts",
      "primary-button.stories.ts",
      "secondary-button.stories.ts",
      "text-button.stories.ts",
      "cancel-button.stories.ts",
      "close-button.stories.ts",
      "confirm-button.stories.ts",
      "create-button.stories.ts",
      "danger-button.stories.ts",
      "edit-button.stories.ts",
      "link-button.stories.ts",
      "refresh-button.stories.ts",
      "save-button.stories.ts",
      "submit-button.stories.ts",
      "verify-button.stories.ts",
    ]

    for (const storyName of files) {
      expect(readStoryFile(storyName)).not.toContain('title: "Buttons/General/')
    }
  })
})
