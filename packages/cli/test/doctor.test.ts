import { mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { runDoctor } from "../src/doctor"

const tempDirs: string[] = []

async function makeProject(): Promise<string> {
  const cwd = join(tmpdir(), `marwes-cli-${crypto.randomUUID()}`)
  tempDirs.push(cwd)
  await mkdir(join(cwd, "src"), { recursive: true })
  return cwd
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

describe("doctor", () => {
  it("warns about direct internals and manual stylesheet imports", async () => {
    const cwd = await makeProject()
    await writeFile(
      join(cwd, "package.json"),
      JSON.stringify({
        dependencies: {
          "@marwes-ui/react": "1.3.0",
          "@marwes-ui/core": "1.3.0",
          react: "18.3.1",
          "react-dom": "18.3.1",
        },
      }),
    )
    await writeFile(
      join(cwd, "src/main.tsx"),
      [
        'import "@marwes-ui/presets/firstEdition/styles.css"',
        'import { MarwesProvider } from "@marwes-ui/react"',
      ].join("\n"),
    )

    const result = await runDoctor({ cwd, write: () => undefined })
    const messages = result.items.map((item) => item.message)

    expect(result.exitCode).toBe(0)
    expect(messages).toContain("@marwes-ui/core is installed directly.")
    expect(messages).toContain("Manual Marwes preset stylesheet import found.")
  })

  it("fails when no adapter package is installed", async () => {
    const cwd = await makeProject()
    await writeFile(join(cwd, "package.json"), JSON.stringify({ dependencies: {} }))

    const result = await runDoctor({ cwd, write: () => undefined })

    expect(result.exitCode).toBe(1)
    expect(result.items[0]?.message).toBe("No Marwes adapter dependency found.")
  })
})
