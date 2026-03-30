import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React button story taxonomy", () => {
  it("uses Atom title for Button story", () => {
    const buttonStory = readStoryFile("button.stories.tsx")

    expect(buttonStory).toContain('title: "Buttons/Atom/Button"')
    expect(buttonStory).toContain("component: Button")
    expect(buttonStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("uses Variant titles for visual wrapper buttons", () => {
    const primary = readStoryFile("primary-button.stories.tsx")
    const secondary = readStoryFile("secondary-button.stories.tsx")
    const text = readStoryFile("text-button.stories.tsx")

    expect(primary).toContain('title: "Buttons/Variant/PrimaryButton"')
    expect(secondary).toContain('title: "Buttons/Variant/SecondaryButton"')
    expect(text).toContain('title: "Buttons/Variant/TextButton"')
  })

  it("keeps semantic wrappers under Buttons/Purpose", () => {
    const purposeStories = [
      "cancel-button.stories.tsx",
      "close-button.stories.tsx",
      "confirm-button.stories.tsx",
      "create-button.stories.tsx",
      "danger-button.stories.tsx",
      "download-button.stories.tsx",
      "dropdown-button.stories.tsx",
      "edit-button.stories.tsx",
      "filter-button.stories.tsx",
      "link-button.stories.tsx",
      "copy-button.stories.tsx",
      "refresh-button.stories.tsx",
      "save-button.stories.tsx",
      "search-button.stories.tsx",
      "sort-button.stories.tsx",
      "submit-button.stories.tsx",
      "upload-button.stories.tsx",
      "verify-button.stories.tsx",
    ]

    for (const storyName of purposeStories) {
      const content = readStoryFile(storyName)
      expect(content).toMatch(/title:\s*"Buttons\/Purpose\/[A-Za-z]+"/)
    }
  })

  it("does not use deprecated Buttons/General grouping", () => {
    const files = [
      "button.stories.tsx",
      "primary-button.stories.tsx",
      "secondary-button.stories.tsx",
      "text-button.stories.tsx",
      "cancel-button.stories.tsx",
      "close-button.stories.tsx",
      "confirm-button.stories.tsx",
      "create-button.stories.tsx",
      "danger-button.stories.tsx",
      "download-button.stories.tsx",
      "dropdown-button.stories.tsx",
      "edit-button.stories.tsx",
      "filter-button.stories.tsx",
      "link-button.stories.tsx",
      "copy-button.stories.tsx",
      "refresh-button.stories.tsx",
      "save-button.stories.tsx",
      "search-button.stories.tsx",
      "sort-button.stories.tsx",
      "submit-button.stories.tsx",
      "upload-button.stories.tsx",
      "verify-button.stories.tsx",
    ]

    for (const storyName of files) {
      expect(readStoryFile(storyName)).not.toContain('title: "Buttons/General/')
    }
  })
})
