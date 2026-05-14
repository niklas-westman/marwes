/**
 * Svelte Toast story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and expected matrix coverage.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

function readStoryFile(fileName: string): string {
  return readFileSync(path.join(storiesDir, fileName), "utf8")
}

describe("Svelte toast story taxonomy", () => {
  it("keeps atom story under Toast/Atom", () => {
    const story = readStoryFile("toast.stories.ts")

    expect(story).toContain('title: "Toast/Atom"')
    expect(story).toContain("AllVariants")
    expect(story).toContain("DarkVariants")
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

  it("keeps the matrix aligned with React and Vue neutral, semantic, and brand rows", () => {
    const matrix = readStoryFile("ToastMatrix.svelte")

    for (const value of [
      'intent: "neutral"',
      'intent: "info"',
      'intent: "success"',
      'intent: "warning"',
      'intent: "error"',
      'intent: "brand"',
      'data-intent": "brand"',
      "gap: 32px",
      "box-sizing: border-box",
      "mw-toast__action-button",
    ]) {
      expect(matrix).toContain(value)
    }
  })
})
