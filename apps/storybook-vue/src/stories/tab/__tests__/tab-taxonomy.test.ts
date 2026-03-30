import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue tab story taxonomy", () => {
  it("keeps atom story under Tab/Atom", () => {
    expect(readStoryFile("tab.stories.ts")).toContain('title: "Tab/Atom"')
  })

  it("uses Molecule title for TabGroup", () => {
    expect(readStoryFile("tab-group.stories.ts")).toContain('title: "Tab/Molecule"')
  })

  it("keeps purpose component stories under Tab/Purpose", () => {
    expect(readStoryFile("navigation-tabs.stories.ts")).toContain(
      'title: "Tab/Purpose/NavigationTabs"',
    )
    expect(readStoryFile("content-tabs.stories.ts")).toContain('title: "Tab/Purpose/ContentTabs"')
    expect(readStoryFile("settings-tabs.stories.ts")).toContain('title: "Tab/Purpose/SettingsTabs"')
  })
})
