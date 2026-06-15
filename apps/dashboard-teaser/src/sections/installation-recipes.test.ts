import { describe, expect, it } from "vitest"
import {
  createAgenticInstallCommand,
  createAgenticInstallPrompt,
  createExistingAppInstallCommand,
  createPackageRunnerCommand,
} from "./installation-recipes"

describe("installation recipes", () => {
  it("formats package runner commands for supported package managers", () => {
    expect(createPackageRunnerCommand("pnpm")).toBe("pnpm dlx @marwes-ui/cli")
    expect(createPackageRunnerCommand("npm")).toBe("npx @marwes-ui/cli")
    expect(createPackageRunnerCommand("yarn")).toBe("yarn dlx @marwes-ui/cli")
    expect(createPackageRunnerCommand("bun")).toBe("bunx @marwes-ui/cli")
  })

  it("creates existing-app and agentic installer commands", () => {
    expect(createExistingAppInstallCommand("vue", "yarn")).toBe(
      "yarn dlx @marwes-ui/cli init --adapter vue",
    )
    expect(createAgenticInstallCommand("svelte", "bun")).toBe(
      "bunx @marwes-ui/cli init --adapter svelte --agentic",
    )
  })

  it("keeps AI install copy focused on the CLI path", () => {
    const prompt = createAgenticInstallPrompt("react", "npm")

    expect(prompt).toContain("npx @marwes-ui/cli init --adapter react --agentic")
    expect(prompt).toContain("Follow the CLI output")
    expect(prompt).not.toContain("pnpm add")
    expect(prompt).not.toContain("@marwes-ui/presets/firstEdition/styles.css")
  })
})
