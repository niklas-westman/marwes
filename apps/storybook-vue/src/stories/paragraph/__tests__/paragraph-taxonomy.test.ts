import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue paragraph story taxonomy", () => {
  it("keeps atom story under Paragraph/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "paragraph.stories.ts"), "utf8")

    expect(story).toContain('title: "Paragraph/Atom"')
  })
})
