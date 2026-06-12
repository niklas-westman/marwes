#!/usr/bin/env node

import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { copyFile, mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = fileURLToPath(new URL("../../", import.meta.url))
const defaultReflectionFamiliesRoot = "packages/design-governance/reflection-families"
const defaultProject = "marwes"
const figmaNodeIdPattern = /^\d+:\d+$/

function usage() {
  return [
    "Usage:",
    "  node scripts/reflection/export-figma-baselines.mjs --family button --dry-run",
    "  node scripts/reflection/export-figma-baselines.mjs --family button",
    "",
    "Options:",
    "  --family <name>       Export one family from the manifest.",
    "  --case <caseId>       Export one case from the manifest.",
    "  --manifest <path>     Reflection family contract. Defaults to packages/design-governance/reflection-families/<family>/reflection-contract.json.",
    "  --project <name>      figma-node-fetch project name. Defaults to marwes.",
    "  --toolkit <path>      Path to marwes-figma-toolkit/figma-node-fetch.",
    "  --dry-run            Print planned exports without calling Figma or writing PNGs.",
    "  --help               Show help.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    family: undefined,
    caseId: undefined,
    manifestPath: undefined,
    project: undefined,
    toolkitPath: undefined,
    dryRun: false,
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
    else if (arg === "--family") options.family = readValue()
    else if (arg === "--case") options.caseId = readValue()
    else if (arg === "--manifest") options.manifestPath = readValue()
    else if (arg === "--project") options.project = readValue()
    else if (arg === "--toolkit") options.toolkitPath = readValue()
    else if (arg === "--dry-run") options.dryRun = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function resolveManifestPath(options) {
  if (options.manifestPath) return resolve(repoRoot, options.manifestPath)

  const family = options.family ?? "button"
  return resolve(repoRoot, defaultReflectionFamiliesRoot, family, "reflection-contract.json")
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

async function readPiSettings() {
  const path = resolve(repoRoot, ".pi/settings.json")
  if (!(await pathExists(path))) return {}
  return readJson(path)
}

async function findToolkit(options) {
  const settings = await readPiSettings()
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

async function readEnvFile(path) {
  if (!(await pathExists(path))) return {}

  const values = {}
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
  return values
}

async function buildChildEnv() {
  const envFileValues = await readEnvFile(resolve(repoRoot, ".env.local"))
  const token = process.env.FIGMA_API_TOKEN ?? envFileValues.FIGMA_API_TOKEN
  if (!token) {
    throw new Error("No Figma token found. Set FIGMA_API_TOKEN in the shell or .env.local.")
  }

  return {
    ...process.env,
    ...envFileValues,
    FIGMA_API_TOKEN: token,
  }
}

function selectCases(manifest, options) {
  let cases = (manifest.cases ?? []).map((entry) => ({
    ...entry,
    family: entry.family ?? manifest.family,
    figmaFileKey: entry.figmaFileKey ?? manifest.figmaFileKey,
  }))

  if (options.family) cases = cases.filter((entry) => entry.family === options.family)
  if (options.caseId) cases = cases.filter((entry) => entry.caseId === options.caseId)
  return cases
}

function validateEntry(entry) {
  const issues = []

  for (const key of [
    "caseId",
    "family",
    "mode",
    "figmaFileKey",
    "figmaNodeId",
    "baseline",
    "viewport",
  ]) {
    if (!entry[key] || typeof entry[key] !== "string") issues.push(`${key} must be a string`)
  }

  if (!figmaNodeIdPattern.test(entry.figmaNodeId ?? "")) {
    issues.push(
      "figmaNodeId must be a top-level Figma frame node id in colon format, for example 123:456",
    )
  }

  if (entry.exportScale !== 1) issues.push("exportScale must be 1")

  if (
    !entry.viewportSize ||
    !Number.isInteger(entry.viewportSize.width) ||
    !Number.isInteger(entry.viewportSize.height) ||
    entry.viewportSize.width <= 0 ||
    entry.viewportSize.height <= 0
  ) {
    issues.push("viewportSize must contain positive integer width and height")
  }

  if (entry.framing) {
    if (
      entry.framing.rootSelector !== undefined &&
      typeof entry.framing.rootSelector !== "string"
    ) {
      issues.push("framing.rootSelector must be a string")
    }

    if (entry.framing.background !== undefined && typeof entry.framing.background !== "string") {
      issues.push("framing.background must be a string")
    }

    if (
      entry.framing.align !== undefined &&
      entry.framing.align !== "center" &&
      entry.framing.align !== "start"
    ) {
      issues.push("framing.align must be center or start")
    }

    if (
      entry.framing.padding !== undefined &&
      (!Number.isInteger(entry.framing.padding) || entry.framing.padding < 0)
    ) {
      issues.push("framing.padding must be a non-negative integer")
    }
  }

  return issues
}

function readPngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex")
  if (signature !== "89504e470d0a1a0a") {
    throw new Error("Exported file is not a PNG")
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

function resolveInside(root, relativePath) {
  const resolvedRoot = resolve(root)
  const resolvedPath = resolve(resolvedRoot, relativePath)
  const rootPrefix = resolvedRoot.endsWith(sep) ? resolvedRoot : `${resolvedRoot}${sep}`
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(rootPrefix)) {
    throw new Error(`Refusing to write outside baseline root: ${relativePath}`)
  }
  return resolvedPath
}

function printPlan({ manifestPath, baselineRoot, cases, invalid }) {
  console.log(`Manifest: ${manifestPath}`)
  console.log(`Baseline root: ${baselineRoot}`)
  console.log(`Selected cases: ${cases.length}`)

  for (const entry of cases) {
    const issues = invalid.get(entry.caseId) ?? []
    const status = issues.length > 0 ? "blocked" : "ready"
    console.log(
      `[${status}] ${entry.caseId} ${entry.figmaFrameName ?? entry.figmaNodeId} -> ${entry.baseline} (${entry.viewportSize?.width}x${entry.viewportSize?.height}, ${entry.framing?.background ?? "transparent"}, ${entry.framing?.align ?? "center"})`,
    )
    for (const issue of issues) {
      console.log(`  - ${issue}`)
    }
  }
}

async function runFigmaExport({ toolkitDir, project, nodeIds, outDir }) {
  const env = await buildChildEnv()
  const fetchScript = join(toolkitDir, "fetch-figma-node.mjs")
  const args = [
    fetchScript,
    "images",
    project,
    "--node-id",
    nodeIds.join(","),
    "--scale",
    "1",
    "--out-dir",
    outDir,
  ]

  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, args, {
      cwd: toolkitDir,
      env,
      stdio: "inherit",
    })

    child.on("error", rejectRun)
    child.on("close", (code) => {
      if (code === 0) resolveRun()
      else rejectRun(new Error(`figma-node-fetch images failed with exit code ${code}`))
    })
  })
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(usage())
    return
  }

  const manifestPath = resolveManifestPath(options)
  const manifest = await readJson(manifestPath)
  const baselineRoot = resolve(
    repoRoot,
    manifest.baselineRoot ??
      `${defaultReflectionFamiliesRoot}/${manifest.family ?? options.family ?? "button"}/baselines`,
  )
  const cases = selectCases(manifest, options)

  if (cases.length === 0) {
    throw new Error("No manifest cases matched the selected filters.")
  }

  const invalid = new Map()
  for (const entry of cases) {
    const issues = validateEntry(entry)
    if (issues.length > 0) invalid.set(entry.caseId, issues)
  }

  printPlan({ manifestPath, baselineRoot, cases, invalid })

  if (options.dryRun) {
    console.log("Dry run only. No Figma API call was made and no files were written.")
    return
  }

  if (invalid.size > 0) {
    throw new Error(
      "Cannot export baselines until every selected manifest entry has a valid Figma frame node id and viewport metadata.",
    )
  }

  const fileKeys = [...new Set(cases.map((entry) => entry.figmaFileKey))]
  if (fileKeys.length !== 1) {
    throw new Error(`Selected cases reference multiple Figma files: ${fileKeys.join(", ")}`)
  }

  const toolkitDir = await findToolkit(options)
  const outDir = await mkdtemp(join(tmpdir(), "marwes-reflection-figma-"))
  try {
    await runFigmaExport({
      toolkitDir,
      project: options.project ?? manifest.figmaProject ?? defaultProject,
      nodeIds: cases.map((entry) => entry.figmaNodeId),
      outDir,
    })

    for (const entry of cases) {
      const exportedPath = join(
        outDir,
        `${entry.figmaFileKey}_${entry.figmaNodeId.replace(/:/g, "-")}.png`,
      )
      if (!(await pathExists(exportedPath))) {
        throw new Error(
          `Figma export did not produce expected PNG for ${entry.caseId}: ${exportedPath}`,
        )
      }

      const buffer = await readFile(exportedPath)
      const dimensions = readPngDimensions(buffer)
      if (
        dimensions.width !== entry.viewportSize.width ||
        dimensions.height !== entry.viewportSize.height
      ) {
        throw new Error(
          `${entry.caseId} exported ${dimensions.width}x${dimensions.height}, expected ${entry.viewportSize.width}x${entry.viewportSize.height}. Resize the Figma frame or update viewportSize before committing the baseline.`,
        )
      }

      const destination = resolveInside(baselineRoot, entry.baseline)
      await mkdir(dirname(destination), { recursive: true })
      await copyFile(exportedPath, destination)
      console.log(`[written] ${entry.caseId} -> ${destination}`)
    }
  } finally {
    await rm(outDir, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
