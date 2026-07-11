import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Svelte progress-bar story taxonomy and introduction docs", () => {
  it("keeps stories titled and documents the family", () => {
    const introDoc = readFileSync(path.join(storiesDir, "Introduction.mdx"), "utf8")
    const story = readFileSync(path.join(storiesDir, "progress-bar.stories.ts"), "utf8")

    expect(story).toContain('title: "ProgressBar/Atom"')
    expect(story).toContain("StateGallery")
    expect(introDoc).toContain("ProgressBar")
    expect(introDoc).toContain('role="progressbar"')
    expect(introDoc).toContain("SliderField")
  })
})
