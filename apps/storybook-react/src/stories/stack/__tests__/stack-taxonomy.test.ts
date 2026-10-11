/**
 * React Stack story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React stack story taxonomy", () => {
  it("keeps the Stack story under Stack/Atom with the full layout story set", () => {
    const story = readStoryFile("stack.stories.tsx")

    expect(story).toContain('title: "Stack/Atom"')
    for (const exportName of [
      "Default",
      "Directions",
      "Gap",
      "Padding",
      "Alignment",
      "Justify",
      "Wrap",
      "ChildSizing",
      "Nested",
    ]) {
      expect(story).toMatch(new RegExp(`export const\\s+${exportName}\\s*:`))
    }
  })

  it("keeps the StackItem story under Stack/Item", () => {
    const story = readStoryFile("stack-item.stories.tsx")

    expect(story).toContain('title: "Stack/Item"')
    expect(story).toMatch(/export const\s+Default\s*:/)
    expect(story).toMatch(/export const\s+ListItems\s*:/)
  })
})
