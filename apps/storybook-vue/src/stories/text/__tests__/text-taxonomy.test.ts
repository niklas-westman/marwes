import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue text story taxonomy", () => {
  it("keeps atom story under Text/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "text.stories.ts"), "utf8")

    expect(story).toContain('title: "Text/Atom"')
  })
})
