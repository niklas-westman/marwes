import { describe, expect, it } from "vitest"
import {
  createAgenticInstallCommand,
  createAgenticInstallPrompt,
  createExistingAppInstallCommand,
} from "./installation-recipes"

describe("installation recipes", () => {
  it("creates existing-app and agentic installer commands using npx", () => {
    expect(createExistingAppInstallCommand("vue")).toBe("npx @marwes-ui/cli init --adapter vue")
    expect(createAgenticInstallCommand("svelte")).toBe(
      "npx @marwes-ui/cli init --adapter svelte --agentic",
    )
  })

  it("keeps AI install copy focused on the CLI path", () => {
    const prompt = createAgenticInstallPrompt("react")

    expect(prompt).toContain("npx @marwes-ui/cli init --adapter react --agentic")
    expect(prompt).toContain("Follow the CLI output")
    expect(prompt).not.toContain("pnpm add")
    expect(prompt).not.toContain("@marwes-ui/presets/firstEdition/styles.css")
  })
})
