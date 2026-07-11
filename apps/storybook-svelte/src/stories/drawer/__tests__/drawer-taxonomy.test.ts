/**
 * Svelte Drawer story taxonomy guard — verifies Storybook title hierarchy.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Svelte drawer story taxonomy", () => {
  it("keeps the component story under Drawer/Atom", () => {
    expect(readStoryFile("drawer.stories.ts")).toContain('title: "Drawer/Atom"')
  })

  it("has an Introduction.mdx with the correct title", () => {
    expect(readStoryFile("Introduction.mdx")).toContain('title="Drawer/Introduction"')
  })
})
