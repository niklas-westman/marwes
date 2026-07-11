#!/usr/bin/env node

import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { basename, dirname, join, resolve } from "node:path"

const defaultConfigPath = ".pi/figma-sync.json"

function usage() {
  return [
    "Usage:",
    "  pnpm --filter @marwes-ui/design-governance raw-sync -- --mode cache",
    "  pnpm --filter @marwes-ui/design-governance raw-sync -- --mode remote",
    "",
    "Options:",
    "  --mode <cache|remote>  cache uses ~/.figma-cache with 0 API calls; remote fetches from Figma.",
    "  --target <name>        Target from .pi/figma-sync.json. Defaults to defaultTarget.",
    "  --config <path>        Figma sync config path. Defaults to .pi/figma-sync.json.",
    "  --toolkit <path>       Path to marwes-figma-toolkit/figma-node-fetch.",
    "  --no-preserve-vars     Do not restore an existing variables.json after promotion.",
    "  --json                 Print machine-readable summary.",
    "  --help                 Show help.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    mode: undefined,
    targetName: undefined,
    configPath: defaultConfigPath,
    toolkitPath: undefined,
    preserveVariables: true,
    json: false,
    help: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    function readValue() {
      const value = argv[index + 1]
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`)
      index += 1
      return value
    }

    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--mode") options.mode = readValue()
    else if (arg === "--target") options.targetName = readValue()
    else if (arg === "--config") options.configPath = readValue()
    else if (arg === "--toolkit") options.toolkitPath = readValue()
    else if (arg === "--no-preserve-vars") options.preserveVariables = false
    else if (arg === "--json") options.json = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.help && options.mode !== "cache" && options.mode !== "remote") {
    throw new Error("--mode must be cache or remote")
  }

  return options
}

function log(options, message) {
  if (!options.json) console.log(message)
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"))
}

async function pathExists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

function extractFileKey(figmaFile) {
  if (!figmaFile) return undefined

  try {
    const url = new URL(figmaFile)
    const match = url.pathname.match(/\/(?:design|file)\/([a-zA-Z0-9]+)/)
    return match?.[1]
  } catch {
    return figmaFile
  }
}

async function readTarget(repoRoot, options) {
  const configPath = resolve(repoRoot, options.configPath)
  const config = await readJson(configPath)
  const targetName = options.targetName ?? config.defaultTarget
  const target = config.targets?.[targetName]

  if (!target) throw new Error(`Unknown Figma sync target: ${targetName}`)

  const fileKey = extractFileKey(target.figmaFile)
  if (!fileKey) throw new Error(`Could not resolve file key for target: ${targetName}`)

  return {
    name: targetName,
    label: target.label ?? targetName,
    figmaFile: target.figmaFile,
    fileKey,
    projectSlug: target.projectSlug,
    liveDir: resolve(repoRoot, target.liveDir),
    archiveDir: resolve(
      repoRoot,
      target.archiveDir ?? `.figma/archive/generated-syncs/${target.projectSlug}`,
    ),
    complete: target.complete !== false,
    tokenEnvVar: target.tokenEnvVar ?? "FIGMA_API_TOKEN",
    envFiles: target.envFiles?.length ? target.envFiles : [".env.local"],
  }
}

async function readPiSettings(repoRoot) {
  const path = resolve(repoRoot, ".pi/settings.json")
  if (!(await pathExists(path))) return {}
  return readJson(path)
}

async function findToolkit(repoRoot, options) {
  const settings = await readPiSettings(repoRoot)
  const configured = settings.packages ?? []
  const roots = [
    repoRoot,
    dirname(repoRoot),
    dirname(dirname(repoRoot)),
    dirname(dirname(dirname(repoRoot))),
  ]
  const candidates = []

  if (options.toolkitPath) candidates.push(resolve(repoRoot, options.toolkitPath))

  for (const packagePath of configured) {
    for (const root of roots) {
      candidates.push(resolve(root, packagePath))
    }
  }

  candidates.push(resolve(repoRoot, "../../marwes-figma-toolkit/figma-node-fetch"))
  candidates.push(
    "/Users/niklaswestman/Documents/extras-projects/marwes-figma-toolkit/figma-node-fetch",
  )

  for (const candidate of [...new Set(candidates)]) {
    if (existsSync(join(candidate, "fetch-figma-node.mjs"))) return candidate
  }

  throw new Error("Could not locate marwes-figma-toolkit/figma-node-fetch")
}

async function readEnvFiles(repoRoot, target) {
  const values = {}

  for (const envFile of target.envFiles) {
    const path = resolve(repoRoot, envFile)
    if (!(await pathExists(path))) continue

    const text = await readFile(path, "utf8")
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue

      const equalsIndex = trimmed.indexOf("=")
      if (equalsIndex === -1) continue

      const key = trimmed.slice(0, equalsIndex).trim()
      let value = trimmed.slice(equalsIndex + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      values[key] = value
    }
  }

  return values
}

async function buildChildEnv(repoRoot, target, mode) {
  if (mode === "cache") return process.env

  const envFileValues = await readEnvFiles(repoRoot, target)
  const token = process.env[target.tokenEnvVar] ?? envFileValues[target.tokenEnvVar]
  if (!token) {
    throw new Error(
      `No Figma token found. Set ${target.tokenEnvVar} in the shell or in ${target.envFiles.join(", ")}.`,
    )
  }

  return {
    ...process.env,
    ...envFileValues,
    [target.tokenEnvVar]: token,
    FIGMA_API_TOKEN: token,
  }
}

async function runFetch({ repoRoot, target, toolkitDir, mode, options }) {
  const args = [join(toolkitDir, "fetch-figma-node.mjs"), "sync", target.figmaFile]
  if (target.complete) args.push("--complete")
  if (mode === "cache") args.push("--cache")

  const env = await buildChildEnv(repoRoot, target, mode)
  log(options, `Running raw Figma ${mode} sync for ${target.fileKey}...`)

  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, args, {
      cwd: toolkitDir,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    })

    let output = ""
    child.stdout.on("data", (chunk) => {
      const text = String(chunk)
      output += text
      if (!options.json) process.stdout.write(text)
    })
    child.stderr.on("data", (chunk) => {
      const text = String(chunk)
      output += text
      if (!options.json) process.stderr.write(text)
    })

    child.on("error", rejectRun)
    child.on("close", (code) => {
      if (code === 0) resolveRun(output.trim())
      else rejectRun(new Error(`Raw sync failed with exit code ${code}\n${output.trim()}`))
    })
  })
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-")
}

function safeName(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._-]+/g, "-")
}

async function readPreservedVariables(target, options) {
  if (!options.preserveVariables) return undefined

  const variablesPath = join(target.liveDir, "tokens", "variables.json")
  if (!(await pathExists(variablesPath))) return undefined

  const text = await readFile(variablesPath, "utf8")
  const parsed = JSON.parse(text)
  if (parsed.fileKey !== target.fileKey) return undefined

  return text
}

async function findCacheDir(target) {
  const cacheRoot = join(homedir(), ".figma-cache")
  const expectedRaw = `${target.fileKey}_full.json`
  const preferredDir = join(cacheRoot, target.projectSlug)

  if (await pathExists(join(preferredDir, "_raw", expectedRaw))) {
    return preferredDir
  }

  const entries = await readdir(cacheRoot, { withFileTypes: true }).catch(() => [])
  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const candidate = join(cacheRoot, entry.name)
    if (await pathExists(join(candidate, "_raw", expectedRaw))) {
      return candidate
    }
  }

  throw new Error(`No cache containing _raw/${expectedRaw} found under ${cacheRoot}`)
}

async function promoteCache({ target, options }) {
  const cacheDir = await findCacheDir(target)
  const cacheManifestPath = join(cacheDir, "manifest.json")
  if (!(await pathExists(cacheManifestPath))) {
    throw new Error(`No cache manifest found at ${cacheManifestPath}`)
  }

  const cacheManifest = await readJson(cacheManifestPath)
  const rawFiles = await readdir(join(cacheDir, "_raw")).catch(() => [])
  const expectedRaw = `${target.fileKey}_full.json`
  if (!rawFiles.includes(expectedRaw)) {
    throw new Error(`Cache exists, but ${expectedRaw} is missing from ${join(cacheDir, "_raw")}`)
  }

  const preservedVariables = await readPreservedVariables(target, options)
  const liveManifestPath = join(target.liveDir, "manifest.json")
  const liveManifest = (await pathExists(liveManifestPath))
    ? await readJson(liveManifestPath)
    : undefined

  await mkdir(dirname(target.liveDir), { recursive: true })
  await mkdir(target.archiveDir, { recursive: true })

  let archivedTo
  if (await pathExists(target.liveDir)) {
    archivedTo = join(
      target.archiveDir,
      `${timestamp()}-${safeName(liveManifest?.fileKey ?? basename(target.liveDir))}`,
    )
    await rm(archivedTo, { recursive: true, force: true })
    await cp(target.liveDir, archivedTo, { recursive: true })
    await rm(target.liveDir, { recursive: true, force: true })
  }

  await cp(cacheDir, target.liveDir, { recursive: true })

  if (preservedVariables) {
    await writeFile(join(target.liveDir, "tokens", "variables.json"), preservedVariables)
  }

  return {
    archivedTo,
    liveDir: target.liveDir,
    manifest: cacheManifest,
    preservedVariables: Boolean(preservedVariables),
  }
}

async function main(argv) {
  const options = parseArgs(argv)
  if (options.help) {
    console.log(usage())
    return
  }

  const repoRoot = process.cwd()
  const target = await readTarget(repoRoot, options)
  const toolkitDir = await findToolkit(repoRoot, options)

  await runFetch({ repoRoot, target, toolkitDir, mode: options.mode, options })
  const promoted = await promoteCache({ target, options })

  const summary = {
    success: true,
    mode: options.mode,
    target: target.name,
    fileKey: target.fileKey,
    liveDir: target.liveDir,
    archivedTo: promoted.archivedTo,
    preservedVariables: promoted.preservedVariables,
    syncedAt: promoted.manifest?.syncedAt,
    totalNodes: promoted.manifest?.totalNodes,
    pageCount: promoted.manifest?.pageCount,
    componentCount: promoted.manifest?.componentCount,
  }

  if (options.json) console.log(JSON.stringify(summary, null, 2))
  else {
    console.log("")
    console.log(`Promoted raw Figma sync for ${target.fileKey}.`)
    console.log(`Live dir: ${target.liveDir}`)
    if (promoted.archivedTo) console.log(`Archived previous live copy: ${promoted.archivedTo}`)
    console.log(`Preserved variables.json: ${promoted.preservedVariables ? "yes" : "no"}`)
  }
}

const cliArgs = process.argv.slice(2).filter((arg) => arg !== "--")

main(cliArgs).catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  if (cliArgs.includes("--json"))
    console.log(JSON.stringify({ success: false, error: message }, null, 2))
  else console.error(message)
  process.exit(1)
})
