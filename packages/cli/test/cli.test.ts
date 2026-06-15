import { describe, expect, it } from "vitest"
import { runCreateMarwesCli, runMarwesCli } from "../src/index"

describe("CLI entrypoints", () => {
  it("prints adapter-specific AI prompts", async () => {
    const output: string[] = []
    const exitCode = await runMarwesCli(["ai-prompt", "--adapter", "react", "--pm", "npm"], {
      write: (message) => output.push(message),
    })

    expect(exitCode).toBe(0)
    expect(output.join("\n")).toContain("npx @marwes-ui/cli init --adapter react --agentic")
  })

  it("dry-runs agentic init without running doctor", async () => {
    const output: string[] = []
    const exitCode = await runMarwesCli(["init", "--adapter", "react", "--agentic", "--dry-run"], {
      write: (message) => output.push(message),
    })

    expect(exitCode).toBe(0)
    expect(output.join("\n")).toContain("[dry-run] pnpm add @marwes-ui/react react react-dom")
    expect(output.join("\n")).toContain("[dry-run] marwes doctor --adapter react")
  })

  it("validates create templates", async () => {
    const output: string[] = []
    const exitCode = await runCreateMarwesCli(["demo", "--template", "bad-template"], {
      write: (message) => output.push(message),
    })

    expect(exitCode).toBe(1)
    expect(output.join("\n")).toContain("Invalid --template")
  })

  it("dry-runs create without invoking a runner", async () => {
    const output: string[] = []
    const exitCode = await runCreateMarwesCli(["demo", "--template", "svelte-ts", "--dry-run"], {
      write: (message) => output.push(message),
    })

    expect(exitCode).toBe(0)
    expect(output.join("\n")).toContain("create vite")
    expect(output.join("\n")).toContain("marwes init --adapter svelte")
  })
})
