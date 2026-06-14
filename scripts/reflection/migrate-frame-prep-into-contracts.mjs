#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = fileURLToPath(new URL("../../", import.meta.url))
const defaultFamiliesRoot = "packages/design-governance/reflection-families"
const modes = ["light", "dark"]

function usage() {
  return [
    "Usage:",
    "  pnpm governance:migrate-contracts -- --dry-run",
    "  pnpm governance:migrate-contracts -- --write",
    "  pnpm governance:migrate-contracts -- --family select --write",
    "",
    "Options:",
    "  --root <path>       Reflection families root. Defaults to packages/design-governance/reflection-families.",
    "  --family <name>     Migrate one frame-prep family. Can be repeated.",
    "  --write             Write changed reflection-contract.json files. Default is dry-run.",
    "  --dry-run           Preview changes without writing.",
    "  --json              Print machine-readable JSON.",
    "  --help              Show help.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    root: defaultFamiliesRoot,
    families: [],
    write: false,
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

    if (arg === "--" || arg === "--dry-run") continue
    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--root") options.root = readValue()
    else if (arg === "--family") options.families.push(readValue())
    else if (arg === "--write") options.write = true
    else if (arg === "--json") options.json = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function absolute(path) {
  return resolve(repoRoot, path)
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value))
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map((item) => stableValue(item))
  if (!value || typeof value !== "object") return value

  return Object.keys(value)
    .sort((left, right) => left.localeCompare(right))
    .reduce((output, key) => {
      const child = value[key]
      if (child !== undefined) output[key] = stableValue(child)
      return output
    }, {})
}

function listFramePrepPaths(root, options) {
  const absoluteRoot = absolute(root)
  const familyFilter = new Set(options.families)
  return readdirSync(absoluteRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((family) => familyFilter.size === 0 || familyFilter.has(family))
    .map((family) => join(absoluteRoot, family, "frame-prep.json"))
    .filter((path) => existsSync(path))
    .sort((left, right) => left.localeCompare(right))
}

function listContracts(root) {
  const absoluteRoot = absolute(root)
  return readdirSync(absoluteRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const path = join(absoluteRoot, entry.name, "reflection-contract.json")
      if (!existsSync(path)) return undefined
      return {
        family: entry.name,
        path,
        contract: readJson(path),
      }
    })
    .filter(Boolean)
}

function buildContractCaseIndex(contracts) {
  const index = new Map()
  for (const contractEntry of contracts) {
    for (const caseEntry of contractEntry.contract.cases ?? []) {
      const key = `${caseEntry.caseId}:${caseEntry.mode}`
      if (!index.has(key)) index.set(key, [])
      index.get(key).push({ ...contractEntry, caseEntry })
    }
  }
  return index
}

function mergeSelector(caseSelector, modeEntry) {
  const selector = { ...(caseSelector ?? {}), ...(modeEntry.selector ?? {}) }
  if (modeEntry.sourceNodeId) selector.sourceNodeId = modeEntry.sourceNodeId
  return selector
}

function buildPrep({ manifest, prepCase, mode, modeEntry }) {
  const prep = {
    outputPage: manifest.outputPage ?? "Reflection Baselines",
    sourceFrameId: modeEntry.sourceFrameId,
    sourceFrameUrl: modeEntry.sourceFrameUrl,
    outputFrameName: modeEntry.outputFrameName,
    selector: mergeSelector(prepCase.selector, modeEntry),
    framing: modeEntry.framing ?? prepCase.framing,
  }

  if (modeEntry.sourceNodeId) prep.sourceNodeId = modeEntry.sourceNodeId
  if (modeEntry.sourceNodeUrl) prep.sourceNodeUrl = modeEntry.sourceNodeUrl

  if (!prep.framing) {
    prep.framing = {
      background: mode === "dark" ? "#0f0f0f" : "#ffffff",
      align: "center",
      padding: 0,
    }
  }

  return prep
}

function findContractCase(caseIndex, caseId, mode) {
  const matches = caseIndex.get(`${caseId}:${mode}`) ?? []
  if (matches.length === 1) return matches[0]
  return undefined
}

function migrate(options) {
  const framePrepPaths = listFramePrepPaths(options.root, options)
  const contracts = listContracts(options.root)
  const caseIndex = buildContractCaseIndex(contracts)
  const changedContracts = new Map()
  const results = []

  for (const framePrepPath of framePrepPaths) {
    const manifest = readJson(framePrepPath)
    for (const prepCase of manifest.cases ?? []) {
      for (const mode of modes) {
        const modeEntry = prepCase.modes?.[mode]
        if (!modeEntry) continue

        const target = findContractCase(caseIndex, prepCase.caseId, mode)
        if (!target) {
          results.push({
            status: "missing-contract-case",
            framePrepPath,
            caseId: prepCase.caseId,
            mode,
          })
          continue
        }

        const nextPrep = buildPrep({ manifest, prepCase, mode, modeEntry })
        const previousPrep = target.caseEntry.prep
        const changed = stableStringify(previousPrep) !== stableStringify(nextPrep)
        if (changed) {
          target.caseEntry.prep = nextPrep
          changedContracts.set(target.path, target.contract)
        }

        results.push({
          status: changed ? "changed" : "unchanged",
          framePrepPath,
          contractPath: target.path,
          caseId: prepCase.caseId,
          mode,
          outputFrameName: nextPrep.outputFrameName,
        })
      }
    }
  }

  if (options.write) {
    for (const [path, contract] of changedContracts) {
      writeJson(path, contract)
    }
  }

  return {
    write: options.write,
    framePrepFiles: framePrepPaths.length,
    changedContracts: changedContracts.size,
    changedCases: results.filter((entry) => entry.status === "changed").length,
    missingContractCases: results.filter((entry) => entry.status === "missing-contract-case")
      .length,
    results,
  }
}

try {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(usage())
    process.exit(0)
  }

  const result = migrate(options)
  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log(`Frame prep contract migration ${options.write ? "write" : "dry-run"}`)
    console.log(`Frame prep files: ${result.framePrepFiles}`)
    console.log(`Changed contracts: ${result.changedContracts}`)
    console.log(`Changed cases: ${result.changedCases}`)
    console.log(`Missing contract cases: ${result.missingContractCases}`)
    console.log("")
    console.log("Legacy frame-prep.json files are retained for the migration window.")
    if (!options.write) console.log("Re-run with --write to update reflection-contract.json files.")
  }

  if (result.missingContractCases > 0) process.exitCode = 1
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
