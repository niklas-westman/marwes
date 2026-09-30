import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { patchProject } from "../src/patchers"
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

describe("project patchers", () => {
  it.each<[Adapter, string, string]>([
    [
      "react",
      "src/main.tsx",
      'import * as Marwes from "@marwes-ui/react"; render(<Marwes.MarwesProvider><App /></Marwes.MarwesProvider>)',
    ],
    [
      "react",
      "src/main.tsx",
      'import { MarwesProvider } from "@marwes-ui/react"; import React from "react"; React.createElement(MarwesProvider, null)',
    ],
    [
      "vue",
      "src/App.vue",
      '<script setup>import { MarwesProvider } from "@marwes-ui/vue"</script><template><marwes-provider><App /></marwes-provider></template>',
    ],
    [
      "vue",
      "src/App.vue",
      '<script>import { MarwesProvider as Provider } from "@marwes-ui/vue"; import { h as render } from "vue"; export default { render: () => render(Provider, null) }</script>',
    ],
    [
      "svelte",
      "src/App.svelte",
      '<script>import { MarwesProvider as Provider } from "@marwes-ui/svelte";</script><Provider><App /></Provider>',
    ],
  ])("leaves valid %s provider wiring untouched", async (adapter, relativeFile, source) => {
    const cwd = await makeProject()
    const file = join(cwd, relativeFile)
    await writeFile(file, source)
    await expect(patchProject(cwd, adapter, false)).resolves.toMatchObject({
      status: "already-configured",
      changed: false,
    })
    await expect(readFile(file, "utf8")).resolves.toBe(source)
  })

  it("dry-runs the React Vite entrypoint patch without writing", async () => {
    const cwd = await makeProject()
    const file = join(cwd, "src/main.tsx")
    await writeFile(
      file,
      [
        'import { StrictMode } from "react"',
        'import { createRoot } from "react-dom/client"',
        'import App from "./App"',
        "",
        'createRoot(document.getElementById("root")!).render(',
        "  <StrictMode>",
        "    <App />",
        "  </StrictMode>,",
        ")",
        "",
      ].join("\n"),
    )

    const result = await patchProject(cwd, "react", true)

    expect(result.changed).toBe(true)
    expect(result.status).toBe("applied")
    await expect(readFile(file, "utf8")).resolves.not.toContain("MarwesProvider")
  })

  it("wraps the React Vite entrypoint with MarwesProvider", async () => {
    const cwd = await makeProject()
    const file = join(cwd, "src/main.tsx")
    await writeFile(
      file,
      ['import App from "./App"', "", "createRoot(root).render(<App />)", ""].join("\n"),
    )

    const result = await patchProject(cwd, "react", false)
    const source = await readFile(file, "utf8")

    expect(result.changed).toBe(true)
    expect(result.status).toBe("applied")
    expect(source).toContain('import { MarwesProvider } from "@marwes-ui/react"')
    expect(source).toContain("<MarwesProvider>")
  })

  it("wraps a Vue starter template with MarwesProvider", async () => {
    const cwd = await makeProject()
    const file = join(cwd, "src/App.vue")
    await writeFile(file, "<template>\n  <main>Hello</main>\n</template>\n")

    const result = await patchProject(cwd, "vue", false)
    const source = await readFile(file, "utf8")

    expect(result.changed).toBe(true)
    expect(result.status).toBe("applied")
    expect(source).toContain('import { MarwesProvider } from "@marwes-ui/vue"')
    expect(source).toContain("<MarwesProvider>")
  })

  it("wraps Svelte starter markup while keeping styles outside the provider", async () => {
    const cwd = await makeProject()
    const file = join(cwd, "src/App.svelte")
    await writeFile(file, "<h1>Hello</h1>\n\n<style>\nh1 { color: red; }\n</style>\n")

    const result = await patchProject(cwd, "svelte", false)
    const source = await readFile(file, "utf8")

    expect(result.changed).toBe(true)
    expect(result.status).toBe("applied")
    expect(source).toContain('import { MarwesProvider } from "@marwes-ui/svelte"')
    expect(source).toContain("<MarwesProvider>")
    expect(source.indexOf("</MarwesProvider>")).toBeLessThan(source.indexOf("<style>"))
  })

  it("distinguishes an already configured app from an unsupported structure", async () => {
    const cwd = await makeProject()
    await writeFile(
      join(cwd, "src/main.tsx"),
      'import { MarwesProvider } from "@marwes-ui/react"\nrender(<MarwesProvider><App /></MarwesProvider>)',
    )

    await expect(patchProject(cwd, "react", false)).resolves.toMatchObject({
      status: "already-configured",
      changed: false,
    })

    const otherCwd = await makeProject()
    await expect(patchProject(otherCwd, "react", false)).resolves.toMatchObject({
      status: "manual-action-required",
      searchedFiles: ["src/main.tsx", "src/main.jsx"],
    })
  })

  it("recognizes an aliased provider as already configured", async () => {
    const cwd = await makeProject()
    await writeFile(
      join(cwd, "src/main.tsx"),
      'import { MarwesProvider as Provider } from "@marwes-ui/react"\nrender(<Provider><App /></Provider>)',
    )

    await expect(patchProject(cwd, "react", false)).resolves.toMatchObject({
      status: "already-configured",
      changed: false,
    })
  })
})
