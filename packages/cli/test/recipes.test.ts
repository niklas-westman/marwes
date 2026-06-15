import { describe, expect, it } from "vitest"
import { createAiPrompt, getAdapterRecipe } from "../src/recipes"

describe("adapter recipes", () => {
  it("installs the public React adapter and peer packages", () => {
    expect(getAdapterRecipe("react").installPackages).toEqual([
      "@marwes-ui/react",
      "react",
      "react-dom",
    ])
  })

  it("creates an AI prompt that keeps users on the public adapter boundary", () => {
    const prompt = createAiPrompt("vue", "pnpm")

    expect(prompt).toContain("pnpm add @marwes-ui/vue vue")
    expect(prompt).toContain("Wrap the app root with MarwesProvider")
    expect(prompt).toContain("Do not install @marwes-ui/core or @marwes-ui/presets directly.")
    expect(prompt).toContain("Do not add a separate Marwes stylesheet import")
  })
})
