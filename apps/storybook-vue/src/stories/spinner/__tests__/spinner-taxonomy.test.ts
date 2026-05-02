import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue spinner story taxonomy", () => {
  it("keeps atom story under Spinner/Atom", () => {
    const story = readFileSync(path.join(storiesDir, "spinner.stories.ts"), "utf8")

    expect(story).toContain('title: "Spinner/Atom"')
  })

  it("keeps spinner compositions under Spinner/Molecule", () => {
    const buttonSpinnerStory = readFileSync(
      path.join(storiesDir, "button-spinner.stories.ts"),
      "utf8",
    )
    const emptyStateSpinnerStory = readFileSync(
      path.join(storiesDir, "empty-state-spinner.stories.ts"),
      "utf8",
    )

    expect(buttonSpinnerStory).toContain('title: "Spinner/Molecule/ButtonSpinner"')
    expect(emptyStateSpinnerStory).toContain('title: "Spinner/Molecule/EmptyStateSpinner"')
  })
})
