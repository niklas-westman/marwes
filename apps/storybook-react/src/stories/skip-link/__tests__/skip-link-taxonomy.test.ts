import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React skip-link story taxonomy", () => {
  it("keeps atom story under SkipLink/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "skip-link.stories.tsx"), "utf8")

    expect(story).toContain('title: "SkipLink/Atom"')
    expect(story).toContain("component: SkipLink")
    expect(story).toMatch(/export const\s+Default\s*:/)
  })
})
