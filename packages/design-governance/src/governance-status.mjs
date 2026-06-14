#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  findNodeById,
  loadDesignSource,
  loadReflectionContracts,
  readPngInfo,
  resolveBaselinePath,
  sourceNodeIdsForCase,
  stableStringify,
  validateBaselineReceipt,
} from "./baseline-receipts.mjs"
import { validateGeneratedFrameProvenance } from "./generated-frame-provenance.mjs"

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url))
const adapters = ["react", "vue", "svelte"]
const portalEntries = {
  react: "tests/reflection/react-portal.tsx",
  vue: "tests/reflection/vue-portal.ts",
  svelte: "tests/reflection/svelte-portal-case.svelte",
}

function usage() {
  return [
    "Usage:",
    "  pnpm governance:status",
    "  pnpm governance:status -- --family badge",
    "  pnpm governance:status -- --json",
    "",
    "Options:",
    "  --all            Include every reflection family. Default.",
    "  --family <name>  Include one family. Can be repeated.",
    "  --json           Print machine-readable JSON.",
    "  --help           Show help.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    families: [],
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

    if (arg === "--" || arg === "--all") continue
    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--family") options.families.push(readValue())
    else if (arg === "--json") options.json = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function absolute(path) {
  return resolve(repoRoot, path)
}

function pathExists(path) {
  return existsSync(absolute(path))
}

function readText(path) {
  return readFileSync(absolute(path), "utf8")
}

function readJson(path) {
  return JSON.parse(readText(path))
}

function readPortalSources() {
  return Object.fromEntries(
    Object.entries(portalEntries).map(([adapter, path]) => [
      adapter,
      pathExists(path) ? readText(path) : "",
    ]),
  )
}

function caseBelongsToFamily(contract, caseEntry, family) {
  return (
    contract.family === family ||
    caseEntry.caseId?.startsWith(`${family}.`) ||
    caseEntry.portalPath?.startsWith(`/reflection/${family}/`)
  )
}

function selectCaseEntries(contract, options) {
  if (options.families.length === 0) return contract.cases ?? []
  return (contract.cases ?? []).filter((caseEntry) =>
    options.families.some((family) => caseBelongsToFamily(contract, caseEntry, family)),
  )
}

function createCounter() {
  return { pass: 0, warn: 0, fail: 0, missing: 0, total: 0 }
}

function increment(counter, status) {
  counter.total += 1
  counter[status] = (counter[status] ?? 0) + 1
}

function checkBaseline({ contract, caseEntry, context }) {
  const pngPath = resolveBaselinePath(repoRoot, contract, caseEntry)
  if (!existsSync(pngPath)) return { png: "fail", receipt: "fail" }

  let png = "pass"
  try {
    const info = readPngInfo(pngPath)
    const expected = caseEntry.viewportSize
    if (info.width !== expected?.width || info.height !== expected?.height) png = "fail"
  } catch (_error) {
    png = "fail"
  }

  const receipt = validateBaselineReceipt({
    repoRoot,
    contract,
    caseEntry,
    context,
    pngPath,
    requireReceipt: true,
  })

  return { png, receipt: receipt.status === "pass" ? "pass" : "fail" }
}

function checkSourceNodes({ rawSource, caseEntry }) {
  const nodeIds = sourceNodeIdsForCase(caseEntry)
  if (nodeIds.length === 0) return "fail"
  return nodeIds.every((nodeId) => Boolean(findNodeById(rawSource, nodeId))) ? "pass" : "fail"
}

function checkFrameProvenance({ contract, caseEntry, context }) {
  const result = validateGeneratedFrameProvenance({
    repoRoot,
    contract,
    caseEntry,
    context,
    requireProvenance: false,
  })
  return result.status === "pass" ? "pass" : "warn"
}

function checkPortalCoverage({ portalSources, caseEntry }) {
  const missing = adapters.filter(
    (adapter) => !portalSources[adapter].includes(caseEntry.portalPath),
  )
  return missing.length === 0 ? "pass" : "fail"
}

function readLatestReflectionReport(adapter, root) {
  const latestPath = `${root}/${adapter}/runs/latest`
  if (!pathExists(latestPath)) return { adapter, root, status: "missing" }

  const runId = readText(latestPath).trim()
  const reportPath = `${root}/${adapter}/runs/${runId}/report.json`
  if (!pathExists(reportPath)) return { adapter, root, status: "missing", runId }

  try {
    const report = readJson(reportPath)
    return {
      adapter,
      root,
      runId,
      status: report.status ?? "unknown",
      summary: report.summary ?? {},
      reportPath,
    }
  } catch (error) {
    return {
      adapter,
      root,
      runId,
      status: "invalid",
      error: error.message,
      reportPath,
    }
  }
}

function summarizeVisualReports() {
  return {
    local: adapters.map((adapter) => readLatestReflectionReport(adapter, ".reflection")),
    ci: adapters.map((adapter) => readLatestReflectionReport(adapter, "artifacts/reflection")),
  }
}

function buildReport(options) {
  const context = loadDesignSource(repoRoot)
  const familyFilter = new Set(options.families)
  const contracts = loadReflectionContracts(repoRoot).filter(
    (entry) =>
      familyFilter.size === 0 ||
      familyFilter.has(entry.family) ||
      (entry.contract.cases ?? []).some((caseEntry) =>
        options.families.some((family) => caseBelongsToFamily(entry.contract, caseEntry, family)),
      ),
  )
  const portalSources = readPortalSources()

  const groups = {
    baselinePngs: createCounter(),
    baselineReceipts: createCounter(),
    sourceNodes: createCounter(),
    generatedFrameProvenance: createCounter(),
    adapterPortals: createCounter(),
  }

  const families = contracts.map(({ family, contract }) => {
    const cases = selectCaseEntries(contract, options).map((caseEntry) => {
      const baseline = checkBaseline({ contract, caseEntry, context })
      const sourceNodes = checkSourceNodes({ rawSource: context.rawSource, caseEntry })
      const frameProvenance = checkFrameProvenance({ contract, caseEntry, context })
      const adapterPortals = checkPortalCoverage({ portalSources, caseEntry })

      increment(groups.baselinePngs, baseline.png)
      increment(groups.baselineReceipts, baseline.receipt)
      increment(groups.sourceNodes, sourceNodes)
      increment(groups.generatedFrameProvenance, frameProvenance)
      increment(groups.adapterPortals, adapterPortals)

      return {
        caseId: caseEntry.caseId,
        mode: caseEntry.mode,
        baselinePng: baseline.png,
        baselineReceipt: baseline.receipt,
        sourceNodes,
        generatedFrameProvenance: frameProvenance,
        adapterPortals,
      }
    })

    return { family, cases }
  })

  const blockingFailures =
    groups.baselinePngs.fail +
    groups.baselineReceipts.fail +
    groups.sourceNodes.fail +
    groups.adapterPortals.fail
  const provenanceWarnings = groups.generatedFrameProvenance.warn

  return {
    target: {
      name: context.target.name,
      source: context.target.liveDir,
      fileKey: context.target.fileKey,
      rawFile: context.rawFile,
      variableMap: context.variableMapPath,
    },
    totals: {
      families: families.length,
      cases: families.reduce((sum, family) => sum + family.cases.length, 0),
    },
    readiness: {
      authoring: blockingFailures === 0 ? "pass" : "fail",
      ci: blockingFailures === 0 ? "pass" : "fail",
      strict: blockingFailures === 0 && provenanceWarnings === 0 ? "pass" : "warn",
    },
    groups,
    visualReports: summarizeVisualReports(),
    families,
  }
}

function formatCounter(counter) {
  const parts = []
  if (counter.pass) parts.push(`${counter.pass} pass`)
  if (counter.warn) parts.push(`${counter.warn} warn`)
  if (counter.fail) parts.push(`${counter.fail} fail`)
  if (counter.missing) parts.push(`${counter.missing} missing`)
  return parts.length > 0 ? parts.join(", ") : "none"
}

function printReport(report) {
  console.log("Design governance status")
  console.log("")
  console.log(`Target: ${report.target.name}`)
  console.log(`Source: ${report.target.source}`)
  console.log(`File key: ${report.target.fileKey}`)
  console.log(`Families: ${report.totals.families}`)
  console.log(`Cases: ${report.totals.cases}`)
  console.log("")
  console.log("Readiness")
  console.log(`  Authoring: ${report.readiness.authoring}`)
  console.log(`  CI: ${report.readiness.ci}`)
  console.log(`  Strict provenance: ${report.readiness.strict}`)
  console.log("")
  console.log("Local contract groups")
  console.log(`  Baseline PNGs: ${formatCounter(report.groups.baselinePngs)}`)
  console.log(`  Baseline receipts: ${formatCounter(report.groups.baselineReceipts)}`)
  console.log(`  Source nodes: ${formatCounter(report.groups.sourceNodes)}`)
  console.log(
    `  Generated frame provenance: ${formatCounter(report.groups.generatedFrameProvenance)}`,
  )
  console.log(`  Adapter portals: ${formatCounter(report.groups.adapterPortals)}`)
  console.log("")
  console.log("Latest Reflection visual reports")
  for (const entry of report.visualReports.local) {
    const visualSummary = entry.summary
      ? ` (${entry.summary.passed ?? 0} passed, ${entry.summary.failed ?? 0} failed, ${entry.summary.warnings ?? 0} warnings)`
      : ""
    console.log(`  ${entry.adapter}: ${entry.status}${visualSummary}`)
  }
}

try {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(usage())
    process.exit(0)
  }

  const report = buildReport(options)
  if (options.json) console.log(stableStringify(report))
  else printReport(report)

  process.exit(report.readiness.ci === "pass" ? 0 : 1)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
