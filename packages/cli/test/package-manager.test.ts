import { mkdir, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { detectPackageManager, formatShellCommand, installCommand } from "../src/package-manager"

const tempDirs: string[] = []

async function makeTempDir(): Promise<string> {
  const path = join(tmpdir(), `marwes-cli-${crypto.randomUUID()}`)
  await mkdir(path, { recursive: true })
  tempDirs.push(path)
  return path
}

afterEach(async () => {
  const { rm } = await import("node:fs/promises")
  await Promise.all(tempDirs.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

describe("package manager helpers", () => {
  it("detects pnpm from lockfile", async () => {
    const cwd = await makeTempDir()
    await writeFile(join(cwd, "pnpm-lock.yaml"), "")

    await expect(detectPackageManager(cwd)).resolves.toBe("pnpm")
  })

  it("formats install commands", () => {
    expect(formatShellCommand(installCommand("npm", ["@marwes-ui/react"]))).toBe(
      "npm install @marwes-ui/react",
    )
    expect(formatShellCommand(installCommand("pnpm", ["@marwes-ui/vue"]))).toBe(
      "pnpm add @marwes-ui/vue",
    )
  })
})
