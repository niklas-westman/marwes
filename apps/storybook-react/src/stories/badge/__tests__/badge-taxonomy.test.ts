import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React badge story taxonomy", () => {
  it("keeps atom story under Badge/Atom", () => {
    const atomStory = readStoryFile("badge.stories.tsx")

    expect(atomStory).toContain('title: "Badge/Atom"')
  })

  it("uses Molecule title for BadgeGroup story", () => {
    const moleculeStory = readStoryFile("badge-group.stories.tsx")

    expect(moleculeStory).toContain('title: "Badge/Molecule"')
  })

  it("keeps purpose component stories under Badge/Purpose", () => {
    expect(readStoryFile("status-badge.stories.tsx")).toContain('title: "Badge/Purpose/Status"')
    expect(readStoryFile("priority-badge.stories.tsx")).toContain('title: "Badge/Purpose/Priority"')
    expect(readStoryFile("notification-badge.stories.tsx")).toContain(
      'title: "Badge/Purpose/Notification"',
    )
  })
})
