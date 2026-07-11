import { runCreateMarwesCli } from "@marwes-ui/cli"
import { describe, expect, it } from "vitest"

describe("create-marwes wrapper", () => {
  it("delegates to the shared Marwes create flow", async () => {
    const output: string[] = []
    const exitCode = await runCreateMarwesCli(["demo", "--template", "react-ts", "--dry-run"], {
      write: (message) => output.push(message),
    })

    expect(exitCode).toBe(0)
    expect(output.join("\n")).toContain("pnpm create vite@latest demo -- --template react-ts")
    expect(output.join("\n")).toContain("marwes init --adapter react")
  })
})
