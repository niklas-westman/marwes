import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React icon story taxonomy", () => {
  it("keeps atom story under Icon/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "icon.stories.tsx"), "utf8")

    expect(story).toContain('title: "Icon/Atom"')
  })
})
