import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Svelte text story taxonomy and introduction docs", () => {
  it("keeps atom story under Text/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "text.stories.ts"), "utf8")

    expect(story).toContain('title: "Text/Atom"')
  })

  it("documents variants and semantic usage guidance", () => {
    const introDoc = readFileSync(path.join(storiesDir, "Introduction.mdx"), "utf8")

    for (const value of [
      "Text",
      "label",
      "label-small",
      "caption",
      "overline",
      "micro",
      "Accessibility Notes",
      "Choose semantics separately from visual style",
      "Component Reference",
    ]) {
      expect(introDoc).toContain(value)
    }
  })
})
