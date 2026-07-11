import { describe, expect, it } from "vitest"
import {
  createAgenticInitCommand,
  createAiPrompt,
  getAdapterRecipe,
  packageRunnerCommand,
} from "../src/recipes"

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

    expect(prompt).toContain("pnpm dlx @marwes-ui/cli init --adapter vue --agentic")
    expect(prompt).toContain("If automatic patching is skipped")
    expect(prompt).toContain("Do not install @marwes-ui/core or @marwes-ui/presets directly.")
    expect(prompt).toContain("Do not add a separate Marwes stylesheet import")
  })

  it("formats package runner commands for agentic installs", () => {
    expect(packageRunnerCommand("pnpm")).toBe("pnpm dlx @marwes-ui/cli")
    expect(packageRunnerCommand("npm")).toBe("npx @marwes-ui/cli")
    expect(packageRunnerCommand("yarn")).toBe("yarn dlx @marwes-ui/cli")
    expect(packageRunnerCommand("bun")).toBe("bunx @marwes-ui/cli")
    expect(createAgenticInitCommand("react", "npm")).toBe(
      "npx @marwes-ui/cli init --adapter react --agentic",
    )
  })
})
