import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { runCreate } from "../src/create"

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

describe("create", () => {
  it("records the adapter before returning a no-install scaffold", async () => {
    const cwd = join(tmpdir(), `create-marwes-${crypto.randomUUID()}`)
    const target = join(cwd, "demo")
    tempDirs.push(cwd)
    await mkdir(cwd, { recursive: true })
    const output: string[] = []

    const result = await runCreate({
      cwd,
      projectName: "demo",
      template: "react-ts",
      noInstall: true,
      runner: async (_command, options) => {
        await mkdir(join(options.cwd, "demo", "src"), { recursive: true })
        await writeFile(
          join(options.cwd, "demo", "package.json"),
          `${JSON.stringify({ dependencies: { react: "^19.0.0", "react-dom": "^19.0.0" } }, null, 2)}\n`,
        )
        await writeFile(
          join(options.cwd, "demo", "src/main.tsx"),
          ['import App from "./App"', "", "createRoot(root).render(<App />)", ""].join("\n"),
        )
        return 0
      },
      write: (message) => output.push(message),
    })

    const packageJson = JSON.parse(await readFile(join(target, "package.json"), "utf8"))
    expect(result.exitCode).toBe(0)
    expect(packageJson.dependencies["@marwes-ui/react"]).toBe("latest")
    expect(output.join("\n")).toContain("Run pnpm install before starting the app")
    expect(output.join("\n")).toContain("Marwes setup guidance:")
    expect(output.join("\n")).toContain("Default preset CSS loads automatically")
    expect(output.join("\n")).toContain("https://marwes.io/docs/theming/")
  })
})
