/**
 * React Tab story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("React tab story taxonomy", () => {
  it("keeps atom story under Tab/Atom", () => {
    expect(readStoryFile("tab.stories.tsx")).toContain('title: "Tab/Atom"')
  })

  it("uses Molecule title for TabGroup", () => {
    expect(readStoryFile("tab-group.stories.tsx")).toContain('title: "Tab/Molecule"')
  })

  it("keeps purpose component stories under Tab/Purpose", () => {
    expect(readStoryFile("navigation-tabs.stories.tsx")).toContain(
      'title: "Tab/Purpose/NavigationTabs"',
    )
    expect(readStoryFile("content-tabs.stories.tsx")).toContain('title: "Tab/Purpose/ContentTabs"')
    expect(readStoryFile("settings-tabs.stories.tsx")).toContain(
      'title: "Tab/Purpose/SettingsTabs"',
    )
  })
})
