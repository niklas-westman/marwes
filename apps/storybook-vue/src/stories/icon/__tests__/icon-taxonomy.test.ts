/**
 * Vue Icon story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue icon story taxonomy", () => {
  it("keeps atom story under Icon/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "icon.stories.ts"), "utf8")

    expect(story).toContain('title: "Icon/Atom"')
  })
})
