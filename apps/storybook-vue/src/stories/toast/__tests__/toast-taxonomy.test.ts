import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Vue toast story taxonomy", () => {
  it("keeps atom story under Toast/Atom", () => {
    const story = readStoryFile("toast.stories.ts")

    expect(story).toContain('title: "Toast/Atom"')
    expect(story).toContain("mw-toast__action-button")
    expect(story).toContain("background: #000000")
  })

  it("uses Molecule title for ToastContainer", () => {
    expect(readStoryFile("toast-container.stories.ts")).toContain('title: "Toast/Molecule"')
  })

  it("keeps purpose stories under Toast/Purpose", () => {
    expect(readStoryFile("success-toast.stories.ts")).toContain(
      'title: "Toast/Purpose/SuccessToast"',
    )
    expect(readStoryFile("error-toast.stories.ts")).toContain('title: "Toast/Purpose/ErrorToast"')
    expect(readStoryFile("warning-toast.stories.ts")).toContain(
      'title: "Toast/Purpose/WarningToast"',
    )
    expect(readStoryFile("info-toast.stories.ts")).toContain('title: "Toast/Purpose/InfoToast"')
    expect(readStoryFile("toast-matrix.stories.ts")).toContain('title: "Toast/Purpose/Matrix"')
  })
})
