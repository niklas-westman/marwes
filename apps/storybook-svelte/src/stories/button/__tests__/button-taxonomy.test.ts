/**
 * Svelte Button story taxonomy guard.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Svelte button story taxonomy", () => {
  it("uses Atom title for Button story", () => {
    const buttonStory = readStoryFile("button.stories.ts")

    expect(buttonStory).toContain('title: "Buttons/Atom/Button"')
    expect(buttonStory).toContain("component: Button")
    expect(buttonStory).toMatch(/export const\s+Basic\s*:/)
  })

  it("keeps SuccessButton under the purpose taxonomy", () => {
    const story = readStoryFile("success-button.stories.ts")

    expect(story).toContain('title: "Buttons/Purpose/SuccessButton"')
    expect(story).toContain("component: SuccessButton")
  })

  it("keeps boolean and object loading stories visually aligned", () => {
    const buttonStory = readStoryFile("button.stories.ts")

    expect(buttonStory).toContain('children: "Saving…"')
    expect(buttonStory).toContain('loadingLabel: "Saving…"')
    expect(buttonStory).not.toContain("Saving...")
  })
})
