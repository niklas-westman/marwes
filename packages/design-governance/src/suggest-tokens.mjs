/**
 * Suggest figmaTokens for a registry family based on actual Figma bound variables.
 *
 * Usage:
 *   node src/suggest-tokens.mjs --family card
 *
 * Outputs the color-relevant tokens bound to the family's node references,
 * filtered to exclude generic spacing/font/size tokens.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import process from "node:process"

const repoRoot = process.cwd()
const registryRoot = "docs/registry/families"

const args = process.argv.slice(2).filter((arg) => arg !== "--")
const family = readOption("--family")

function readOption(name) {
  const index = args.indexOf(name)
  if (index === -1) return undefined
  return args[index + 1]
}

function absolute(path) {
  return join(repoRoot, path)
}

function readJson(path) {
  return JSON.parse(readFileSync(absolute(path), "utf8"))
}

function normalizeTokenName(name) {
  return name
    .replace(/\\/g, "/")
    .replace(/\s*\/\s*/g, "/")
    .trim()
    .toLowerCase()
}

function loadVariableMap(variableMapPath) {
  const source = readJson(variableMapPath)
  const variables = Array.isArray(source.variables)
    ? source.variables
    : Object.values(source.variables ?? source)
  const map = new Map()

  for (const variable of variables) {
    if (!variable || typeof variable !== "object") continue
    const id = variable.id ?? variable.variableId ?? variable.key
    const name = variable.name ?? variable.path ?? variable.token ?? variable.tokenName
    if (typeof id !== "string" || typeof name !== "string") continue
    map.set(id, { id, name, normalizedName: normalizeTokenName(name), raw: variable })
  }

  return map
}

function collectBoundVariableIds(rawSource, nodeIds) {
  const targetIds = new Set(nodeIds)
  const variableIds = new Set()

  function collectIds(boundVariables) {
    for (const val of Object.values(boundVariables)) {
      const entries = Array.isArray(val) ? val : [val]
      for (const entry of entries) {
        if (entry && typeof entry === "object" && entry.id) {
          variableIds.add(entry.id)
        }
      }
    }
  }

  function walk(node, insideTarget = false) {
    if (!node || typeof node !== "object") return
    const isInside = insideTarget || targetIds.has(node.id)
    if (isInside && node.boundVariables) {
      collectIds(node.boundVariables)
    }
    for (const child of node.children ?? []) {
      walk(child, isInside)
    }
  }

  walk(rawSource.document ?? rawSource)
  return variableIds
}

const GENERIC_PREFIXES = ["font/", "sp-", "size", "color"]

function isColorToken(normalizedName) {
  return (
    !GENERIC_PREFIXES.some((prefix) => normalizedName.startsWith(prefix)) &&
    normalizedName !== "size" &&
    normalizedName !== "color"
  )
}

function main() {
  if (!family) {
    console.error("Usage: node src/suggest-tokens.mjs --family <family>")
    process.exit(1)
  }

  const registryPath = `${registryRoot}/${family}/registry.generated.json`
  if (!existsSync(absolute(registryPath))) {
    console.error(`Registry not found: ${registryPath}`)
    process.exit(1)
  }

  const registry = readJson(registryPath)
  const nodeIds = Object.values(registry.design?.nodeReferences ?? {})

  if (nodeIds.length === 0) {
    console.log(`No node references for family: ${family}`)
    process.exit(0)
  }

  // Find raw file
  const targetConfigPath = ".pi/figma-sync.json"
  const config = readJson(targetConfigPath)
  const targetName = config.target ?? "marwes"
  const liveDir = `.figma/${targetName}`
  const variableMapPath = `${liveDir}/tokens/variables.json`
  const rawDir = `${liveDir}/_raw`

  if (!existsSync(absolute(variableMapPath))) {
    console.error(`Missing: ${variableMapPath}. Run: pnpm design:sync`)
    process.exit(1)
  }

  // Find raw JSON file
  const rawEntries = readdirSync(absolute(rawDir))
  const rawJsonFile = rawEntries.find((f) => f.endsWith("_full.json"))

  if (!rawJsonFile) {
    console.error(`No raw Figma JSON found in ${rawDir}`)
    process.exit(1)
  }

  const rawSource = readJson(`${rawDir}/${rawJsonFile}`)
  const variableMap = loadVariableMap(variableMapPath)
  const boundIds = collectBoundVariableIds(rawSource, nodeIds)

  const tokens = [...boundIds]
    .map((id) => variableMap.get(id))
    .filter(Boolean)
    .map((v) => v.normalizedName)
  const unique = [...new Set(tokens)].filter(isColorToken).sort()

  const currentTokens = (registry.design?.figmaTokens ?? []).map(normalizeTokenName)

  console.log(`\nFamily: ${family}`)
  console.log(`Node references: ${nodeIds.length}`)
  console.log(`Bound color tokens (${unique.length}):`)
  console.log("")

  for (const token of unique) {
    const inRegistry = currentTokens.includes(token)
    console.log(`  ${inRegistry ? "✓" : "+"} ${token}`)
  }

  if (currentTokens.length > 0) {
    const stale = currentTokens.filter((t) => !unique.includes(t))
    if (stale.length > 0) {
      console.log("")
      console.log("Stale registry tokens (not bound in Figma):")
      for (const token of stale) {
        console.log(`  ✗ ${token}`)
      }
    }
  }

  console.log("")
  console.log("Suggested figmaTokens array:")
  console.log(`  figmaTokens: ${JSON.stringify(unique)},`)
}

main()
