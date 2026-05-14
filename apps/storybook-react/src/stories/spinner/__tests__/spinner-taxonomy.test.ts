/**
 * React Spinner story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React spinner story taxonomy", () => {
  it("keeps atom story under Spinner/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "spinner.stories.tsx"), "utf8")

    expect(story).toContain('title: "Spinner/Atom"')
  })

  it("keeps spinner compositions under Spinner/Molecule", () => {
    const buttonSpinnerStory = readFileSync(
      path.join(storiesDir, "button-spinner.stories.tsx"),
      "utf8",
    )
    const emptyStateSpinnerStory = readFileSync(
      path.join(storiesDir, "empty-state-spinner.stories.tsx"),
      "utf8",
    )

    expect(buttonSpinnerStory).toContain('title: "Spinner/Molecule/ButtonSpinner"')
    expect(emptyStateSpinnerStory).toContain('title: "Spinner/Molecule/EmptyStateSpinner"')
  })

  it("keeps EmptyStateSpinner default story on a light surface", () => {
    const emptyStateSpinnerStory = readFileSync(
      path.join(storiesDir, "empty-state-spinner.stories.tsx"),
      "utf8",
    )

    expect(emptyStateSpinnerStory).toContain('background: "rgba(248, 250, 252, 0.88)"')
    expect(emptyStateSpinnerStory).toContain('color: "#111827"')
    expect(emptyStateSpinnerStory).not.toContain('background: "#141414"')
    expect(emptyStateSpinnerStory).not.toContain('color: "#f9fafb"')
  })
})
