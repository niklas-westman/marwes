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
        "",
        "export const Root = () => <MarwesProvider><App /></MarwesProvider>",
      ].join("\n"),
    )

    const result = await runDoctor({ cwd, write: () => undefined })
    const messages = result.items.map((item) => item.message)

    expect(result.exitCode).toBe(0)
    expect(messages).toContain("@marwes-ui/core is installed directly.")
    expect(messages).toContain("Manual Marwes preset stylesheet import found.")
  })

  it("fails when the provider is imported but not rendered", async () => {
    const cwd = await makeProject()
    await writeFile(
      join(cwd, "package.json"),
      JSON.stringify({
        dependencies: {
          "@marwes-ui/react": "1.3.0",
          react: "19.2.4",
          "react-dom": "19.2.4",
        },
      }),
    )
    await writeFile(
      join(cwd, "src/main.tsx"),
      'import { MarwesProvider } from "@marwes-ui/react"\nrender(<App />)',
    )

    const result = await runDoctor({ cwd, write: () => undefined })

    expect(result.exitCode).toBe(1)
    expect(result.items).toContainEqual(
      expect.objectContaining({
        level: "fail",
        message: expect.stringContaining("not both imported"),
      }),
    )
  })

  it("finds a correctly rendered provider in an app directory", async () => {
    const cwd = await makeProject()
    await mkdir(join(cwd, "app"), { recursive: true })
    await writeFile(
      join(cwd, "package.json"),
      JSON.stringify({
        dependencies: {
          "@marwes-ui/react": "1.3.0",
          react: "19.2.4",
          "react-dom": "19.2.4",
        },
      }),
    )
    await writeFile(
      join(cwd, "app/layout.tsx"),
      'import { MarwesProvider as Provider } from "@marwes-ui/react"\nexport const Layout = () => <Provider><App /></Provider>',
    )

    const result = await runDoctor({ cwd, write: () => undefined })

    expect(result.exitCode).toBe(0)
    expect(result.items).toContainEqual(
      expect.objectContaining({ level: "pass", message: expect.stringContaining("layout.tsx") }),
    )
  })

  it("preserves the underlying build failure code", async () => {
    const cwd = await makeProject()
    await writeFile(
      join(cwd, "package.json"),
      JSON.stringify({
        scripts: { typecheck: "tsc --noEmit" },
        dependencies: {
          "@marwes-ui/react": "1.3.0",
          react: "19.2.4",
          "react-dom": "19.2.4",
        },
      }),
    )
    await writeFile(
      join(cwd, "src/main.tsx"),
      'import { MarwesProvider } from "@marwes-ui/react"\nrender(<MarwesProvider><App /></MarwesProvider>)',
    )

    const result = await runDoctor({
      cwd,
      runBuild: true,
      runner: async () => 7,
      write: () => undefined,
    })

    expect(result.exitCode).toBe(7)
    expect(result.items).toContainEqual(
      expect.objectContaining({ level: "fail", message: "typecheck failed with exit code 7." }),
    )
  })

  it("fails when no adapter package is installed", async () => {
    const cwd = await makeProject()
    await writeFile(join(cwd, "package.json"), JSON.stringify({ dependencies: {} }))

    const result = await runDoctor({ cwd, write: () => undefined })

    expect(result.exitCode).toBe(1)
    expect(result.items[0]?.message).toBe("No Marwes adapter dependency found.")
  })
})
