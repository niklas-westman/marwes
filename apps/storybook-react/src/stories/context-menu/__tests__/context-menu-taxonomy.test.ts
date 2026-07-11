import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React context menu story taxonomy", () => {
  it("keeps the component story under ContextMenu/Atom", () => {
    expect(readStoryFile("context-menu.stories.tsx")).toContain('title: "ContextMenu/Atom"')
  })

  it("has an Introduction.mdx with the correct title", () => {
    expect(readStoryFile("Introduction.mdx")).toContain('title="ContextMenu/Introduction"')
  })
})
