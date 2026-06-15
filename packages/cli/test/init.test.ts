import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { runInit } from "../src/init"
import type { ShellCommand } from "../src/package-manager"

const tempDirs: string[] = []

async function makeProject(): Promise<string> {
  const cwd = join(tmpdir(), `marwes-cli-${crypto.randomUUID()}`)
  tempDirs.push(cwd)
  await mkdir(join(cwd, "src"), { recursive: true })
  return cwd
}

async function writeReactProject(cwd: string, dependencies: Record<string, string>): Promise<void> {
  await writeFile(join(cwd, "package.json"), JSON.stringify({ dependencies }))
  await writeFile(
    join(cwd, "src/main.tsx"),
    ['import App from "./App"', "", "createRoot(root).render(<App />)", ""].join("\n"),
  )
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

describe("init agentic mode", () => {
  it("runs install, patches the app, then runs doctor", async () => {
    const cwd = await makeProject()
    await writeReactProject(cwd, {
      "@marwes-ui/react": "1.3.0",
      react: "19.2.4",
      "react-dom": "19.2.4",
    })
    const output: string[] = []
    const commands: ShellCommand[] = []

    const result = await runInit({
      adapter: "react",
      agentic: true,
      cwd,
      runner: async (command) => {
        commands.push(command)
        return 0
      },
      write: (message) => output.push(message),
    })

    expect(result.exitCode).toBe(0)
    expect(result.doctor?.exitCode).toBe(0)
    expect(commands).toHaveLength(1)
    expect(commands[0]).toMatchObject({
      command: "pnpm",
      args: ["add", "@marwes-ui/react", "react", "react-dom"],
    })
    await expect(readFile(join(cwd, "src/main.tsx"), "utf8")).resolves.toContain("MarwesProvider")
    expect(output.join("\n")).toContain("Marwes doctor:")
    expect(output.join("\n")).toContain("Import Marwes APIs only from @marwes-ui/react.")
  })

  it("does not run doctor when install fails", async () => {
    const cwd = await makeProject()
    await writeReactProject(cwd, {
      "@marwes-ui/react": "1.3.0",
      react: "19.2.4",
      "react-dom": "19.2.4",
    })
    const output: string[] = []

    const result = await runInit({
      adapter: "react",
      agentic: true,
      cwd,
      runner: async () => 1,
      write: (message) => output.push(message),
    })

    expect(result.exitCode).toBe(1)
    expect(result.doctor).toBeUndefined()
    expect(output.join("\n")).not.toContain("Marwes doctor:")
  })

  it("returns the doctor failure code in agentic mode", async () => {
    const cwd = await makeProject()
    await writeReactProject(cwd, {})

    const result = await runInit({
      adapter: "react",
      agentic: true,
      noInstall: true,
      cwd,
      write: () => undefined,
    })

    expect(result.installSkipped).toBe(true)
    expect(result.exitCode).toBe(1)
    expect(result.doctor?.exitCode).toBe(1)
  })

  it("honors no-patch and prints manual provider guidance", async () => {
    const cwd = await makeProject()
    await writeReactProject(cwd, {
      "@marwes-ui/react": "1.3.0",
      react: "19.2.4",
      "react-dom": "19.2.4",
    })
    const output: string[] = []

    const result = await runInit({
      adapter: "react",
      agentic: true,
      noInstall: true,
      noPatch: true,
      cwd,
      write: (message) => output.push(message),
    })

    expect(result.patchSkipped).toBe(true)
    expect(result.exitCode).toBe(0)
    expect(output.join("\n")).toContain(
      "Manual follow-up: wrap the app root with MarwesProvider from @marwes-ui/react.",
    )
  })
})
