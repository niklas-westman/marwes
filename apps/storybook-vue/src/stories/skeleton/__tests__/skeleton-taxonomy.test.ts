import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue skeleton story taxonomy", () => {
  it("keeps atom story under Skeleton/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "skeleton.stories.ts"), "utf8")

    expect(story).toContain('title: "Skeleton/Atom"')
  })
})
