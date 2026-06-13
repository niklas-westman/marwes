#!/usr/bin/env node

import { existsSync } from "node:fs"
import { copyFile, mkdir, readFile, readdir, stat } from "node:fs/promises"
import { basename, dirname, isAbsolute, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = fileURLToPath(new URL("../../", import.meta.url))
const defaultRenameMap =
  "packages/design-governance/reflection-families/pending-figma-frame-renames.json"
const defaultOutputRoot = "packages/design-governance/reflection-families/_incoming"
const defaultActiveOutputRoot = "packages/design-governance/reflection-families"
const modes = ["light", "dark"]
const outputTargets = ["incoming", "active"]

function usage() {
  return [
    "Usage:",
    "  pnpm reflection:figma:sort -- --source /path/to/component-reflection-experiment/v3",
    "  pnpm reflection:figma:sort -- --source /path/to/component-reflection-experiment/v3 --write",
    "  pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3 --target active --family badge --write",
    "",
    "Options:",
    "  --source <path>      Folder containing light-marwes-reflection/ and dark-marwes-reflection/.",
    "  --map <path>         Pending frame rename map. Defaults to packages/design-governance/reflection-families/pending-figma-frame-renames.json.",
    "  --target <target>    Output target: incoming or active. Defaults to incoming.",
    "  --out-root <path>    Output root override. Incoming defaults to _incoming/<source-folder-name>; active defaults to reflection-families/.",
    "  --family <name>      Sort one family from the map.",
    "  --case <caseId>      Sort one case from the map.",
    "  --allow-unused       Do not fail on exported PNGs outside the selected mapping.",
    "  --dry-run           Validate and print the mapping without copying files. This is the default.",
    "  --write             Copy files. Without this, only validate and print the mapping.",
    "  --force             Allow overwriting files when used with --write.",
    "  --help              Show help.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    source: undefined,
    map: defaultRenameMap,
    target: "incoming",
    outRoot: undefined,
    family: undefined,
    caseId: undefined,
    allowUnused: false,
    write: false,
    force: false,
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

    if (arg === "--") continue
    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--source") options.source = readValue()
    else if (arg === "--map") options.map = readValue()
    else if (arg === "--target") options.target = readValue()
    else if (arg === "--active") options.target = "active"
    else if (arg === "--out-root") options.outRoot = readValue()
    else if (arg === "--family") options.family = readValue()
    else if (arg === "--case") options.caseId = readValue()
    else if (arg === "--allow-unused") options.allowUnused = true
    else if (arg === "--dry-run") options.write = false
    else if (arg === "--write") options.write = true
    else if (arg === "--force") options.force = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  if (!outputTargets.includes(options.target)) {
    throw new Error(`--target must be one of: ${outputTargets.join(", ")}`)
  }

  return options
}

function resolvePath(path) {
  return isAbsolute(path) ? path : resolve(repoRoot, path)
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

async function listPngs(folder) {
  const entries = await readdir(folder, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
}

function sourceFileName(currentName, index) {
  return index === 0 ? `${currentName}.png` : `${currentName}-${index}.png`
}

function caseSlug(family, caseId) {
  const prefix = `${family}.`
  const withoutFamily = caseId.startsWith(prefix) ? caseId.slice(prefix.length) : caseId
  return withoutFamily.replaceAll(".", "-")
}

function readPngSize(bytes) {
  const pngSignature = "89504e470d0a1a0a"
  if (bytes.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error("not a PNG")
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  }
}

function selectedFamilies(renameMap, options) {
  const selected = []
  for (const [family, cases] of Object.entries(renameMap.families ?? {})) {
    if (options.family && family !== options.family) continue

    const filteredCases = cases.filter(
      (entry) => !options.caseId || entry.caseId === options.caseId,
    )
    if (filteredCases.length === 0) continue

    selected.push([family, filteredCases])
  }
  return selected
}

function buildMapping(renameMap, options) {
  const mapping = []
  const counters = new Map()

  for (const [family, cases] of selectedFamilies(renameMap, options)) {
    for (const entry of cases) {
      for (const mode of modes) {
        const frame = entry.requiredFrameNames?.[mode]
        if (!frame) continue

        const counterKey = `${mode}:${frame.currentName}`
        const index = counters.get(counterKey) ?? 0
        counters.set(counterKey, index + 1)

        const sourceName = sourceFileName(frame.currentName, index)
        const slug = caseSlug(family, entry.caseId)
        const targetName = `${slug}.chromium-linux.${mode}.png`

        mapping.push({
          family,
          caseId: entry.caseId,
          mode,
          figmaNodeId: frame.figmaNodeId,
          currentName: frame.currentName,
          requiredName: frame.requiredName,
          sourceName,
          targetName,
          viewportSize: entry.viewportSize ?? renameMap.viewportSize,
        })
      }
    }
  }

  return mapping
}

async function validateAndMaybeCopy(mapping, options) {
  const sourceRoot = resolvePath(options.source)
  const defaultRoot =
    options.target === "active"
      ? defaultActiveOutputRoot
      : join(defaultOutputRoot, basename(sourceRoot))
  const outRoot = resolvePath(options.outRoot ?? defaultRoot)

  const availableByMode = new Map()
  for (const mode of modes) {
    const folder = join(sourceRoot, `${mode}-marwes-reflection`)
    if (!(await pathExists(folder))) throw new Error(`Missing source folder: ${folder}`)
    availableByMode.set(mode, new Set(await listPngs(folder)))
  }

  const used = new Map(modes.map((mode) => [mode, new Set()]))
  const issues = []
  let copied = 0
  const allowUnused = options.allowUnused || Boolean(options.family || options.caseId)

  for (const item of mapping) {
    const sourceFolder = join(sourceRoot, `${item.mode}-marwes-reflection`)
    const sourcePath = join(sourceFolder, item.sourceName)
    const targetPath = join(outRoot, item.family, "baselines", item.targetName)
    const available = availableByMode.get(item.mode)

    if (!available?.has(item.sourceName)) {
      issues.push(`[missing] ${item.mode} ${item.currentName} -> ${item.sourceName}`)
      continue
    }

    used.get(item.mode)?.add(item.sourceName)

    try {
      const size = readPngSize(await readFile(sourcePath))
      const expected = item.viewportSize
      if (size.width !== expected.width || size.height !== expected.height) {
        issues.push(
          `[size] ${sourcePath}: ${size.width}x${size.height}, expected ${expected.width}x${expected.height}`,
        )
      }
    } catch (error) {
      issues.push(`[png] ${sourcePath}: ${error.message}`)
    }

    const action = options.write ? "copy" : "map"
    console.log(
      `[${action}:${options.target}] ${item.mode} ${item.sourceName} -> ${targetPath} (${item.requiredName})`,
    )

    if (options.write) {
      if (existsSync(targetPath) && !options.force) {
        issues.push(`[exists] ${targetPath} already exists; pass --force to overwrite`)
        continue
      }

      await mkdir(dirname(targetPath), { recursive: true })
      await copyFile(sourcePath, targetPath)
      copied += 1
    }
  }

  if (!allowUnused) {
    for (const [mode, files] of availableByMode) {
      for (const file of files) {
        if (!used.get(mode)?.has(file)) issues.push(`[unused] ${mode} ${file}`)
      }
    }
  }

  return {
    outRoot,
    mapped: mapping.length,
    copied,
    issues,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    console.log(usage())
    return
  }

  if (!options.source) {
    throw new Error(`Missing --source.\n\n${usage()}`)
  }

  const renameMapPath = resolvePath(options.map)
  const renameMap = await readJson(renameMapPath)
  const mapping = buildMapping(renameMap, options)

  if (mapping.length === 0) {
    throw new Error("No frames matched the requested family/case filters.")
  }

  const result = await validateAndMaybeCopy(mapping, options)

  console.log("")
  console.log(`Output target: ${options.target}`)
  console.log(`Output root: ${result.outRoot}`)
  console.log(`Mapped PNGs: ${result.mapped}`)
  if (options.write) console.log(`Copied PNGs: ${result.copied}`)
  console.log(`Issues: ${result.issues.length}`)

  if (result.issues.length > 0) {
    console.log("")
    for (const issue of result.issues) console.log(issue)
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
