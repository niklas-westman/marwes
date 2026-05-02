import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React heading story taxonomy", () => {
  it("keeps atom story under Heading/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "heading.stories.tsx"), "utf8")

    expect(story).toContain('title: "Heading/Atom"')
  })
})
