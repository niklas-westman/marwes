import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import ts from "typescript"
import { afterEach, describe, expect, it } from "vitest"
import { runInit } from "../src/init"
import type { ShellCommand } from "../src/package-manager"
import { type Adapter, getAdapterRecipe } from "../src/recipes"
import { setupGuidance } from "../src/setup-guidance"

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

async function writeAdapterProject(cwd: string, adapter: Adapter): Promise<void> {
  const dependencies = Object.fromEntries(
    getAdapterRecipe(adapter).installPackages.map((name) => [name, "latest"]),
  )
  if (adapter === "react") return writeReactProject(cwd, dependencies)
  await writeFile(join(cwd, "package.json"), JSON.stringify({ dependencies }))
  await writeFile(
    join(cwd, adapter === "vue" ? "src/App.vue" : "src/App.svelte"),
    adapter === "vue" ? "<template><main>Your app</main></template>" : "<main>Your app</main>",
  )
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

describe("init", () => {
  it("runs doctor after a regular init", async () => {
    const cwd = await makeProject()
    await writeReactProject(cwd, {
      "@marwes-ui/react": "1.3.0",
      react: "19.2.4",
      "react-dom": "19.2.4",
    })
    const output: string[] = []

    const result = await runInit({
      adapter: "react",
      noInstall: true,
      cwd,
      write: (message) => output.push(message),
    })

    expect(result.status).toBe("complete")
    expect(result.doctor?.exitCode).toBe(0)
    expect(output.join("\n")).toContain("Marwes doctor:")
  })

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
    expect(result.status).toBe("complete")
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
    expect(result.status).toBe("failed")
    expect(result.doctor).toBeUndefined()
    expect(output.join("\n")).not.toContain("Marwes doctor:")
  })

  it("labels install failure code 2 as failed, not manual provider wiring", async () => {
    const cwd = await makeProject()
    const output: string[] = []
    const result = await runInit({
      adapter: "react",
      cwd,
      runner: async () => 2,
      write: (message) => output.push(message),
    })
    expect(result.status).toBe("failed")
    expect(result.exitCode).toBe(2)
    expect(result.doctor).toBeUndefined()
    expect(output.join("\n")).toContain(
      "Marwes init failed: installation command exited with code 2",
    )
    expect(output.join("\n")).toContain("Marwes init status: failed.")
    expect(output.join("\n")).not.toContain("manual action")
  })

  for (const adapter of ["react", "vue", "svelte"] as const) {
    for (const agentic of [false, true]) {
      it(`prints ${agentic ? "full agentic" : "concise"} guidance after successful ${adapter} setup`, async () => {
        const cwd = await makeProject()
        await writeAdapterProject(cwd, adapter)
        const output: string[] = []
        const result = await runInit({
          adapter,
          cwd,
          noInstall: true,
          agentic,
          write: (message) => output.push(message),
        })
        const text = output.join("\n")
        expect(result.status).toBe("complete")
        expect(text).toContain("Marwes init status: complete.")
        expect(text).toContain(`Import Marwes APIs only from @marwes-ui/${adapter}.`)
        expect(text).toContain("Default preset CSS loads automatically")
        expect(text).toContain(
          "Do not install or import @marwes-ui/core or @marwes-ui/presets directly",
        )
        expect(text).toContain("scoped to the provider and its descendants, not :root")
        expect(text).toContain("CSS var(...) references, not concrete JavaScript values")
        expect(text).toContain("useTheme() only in a child component below MarwesProvider")
        expect(text).toContain("https://marwes.io/docs/theming/")
        expect(text).toContain(
          `https://marwes.io/docs/integrations/${{ react: "next", vue: "nuxt", svelte: "sveltekit" }[adapter]}/`,
        )
        expect(text.includes("Complete ")).toBe(agentic)
        if (agentic) {
          expect(text).toContain(
            `import { MarwesProvider, type ThemeInput } from "@marwes-ui/${adapter}"`,
          )
          expect(text).toContain(
            'const brandTheme = { color: { primary: "#2457FF" } } satisfies ThemeInput',
          )
          expect(text).toContain(adapter === "vue" ? ':theme="brandTheme"' : "theme={brandTheme}")
          expect(text).toContain("https://marwes.io/llms.txt")
          expect(text).toContain(`https://marwes.io/ai/${adapter}.md`)
          expect(text).toContain("https://marwes.io/ai/v1/public-api.json")
          expect(text).toContain(`import { PrimaryButton } from "@marwes-ui/${adapter}"`)
          expect(text).toContain("not invented mw-* replacement classes")
          expect(text).not.toContain("Manual follow-up")
        }
        if (adapter === "vue") expect(text).toContain("not a ref")
        if (adapter === "svelte") expect(text).toContain("destructuring .theme takes a snapshot")
      })
    }

    it(`prints full ${adapter} guidance when manual wiring is required`, async () => {
      const cwd = await makeProject()
      await writeAdapterProject(cwd, adapter)
      const output: string[] = []
      const result = await runInit({
        adapter,
        cwd,
        noInstall: true,
        noPatch: true,
        write: (message) => output.push(message),
      })
      expect(result.status).toBe("manual-action-required")
      expect(result.exitCode).toBe(2)
      expect(output.join("\n")).toContain("Marwes init status: manual-action-required.")
      expect(output.join("\n")).toContain(
        `Complete ${getAdapterRecipe(adapter).displayName} provider example:`,
      )
      expect(output.join("\n")).toContain("satisfies ThemeInput")
    })
  }

  it("reports dry-run plans without claiming installation or changing files", async () => {
    const cwd = await makeProject()
    await writeAdapterProject(cwd, "react")
    const before = await readFile(join(cwd, "src/main.tsx"), "utf8")
    const output: string[] = []
    const result = await runInit({
      adapter: "react",
      cwd,
      dryRun: true,
      agentic: true,
      runner: async () => {
        throw new Error("dry-run must not execute commands")
      },
      write: (message) => output.push(message),
    })
    expect(result.exitCode).toBe(0)
    expect(result.doctor).toBeUndefined()
    expect(await readFile(join(cwd, "src/main.tsx"), "utf8")).toBe(before)
    expect(output.join("\n")).toContain("No installation, file changes, or doctor checks performed")
    expect(output.join("\n")).not.toContain("Marwes init complete.")
    expect(output.join("\n")).not.toContain("Marwes init status:")
    expect(output.join("\n")).toContain("[dry-run] Planned init status: complete.")
    expect(output.join("\n")).toContain("satisfies ThemeInput")
  })

  it("typechecks printed theme declarations against every source adapter API", () => {
    const repoRoot = new URL("../../../", import.meta.url).pathname
    const config = ts.readConfigFile(join(repoRoot, "tsconfig.base.json"), ts.sys.readFile)
    const options = {
      ...ts.parseJsonConfigFileContent(config.config, ts.sys, repoRoot).options,
      noEmit: true,
    }
    const sources = new Map<string, string>()
    for (const adapter of ["react", "vue", "svelte"] as const) {
      const lines = setupGuidance(adapter, true)
      const example = lines[lines.findIndex((line) => line.startsWith("Complete ")) + 1] ?? ""
      const script =
        adapter === "react"
          ? example.replace('import App from "./App"', "const App = () => null")
          : (example.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "")
      sources.set(join(repoRoot, `packages/cli/test/printed-${adapter}.tsx`), script)
    }
    const host = ts.createCompilerHost(options)
    const getSourceFile = host.getSourceFile.bind(host)
    host.getSourceFile = (filename, languageVersion, ...rest) =>
      sources.has(filename)
        ? ts.createSourceFile(
            filename,
            sources.get(filename) ?? "",
            languageVersion,
            true,
            ts.ScriptKind.TSX,
          )
        : getSourceFile(filename, languageVersion, ...rest)
    const program = ts.createProgram([...sources.keys()], options, host)
    const errors = [...sources.keys()].flatMap((filename) => {
      const file = program.getSourceFile(filename)
      return file
        ? [...program.getSyntacticDiagnostics(file), ...program.getSemanticDiagnostics(file)]
        : []
    })
    expect(errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, "\n"))).toEqual(
      [],
    )
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
    expect(result.exitCode).toBe(2)
    expect(result.status).toBe("manual-action-required")
    expect(output.join("\n")).toContain(
      "Manual follow-up: wrap the app root with MarwesProvider from @marwes-ui/react.",
    )
    expect(output.join("\n")).toContain("https://marwes.io/docs/get-started/react/")
  })

  it("returns exit code 2 with searched files and a complete guide for an unknown structure", async () => {
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
    const output: string[] = []

    const result = await runInit({
      adapter: "react",
      noInstall: true,
      cwd,
      write: (message) => output.push(message),
    })

    expect(result.status).toBe("manual-action-required")
    expect(result.exitCode).toBe(2)
    expect(result.patch).toMatchObject({
      status: "manual-action-required",
      searchedFiles: ["src/main.tsx", "src/main.jsx"],
    })
    expect(output.join("\n")).toContain("Files searched: src/main.tsx, src/main.jsx")
    expect(output.join("\n")).toContain("Complete React provider example:")
  })
})
