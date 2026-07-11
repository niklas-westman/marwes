import { existsSync, readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import process from "node:process"
import { validateBaselineReceipt } from "./baseline-receipts.mjs"
import { validateGeneratedFrameProvenance } from "./generated-frame-provenance.mjs"

const repoRoot = process.cwd()
const defaultTargetConfigPath = ".pi/figma-sync.json"
const reflectionFamiliesRoot = "packages/design-governance/reflection-families"

const args = process.argv.slice(2).filter((arg) => arg !== "--")
const jsonOutput = args.includes("--json")
const allFamilies = args.includes("--all")
const family = readOption("--family")
const requireFigmaFrames = args.includes("--require-figma-frames")
const requireBaselineReceipts = args.includes("--require-baseline-receipts")
const requireComplete = args.includes("--complete")
const portalEntries = {
  react: "tests/reflection/react-portal.tsx",
  vue: "tests/reflection/vue-portal.ts",
  svelte: "tests/reflection/svelte-portal-case.svelte",
}

function readOption(name) {
  const index = args.indexOf(name)
  if (index === -1) return undefined
  return args[index + 1]
}

function usage() {
  return [
    "Usage:",
    "  pnpm --filter @marwes-ui/design-governance cohesive-check -- --family button",
    "  pnpm --filter @marwes-ui/design-governance cohesive-check -- --all",
    "",
    "Options:",
    "  --require-baseline-receipts  Fail when baseline PNG receipt sidecars are missing or stale.",
    "  --require-figma-frames       Fail when generated reflection/* frame provenance is missing or stale.",
    "  --complete                   Fail when registered/prepared families are not fully wired through React, Vue, and Svelte portals.",
    "  --json                       Print JSON.",
  ].join("\n")
}

function absolute(path) {
  return resolve(repoRoot, path)
}

function pathExists(path) {
  return existsSync(absolute(path))
}

function readJson(path) {
  return JSON.parse(readFileSync(absolute(path), "utf8"))
}

function normalizeTokenName(name) {
  return String(name)
    .replace(/\\/g, "/")
    .replace(/\s*\/\s*/g, "/")
    .trim()
    .toLowerCase()
}

function createCheck(name, status, details = []) {
  return { name, status, details }
}

function extractFileKey(figmaFile) {
  return figmaFile?.match(/figma\.com\/(?:file|design)\/([^/?#]+)/)?.[1]
}

function readSyncTarget() {
  if (!pathExists(defaultTargetConfigPath)) {
    throw new Error(`Missing ${defaultTargetConfigPath}`)
  }

  const syncConfig = readJson(defaultTargetConfigPath)
  const targetName = syncConfig.defaultTarget
  const target = syncConfig.targets?.[targetName]

  if (!target) {
    throw new Error(`Unknown Figma sync target: ${targetName}`)
  }

  return {
    name: targetName,
    liveDir: target.liveDir,
    figmaFile: target.figmaFile,
    fileKey: extractFileKey(target.figmaFile),
  }
}

function findRawFigmaFile(target) {
  const rawDir = absolute(`${target.liveDir}/_raw`)
  if (!existsSync(rawDir)) return undefined

  const rawFiles = readdirSync(rawDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => `${target.liveDir}/_raw/${file}`)

  return rawFiles.find((path) => path.endsWith("_full.json")) ?? rawFiles[0]
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

    map.set(id, {
      id,
      name,
      normalizedName: normalizeTokenName(name),
      raw: variable,
    })
  }

  return { source, map }
}

function findNodeById(source, id) {
  let found

  function walk(value) {
    if (!value || found) return

    if (Array.isArray(value)) {
      for (const item of value) walk(item)
      return
    }

    if (typeof value !== "object") return

    if (value.id === id) {
      found = value
      return
    }

    for (const child of Object.values(value)) {
      walk(child)
    }
  }

  walk(source.document ?? source)
  return found
}

function collectVariableIds(value, output = new Set()) {
  if (!value) return output

  if (Array.isArray(value)) {
    for (const item of value) collectVariableIds(item, output)
    return output
  }

  if (typeof value === "object") {
    if (typeof value.id === "string" && value.id.startsWith("VariableID:")) {
      output.add(value.id)
    }

    for (const child of Object.values(value)) {
      collectVariableIds(child, output)
    }
  }

  return output
}

function collectBoundVariableIdsForNode(rawSource, nodeId) {
  const variableIds = new Set()

  function walk(node, insideTarget = false) {
    if (!node || typeof node !== "object") return

    const isInsideTarget = insideTarget || node.id === nodeId

    if (isInsideTarget && node.boundVariables) {
      collectVariableIds(node.boundVariables, variableIds)
    }

    for (const child of node.children ?? []) {
      walk(child, isInsideTarget)
    }
  }

  walk(rawSource.document ?? rawSource)
  return variableIds
}

function readNodeBounds(node) {
  const bounds = node?.absoluteBoundingBox ?? node?.bounds
  if (!bounds) return undefined

  return {
    width: bounds.width ?? bounds.w,
    height: bounds.height ?? bounds.h,
  }
}

function readPngDimensions(path) {
  const buffer = readFileSync(absolute(path))
  const signature = buffer.subarray(0, 8).toString("hex")
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`${path} is not a PNG`)
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

function listReflectionContracts() {
  if (!pathExists(reflectionFamiliesRoot)) return []

  return readdirSync(absolute(reflectionFamiliesRoot), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const path = `${reflectionFamiliesRoot}/${entry.name}/reflection-contract.json`
      if (!pathExists(path)) return undefined
      return { family: entry.name, path, contract: readJson(path) }
    })
    .filter(Boolean)
    .sort((left, right) => left.family.localeCompare(right.family))
}

function readSourceFrameRegistry() {
  const path = `${reflectionFamiliesRoot}/source-frame-registry.json`
  if (!pathExists(path)) return {}

  return readJson(path).families ?? {}
}

function listFramePrepFamilies() {
  if (!pathExists(reflectionFamiliesRoot)) return []

  return readdirSync(absolute(reflectionFamiliesRoot), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => pathExists(`${reflectionFamiliesRoot}/${entry.name}/frame-prep.json`))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))
}

function selectedFamilyNamesForCompleteness(contracts) {
  if (family) return [family]

  const registryFamilies = Object.keys(readSourceFrameRegistry())
  const framePrepFamilies = listFramePrepFamilies()
  const contractFamilies = contracts.map((entry) => entry.family)

  return [...new Set([...registryFamilies, ...framePrepFamilies, ...contractFamilies])].sort(
    (left, right) => left.localeCompare(right),
  )
}

function loadPortalSources() {
  return Object.fromEntries(
    Object.entries(portalEntries).map(([adapter, path]) => [
      adapter,
      pathExists(path) ? readFileSync(absolute(path), "utf8") : "",
    ]),
  )
}

function findContractEntryForFamily(familyName, contractsByFamily, contracts) {
  const exactMatch = contractsByFamily.get(familyName)
  if (exactMatch) return exactMatch

  return contracts.find((entry) =>
    (entry.contract.cases ?? []).some(
      (caseEntry) =>
        caseEntry.caseId?.startsWith(`${familyName}.`) ||
        caseEntry.portalPath?.startsWith(`/reflection/${familyName}/`),
    ),
  )
}

function caseBelongsToFamily(contract, caseEntry, familyName) {
  return (
    contract.family === familyName ||
    caseEntry.caseId?.startsWith(`${familyName}.`) ||
    caseEntry.portalPath?.startsWith(`/reflection/${familyName}/`)
  )
}

function selectContracts(contracts) {
  if (allFamilies) return contracts
  if (family)
    return contracts.filter(
      (entry) =>
        entry.family === family ||
        (entry.contract.cases ?? []).some((caseEntry) =>
          caseBelongsToFamily(entry.contract, caseEntry, family),
        ),
    )
  return contracts
}

function selectCaseEntries(contract) {
  if (!family || contract.family === family) return contract.cases ?? []
  return (contract.cases ?? []).filter((caseEntry) =>
    caseBelongsToFamily(contract, caseEntry, family),
  )
}

function validateSync(target, contract, contractPath) {
  const details = []

  if (target.fileKey !== contract.figmaFileKey) {
    details.push(
      `target file key ${target.fileKey ?? "unknown"} does not match contract ${contract.figmaFileKey}`,
    )
  }

  if (contract.baselineRoot && !pathExists(contract.baselineRoot)) {
    details.push(`missing baseline root: ${contract.baselineRoot}`)
  }

  return createCheck(
    "contract target",
    details.length === 0 ? "pass" : "fail",
    details.length === 0
      ? [`contract: ${contractPath}`, `target: ${target.name}`, `fileKey: ${contract.figmaFileKey}`]
      : details,
  )
}

function validateCase({
  contract,
  caseEntry,
  rawSource,
  variableMap,
  receiptContext,
  requireFrames,
  requireReceipts,
}) {
  const checks = []
  const family = contract.family
  const caseLabel = `${family}:${caseEntry.caseId}`
  const baselineRoot = contract.baselineRoot
  const viewportSize = caseEntry.viewportSize

  const requiredFields = ["caseId", "mode", "viewport", "baseline", "portalPath", "figmaFrameName"]
  const missingFields = requiredFields.filter((key) => typeof caseEntry[key] !== "string")
  if (
    !viewportSize ||
    !Number.isInteger(viewportSize.width) ||
    !Number.isInteger(viewportSize.height)
  ) {
    missingFields.push("viewportSize")
  }
  checks.push(
    createCheck(
      `${caseLabel} contract shape`,
      missingFields.length === 0 ? "pass" : "fail",
      missingFields.length === 0 ? [`portal: ${caseEntry.portalPath}`] : missingFields,
    ),
  )

  const baselinePath = baselineRoot ? `${baselineRoot}/${caseEntry.baseline}` : caseEntry.baseline
  if (!pathExists(baselinePath)) {
    checks.push(createCheck(`${caseLabel} baseline PNG`, "fail", [`missing: ${baselinePath}`]))
  } else {
    const dimensions = readPngDimensions(baselinePath)
    const matches =
      viewportSize &&
      dimensions.width === viewportSize.width &&
      dimensions.height === viewportSize.height
    checks.push(
      createCheck(
        `${caseLabel} baseline PNG`,
        matches ? "pass" : "fail",
        matches
          ? [`${baselinePath}: ${dimensions.width}x${dimensions.height}`]
          : [
              `${baselinePath}: ${dimensions.width}x${dimensions.height}, expected ${viewportSize?.width}x${viewportSize?.height}`,
            ],
      ),
    )

    const receiptCheck = validateBaselineReceipt({
      repoRoot,
      contract,
      caseEntry,
      context: receiptContext,
      pngPath: absolute(baselinePath),
      requireReceipt: requireReceipts,
    })
    checks.push(
      createCheck(`${caseLabel} baseline receipt`, receiptCheck.status, receiptCheck.details),
    )
  }

  const source = caseEntry.source ?? {}
  const componentNodeId = source.componentNodeId
  const componentNode =
    typeof componentNodeId === "string" ? findNodeById(rawSource, componentNodeId) : undefined
  if (!componentNode) {
    checks.push(
      createCheck(`${caseLabel} source node`, "fail", [
        `missing source.componentNodeId: ${componentNodeId ?? "undefined"}`,
      ]),
    )
  } else {
    const bounds = readNodeBounds(componentNode)
    const expectedBounds = source.componentBounds
    const boundsMatch =
      bounds &&
      expectedBounds &&
      bounds.width === expectedBounds.width &&
      bounds.height === expectedBounds.height
    checks.push(
      createCheck(
        `${caseLabel} source node`,
        boundsMatch ? "pass" : "fail",
        boundsMatch
          ? [`${componentNodeId}: ${bounds.width}x${bounds.height}`]
          : [
              `${componentNodeId}: ${bounds?.width ?? "?"}x${bounds?.height ?? "?"}, expected ${expectedBounds?.width ?? "?"}x${expectedBounds?.height ?? "?"}`,
            ],
      ),
    )
  }

  if (source.componentJson) {
    if (!pathExists(source.componentJson)) {
      checks.push(
        createCheck(`${caseLabel} component JSON`, "fail", [`missing: ${source.componentJson}`]),
      )
    } else {
      const componentJson = readJson(source.componentJson)
      const node = componentNodeId ? findNodeById(componentJson, componentNodeId) : undefined
      checks.push(
        createCheck(
          `${caseLabel} component JSON`,
          node ? "pass" : "fail",
          node
            ? [`${source.componentJson} contains ${componentNodeId}`]
            : [`${source.componentJson} does not contain ${componentNodeId}`],
        ),
      )
    }
  }

  const requiredTokens = (source.requiredBoundTokens ?? []).map(normalizeTokenName)
  const boundTokens = new Set(
    [...collectBoundVariableIdsForNode(rawSource, componentNodeId)]
      .map((id) => variableMap.get(id)?.normalizedName)
      .filter(Boolean),
  )
  const missingTokens = requiredTokens.filter((token) => !boundTokens.has(token))
  checks.push(
    createCheck(
      `${caseLabel} bound tokens`,
      missingTokens.length === 0 ? "pass" : "fail",
      missingTokens.length === 0
        ? [`${requiredTokens.length} required tokens found`]
        : missingTokens.map((token) => `missing bound token: ${token}`),
    ),
  )

  const provenanceCheck = validateGeneratedFrameProvenance({
    repoRoot,
    contract,
    caseEntry,
    context: receiptContext,
    requireProvenance: requireFrames,
  })
  checks.push(
    createCheck(
      `${caseLabel} generated frame provenance`,
      provenanceCheck.status,
      provenanceCheck.details,
    ),
  )

  const threshold = caseEntry.comparison?.threshold
  const toleranceReason = caseEntry.comparison?.toleranceReason
  const thresholdValid =
    threshold &&
    Number.isFinite(threshold.maxDiffPixels) &&
    Number.isFinite(threshold.maxDiffPixelRatio) &&
    typeof toleranceReason === "string" &&
    toleranceReason.length > 20
  checks.push(
    createCheck(
      `${caseLabel} comparison policy`,
      thresholdValid ? "pass" : "fail",
      thresholdValid
        ? [
            `maxDiffPixels: ${threshold.maxDiffPixels}`,
            `maxDiffPixelRatio: ${threshold.maxDiffPixelRatio}`,
          ]
        : ["comparison.threshold and comparison.toleranceReason are required"],
    ),
  )

  return checks
}

function validateFamilyCompleteness({
  familyName,
  registryFamilies,
  framePrepFamilies,
  contractsByFamily,
  portalSources,
}) {
  const checks = []
  const hasRegistryEntry = Boolean(registryFamilies[familyName])
  const hasFramePrep = framePrepFamilies.has(familyName)
  const contractEntry = findContractEntryForFamily(familyName, contractsByFamily, [
    ...contractsByFamily.values(),
  ])
  const hasPrepOrContract = hasFramePrep || Boolean(contractEntry)

  checks.push(
    createCheck(
      `${familyName} complete source registry`,
      hasRegistryEntry ? "pass" : "fail",
      hasRegistryEntry
        ? [`registered source modes: ${Object.keys(registryFamilies[familyName]).join(", ")}`]
        : [`missing ${reflectionFamiliesRoot}/source-frame-registry.json entry`],
    ),
  )

  checks.push(
    createCheck(
      `${familyName} complete frame prep`,
      hasPrepOrContract ? "pass" : "fail",
      hasFramePrep
        ? [`${reflectionFamiliesRoot}/${familyName}/frame-prep.json`]
        : contractEntry
          ? ["already promoted to reflection contract"]
          : [`missing ${reflectionFamiliesRoot}/${familyName}/frame-prep.json`],
    ),
  )

  checks.push(
    createCheck(
      `${familyName} complete reflection contract`,
      contractEntry ? "pass" : "fail",
      contractEntry
        ? [
            contractEntry.family === familyName
              ? `${reflectionFamiliesRoot}/${familyName}/reflection-contract.json`
              : `covered by ${reflectionFamiliesRoot}/${contractEntry.family}/reflection-contract.json`,
          ]
        : [`missing ${reflectionFamiliesRoot}/${familyName}/reflection-contract.json`],
    ),
  )

  if (!contractEntry) return checks

  const missingPortalPaths = []
  const relevantCases = (contractEntry.contract.cases ?? []).filter(
    (caseEntry) =>
      contractEntry.family === familyName ||
      caseEntry.caseId?.startsWith(`${familyName}.`) ||
      caseEntry.portalPath?.startsWith(`/reflection/${familyName}/`),
  )
  for (const caseEntry of relevantCases) {
    for (const [adapter, source] of Object.entries(portalSources)) {
      if (!source.includes(caseEntry.portalPath)) {
        missingPortalPaths.push(`${adapter}: ${caseEntry.portalPath}`)
      }
    }
  }

  checks.push(
    createCheck(
      `${familyName} complete adapter portals`,
      missingPortalPaths.length === 0 ? "pass" : "fail",
      missingPortalPaths.length === 0
        ? [`${relevantCases.length} case(s) wired in React, Vue, and Svelte`]
        : missingPortalPaths.map((path) => `missing portal case: ${path}`),
    ),
  )

  return checks
}

function hasFailures(checks) {
  return checks.some((check) => check.status === "fail")
}

function hasWarnings(checks) {
  return checks.some((check) => check.status === "warn")
}

function collectChecksByStatus(report, status) {
  return report.families.flatMap((familyReport) =>
    familyReport.checks
      .filter((check) => check.status === status)
      .map((check) => ({
        family: familyReport.family,
        check,
      })),
  )
}

function printReport(report) {
  console.log(`cohesive:check ${report.selection}`)
  console.log("")
  console.log(`Target: ${report.target.name}`)
  console.log(`Source: ${report.target.liveDir}`)
  console.log("")

  for (const familyReport of report.families) {
    console.log(`Family: ${familyReport.family}`)
    console.log("")
    for (const check of familyReport.checks) {
      const marker = check.status === "pass" ? "pass" : check.status === "warn" ? "warn" : "fail"
      console.log(`[${marker}] ${check.name}`)
      for (const detail of check.details) {
        console.log(`       ${detail}`)
      }
    }
    console.log("")
  }

  const warnings = collectChecksByStatus(report, "warn")
  if (warnings.length > 0) {
    console.log(`WARNING: cohesive:check passed with ${warnings.length} warning(s).`)
    console.log("These warnings are non-blocking in authoring mode.")
    console.log("Run with --require-baseline-receipts to fail missing or stale baseline receipts.")
    console.log(
      "Run with --require-figma-frames to fail generated Figma frame provenance warnings.",
    )
    console.log("")

    for (const { family: familyName, check } of warnings) {
      console.log(`[warn] ${familyName}: ${check.name}`)
      for (const detail of check.details) {
        console.log(`       ${detail}`)
      }
    }
    console.log("")
  }

  console.log(`Status: ${report.status}`)
}

function main() {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(usage())
    return
  }

  const target = readSyncTarget()
  const rawFile = findRawFigmaFile(target)
  const variableMapPath = `${target.liveDir}/tokens/variables.json`
  if (!rawFile) throw new Error(`Missing raw Figma JSON in ${target.liveDir}/_raw`)
  if (!pathExists(variableMapPath)) throw new Error(`Missing ${variableMapPath}`)

  const rawSource = readJson(rawFile)
  const { source: variableSource, map: variableMap } = loadVariableMap(variableMapPath)
  const selectedContracts = selectContracts(listReflectionContracts())

  if (selectedContracts.length === 0 && !(requireComplete && family)) {
    throw new Error(
      family ? `Unknown reflection family: ${family}` : "No reflection families found",
    )
  }

  const families = selectedContracts.map(({ family: familyName, path, contract }) => {
    const checks = [
      validateSync(target, contract, path),
      createCheck("local Figma source", "pass", [
        `raw file: ${rawFile}`,
        `variable map: ${variableMapPath}`,
        `variable file key: ${variableSource.fileKey ?? "unknown"}`,
      ]),
      ...selectCaseEntries(contract).flatMap((caseEntry) =>
        validateCase({
          contract,
          caseEntry,
          rawSource,
          variableMap,
          receiptContext: {
            rawSource,
            variableSource,
          },
          requireFrames: requireFigmaFrames,
          requireReceipts: requireBaselineReceipts || requireComplete,
        }),
      ),
    ]

    return { family: familyName, checks }
  })

  if (requireComplete) {
    const contractsByFamily = new Map(
      listReflectionContracts().map((entry) => [entry.family, entry]),
    )
    const familyReportsByName = new Map(
      families.map((familyReport) => [familyReport.family, familyReport]),
    )
    const registryFamilies = readSourceFrameRegistry()
    const framePrepFamilies = new Set(listFramePrepFamilies())
    const portalSources = loadPortalSources()

    for (const familyName of selectedFamilyNamesForCompleteness(listReflectionContracts())) {
      const completenessChecks = validateFamilyCompleteness({
        familyName,
        registryFamilies,
        framePrepFamilies,
        contractsByFamily,
        portalSources,
      })
      const familyReport = familyReportsByName.get(familyName)
      if (familyReport) {
        familyReport.checks.push(...completenessChecks)
      } else {
        const newFamilyReport = { family: familyName, checks: completenessChecks }
        families.push(newFamilyReport)
        familyReportsByName.set(familyName, newFamilyReport)
      }
    }
  }

  const checks = families.flatMap((item) => item.checks)
  const report = {
    selection: allFamilies ? "--all" : (family ?? "--all"),
    target,
    status: hasFailures(checks) ? "fail" : hasWarnings(checks) ? "pass-with-warnings" : "pass",
    families,
  }

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    printReport(report)
  }

  process.exit(hasFailures(checks) ? 1 : 0)
}

try {
  main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)

  if (jsonOutput) {
    console.log(JSON.stringify({ error: message }, null, 2))
  } else {
    console.error(message)
  }

  process.exit(1)
}
