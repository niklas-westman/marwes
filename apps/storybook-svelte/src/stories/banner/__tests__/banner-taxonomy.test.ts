import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Svelte banner story taxonomy", () => {
  it("keeps component story under Banner/Atom", () => {
    expect(readStoryFile("banner.stories.ts")).toContain('title: "Banner/Atom"')
  })

  it("has an Introduction.mdx with correct title", () => {
    expect(readStoryFile("Introduction.mdx")).toContain('title="Banner/Introduction"')
  })
})
