import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Svelte welcome introduction docs", () => {
  it("introduces the Storybook navigation and Svelte package entry point", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    for (const value of [
      '<Meta title="Welcome/Introduction" />',
      'import coverImage from "./assets/cover-v3.png"',
      'alt="Marwes interface system cover"',
      'height: "clamp(420px, 46vw, 580px)"',
      "Marwes Svelte Storybook",
      "Start Here",
      "Navigation Model",
      "@marwes-ui/svelte",
    ]) {
      expect(introDoc).toContain(value)
    }

    expect(introDoc).not.toContain("@marwes-ui/presets/firstEdition/styles.css")
    expect(introDoc).not.toContain("Datepicker")
  })
})
