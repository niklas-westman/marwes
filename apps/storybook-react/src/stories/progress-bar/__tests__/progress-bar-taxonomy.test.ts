import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React progress-bar story taxonomy", () => {
  it("keeps atom stories under ProgressBar/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "progress-bar.stories.tsx"), "utf8")

    expect(story).toContain('title: "ProgressBar/Atom"')
    expect(story).toContain("StateGallery")
  })
})
