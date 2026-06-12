import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import process from "node:process"

const repoRoot = process.cwd()
const defaultTargetConfigPath = ".pi/figma-sync.json"
const registryRoot = "docs/registry/families"
const cssRoot = "packages/presets/src/firstEdition"
const marwesColorSourcePath = "docs/marwes-colors.json"
const borderStrongSourcePath = "docs/marwes-border-strong-tokens.json"
const themeCssPath = "packages/core/src/theme/theme-css.ts"
const themeVarsPath = "packages/core/src/theme/theme-vars.ts"

const args = process.argv.slice(2).filter((arg) => arg !== "--")
const jsonOutput = args.includes("--json")
const colorsOnly = args.includes("--colors")
const runtimeOnly = args.includes("--runtime-only")
const verbose = args.includes("--verbose")
const allFamilies = args.includes("--all")
const family = readOption("--family")
const targetOption = readOption("--target")

function readOption(name) {
  const index = args.indexOf(name)
  if (index === -1) return undefined
  return args[index + 1]
}

function usage() {
  return [
    "Usage:",
    "  pnpm --filter @marwes-ui/design-governance validate -- --all",
    "  pnpm --filter @marwes-ui/design-governance validate -- --family checkbox",
    "  pnpm --filter @marwes-ui/design-governance validate-runtime -- --family checkbox",
    "  pnpm --filter @marwes-ui/design-governance colors",
  ].join("\n")
}

function absolute(path) {
  return join(repoRoot, path)
}

function pathExists(path) {
  return existsSync(absolute(path))
}

function readJson(path) {
  return JSON.parse(readFileSync(absolute(path), "utf8"))
}

function listFilesRecursive(directory, predicate = () => true) {
  const absoluteDirectory = absolute(directory)

  if (!existsSync(absoluteDirectory)) return []

  return readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name)

    if (entry.isDirectory()) return listFilesRecursive(entryPath, predicate)
    if (entry.isFile() && predicate(entryPath)) return [entryPath]

    return []
  })
}

function getPathValue(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source)
}

function createCheck(name, status, details = []) {
  return { name, status, details }
}

function failDetails(paths, label = "missing") {
  return paths.map((path) => `${label}: ${path}`)
}

function buildColorContract() {
  const colorSource = readJson(marwesColorSourcePath)
  const borderStrongSource = readJson(borderStrongSourcePath)
  const entries = [
    ["--mw-color-background", "semantic.surface.primary"],
    ["--mw-color-surface", "semantic.surface.secondary"],
    ["--mw-color-surface-primary", "semantic.surface.primary"],
    ["--mw-color-surface-subtle", "semantic.surface.sunken"],
    ["--mw-color-surface-brand", "semantic.surface.brand"],
    ["--mw-color-surface-elevated", "semantic.surface.raised"],
    ["--mw-color-surface-disabled", "semantic.surface.disabled"],
    ["--mw-color-surface-inverted", "semantic.surface.inverse"],
    ["--mw-color-text", "semantic.text.primary"],
    ["--mw-color-text-muted", "semantic.text.secondary"],
    ["--mw-color-text-subtle", "semantic.text.disabled"],
    ["--mw-color-text-disabled", "semantic.text.disabled"],
    ["--mw-color-text-inverted", "semantic.text.inverse"],
    ["--mw-color-text-brand", "semantic.text.brand"],
    ["--mw-color-text-link", "semantic.text.link"],
    ["--mw-color-icon-muted", "semantic.icon.muted"],
    ["--mw-color-border-low", "semantic.border.low"],
    ["--mw-color-border", "semantic.border.default"],
    ["--mw-color-border-subtle", "semantic.border.default"],
    ["--mw-color-border-strong", "semantic.border.strong"],
    ["--mw-color-border-disabled", "semantic.border.default"],
    ["--mw-color-border-brand", "semantic.border.brand"],
    ["--mw-color-focus", "semantic.focus.ring"],
    ["--mw-color-primary-base", "semantic.action.primary.default"],
    ["--mw-color-primary-hover", "semantic.action.primary.hover"],
    ["--mw-color-primary-pressed", "semantic.action.primary.active"],
    ["--mw-color-primary-disabled", "semantic.action.primary.disabled"],
    ["--mw-color-primary-label", "semantic.action.primary.label"],
    ["--mw-color-primary-label-disabled", "semantic.action.primary.label"],
    ["--mw-color-secondary-base", "semantic.action.secondary.default"],
    ["--mw-color-secondary-hover", "semantic.action.secondary.hover"],
    ["--mw-color-secondary-pressed", "semantic.action.secondary.active"],
    ["--mw-color-secondary-disabled", "semantic.action.secondary.disabled"],
    ["--mw-color-secondary-label", "semantic.action.secondary.label"],
    ["--mw-color-secondary-label-disabled", "semantic.action.secondary.label"],
    ["--mw-color-secondary-border", "semantic.action.secondary.default"],
    ["--mw-color-secondary-border-disabled", "semantic.action.secondary.disabled"],
    ["--mw-color-danger-base", "semantic.action.destructive.default"],
    ["--mw-color-danger-hover", "semantic.action.destructive.hover"],
    ["--mw-color-danger-pressed", "semantic.action.destructive.active"],
    ["--mw-color-danger-disabled", "semantic.action.destructive.disabled"],
    ["--mw-color-danger-label", "semantic.action.destructive.label"],
    ["--mw-color-danger-label-disabled", "semantic.action.destructive.label"],
    ["--mw-color-success-base", "semantic.status.success.text"],
    ["--mw-color-success-hover", "semantic.status.success.text"],
    ["--mw-color-success-pressed", "semantic.status.success.text"],
    ["--mw-color-success-disabled", "semantic.status.success.background"],
    ["--mw-color-success-label", "semantic.action.success.label"],
    ["--mw-color-success-label-disabled", "semantic.action.success.label"],
    ["--mw-color-warning-base", "semantic.status.warning.text"],
    ["--mw-color-warning-hover", "semantic.status.warning.text"],
    ["--mw-color-warning-pressed", "semantic.status.warning.text"],
    ["--mw-color-warning-disabled", "semantic.status.warning.background"],
    ["--mw-color-warning-label", "semantic.status.warning.background"],
    ["--mw-color-warning-label-disabled", "semantic.status.warning.background"],
    ["--mw-color-info-base", "semantic.status.info.icon"],
    ["--mw-color-info-hover", "semantic.status.info.icon"],
    ["--mw-color-info-pressed", "semantic.status.info.icon"],
    ["--mw-color-info-disabled", "semantic.status.info.background"],
    ["--mw-color-info-label", "semantic.status.info.background"],
    ["--mw-color-info-label-disabled", "semantic.status.info.background"],
    ["--mw-color-status-success-background", "semantic.status.success.background"],
    ["--mw-color-status-success-text", "semantic.status.success.text"],
    ["--mw-color-status-success-icon", "semantic.status.success.icon"],
    ["--mw-color-status-success-border", "semantic.status.success.border"],
    ["--mw-color-status-warning-background", "semantic.status.warning.background"],
    ["--mw-color-status-warning-text", "semantic.status.warning.text"],
    ["--mw-color-status-warning-icon", "semantic.status.warning.icon"],
    ["--mw-color-status-warning-border", "semantic.status.warning.border"],
    ["--mw-color-status-error-background", "semantic.status.error.background"],
    ["--mw-color-status-error-text", "semantic.status.error.text"],
    ["--mw-color-status-error-icon", "semantic.status.error.icon"],
    ["--mw-color-status-error-border", "semantic.status.error.border"],
    ["--mw-color-status-info-background", "semantic.status.info.background"],
    ["--mw-color-status-info-text", "semantic.status.info.text"],
    ["--mw-color-status-info-icon", "semantic.status.info.icon"],
    ["--mw-color-status-info-border", "semantic.status.info.border"],
  ]

  const contract = new Map(
    entries.map(([cssVar, sourcePath]) => [
      cssVar,
      {
        cssVar,
        sourcePath,
        source: marwesColorSourcePath,
        sourceExists: getPathValue(colorSource, sourcePath) !== undefined,
      },
    ]),
  )

  for (const role of ["success", "warning", "error", "info"]) {
    const cssVar = `--mw-color-status-${role}-border-strong`
    const sourcePath = `status.${role}.border-strong`
    contract.set(cssVar, {
      cssVar,
      sourcePath,
      source: borderStrongSourcePath,
      sourceExists: getPathValue(borderStrongSource, sourcePath) !== undefined,
    })
  }

  return contract
}

function collectThemeColorVars() {
  const sourcePaths = [themeCssPath, themeVarsPath].filter(pathExists)

  const vars = sourcePaths.flatMap((sourcePath) => {
    const source = readFileSync(absolute(sourcePath), "utf8")
    return [...source.matchAll(/["'`]--mw-color-[\w-]+["'`]/g)].map(([match]) => match.slice(1, -1))
  })

  return [...new Set(vars)].sort((left, right) => left.localeCompare(right))
}

function collectThemeVars() {
  const sourcePaths = [themeCssPath, themeVarsPath].filter(pathExists)

  const vars = sourcePaths.flatMap((sourcePath) => {
    const source = readFileSync(absolute(sourcePath), "utf8")
    return [...source.matchAll(/["'`]--mw-[\w-]+["'`]/g)].map(([match]) => match.slice(1, -1))
  })

  return [...new Set(vars)].sort((left, right) => left.localeCompare(right))
}

function collectPresetColorVarUsage() {
  const files = listFilesRecursive(cssRoot, (path) => path.endsWith(".css"))
  const usages = []
  const varPattern = /--mw-color-[\w-]+/g

  for (const file of files) {
    const lines = readFileSync(absolute(file), "utf8").split("\n")

    lines.forEach((line, index) => {
      for (const match of line.matchAll(varPattern)) {
        usages.push({
          cssVar: match[0],
          file,
          line: index + 1,
          text: line.trim(),
        })
      }
    })
  }

  return usages
}

function runColorChecks() {
  const contract = buildColorContract()
  const checks = []
  const invalidSources = [...contract.values()]
    .filter((entry) => !entry.sourceExists)
    .map((entry) => `${entry.cssVar} -> ${entry.source}:${entry.sourcePath}`)

  checks.push(
    createCheck(
      "color contract source paths",
      invalidSources.length === 0 ? "pass" : "fail",
      invalidSources,
    ),
  )

  const contractVars = new Set(contract.keys())
  const themeVars = collectThemeColorVars()
  const missingFromContract = themeVars.filter((cssVar) => !contractVars.has(cssVar))
  const missingFromTheme = [...contractVars].filter((cssVar) => !themeVars.includes(cssVar))

  checks.push(
    createCheck(
      "theme color variable exposure",
      missingFromContract.length === 0 && missingFromTheme.length === 0 ? "pass" : "fail",
      [
        ...missingFromContract.map((cssVar) => `theme exposes but contract misses: ${cssVar}`),
        ...missingFromTheme.map((cssVar) => `contract exposes but theme misses: ${cssVar}`),
      ],
    ),
  )

  const unknownPresetVars = collectPresetColorVarUsage().filter(
    (usage) => !contractVars.has(usage.cssVar),
  )

  checks.push(
    createCheck(
      "preset CSS color variable usage",
      unknownPresetVars.length === 0 ? "pass" : "fail",
      unknownPresetVars.map(
        (usage) => `${usage.file}:${usage.line} ${usage.cssVar} in "${usage.text}"`,
      ),
    ),
  )

  return {
    contractSize: contract.size,
    checks,
  }
}

function readSyncTarget() {
  if (!pathExists(defaultTargetConfigPath)) {
    throw new Error(`Missing ${defaultTargetConfigPath}`)
  }

  const syncConfig = readJson(defaultTargetConfigPath)
  const targetName = targetOption ?? syncConfig.defaultTarget
  const target = syncConfig.targets?.[targetName]

  if (!target) {
    throw new Error(`Unknown Figma sync target: ${targetName}`)
  }

  return {
    name: targetName,
    liveDir: target.liveDir,
    archiveDir: target.archiveDir,
    figmaFile: target.figmaFile,
    docsFile: target.docsFile,
  }
}

function listRegistryFamilies() {
  if (!pathExists(registryRoot)) return []

  return readdirSync(absolute(registryRoot), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => pathExists(`${registryRoot}/${name}/registry.generated.json`))
    .sort((left, right) => left.localeCompare(right))
}

function readFamilyRegistry(familyName) {
  return readJson(`${registryRoot}/${familyName}/registry.generated.json`)
}

function collectMissing(paths) {
  return paths.filter((path) => !pathExists(path))
}

function checkFigmaReferences(registry) {
  const design = registry.design ?? {}
  const referencePaths = [
    ...(design.componentJsons ?? []),
    ...(design.pageReferences ?? []),
    ...(design.curatedReferences ?? []),
  ]
  const missing = collectMissing(referencePaths)

  return createCheck(
    "Figma references",
    missing.length === 0 ? "pass" : "fail",
    missing.length === 0
      ? [
          `component jsons: ${(design.componentJsons ?? []).length}`,
          `page refs: ${(design.pageReferences ?? []).length}`,
          `node refs: ${Object.keys(design.nodeReferences ?? {}).length}`,
        ]
      : failDetails(missing),
  )
}

function checkFrameworkSurfaces(registry) {
  const links = registry.links ?? {}
  const expected = {
    core: links.core ?? [],
    presets: links.presets ?? [],
    react: links.react ?? [],
    vue: links.vue ?? [],
    svelte: links.svelte ?? [],
  }
  const details = []
  let failed = false

  for (const [surface, paths] of Object.entries(expected)) {
    if (paths.length === 0) {
      failed = true
      details.push(`${surface}: no registry paths`)
      continue
    }

    const missing = collectMissing(paths)
    if (missing.length > 0) {
      failed = true
      details.push(...missing.map((path) => `${surface}: missing ${path}`))
      continue
    }

    details.push(`${surface}: ${paths.length} path${paths.length === 1 ? "" : "s"}`)
  }

  return createCheck("Framework surfaces", failed ? "fail" : "pass", details)
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

    map.set(id, {
      id,
      name,
      normalizedName: normalizeTokenName(name),
      raw: variable,
    })
  }

  return map
}

function collectVariableIds(value, output = new Set()) {
  if (!value) return output

  if (Array.isArray(value)) {
    for (const item of value) {
      collectVariableIds(item, output)
    }
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

function findRawFigmaFile(target) {
  const rawFiles = listFilesRecursive(`${target.liveDir}/_raw`, (path) => path.endsWith(".json"))
  return rawFiles.find((path) => path.endsWith("_full.json")) ?? rawFiles[0]
}

function collectBoundVariableIdsForNodes(rawSource, nodeIds) {
  const targetIds = new Set(nodeIds)
  const variableIds = new Set()

  function walk(node, insideTarget = false) {
    if (!node || typeof node !== "object") return

    const isInsideTarget = insideTarget || targetIds.has(node.id)

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

function collectFigmaTokenUsage(target, registry) {
  const variableMapPath = `${target.liveDir}/tokens/variables.json`
  const legacyColorTokenPath = `${target.liveDir}/tokens/colors.json`
  const details = []

  if (!pathExists(variableMapPath)) {
    details.push(`missing: ${variableMapPath}`)

    if (pathExists(legacyColorTokenPath)) {
      details.push(
        `${legacyColorTokenPath} exists, but it is hex-grouped usage and cannot prove VariableID token names`,
      )
    }

    details.push("run: pnpm design:sync")

    return {
      status: "blocked",
      details,
    }
  }

  const rawFile = findRawFigmaFile(target)
  if (!rawFile) {
    return {
      status: "fail",
      details: [`missing raw Figma JSON in ${target.liveDir}/_raw`],
    }
  }

  const variableMap = loadVariableMap(variableMapPath)
  const rawSource = readJson(rawFile)
  const nodeIds = Object.values(registry.design?.nodeReferences ?? {})
  const boundVariableIds = collectBoundVariableIdsForNodes(rawSource, nodeIds)

  return {
    status: "pass",
    variableMapPath,
    rawFile,
    variableMap,
    boundVariableIds,
    details,
  }
}

function checkFigmaTokenParity(target, registry) {
  const usage = collectFigmaTokenUsage(target, registry)
  if (usage.status !== "pass") {
    return createCheck("Figma token parity", usage.status, usage.details)
  }

  const { variableMapPath, rawFile, variableMap, boundVariableIds } = usage
  const details = []
  const unresolvedIds = [...boundVariableIds].filter((id) => !variableMap.has(id))
  const actualTokens = [...boundVariableIds]
    .map((id) => variableMap.get(id)?.normalizedName)
    .filter(Boolean)
  const actualTokenSet = new Set(actualTokens)
  const expectedTokens = (registry.design?.figmaTokens ?? []).map(normalizeTokenName)
  const missingExpectedTokens = expectedTokens.filter((token) => !actualTokenSet.has(token))

  details.push(`variable map: ${variableMapPath}`)
  details.push(`raw file: ${rawFile}`)
  details.push(`bound variables: ${boundVariableIds.size}`)
  details.push(`resolved tokens: ${actualTokenSet.size}`)

  if (unresolvedIds.length > 0) {
    details.push(...unresolvedIds.map((id) => `unresolved variable id: ${id}`))
  }

  if (missingExpectedTokens.length > 0) {
    details.push(
      ...missingExpectedTokens.map((token) => `registry token not found in Figma usage: ${token}`),
    )
    const colorTokens = [...actualTokenSet].filter(
      (t) => !t.startsWith("font/") && !t.startsWith("sp-") && t !== "color" && t !== "size",
    )
    if (colorTokens.length > 0) {
      details.push(`bound color tokens found: ${colorTokens.sort().join(", ")}`)
    }
  }

  return createCheck(
    "Figma token parity",
    unresolvedIds.length === 0 && missingExpectedTokens.length === 0 ? "pass" : "fail",
    details,
  )
}

function collectAliasNames(variableEntry) {
  const aliases = new Set([variableEntry.normalizedName])
  const valuesByMode = variableEntry.raw?.valuesByMode ?? {}

  for (const value of Object.values(valuesByMode)) {
    if (
      value &&
      typeof value === "object" &&
      value.type === "VARIABLE_ALIAS" &&
      typeof value.name === "string"
    ) {
      aliases.add(normalizeTokenName(value.name))
    }
  }

  return [...aliases]
}

function cssVarForTokenName(tokenName) {
  const token = normalizeTokenName(tokenName)
  const statusMatch = token.match(/^status\/(success|warning|error|info)\/(.+)$/)

  if (statusMatch) {
    const [, role, state] = statusMatch
    const mappedState = state === "border-strong" ? "border-strong" : state
    if (["background", "text", "icon", "border", "border-strong"].includes(mappedState)) {
      return `--mw-color-status-${role}-${mappedState}`
    }
  }

  const actionMatch = token.match(
    /^action\/(primary|secondary|destructive|success|warning|info)\/(.+)$/,
  )

  if (actionMatch) {
    const [, rawRole, rawState] = actionMatch
    if (rawRole === "secondary" && rawState === "default") {
      return "--mw-color-secondary-border"
    }

    const role = rawRole === "destructive" ? "danger" : rawRole
    const state = rawState === "default" ? "base" : rawState === "active" ? "pressed" : rawState

    if (["base", "hover", "pressed", "disabled", "label", "label-disabled"].includes(state)) {
      return `--mw-color-${role}-${state}`
    }
  }

  const buttonMap = new Map([
    ["button/gap", "--mw-spacing-sp-4"],
    ["button/paddingh", "--mw-density-padding-x"],
    ["button/paddingv", "--mw-density-padding-y"],
    ["button/radius", "--mw-ui-radius"],
    ["button/primary/surface", "--mw-color-primary-base"],
    ["button/primary/label", "--mw-color-primary-label"],
    ["button/secondary/label", "--mw-color-secondary-label"],
    ["button/secondary/outline", "--mw-color-secondary-border"],
    ["button/text/label", "--mw-color-primary-base"],
  ])

  const buttonMapped = buttonMap.get(token)
  if (buttonMapped) return buttonMapped

  const directMap = new Map([
    ["surface/primary", "--mw-color-surface-primary"],
    ["surface/secondary", "--mw-color-surface"],
    ["surface/sunken", "--mw-color-surface-subtle"],
    ["surface/raised", "--mw-color-surface-elevated"],
    ["surface/disabled", "--mw-color-surface-disabled"],
    ["surface/inverse", "--mw-color-surface-inverted"],
    ["surface/brand", "--mw-color-surface-brand"],
    ["text/primary", "--mw-color-text"],
    ["text/secondary", "--mw-color-text-muted"],
    ["text/disabled", "--mw-color-text-disabled"],
    ["text/link", "--mw-color-text-link"],
    ["icon/muted", "--mw-color-icon-muted"],
    ["border/low", "--mw-color-border-low"],
    ["border/default", "--mw-color-border"],
    ["border/medium", "--mw-color-border-subtle"],
    ["border/strong", "--mw-color-border-strong"],
    ["border/brand", "--mw-color-border-brand"],
    ["focus/ring", "--mw-color-focus"],
  ])

  return directMap.get(token)
}

function collectFamilyPresetVars(registry) {
  const presetPaths = registry.links?.presets ?? []
  const vars = new Set()
  const usages = []
  const pattern = /--mw-[\w-]+/g

  for (const file of presetPaths) {
    if (!pathExists(file) || !file.endsWith(".css")) continue

    const lines = readFileSync(absolute(file), "utf8").split("\n")
    lines.forEach((line, index) => {
      for (const match of line.matchAll(pattern)) {
        vars.add(match[0])
        usages.push({
          cssVar: match[0],
          file,
          line: index + 1,
          text: line.trim(),
        })
      }
    })
  }

  return { vars, usages, presetPaths }
}

function relatedRuntimeVars(expectedCssVar, runtimeVars) {
  const parts = expectedCssVar.split("-")
  const suffix = parts.at(-1)
  const base =
    suffix === "background" ||
    suffix === "text" ||
    suffix === "icon" ||
    suffix === "border" ||
    suffix === "strong" ||
    suffix === "low" ||
    suffix === "subtle"
      ? parts.slice(0, -1).join("-")
      : expectedCssVar

  return [...runtimeVars].filter((cssVar) => cssVar.startsWith(base) && cssVar !== expectedCssVar)
}

function checkRuntimeTokenParity(target, registry) {
  const expectedTokens = (registry.design?.figmaTokens ?? []).map(normalizeTokenName)
  if (expectedTokens.length === 0) {
    return createCheck("Runtime token parity", "pass", ["no registry Figma tokens"])
  }

  const usage = collectFigmaTokenUsage(target, registry)
  if (usage.status !== "pass") {
    return createCheck("Runtime token parity", usage.status, usage.details)
  }

  const { variableMap, boundVariableIds } = usage
  const actualVariables = [...boundVariableIds].map((id) => variableMap.get(id)).filter(Boolean)
  const actualVariablesByName = new Map(
    actualVariables.map((variable) => [variable.normalizedName, variable]),
  )
  const themeVars = new Set(collectThemeVars())
  const runtime = collectFamilyPresetVars(registry)
  const details = [
    `preset files: ${runtime.presetPaths.length}`,
    `runtime vars: ${runtime.vars.size}`,
  ]
  const failures = []
  const checked = new Set()
  const unsupported = new Set()

  for (const expectedToken of expectedTokens) {
    const variable = actualVariablesByName.get(expectedToken)
    if (!variable) continue

    let mappedAliases = 0
    const unsupportedAliases = []

    for (const alias of collectAliasNames(variable)) {
      const expectedCssVar = cssVarForTokenName(alias)
      if (!expectedCssVar) {
        unsupportedAliases.push(alias)
        continue
      }

      mappedAliases += 1
      const checkKey = `${variable.normalizedName}:${alias}:${expectedCssVar}`
      if (checked.has(checkKey)) continue
      checked.add(checkKey)

      if (!themeVars.has(expectedCssVar) && !runtime.vars.has(expectedCssVar)) {
        failures.push(
          [
            `Figma token: ${variable.name}`,
            `Alias: ${alias}`,
            `Expected CSS var: ${expectedCssVar}`,
            "Found CSS var: missing from theme exposure and family preset CSS",
          ].join(" | "),
        )
        continue
      }

      if (!runtime.vars.has(expectedCssVar)) {
        const related = relatedRuntimeVars(expectedCssVar, runtime.vars)
        failures.push(
          [
            `Figma token: ${variable.name}`,
            `Alias: ${alias}`,
            `Expected CSS var: ${expectedCssVar}`,
            `Found CSS var: ${related.length > 0 ? related.join(", ") : "none in family preset CSS"}`,
          ].join(" | "),
        )
      }
    }

    if (mappedAliases === 0 && unsupportedAliases.length > 0) {
      unsupported.add(`${variable.name} -> ${unsupportedAliases.join(", ")}`)
    }
  }

  details.push(`checked mappings: ${checked.size}`)
  if (unsupported.size > 0) {
    details.push(`unsupported color mappings skipped: ${unsupported.size}`)
    if (verbose) {
      for (const mapping of [...unsupported].sort()) {
        details.push(`  unsupported: ${mapping}`)
      }
    }
  }

  return createCheck("Runtime token parity", failures.length === 0 ? "pass" : "fail", [
    ...details,
    ...failures,
  ])
}

function checkFetchFreshness(target) {
  const required = [
    `${target.liveDir}/manifest.json`,
    `${target.liveDir}/components/_index.json`,
    `${target.liveDir}/tokens/colors.json`,
  ]
  const missing = collectMissing(required)

  if (missing.length > 0) {
    return createCheck("Fetch freshness", "fail", failDetails(missing))
  }

  const manifestPath = `${target.liveDir}/manifest.json`
  const manifest = readJson(manifestPath)
  const manifestStat = statSync(absolute(manifestPath))

  return createCheck("Fetch freshness", "pass", [
    `target: ${target.name}`,
    `source: ${target.liveDir}`,
    `manifest modified: ${manifestStat.mtime.toISOString()}`,
    `sync version: ${manifest.version ?? "unknown"}`,
  ])
}

function validateFamily(familyName, target) {
  const registry = readFamilyRegistry(familyName)

  return {
    family: familyName,
    checks: runtimeOnly
      ? [checkRuntimeTokenParity(target, registry)]
      : [
          checkFetchFreshness(target),
          checkFigmaReferences(registry),
          checkFigmaTokenParity(target, registry),
          checkRuntimeTokenParity(target, registry),
          checkFrameworkSurfaces(registry),
        ],
  }
}

function hasProblems(checks, includeBlocked = true) {
  return checks.some(
    (check) => check.status === "fail" || (includeBlocked && check.status === "blocked"),
  )
}

function printCheck(check) {
  const marker = check.status === "pass" ? "pass" : check.status === "blocked" ? "block" : "fail"
  console.log(`[${marker}] ${check.name}`)
  for (const detail of check.details) {
    console.log(`       ${detail}`)
  }
}

function printColorReport(report) {
  console.log("colors:check")
  console.log("")
  console.log(`Contract color vars: ${report.contractSize}`)
  console.log("")
  for (const check of report.checks) {
    printCheck(check)
  }
}

function printFigmaReport(report) {
  console.log(`${runtimeOnly ? "design:validate-runtime" : "design:validate"} ${report.selection}`)
  console.log("")
  console.log(`Target: ${report.target.name}`)
  console.log(`Source: ${report.target.liveDir}`)
  console.log("")

  for (const familyReport of report.families) {
    console.log(`Family: ${familyReport.family}`)
    console.log("")
    for (const check of familyReport.checks) {
      printCheck(check)
    }
    console.log("")
  }
}

function main() {
  if (colorsOnly) {
    const report = runColorChecks()
    if (jsonOutput) {
      console.log(JSON.stringify(report, null, 2))
    } else {
      printColorReport(report)
    }

    process.exit(hasProblems(report.checks, false) ? 1 : 0)
  }

  if (!allFamilies && !family) {
    console.error(usage())
    process.exit(1)
  }

  const target = readSyncTarget()
  const availableFamilies = listRegistryFamilies()
  const selectedFamilies = allFamilies ? availableFamilies : [family]

  for (const selectedFamily of selectedFamilies) {
    if (!availableFamilies.includes(selectedFamily)) {
      console.error(`Unknown family: ${selectedFamily}`)
      console.error("")
      console.error(`Known families: ${availableFamilies.join(", ")}`)
      process.exit(1)
    }
  }

  const report = {
    selection: allFamilies ? "--all" : family,
    target,
    families: selectedFamilies.map((selectedFamily) => validateFamily(selectedFamily, target)),
  }

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    printFigmaReport(report)
  }

  process.exit(report.families.some((item) => hasProblems(item.checks)) ? 1 : 0)
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
