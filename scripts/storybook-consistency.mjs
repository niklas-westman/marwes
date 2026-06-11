import { existsSync, readdirSync } from "node:fs"
import { access, readFile, readdir } from "node:fs/promises"
import { basename, extname, join, resolve } from "node:path"
import process from "node:process"

const frameworkConfigs = {
  react: {
    name: "react",
    label: "React",
    sourceRoot: "packages/react/src/components",
    storyRoot: "apps/storybook-react/src/stories",
  },
  vue: {
    name: "vue",
    label: "Vue",
    sourceRoot: "packages/vue/src/components",
    storyRoot: "apps/storybook-vue/src/stories",
  },
  svelte: {
    name: "svelte",
    label: "Svelte",
    sourceRoot: "packages/svelte/src/lib/components",
    storyRoot: "apps/storybook-svelte/src/stories",
  },
}

const frameworksInOrder = ["react", "vue", "svelte"]

function normalizePathForMatch(path) {
  return path.replace(/\\/g, "/")
}

function toRelativePath(repoRoot, path) {
  return normalizePathForMatch(path.replace(`${repoRoot}/`, ""))
}

function toPascalCase(value) {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function toKebabCase(value) {
  return value
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase()
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right))
}

async function loadStorybookCompanionConfig() {
  const configPath = resolve(process.cwd(), ".pi/storybook-companion.config.ts")
  const configSource = await readFile(configPath, "utf8")
  const typescript = await import("typescript")

  const transpiledConfig = typescript.transpileModule(configSource, {
    compilerOptions: {
      module: typescript.ModuleKind.ES2022,
      target: typescript.ScriptTarget.ES2022,
    },
  }).outputText

  const configModuleUrl = `data:text/javascript;base64,${Buffer.from(transpiledConfig).toString("base64")}`
  const configModule = await import(configModuleUrl)
  return configModule.storybookCompanionConfig
}

function getFamilyConfig(config, family) {
  return config.families[family]
}

function isStoryOnlyFamily(config, family) {
  return getFamilyConfig(config, family)?.storyOnly ?? false
}

function isExcludedFamily(config, family) {
  return getFamilyConfig(config, family)?.excluded ?? false
}

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function readDirectFiles(directoryPath) {
  if (!(await pathExists(directoryPath))) {
    return []
  }

  const entries = await readdir(directoryPath, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(directoryPath, entry.name))
    .sort((left, right) => left.localeCompare(right))
}

async function readTestFiles(directoryPath) {
  const testsDirectory = join(directoryPath, "__tests__")
  if (!(await pathExists(testsDirectory))) {
    return []
  }

  const entries = await readdir(testsDirectory, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(testsDirectory, entry.name))
    .sort((left, right) => left.localeCompare(right))
}

function getAvailableFamilies(repoRoot, config) {
  const componentFamilies = frameworksInOrder.flatMap((framework) => {
    const frameworkConfig = frameworkConfigs[framework]
    const rootPath = join(repoRoot, frameworkConfig.sourceRoot)
    if (!existsSync(rootPath)) {
      return []
    }

    return readDirectoryNames(rootPath)
  })

  const supportedStoryOnlyFamilies = Object.entries(config.families)
    .filter(([, familyConfig]) => familyConfig.storyOnly)
    .map(([family]) => family)
    .filter((family) => {
      return frameworksInOrder.some((framework) => {
        const frameworkConfig = frameworkConfigs[framework]
        return existsSync(join(repoRoot, frameworkConfig.storyRoot, family))
      })
    })

  return uniqueSorted(
    [...componentFamilies, ...supportedStoryOnlyFamilies].filter(
      (family) => !isExcludedFamily(config, family),
    ),
  )
}

function readDirectoryNames(rootPath) {
  return readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

function isStoryFile(path) {
  return /\.stories\.(ts|tsx|js|jsx|mdx)$/.test(normalizePathForMatch(path))
}

function isSourceFile(path) {
  const extension = extname(path)
  return extension === ".ts" || extension === ".tsx" || extension === ".svelte"
}

function getStemWithoutExtension(path) {
  const fileName = basename(path)
  return toKebabCase(
    fileName.replace(/\.stories\.(ts|tsx|js|jsx|mdx)$/, "").replace(/\.[^.]+$/, ""),
  )
}

function shouldIgnoreComponentStemForStoryCoverage(config, stem) {
  const ignoredPatterns = config.ignoredComponentStemPatterns

  if (ignoredPatterns.exact.includes(stem)) {
    return true
  }

  return (
    ignoredPatterns.suffixes.some((suffix) => stem.endsWith(suffix)) ||
    ignoredPatterns.prefixes.some((prefix) => stem.startsWith(prefix))
  )
}

function getStoryBearingComponentStems(config, componentFiles, family) {
  const canonicalComponentStems = getFamilyConfig(config, family)?.canonicalComponentStems

  if (canonicalComponentStems) {
    return new Set(canonicalComponentStems)
  }

  return new Set(
    componentFiles
      .map((path) => getStemWithoutExtension(path))
      .filter((stem) => stem !== "types")
      .filter((stem) => !shouldIgnoreComponentStemForStoryCoverage(config, stem)),
  )
}

function extractMetaTitle(content) {
  const metaTitleMatchers = [
    /const\s+meta[\s\S]*?=\s*\{[\s\S]*?\btitle\s*:\s*["'`](.*?)["'`]/,
    /export\s+default\s+\{[\s\S]*?\btitle\s*:\s*["'`](.*?)["'`]/,
    /title\s*:\s*["'`](.*?)["'`]/,
  ]

  for (const matcher of metaTitleMatchers) {
    const match = content.match(matcher)
    if (match?.[1]) {
      return match[1]
    }
  }

  return undefined
}

function extractStoryExportSummaries(content) {
  const exportMatches = [...content.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g)]

  return exportMatches.map((match, index) => {
    const nextMatch = exportMatches[index + 1]
    const exportBlock = content.slice(match.index, nextMatch?.index)

    return {
      name: match[1],
      renderMode: exportBlock.includes("render:")
        ? "render"
        : exportBlock.includes("args:")
          ? "args"
          : "unknown",
    }
  })
}

async function extractStoryFileSummary(filePath) {
  const content = await readFile(filePath, "utf8")
  const exports = extractStoryExportSummaries(content)

  return {
    path: filePath,
    stem: getStemWithoutExtension(filePath),
    title: extractMetaTitle(content),
    exports: exports.map((entry) => entry.name),
    exportSummaries: exports,
  }
}

function parseExportSpecifiers(specifierBlock) {
  return uniqueSorted(
    specifierBlock
      .split(",")
      .map((specifier) => specifier.trim())
      .filter(Boolean)
      .map((specifier) =>
        specifier
          .split(/\s+as\s+/)
          .pop()
          .trim(),
      ),
  )
}

function extractIndexExportSummary(content) {
  const valueExports = []
  const typeExports = []

  for (const match of content.matchAll(
    /export\s+(type\s+)?\{([^}]+)\}\s+from\s+["'`][^"'`]+["'`]/g,
  )) {
    const exportNames = parseExportSpecifiers(match[2])
    if (match[1]) {
      typeExports.push(...exportNames)
      continue
    }

    valueExports.push(...exportNames)
  }

  return {
    valueExports: uniqueSorted(valueExports),
    typeExports: uniqueSorted(typeExports),
  }
}

async function extractFrameworkExportSummary(sourceIndexFile) {
  if (!sourceIndexFile) {
    return {
      valueExports: [],
      typeExports: [],
    }
  }

  const content = await readFile(sourceIndexFile, "utf8")
  return extractIndexExportSummary(content)
}

async function buildFrameworkFamilyMap(family, repoRoot, framework) {
  const frameworkConfig = frameworkConfigs[framework]
  const sourceDir = join(repoRoot, frameworkConfig.sourceRoot, family)
  const storyDir = join(repoRoot, frameworkConfig.storyRoot, family)
  const sourceDirExists = await pathExists(sourceDir)
  const storyDirExists = await pathExists(storyDir)

  const sourceFiles = (await readDirectFiles(sourceDir)).filter((path) => isSourceFile(path))
  const componentFiles = sourceFiles.filter((path) => basename(path) !== "index.ts")
  const sourceIndexFile = sourceFiles.find((path) => basename(path) === "index.ts")
  const exportSummary = await extractFrameworkExportSummary(sourceIndexFile)
  const componentTests = await readTestFiles(sourceDir)

  const storyEntries = await readDirectFiles(storyDir)
  const storyFiles = await Promise.all(
    storyEntries.filter((path) => isStoryFile(path)).map((path) => extractStoryFileSummary(path)),
  )
  const docsFiles = storyEntries.filter((path) => path.endsWith(".mdx") && !isStoryFile(path))
  const storyTests = await readTestFiles(storyDir)

  return {
    framework,
    label: frameworkConfig.label,
    sourceDir,
    storyDir,
    sourceDirExists,
    storyDirExists,
    componentFiles,
    sourceIndexFile,
    exportSummary,
    componentTests,
    storyFiles: storyFiles.sort((left, right) => left.path.localeCompare(right.path)),
    docsFiles,
    storyTests,
  }
}

async function buildFamilyMap(family, repoRoot) {
  const frameworkEntries = await Promise.all(
    frameworksInOrder.map(async (framework) => [
      framework,
      await buildFrameworkFamilyMap(family, repoRoot, framework),
    ]),
  )

  return {
    repoRoot,
    family,
    frameworks: Object.fromEntries(frameworkEntries),
  }
}

function getFamilyMapFramework(map, framework) {
  return map.frameworks[framework]
}

function getExpectedStoryTitle(config, family, stem) {
  const configuredTitle = getFamilyConfig(config, family)?.titleByStem?.[stem]
  if (configuredTitle) {
    return configuredTitle
  }

  const familyName = toPascalCase(family)

  if (stem === family) {
    return `${familyName}/Atom`
  }

  return `${familyName}/Molecule/${toPascalCase(stem)}`
}

function isSemanticStoryGroupTitle(title) {
  return Boolean(title && (title.includes("/Purpose/") || title.includes("/Variant/")))
}

function shouldCompareRenderMode(config, family, stem, exportName) {
  const renderModeParityByStem = getFamilyConfig(config, family)?.renderModeParityByStem
  if (!renderModeParityByStem) return false

  return renderModeParityByStem[stem]?.includes(exportName) ?? false
}

function buildFrameworkCoverageWarnings(config, map, framework) {
  const frameworkMap = getFamilyMapFramework(map, framework)
  const warnings = []
  const componentStems = getStoryBearingComponentStems(
    config,
    frameworkMap.componentFiles,
    map.family,
  )
  const storyStems = new Set(frameworkMap.storyFiles.map((storyFile) => storyFile.stem))
  const storyOnly = isStoryOnlyFamily(config, map.family)

  if (!frameworkMap.sourceDirExists && !storyOnly) {
    warnings.push(`${frameworkMap.label} source directory is missing for this family`)
  }

  if (!frameworkMap.storyDirExists) {
    warnings.push(`${frameworkMap.label} Storybook directory is missing for this family`)
  }

  if (frameworkMap.componentFiles.length === 0 && !storyOnly) {
    warnings.push(`No ${frameworkMap.label} component files were found`)
  }

  if (!frameworkMap.sourceIndexFile && !storyOnly) {
    warnings.push(`No ${frameworkMap.label} index.ts export surface was found for the family`)
  }

  if (frameworkMap.storyFiles.length === 0) {
    warnings.push(`No ${frameworkMap.label} Storybook story files were found`)
  }

  if (frameworkMap.docsFiles.length === 0) {
    warnings.push(`No ${frameworkMap.label} Introduction.mdx file was found for the family`)
  }

  if (!frameworkMap.storyTests.some((path) => basename(path).includes("taxonomy"))) {
    warnings.push(`No ${frameworkMap.label} taxonomy test was found in the Storybook family`)
  }

  if (!frameworkMap.storyTests.some((path) => basename(path).includes("introduction-docs"))) {
    warnings.push(
      `No ${frameworkMap.label} introduction docs test was found in the Storybook family`,
    )
  }

  if (!storyOnly) {
    for (const componentStem of componentStems) {
      if (!storyStems.has(componentStem)) {
        warnings.push(
          `Missing ${frameworkMap.label} story file for component stem "${componentStem}"`,
        )
      }
    }

    for (const storyFile of frameworkMap.storyFiles) {
      if (isSemanticStoryGroupTitle(storyFile.title)) continue

      const storyStem = storyFile.stem
      if (!componentStems.has(storyStem)) {
        warnings.push(
          `Story stem "${storyStem}" has no matching ${frameworkMap.label} component file`,
        )
      }
    }
  }

  for (const storyFile of frameworkMap.storyFiles) {
    if (!storyFile.title) {
      warnings.push(`Story file ${toRelativePath(map.repoRoot, storyFile.path)} has no meta title`)
      continue
    }

    const expectedTitle = getExpectedStoryTitle(config, map.family, storyFile.stem)
    if (storyFile.title !== expectedTitle) {
      warnings.push(
        `${frameworkMap.label} story title "${storyFile.title}" should be "${expectedTitle}" for ${toRelativePath(map.repoRoot, storyFile.path)}`,
      )
    }
  }

  return warnings
}

function buildCrossFrameworkExportWarnings(config, map) {
  if (
    getFamilyConfig(config, map.family)?.exportParityExempt ||
    isStoryOnlyFamily(config, map.family)
  ) {
    return []
  }

  const warnings = []
  const baselineFramework = "react"
  const baselineMap = getFamilyMapFramework(map, baselineFramework)

  for (const framework of frameworksInOrder.filter((name) => name !== baselineFramework)) {
    const frameworkMap = getFamilyMapFramework(map, framework)

    for (const baselineValueExport of baselineMap.exportSummary.valueExports) {
      if (!frameworkMap.exportSummary.valueExports.includes(baselineValueExport)) {
        warnings.push(
          `${baselineMap.label} value export "${baselineValueExport}" is missing from ${frameworkMap.label} index.ts`,
        )
      }
    }

    for (const frameworkValueExport of frameworkMap.exportSummary.valueExports) {
      if (!baselineMap.exportSummary.valueExports.includes(frameworkValueExport)) {
        warnings.push(
          `${frameworkMap.label} value export "${frameworkValueExport}" is missing from ${baselineMap.label} index.ts`,
        )
      }
    }

    for (const baselineTypeExport of baselineMap.exportSummary.typeExports) {
      if (!frameworkMap.exportSummary.typeExports.includes(baselineTypeExport)) {
        warnings.push(
          `${baselineMap.label} type export "${baselineTypeExport}" is missing from ${frameworkMap.label} index.ts`,
        )
      }
    }

    for (const frameworkTypeExport of frameworkMap.exportSummary.typeExports) {
      if (!baselineMap.exportSummary.typeExports.includes(frameworkTypeExport)) {
        warnings.push(
          `${frameworkMap.label} type export "${frameworkTypeExport}" is missing from ${baselineMap.label} index.ts`,
        )
      }
    }
  }

  return warnings
}

function findStoryFileByStem(frameworkMap, stem) {
  return frameworkMap.storyFiles.find((storyFile) => storyFile.stem === stem)
}

function buildStoryExportWarnings(config, map, baselineFramework, framework) {
  const baselineMap = getFamilyMapFramework(map, baselineFramework)
  const frameworkMap = getFamilyMapFramework(map, framework)
  const warnings = []

  for (const baselineStoryFile of baselineMap.storyFiles) {
    const frameworkStoryFile = findStoryFileByStem(frameworkMap, baselineStoryFile.stem)
    if (!frameworkStoryFile) continue

    for (const baselineExport of baselineStoryFile.exportSummaries) {
      const matchingExport = frameworkStoryFile.exportSummaries.find(
        (entry) => entry.name === baselineExport.name,
      )

      if (!matchingExport) {
        warnings.push(
          `${frameworkMap.label} story ${frameworkStoryFile.stem} is missing story export "${baselineExport.name}" from ${baselineMap.label}`,
        )
        continue
      }

      if (
        shouldCompareRenderMode(config, map.family, baselineStoryFile.stem, matchingExport.name) &&
        matchingExport.renderMode !== baselineExport.renderMode
      ) {
        warnings.push(
          `${frameworkMap.label} story ${frameworkStoryFile.stem}/${matchingExport.name} uses ${matchingExport.renderMode}, but ${baselineMap.label} uses ${baselineExport.renderMode}`,
        )
      }
    }
  }

  return warnings
}

function buildCrossFrameworkWarnings(config, map) {
  const warnings = []
  const baselineFramework = "react"
  const baselineMap = getFamilyMapFramework(map, baselineFramework)
  const baselineStems = getStoryBearingComponentStems(
    config,
    baselineMap.componentFiles,
    map.family,
  )

  for (const framework of frameworksInOrder.filter((name) => name !== baselineFramework)) {
    const frameworkMap = getFamilyMapFramework(map, framework)
    const frameworkStems = getStoryBearingComponentStems(
      config,
      frameworkMap.componentFiles,
      map.family,
    )

    if (!isStoryOnlyFamily(config, map.family)) {
      for (const baselineStem of baselineStems) {
        if (!frameworkStems.has(baselineStem)) {
          warnings.push(
            `${baselineMap.label} component stem "${baselineStem}" has no matching ${frameworkMap.label} component file`,
          )
        }
      }

      for (const frameworkStem of frameworkStems) {
        if (!baselineStems.has(frameworkStem)) {
          warnings.push(
            `${frameworkMap.label} component stem "${frameworkStem}" has no matching ${baselineMap.label} component file`,
          )
        }
      }
    }

    const baselineStoryStems = new Set(baselineMap.storyFiles.map((storyFile) => storyFile.stem))
    const frameworkStoryStems = new Set(frameworkMap.storyFiles.map((storyFile) => storyFile.stem))

    for (const baselineStoryStem of baselineStoryStems) {
      if (!frameworkStoryStems.has(baselineStoryStem)) {
        warnings.push(
          `${baselineMap.label} story stem "${baselineStoryStem}" has no matching ${frameworkMap.label} story file`,
        )
      }
    }

    for (const frameworkStoryStem of frameworkStoryStems) {
      if (!baselineStoryStems.has(frameworkStoryStem)) {
        warnings.push(
          `${frameworkMap.label} story stem "${frameworkStoryStem}" has no matching ${baselineMap.label} story file`,
        )
      }
    }

    warnings.push(...buildStoryExportWarnings(config, map, baselineFramework, framework))
  }

  warnings.push(...buildCrossFrameworkExportWarnings(config, map))

  return warnings
}

function collectCoverageWarnings(config, map) {
  return [
    ...frameworksInOrder.flatMap((framework) =>
      buildFrameworkCoverageWarnings(config, map, framework),
    ),
    ...buildCrossFrameworkWarnings(config, map),
  ]
}

function classifyWarningSeverity(warning) {
  const criticalSignals = [
    "source directory is missing",
    "storybook directory is missing",
    "no react component files were found",
    "no vue component files were found",
    "no svelte component files were found",
    "no react storybook story files were found",
    "no vue storybook story files were found",
    "no svelte storybook story files were found",
    "no react index.ts export surface was found",
    "no vue index.ts export surface was found",
    "no svelte index.ts export surface was found",
    "missing react story file",
    "missing vue story file",
    "missing svelte story file",
    "has no matching react component file",
    "has no matching vue component file",
    "has no matching svelte component file",
    "has no matching react story file",
    "has no matching vue story file",
    "has no matching svelte story file",
    "is missing from react index.ts",
    "is missing from vue index.ts",
    "is missing from svelte index.ts",
  ]
  const warningSignals = [
    "no react introduction.mdx file was found",
    "no vue introduction.mdx file was found",
    "no svelte introduction.mdx file was found",
    "no react taxonomy test was found",
    "no vue taxonomy test was found",
    "no svelte taxonomy test was found",
    "no react introduction docs test was found",
    "no vue introduction docs test was found",
    "no svelte introduction docs test was found",
    "story title",
    "uses args, but",
    "uses render, but",
  ]

  const normalizedWarning = warning.toLowerCase()

  if (criticalSignals.some((signal) => normalizedWarning.includes(signal))) {
    return "critical"
  }

  if (warningSignals.some((signal) => normalizedWarning.includes(signal))) {
    return "warning"
  }

  return "suggestion"
}

function buildScore(summary) {
  const rawScore = 100 - summary.critical * 25 - summary.warning * 10 - summary.suggestion * 3
  return Math.max(0, Math.min(100, rawScore))
}

function getHealthLabel(score) {
  if (score >= 90) return "excellent"
  if (score >= 75) return "strong"
  if (score >= 60) return "fair"
  if (score >= 40) return "fragile"
  return "critical"
}

async function main() {
  const repoRoot = process.cwd()
  const config = await loadStorybookCompanionConfig()
  const familyArgIndex = process.argv.findIndex((arg) => arg === "--family")
  const requestedFamily = familyArgIndex >= 0 ? process.argv[familyArgIndex + 1] : undefined
  const families = requestedFamily ? [requestedFamily] : getAvailableFamilies(repoRoot, config)

  const results = []

  for (const family of families) {
    if (isExcludedFamily(config, family)) {
      console.error(`Family "${family}" is excluded from Storybook consistency checks`)
      process.exitCode = 1
      return
    }

    const map = await buildFamilyMap(family, repoRoot)
    const warnings = collectCoverageWarnings(config, map)
    const summary = warnings.reduce(
      (totals, warning) => {
        totals[classifyWarningSeverity(warning)] += 1
        return totals
      },
      { critical: 0, warning: 0, suggestion: 0 },
    )

    results.push({
      family,
      warnings,
      summary,
      score: buildScore(summary),
    })
  }

  const familiesWithFindings = results.filter((result) => result.warnings.length > 0)
  const totals = results.reduce(
    (aggregate, result) => ({
      critical: aggregate.critical + result.summary.critical,
      warning: aggregate.warning + result.summary.warning,
      suggestion: aggregate.suggestion + result.summary.suggestion,
    }),
    { critical: 0, warning: 0, suggestion: 0 },
  )

  console.log("Storybook consistency audit")
  if (requestedFamily) {
    console.log(`Family: ${requestedFamily}`)
  }
  console.log(`Families scanned: ${results.length}`)
  console.log(`Healthy families: ${results.length - familiesWithFindings.length}`)
  console.log(`Families with findings: ${familiesWithFindings.length}`)
  console.log(
    `Severity totals: critical ${totals.critical}, warning ${totals.warning}, suggestion ${totals.suggestion}`,
  )

  if (familiesWithFindings.length === 0) {
    console.log("✓ Storybook consistency audit passed")
    return
  }

  console.error("✗ Storybook consistency audit found issues")

  for (const result of familiesWithFindings.sort((left, right) =>
    left.family.localeCompare(right.family),
  )) {
    console.error("")
    console.error(`${result.family} — ${result.score}/100 (${getHealthLabel(result.score)})`)
    for (const warning of result.warnings) {
      console.error(`- ${warning}`)
    }
  }

  process.exitCode = 1
}

await main()
