import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React accordion story taxonomy", () => {
  it("keeps atom story under Accordion/Atom", () => {
    const atomStory = readStoryFile("accordion.stories.tsx")

    expect(atomStory).toContain('title: "Accordion/Atom"')
  })

  it("uses Molecule title for AccordionField story", () => {
    const moleculeStory = readStoryFile("accordion-field.stories.tsx")

    expect(moleculeStory).toContain('title: "Accordion/Molecule"')
  })

  it("keeps context variant stories under Accordion/Context", () => {
    expect(readStoryFile("faq-accordion.stories.tsx")).toContain('title: "Accordion/Context/FAQ"')
    expect(readStoryFile("settings-accordion.stories.tsx")).toContain(
      'title: "Accordion/Context/Settings"',
    )
    expect(readStoryFile("sections-accordion.stories.tsx")).toContain(
      'title: "Accordion/Context/Sections"',
    )
  })
})
