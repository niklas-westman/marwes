/**
 * Vue Skeleton story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue skeleton story taxonomy", () => {
  it("keeps atom story under Skeleton/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "skeleton.stories.ts"), "utf8")

    expect(story).toContain('title: "Skeleton/Atom"')
  })

  it("keeps replica stories under Skeleton/Molecule", () => {
    const story = readFileSync(path.join(storiesDir, "skeleton-molecules.stories.ts"), "utf8")

    expect(story).toContain('title: "Skeleton/Molecule"')
    expect(story).toContain("CardReplica")
    expect(story).toContain("StatTileReplica")
    expect(story).toContain("InputFieldReplica")
  })
})
