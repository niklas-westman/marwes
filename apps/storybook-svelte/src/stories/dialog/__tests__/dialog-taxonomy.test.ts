/**
 * Svelte Dialog story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and keep generated autodocs disabled.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

const dialogStoryFiles = [
  "dialog.stories.ts",
  "dialog-modal.stories.ts",
  "confirm-dialog.stories.ts",
  "destructive-dialog.stories.ts",
  "info-dialog.stories.ts",
] as const

describe("Svelte dialog story taxonomy", () => {
  it("keeps atom and molecule stories in the correct tiers", () => {
    expect(readStoryFile("dialog.stories.ts")).toContain('title: "Dialog/Atom"')
    expect(readStoryFile("dialog-modal.stories.ts")).toContain('title: "Dialog/Molecule"')
  })

  it("keeps purpose stories under Dialog/Purpose", () => {
    expect(readStoryFile("confirm-dialog.stories.ts")).toContain(
      'title: "Dialog/Purpose/ConfirmDialog"',
    )
    expect(readStoryFile("destructive-dialog.stories.ts")).toContain(
      'title: "Dialog/Purpose/DestructiveDialog"',
    )
    expect(readStoryFile("info-dialog.stories.ts")).toContain('title: "Dialog/Purpose/InfoDialog"')
  })

  it("keeps generated autodocs disabled for all dialog stories", () => {
    for (const fileName of dialogStoryFiles) {
      expect(readStoryFile(fileName)).not.toContain("autodocs")
    }
  })
})
