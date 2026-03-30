import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React divider story taxonomy", () => {
  it("keeps atom story under Divider/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "divider.stories.tsx"), "utf8")

    expect(story).toContain('title: "Divider/Atom"')
  })
})
