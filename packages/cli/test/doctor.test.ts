import { mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { runDoctor } from "../src/doctor"
import type { Adapter } from "../src/recipes"

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
  it.each<[Adapter, string, Record<string, string>]>([
    [
      "vue",
      '<script setup>import { MarwesProvider } from "@marwes-ui/vue"</script><template><marwes-provider /></template>',
      { vue: "3.5.0" },
    ],
    [
      "vue",
      'import * as Marwes from "@marwes-ui/vue"; import { h as render } from "vue"; render(Marwes.MarwesProvider, null)',
      { vue: "3.5.0" },
    ],
    [
      "svelte",
      '<script>import { MarwesProvider as Provider } from "@marwes-ui/svelte";</script><Provider />',
      { svelte: "5.0.0" },
    ],
  ])(
    "accepts alternate %s provider syntax through doctor",
    async (adapter, source, frameworkDependencies) => {
      const cwd = await makeProject()
      await writeFile(
        join(cwd, "package.json"),
        JSON.stringify({
          dependencies: { [`@marwes-ui/${adapter}`]: "1.4.1", ...frameworkDependencies },
        }),
      )
      await writeFile(join(cwd, `src/App.${adapter === "vue" ? "vue" : "svelte"}`), source)
      const result = await runDoctor({ cwd, write: () => undefined })
      expect(result.exitCode).toBe(0)
      expect(result.items).toContainEqual(
        expect.objectContaining({
          level: "pass",
          message: expect.stringContaining("and rendered"),
        }),
      )
    },
  )

  it.each([
    {
      scripts: { typecheck: "tsc", build: "vite build" },
      codes: [0, 0],
      expected: ["typecheck", "build"],
      exitCode: 0,
    },
    {
      scripts: { typecheck: "tsc", build: "vite build" },
      codes: [7],
      expected: ["typecheck"],
      exitCode: 7,
    },
    { scripts: { build: "vite build" }, codes: [0], expected: ["build"], exitCode: 0 },
    { scripts: { build: "vite build" }, codes: [2], expected: ["build"], exitCode: 2 },
    { scripts: { typecheck: "tsc" }, codes: [0], expected: ["typecheck"], exitCode: 1 },
    { scripts: {}, codes: [], expected: [], exitCode: 1 },
  ])(
    "runs production build with optional preceding typecheck: $scripts / $codes",
    async ({ scripts, codes, expected, exitCode }) => {
      const cwd = await makeProject()
      await writeFile(
        join(cwd, "package.json"),
        JSON.stringify({
          scripts,
          dependencies: {
            "@marwes-ui/react": "1.4.1",
            react: "19.2.4",
            "react-dom": "19.2.4",
          },
        }),
      )
      await writeFile(
        join(cwd, "src/main.tsx"),
        'import * as Marwes from "@marwes-ui/react"; const App = () => <Marwes.MarwesProvider />',
      )
      const commands: string[] = []
      const result = await runDoctor({
        cwd,
        runBuild: true,
        packageManager: "pnpm",
        write: () => undefined,
        runner: async (command) => {
          commands.push(command.args.at(-1) ?? "")
          return codes[commands.length - 1] ?? 0
        },
      })
      expect(commands).toEqual(expected)
      expect(result.exitCode).toBe(exitCode)
      if (!("build" in scripts))
        expect(result.items).toContainEqual(
          expect.objectContaining({ level: "fail", message: "No build script found to run." }),
        )
    },
  )

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
