#!/usr/bin/env node

import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import {
  buildBaselineReceipt,
  compareReceipt,
  defaultReflectionFamiliesRoot,
  loadDesignSource,
  loadReflectionContracts,
  readJsonFile,
  receiptPathForBaselinePath,
  resolveBaselinePath,
  stableStringify,
  writeBaselineReceipt,
} from "../../packages/design-governance/src/baseline-receipts.mjs"

const repoRoot = fileURLToPath(new URL("../../", import.meta.url))

function usage() {
  return [
    "Usage:",
    "  pnpm reflection:figma:receipts -- --all --dry-run",
    "  pnpm reflection:figma:receipts -- --all --write",
    "  pnpm reflection:figma:receipts -- --family card --write",
    "",
    "Options:",
    "  --all              Include every reflection family contract.",
    "  --family <name>    Include one family. Can be repeated.",
    "  --case <caseId>    Include one case id.",
    "  --write            Write or update receipt sidecars. Default is dry-run.",
    "  --dry-run          Validate and print planned receipt changes.",
    "  --json             Print machine-readable JSON.",
    "  --help             Show help.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    all: false,
    families: [],
    caseId: undefined,
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

    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--all") options.all = true
    else if (arg === "--family") options.families.push(readValue())
    else if (arg === "--case") options.caseId = readValue()
    else if (arg === "--write") options.write = true
    else if (arg === "--dry-run") options.write = false
    else if (arg === "--json") options.json = true
    else if (arg === "--") continue
    else throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.help && !options.all && options.families.length === 0) {
    throw new Error("Choose --all or --family <name>.")
  }

  return options
}

function selectContracts(options) {
  const familyFilter = new Set(options.families)
  return loadReflectionContracts(repoRoot, defaultReflectionFamiliesRoot).filter(
    (entry) => options.all || familyFilter.has(entry.family),
  )
}

function selectCases(contract, options) {
  return (contract.cases ?? []).filter(
    (entry) => !options.caseId || entry.caseId === options.caseId,
  )
}

function classifyExistingReceipt({ context, contract, caseEntry, pngPath, receiptPath }) {
  if (!existsSync(receiptPath)) return { status: "missing", issues: [] }

  let existing
  try {
    existing = readJsonFile(receiptPath)
  } catch (error) {
    return { status: "invalid", issues: [`invalid JSON: ${error.message}`] }
  }

  const expected = buildBaselineReceipt({
    repoRoot,
    contract,
    caseEntry,
    rawSource: context.rawSource,
    variableSource: context.variableSource,
    pngPath,
    origin: existing.origin,
    createdAt: existing.createdAt,
  })
  const issues = compareReceipt(existing, expected)
  return {
    status: issues.length === 0 ? "up-to-date" : "stale",
    issues,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    console.log(usage())
    return
  }

  const contracts = selectContracts(options)
  if (contracts.length === 0) {
    throw new Error("No reflection contracts matched the requested selection.")
  }

  const context = loadDesignSource(repoRoot)
  const results = []

  for (const { family, contract } of contracts) {
    for (const caseEntry of selectCases(contract, options)) {
      const pngPath = resolveBaselinePath(repoRoot, contract, caseEntry)
      const receiptPath = receiptPathForBaselinePath(pngPath)

      if (!existsSync(pngPath)) {
        results.push({
          family,
          caseId: caseEntry.caseId,
          mode: caseEntry.mode,
          status: "missing-png",
          baseline: pngPath,
          receipt: receiptPath,
          issues: [`missing baseline PNG: ${pngPath}`],
        })
        continue
      }

      const current = classifyExistingReceipt({
        context,
        contract,
        caseEntry,
        pngPath,
        receiptPath,
      })

      let written = false
      if (options.write) {
        const writeResult = await writeBaselineReceipt({
          repoRoot,
          contract,
          caseEntry,
          context,
          pngPath,
          origin: "receipt-backfill",
        })
        written = writeResult.changed
      }

      results.push({
        family,
        caseId: caseEntry.caseId,
        mode: caseEntry.mode,
        status: current.status,
        baseline: pngPath,
        receipt: receiptPath,
        issues: current.issues,
        written,
      })
    }
  }

  const failures = results.filter(
    (entry) => entry.status === "missing-png" || entry.status === "invalid",
  )

  if (options.json) {
    console.log(
      stableStringify({
        write: options.write,
        source: {
          target: context.target.name,
          rawFile: context.rawFile,
          variableMap: context.variableMapPath,
        },
        results,
        failures: failures.length,
      }),
    )
  } else {
    console.log(`Baseline receipt ${options.write ? "write" : "dry-run"}`)
    console.log(`Source: ${context.target.name}`)
    console.log(`Raw file: ${context.rawFile}`)
    console.log(`Variables: ${context.variableMapPath}`)
    console.log("")

    for (const entry of results) {
      const action = options.write && entry.written ? "written" : entry.status
      console.log(`[${action}] ${entry.family} ${entry.caseId} ${entry.mode}`)
      console.log(`       png: ${entry.baseline}`)
      console.log(`       meta: ${entry.receipt}`)
      for (const issue of entry.issues ?? []) console.log(`       ${issue}`)
    }

    console.log("")
    console.log(`Receipts checked: ${results.length}`)
    if (options.write) {
      console.log(`Receipts written: ${results.filter((entry) => entry.written).length}`)
    }
    console.log(`Failures: ${failures.length}`)
  }

  if (failures.length > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
