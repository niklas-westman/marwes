import { existsSync, readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import process from "node:process"
import { validateBaselineReceipt } from "./baseline-receipts.mjs"

const repoRoot = process.cwd()
const defaultTargetConfigPath = ".pi/figma-sync.json"
const reflectionFamiliesRoot = "packages/design-governance/reflection-families"
const figmaNodeIdPattern = /^\d+:\d+$/

const args = process.argv.slice(2).filter((arg) => arg !== "--")
const jsonOutput = args.includes("--json")
const allFamilies = args.includes("--all")
const family = readOption("--family")
const requireFigmaFrames = args.includes("--require-figma-frames")
const requireBaselineReceipts = args.includes("--require-baseline-receipts")

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
    "  --require-figma-frames       Fail when Reflection Baselines frame node ids are missing.",
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

function selectContracts(contracts) {
  if (allFamilies) return contracts
  if (family) return contracts.filter((entry) => entry.family === family)
  return contracts
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

  const frameId = caseEntry.figmaNodeId
  if (!figmaNodeIdPattern.test(frameId ?? "")) {
    checks.push(
      createCheck(`${caseLabel} baseline frame node`, requireFrames ? "fail" : "warn", [
        `pending top-level Reflection Baselines frame id: ${frameId ?? "undefined"}`,
      ]),
    )
  } else {
    const frameNode = findNodeById(rawSource, frameId)
    const bounds = readNodeBounds(frameNode)
    const dimensionsMatch =
      frameNode &&
      bounds &&
      viewportSize &&
      bounds.width === viewportSize.width &&
      bounds.height === viewportSize.height
    const nameMatches = frameNode && frameNode.name === caseEntry.figmaFrameName
    const matches = dimensionsMatch && nameMatches
    const status = matches
      ? "pass"
      : !frameNode && !requireFrames
        ? "warn"
        : !dimensionsMatch
          ? "fail"
          : requireFrames
            ? "fail"
            : "warn"
    const details = []

    if (!frameNode) {
      details.push(`${frameId}: missing`)
    } else {
      details.push(
        dimensionsMatch
          ? `${frameId}: ${bounds.width}x${bounds.height}`
          : `${frameId}: ${bounds?.width ?? "missing"}x${bounds?.height ?? "missing"}, expected ${viewportSize?.width}x${viewportSize?.height}`,
      )
      details.push(
        nameMatches
          ? `name: ${frameNode.name}`
          : `name: ${frameNode.name ?? "missing"}, expected ${caseEntry.figmaFrameName}`,
      )
    }

    checks.push(createCheck(`${caseLabel} baseline frame node`, status, details))
  }

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

  if (selectedContracts.length === 0) {
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
      ...contract.cases.flatMap((caseEntry) =>
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
          requireReceipts: requireBaselineReceipts,
        }),
      ),
    ]

    return { family: familyName, checks }
  })

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
