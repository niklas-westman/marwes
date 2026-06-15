import { access, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type { Adapter } from "./recipes"

export type PatchResult = {
  adapter: Adapter
  changed: boolean
  dryRun: boolean
  file?: string
  message: string
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function insertImport(source: string, importLine: string): string {
  if (source.includes(importLine)) {
    return source
  }

  const lines = source.split("\n")
  let lastImportIndex = -1

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index]?.startsWith("import ")) {
      lastImportIndex = index
    }
  }

  if (lastImportIndex === -1) {
    return `${importLine}\n${source}`
  }

  lines.splice(lastImportIndex + 1, 0, importLine)
  return lines.join("\n")
}

function indentBlock(source: string, indentation: string): string {
  return source
    .split("\n")
    .map((line) => (line.trim().length === 0 ? "" : `${indentation}${line}`))
    .join("\n")
}

async function writeIfNeeded(path: string, source: string, dryRun: boolean): Promise<boolean> {
  const current = await readFile(path, "utf8")
  if (current === source) {
    return false
  }

  if (!dryRun) {
    await writeFile(path, source)
  }

  return true
}

async function patchReact(cwd: string, dryRun: boolean): Promise<PatchResult> {
  const candidates = ["src/main.tsx", "src/main.jsx"]
  let relativeFile: string | undefined

  for (const candidate of candidates) {
    if (await fileExists(join(cwd, candidate))) {
      relativeFile = candidate
      break
    }
  }

  if (!relativeFile) {
    return {
      adapter: "react",
      changed: false,
      dryRun,
      message: "No React Vite entrypoint found. Expected src/main.tsx or src/main.jsx.",
    }
  }

  const file = join(cwd, relativeFile)
  const source = await readFile(file, "utf8")

  if (source.includes("MarwesProvider")) {
    return {
      adapter: "react",
      changed: false,
      dryRun,
      file: relativeFile,
      message: "React entrypoint already references MarwesProvider.",
    }
  }

  if (!source.includes("<App />")) {
    return {
      adapter: "react",
      changed: false,
      dryRun,
      file: relativeFile,
      message: "React entrypoint did not contain the standard <App /> starter render.",
    }
  }

  const withImport = insertImport(source, 'import { MarwesProvider } from "@marwes-ui/react"')
  const next = withImport.replace(
    "<App />",
    ["<MarwesProvider>", "      <App />", "    </MarwesProvider>"].join("\n"),
  )
  const changed = await writeIfNeeded(file, next, dryRun)

  return {
    adapter: "react",
    changed,
    dryRun,
    file: relativeFile,
    message: changed
      ? "Wrapped the React root render with MarwesProvider."
      : "React entrypoint already matched the expected MarwesProvider setup.",
  }
}

function ensureVueScript(source: string): string {
  if (source.includes('MarwesProvider } from "@marwes-ui/vue"')) {
    return source
  }

  const importLine = 'import { MarwesProvider } from "@marwes-ui/vue"'
  const scriptSetupMatch = source.match(/<script\s+setup[^>]*>/)

  if (!scriptSetupMatch?.index && scriptSetupMatch?.index !== 0) {
    return `<script setup lang="ts">\n${importLine}\n</script>\n\n${source}`
  }

  const insertAt = scriptSetupMatch.index + scriptSetupMatch[0].length
  return `${source.slice(0, insertAt)}\n${importLine}${source.slice(insertAt)}`
}

async function patchVue(cwd: string, dryRun: boolean): Promise<PatchResult> {
  const relativeFile = "src/App.vue"
  const file = join(cwd, relativeFile)

  if (!(await fileExists(file))) {
    return {
      adapter: "vue",
      changed: false,
      dryRun,
      message: "No Vue starter component found. Expected src/App.vue.",
    }
  }

  const source = await readFile(file, "utf8")
  if (source.includes("<MarwesProvider")) {
    return {
      adapter: "vue",
      changed: false,
      dryRun,
      file: relativeFile,
      message: "Vue starter component already contains MarwesProvider.",
    }
  }

  const templateMatch = source.match(/<template>([\s\S]*?)<\/template>/)
  if (!templateMatch) {
    return {
      adapter: "vue",
      changed: false,
      dryRun,
      file: relativeFile,
      message: "Vue starter component did not contain a standard <template> block.",
    }
  }

  const innerTemplate = templateMatch[1]?.trim()
  if (!innerTemplate) {
    return {
      adapter: "vue",
      changed: false,
      dryRun,
      file: relativeFile,
      message: "Vue starter template was empty.",
    }
  }

  const wrappedTemplate = [
    "<template>",
    "  <MarwesProvider>",
    indentBlock(innerTemplate, "    "),
    "  </MarwesProvider>",
    "</template>",
  ].join("\n")
  const withProviderTemplate = source.replace(templateMatch[0], wrappedTemplate)
  const next = ensureVueScript(withProviderTemplate)
  const changed = await writeIfNeeded(file, next, dryRun)

  return {
    adapter: "vue",
    changed,
    dryRun,
    file: relativeFile,
    message: changed
      ? "Wrapped the Vue starter template with MarwesProvider."
      : "Vue starter component already matched the expected MarwesProvider setup.",
  }
}

function blockMatches(source: string, tagName: "script" | "style"): string[] {
  return source.match(new RegExp(`<${tagName}[^>]*>[\\s\\S]*?<\\/${tagName}>`, "g")) ?? []
}

function removeBlocks(source: string, blocks: readonly string[]): string {
  return blocks.reduce((next, block) => next.replace(block, ""), source)
}

function ensureSvelteScript(scriptBlocks: readonly string[]): string {
  const importLine = '  import { MarwesProvider } from "@marwes-ui/svelte"'
  const script = scriptBlocks[0]

  if (!script) {
    return `<script lang="ts">\n${importLine}\n</script>`
  }

  if (script.includes("MarwesProvider")) {
    return script
  }

  return script.replace(/<script([^>]*)>/, `<script$1>\n${importLine}`)
}

async function patchSvelte(cwd: string, dryRun: boolean): Promise<PatchResult> {
  const relativeFile = "src/App.svelte"
  const file = join(cwd, relativeFile)

  if (!(await fileExists(file))) {
    return {
      adapter: "svelte",
      changed: false,
      dryRun,
      message: "No Svelte starter component found. Expected src/App.svelte.",
    }
  }

  const source = await readFile(file, "utf8")
  if (source.includes("<MarwesProvider")) {
    return {
      adapter: "svelte",
      changed: false,
      dryRun,
      file: relativeFile,
      message: "Svelte starter component already contains MarwesProvider.",
    }
  }

  const scriptBlocks = blockMatches(source, "script")
  const styleBlocks = blockMatches(source, "style")
  const body = removeBlocks(source, [...scriptBlocks, ...styleBlocks]).trim()

  if (!body) {
    return {
      adapter: "svelte",
      changed: false,
      dryRun,
      file: relativeFile,
      message: "Svelte starter component had no markup to wrap.",
    }
  }

  const script = ensureSvelteScript(scriptBlocks)
  const styles = styleBlocks.join("\n\n")
  const next = [
    script,
    "",
    "<MarwesProvider>",
    indentBlock(body, "  "),
    "</MarwesProvider>",
    styles ? `\n${styles}` : "",
  ]
    .filter(Boolean)
    .join("\n")
  const changed = await writeIfNeeded(file, `${next.trimEnd()}\n`, dryRun)

  return {
    adapter: "svelte",
    changed,
    dryRun,
    file: relativeFile,
    message: changed
      ? "Wrapped the Svelte starter markup with MarwesProvider."
      : "Svelte starter component already matched the expected MarwesProvider setup.",
  }
}

export async function patchProject(
  cwd: string,
  adapter: Adapter,
  dryRun: boolean,
): Promise<PatchResult> {
  if (adapter === "react") {
    return patchReact(cwd, dryRun)
  }

  if (adapter === "vue") {
    return patchVue(cwd, dryRun)
  }

  return patchSvelte(cwd, dryRun)
}
