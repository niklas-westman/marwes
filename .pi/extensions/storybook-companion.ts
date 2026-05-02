import { existsSync, readdirSync } from "node:fs"
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { basename, extname, isAbsolute, join, relative, resolve } from "node:path"

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent"
import { Box, Text } from "@mariozechner/pi-tui"
import type { AutocompleteItem } from "@mariozechner/pi-tui"

import { storybookCompanionConfig } from "../storybook-companion.config"

const STORYBOOK_REPORT_TYPE = "storybook-companion-report"

type FrameworkName = "react" | "vue"

interface FrameworkConfig {
  name: FrameworkName
  label: string
  sourceRoot: string
  storyRoot: string
}

interface FamilyResolution {
  repoRoot: string
  family: string
  targetPath?: string
  targetFramework?: FrameworkName
}

interface StoryFileSummary {
  path: string
  stem: string
  title?: string
  exports: string[]
}

interface ExportSummary {
  valueExports: string[]
  typeExports: string[]
}

interface FrameworkFamilyMap {
  framework: FrameworkName
  label: string
  sourceRoot: string
  storyRoot: string
  sourceDir: string
  storyDir: string
  sourceDirExists: boolean
  storyDirExists: boolean
  componentFiles: string[]
  sourceIndexFile?: string
  exportSummary: ExportSummary
  componentTests: string[]
  storyFiles: StoryFileSummary[]
  docsFiles: string[]
  storyTests: string[]
}

interface FamilyMap {
  repoRoot: string
  family: string
  frameworks: Record<FrameworkName, FrameworkFamilyMap>
}

interface ImpactSummary {
  title: string
  primary: string[]
  secondary: string[]
  notes: string[]
}

type WarningSeverity = "critical" | "warning" | "suggestion"

const frameworkConfigs: Record<FrameworkName, FrameworkConfig> = {
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
}

const frameworksInOrder: FrameworkName[] = ["react", "vue"]

function normalizePathForMatch(path: string): string {
  return path.replace(/\\/g, "/")
}

function toRelativePath(repoRoot: string, path: string): string {
  return normalizePathForMatch(relative(repoRoot, path) || path)
}

function toPascalCase(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function uniqueSorted(paths: string[]): string[] {
  return [...new Set(paths)].sort((left, right) => left.localeCompare(right))
}

function getFamilyConfig(family: string) {
  return storybookCompanionConfig.families[family]
}

function isStoryOnlyFamily(family: string): boolean {
  return getFamilyConfig(family)?.storyOnly ?? false
}

function isExcludedFamily(family: string): boolean {
  return getFamilyConfig(family)?.excluded ?? false
}

function createEmptyExportSummary(): ExportSummary {
  return {
    valueExports: [],
    typeExports: [],
  }
}

function getFrameworkMap(map: FamilyMap, framework: FrameworkName): FrameworkFamilyMap {
  return map.frameworks[framework]
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function hasRepoMarkersSync(path: string): boolean {
  return frameworksInOrder.every((framework) => {
    const config = frameworkConfigs[framework]
    return existsSync(join(path, config.sourceRoot)) && existsSync(join(path, config.storyRoot))
  })
}

async function hasRepoMarkers(path: string): Promise<boolean> {
  for (const framework of frameworksInOrder) {
    const config = frameworkConfigs[framework]
    const hasSource = await pathExists(join(path, config.sourceRoot))
    const hasStory = await pathExists(join(path, config.storyRoot))

    if (!hasSource || !hasStory) {
      return false
    }
  }

  return true
}

async function findRepoRoot(startPath: string): Promise<string | undefined> {
  let currentPath = resolve(startPath)

  while (true) {
    if (await hasRepoMarkers(currentPath)) {
      return currentPath
    }

    const parentPath = resolve(currentPath, "..")
    if (parentPath === currentPath) {
      return undefined
    }

    currentPath = parentPath
  }
}

function findRepoRootSync(startPath: string): string | undefined {
  let currentPath = resolve(startPath)

  while (true) {
    if (hasRepoMarkersSync(currentPath)) {
      return currentPath
    }

    const parentPath = resolve(currentPath, "..")
    if (parentPath === currentPath) {
      return undefined
    }

    currentPath = parentPath
  }
}

async function resolveFamilyInput(input: string, cwd: string): Promise<FamilyResolution> {
  const repoRoot = await findRepoRoot(cwd)
  if (!repoRoot) {
    throw new Error("Could not find the Marwes repo root from the current working directory")
  }

  const trimmedInput = input.trim()
  if (!trimmedInput) {
    throw new Error("Usage: /story-map <family|path>")
  }

  const looksLikePath =
    trimmedInput.includes("/") || trimmedInput.includes("\\") || trimmedInput.startsWith(".")

  if (!looksLikePath) {
    if (isExcludedFamily(trimmedInput)) {
      throw new Error(
        `Family "${trimmedInput}" is currently excluded from Storybook companion audits`,
      )
    }

    return {
      repoRoot,
      family: trimmedInput,
    }
  }

  const absoluteTargetPath = isAbsolute(trimmedInput)
    ? resolve(trimmedInput)
    : resolve(cwd, trimmedInput)
  const repoRelativePath = normalizePathForMatch(relative(repoRoot, absoluteTargetPath))

  for (const framework of frameworksInOrder) {
    const config = frameworkConfigs[framework]
    const sourcePrefix = `${config.sourceRoot}/`
    const storyPrefix = `${config.storyRoot}/`

    if (repoRelativePath.startsWith(sourcePrefix)) {
      const family = repoRelativePath.slice(sourcePrefix.length).split("/")[0]
      if (isExcludedFamily(family)) {
        throw new Error(`Family "${family}" is currently excluded from Storybook companion audits`)
      }
      return { repoRoot, family, targetPath: absoluteTargetPath, targetFramework: framework }
    }

    if (repoRelativePath.startsWith(storyPrefix)) {
      const family = repoRelativePath.slice(storyPrefix.length).split("/")[0]
      if (isExcludedFamily(family)) {
        throw new Error(`Family "${family}" is currently excluded from Storybook companion audits`)
      }
      return { repoRoot, family, targetPath: absoluteTargetPath, targetFramework: framework }
    }
  }

  throw new Error(
    `Input is outside the supported Marwes component/storybook roots: ${trimmedInput}`,
  )
}

async function readDirectFiles(directoryPath: string): Promise<string[]> {
  if (!(await pathExists(directoryPath))) {
    return []
  }

  const entries = await readdir(directoryPath, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(directoryPath, entry.name))
    .sort((left, right) => left.localeCompare(right))
}

async function readTestFiles(directoryPath: string): Promise<string[]> {
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

function getAvailableFamiliesSync(startPath: string): string[] {
  const repoRoot = findRepoRootSync(startPath)
  if (!repoRoot) {
    return []
  }

  const componentFamilies = frameworksInOrder.flatMap((framework) => {
    const config = frameworkConfigs[framework]
    const rootPath = join(repoRoot, config.sourceRoot)
    if (!existsSync(rootPath)) {
      return []
    }

    return readdirSync(rootPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  })

  const supportedStoryOnlyFamilies = Object.entries(storybookCompanionConfig.families)
    .filter(([, familyConfig]) => familyConfig.storyOnly)
    .map(([family]) => family)
    .filter((family) => {
      return frameworksInOrder.some((framework) => {
        const config = frameworkConfigs[framework]
        return existsSync(join(repoRoot, config.storyRoot, family))
      })
    })

  return uniqueSorted(
    [...componentFamilies, ...supportedStoryOnlyFamilies].filter(
      (family) => !isExcludedFamily(family),
    ),
  )
}

function getFamilyArgumentCompletions(prefix: string): AutocompleteItem[] | null {
  const trimmedPrefix = prefix.trim()
  const families = getAvailableFamiliesSync(process.cwd())
  const filteredFamilies = families.filter((family) => family.startsWith(trimmedPrefix))

  if (filteredFamilies.length === 0) {
    return null
  }

  return filteredFamilies.map((family) => ({
    value: family,
    label: family,
  }))
}

function isStoryFile(path: string): boolean {
  const normalizedPath = normalizePathForMatch(path)
  return /\.stories\.(ts|tsx|js|jsx|mdx)$/.test(normalizedPath)
}

function isTypeScriptFile(path: string): boolean {
  const extension = extname(path)
  return extension === ".ts" || extension === ".tsx"
}

function getStemWithoutExtension(path: string): string {
  const fileName = basename(path)
  return fileName.replace(/\.stories\.(ts|tsx|js|jsx|mdx)$/, "").replace(/\.[^.]+$/, "")
}

function shouldIgnoreComponentStemForStoryCoverage(stem: string): boolean {
  const ignoredStemPatterns = storybookCompanionConfig.ignoredComponentStemPatterns

  if (ignoredStemPatterns.exact.includes(stem)) {
    return true
  }

  return (
    ignoredStemPatterns.suffixes.some((suffix) => stem.endsWith(suffix)) ||
    ignoredStemPatterns.prefixes.some((prefix) => stem.startsWith(prefix))
  )
}

function getStoryBearingComponentStems(componentFiles: string[], family?: string): Set<string> {
  const canonicalComponentStems = family
    ? getFamilyConfig(family)?.canonicalComponentStems
    : undefined

  if (canonicalComponentStems) {
    return new Set(canonicalComponentStems)
  }

  return new Set(
    componentFiles
      .map((path) => getStemWithoutExtension(path))
      .filter((stem) => !shouldIgnoreComponentStemForStoryCoverage(stem)),
  )
}

function extractMetaTitle(content: string): string | undefined {
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

async function extractStoryFileSummary(filePath: string): Promise<StoryFileSummary> {
  const content = await readFile(filePath, "utf8")
  const title = extractMetaTitle(content)
  const exports = [...content.matchAll(/export const\s+([A-Za-z0-9_]+)/g)].map((match) => match[1])

  return {
    path: filePath,
    stem: getStemWithoutExtension(filePath),
    title,
    exports,
  }
}

function parseExportSpecifiers(specifierBlock: string): string[] {
  return uniqueSorted(
    specifierBlock
      .split(",")
      .map((specifier) => specifier.trim())
      .filter(Boolean)
      .map((specifier) => {
        const parts = specifier.split(/\s+as\s+/)
        return parts[parts.length - 1].trim()
      }),
  )
}

function extractIndexExportSummary(content: string): ExportSummary {
  const exportSummary = createEmptyExportSummary()

  for (const match of content.matchAll(
    /export\s+(type\s+)?\{([^}]+)\}\s+from\s+["'`][^"'`]+["'`]/g,
  )) {
    const exportNames = parseExportSpecifiers(match[2])
    if (match[1]) {
      exportSummary.typeExports.push(...exportNames)
      continue
    }

    exportSummary.valueExports.push(...exportNames)
  }

  return {
    valueExports: uniqueSorted(exportSummary.valueExports),
    typeExports: uniqueSorted(exportSummary.typeExports),
  }
}

async function extractFrameworkExportSummary(
  sourceIndexFile: string | undefined,
): Promise<ExportSummary> {
  if (!sourceIndexFile) {
    return createEmptyExportSummary()
  }

  const content = await readFile(sourceIndexFile, "utf8")
  return extractIndexExportSummary(content)
}

async function buildFrameworkFamilyMap(
  family: string,
  repoRoot: string,
  framework: FrameworkName,
): Promise<FrameworkFamilyMap> {
  const config = frameworkConfigs[framework]
  const sourceDir = join(repoRoot, config.sourceRoot, family)
  const storyDir = join(repoRoot, config.storyRoot, family)
  const sourceDirExists = await pathExists(sourceDir)
  const storyDirExists = await pathExists(storyDir)

  const sourceFiles = (await readDirectFiles(sourceDir)).filter((path) => isTypeScriptFile(path))
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
    label: config.label,
    sourceRoot: config.sourceRoot,
    storyRoot: config.storyRoot,
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

async function buildFamilyMap(family: string, repoRoot: string): Promise<FamilyMap> {
  const [react, vue] = await Promise.all([
    buildFrameworkFamilyMap(family, repoRoot, "react"),
    buildFrameworkFamilyMap(family, repoRoot, "vue"),
  ])

  return {
    repoRoot,
    family,
    frameworks: {
      react,
      vue,
    },
  }
}

function renderPathList(repoRoot: string, paths: string[]): string {
  if (paths.length === 0) {
    return "- None"
  }

  return paths.map((path) => `- ${toRelativePath(repoRoot, path)}`).join("\n")
}

function getExpectedStoryTitle(family: string, stem: string): string {
  const configuredTitle = getFamilyConfig(family)?.titleByStem?.[stem]

  if (configuredTitle) {
    return configuredTitle
  }

  const familyName = toPascalCase(family)

  if (stem === family) {
    return `${familyName}/Atom`
  }

  return `${familyName}/Molecule/${toPascalCase(stem)}`
}

function isSemanticStoryGroupTitle(title: string | undefined): boolean {
  if (!title) {
    return false
  }

  return title.includes("/Purpose/") || title.includes("/Variant/")
}

function getCanonicalStoryStems(storyFiles: StoryFileSummary[]): Set<string> {
  return new Set(
    storyFiles
      .filter((storyFile) => !isSemanticStoryGroupTitle(storyFile.title))
      .map((storyFile) => storyFile.stem),
  )
}

function buildFrameworkMapSection(map: FamilyMap, framework: FrameworkName): string {
  const frameworkMap = getFrameworkMap(map, framework)
  const filesInOrder = [
    ...frameworkMap.componentFiles,
    ...(frameworkMap.sourceIndexFile ? [frameworkMap.sourceIndexFile] : []),
    ...frameworkMap.storyFiles.map((storyFile) => storyFile.path),
    ...frameworkMap.docsFiles,
    ...frameworkMap.componentTests,
    ...frameworkMap.storyTests,
  ]

  return [
    `## ${frameworkMap.label}`,
    `Source dir: ${toRelativePath(map.repoRoot, frameworkMap.sourceDir)}`,
    `Storybook dir: ${toRelativePath(map.repoRoot, frameworkMap.storyDir)}`,
    "",
    `### ${frameworkMap.label} source`,
    renderPathList(map.repoRoot, [
      ...frameworkMap.componentFiles,
      ...(frameworkMap.sourceIndexFile ? [frameworkMap.sourceIndexFile] : []),
    ]),
    "",
    `### ${frameworkMap.label} exports`,
    "Value exports:",
    frameworkMap.exportSummary.valueExports.length > 0
      ? frameworkMap.exportSummary.valueExports.map((entry) => `- ${entry}`).join("\n")
      : "- None",
    "",
    "Type exports:",
    frameworkMap.exportSummary.typeExports.length > 0
      ? frameworkMap.exportSummary.typeExports.map((entry) => `- ${entry}`).join("\n")
      : "- None",
    "",
    `### ${frameworkMap.label} Storybook`,
    renderPathList(map.repoRoot, [
      ...frameworkMap.storyFiles.map((storyFile) => storyFile.path),
      ...frameworkMap.docsFiles,
    ]),
    "",
    `### ${frameworkMap.label} tests`,
    renderPathList(map.repoRoot, [...frameworkMap.componentTests, ...frameworkMap.storyTests]),
    "",
    `### ${frameworkMap.label} all related files`,
    renderPathList(map.repoRoot, filesInOrder),
  ].join("\n")
}

function buildFrameworkCoverageWarnings(map: FamilyMap, framework: FrameworkName): string[] {
  const frameworkMap = getFrameworkMap(map, framework)
  const warnings: string[] = []
  const componentStems = getStoryBearingComponentStems(frameworkMap.componentFiles, map.family)
  const storyStems = getCanonicalStoryStems(frameworkMap.storyFiles)
  const isStoryOnly = isStoryOnlyFamily(map.family)

  if (!frameworkMap.sourceDirExists && !isStoryOnly) {
    warnings.push(`${frameworkMap.label} source directory is missing for this family`)
  }

  if (!frameworkMap.storyDirExists) {
    warnings.push(`${frameworkMap.label} Storybook directory is missing for this family`)
  }

  if (frameworkMap.componentFiles.length === 0 && !isStoryOnly) {
    warnings.push(`No ${frameworkMap.label} component files were found`)
  }

  if (!frameworkMap.sourceIndexFile && !isStoryOnly) {
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

  if (!isStoryOnly) {
    for (const componentStem of componentStems) {
      if (!storyStems.has(componentStem)) {
        warnings.push(
          `Missing ${frameworkMap.label} story file for component stem \"${componentStem}\"`,
        )
      }
    }

    for (const storyStem of storyStems) {
      if (!componentStems.has(storyStem)) {
        warnings.push(
          `Story stem \"${storyStem}\" has no matching ${frameworkMap.label} component file`,
        )
      }
    }
  }

  for (const storyFile of frameworkMap.storyFiles) {
    if (!storyFile.title) {
      warnings.push(`Story file ${toRelativePath(map.repoRoot, storyFile.path)} has no meta title`)
      continue
    }

    const expectedTitle = getExpectedStoryTitle(map.family, storyFile.stem)
    if (storyFile.title !== expectedTitle) {
      warnings.push(
        `${frameworkMap.label} story title \"${storyFile.title}\" should be \"${expectedTitle}\" for ${toRelativePath(map.repoRoot, storyFile.path)}`,
      )
    }
  }

  return warnings
}

function buildCrossFrameworkExportWarnings(map: FamilyMap): string[] {
  if (getFamilyConfig(map.family)?.exportParityExempt || isStoryOnlyFamily(map.family)) {
    return []
  }

  const reactMap = getFrameworkMap(map, "react")
  const vueMap = getFrameworkMap(map, "vue")
  const warnings: string[] = []

  for (const reactValueExport of reactMap.exportSummary.valueExports) {
    if (!vueMap.exportSummary.valueExports.includes(reactValueExport)) {
      warnings.push(`React value export \"${reactValueExport}\" is missing from Vue index.ts`)
    }
  }

  for (const vueValueExport of vueMap.exportSummary.valueExports) {
    if (!reactMap.exportSummary.valueExports.includes(vueValueExport)) {
      warnings.push(`Vue value export \"${vueValueExport}\" is missing from React index.ts`)
    }
  }

  for (const reactTypeExport of reactMap.exportSummary.typeExports) {
    if (!vueMap.exportSummary.typeExports.includes(reactTypeExport)) {
      warnings.push(`React type export \"${reactTypeExport}\" is missing from Vue index.ts`)
    }
  }

  for (const vueTypeExport of vueMap.exportSummary.typeExports) {
    if (!reactMap.exportSummary.typeExports.includes(vueTypeExport)) {
      warnings.push(`Vue type export \"${vueTypeExport}\" is missing from React index.ts`)
    }
  }

  return warnings
}

function buildCrossFrameworkWarnings(map: FamilyMap): string[] {
  const reactMap = getFrameworkMap(map, "react")
  const vueMap = getFrameworkMap(map, "vue")
  const reactStems = getStoryBearingComponentStems(reactMap.componentFiles, map.family)
  const vueStems = getStoryBearingComponentStems(vueMap.componentFiles, map.family)
  const warnings: string[] = []

  if (!isStoryOnlyFamily(map.family)) {
    for (const reactStem of reactStems) {
      if (!vueStems.has(reactStem)) {
        warnings.push(`React component stem \"${reactStem}\" has no matching Vue component file`)
      }
    }

    for (const vueStem of vueStems) {
      if (!reactStems.has(vueStem)) {
        warnings.push(`Vue component stem \"${vueStem}\" has no matching React component file`)
      }
    }
  }

  const reactStoryStems = getCanonicalStoryStems(reactMap.storyFiles)
  const vueStoryStems = getCanonicalStoryStems(vueMap.storyFiles)

  for (const reactStoryStem of reactStoryStems) {
    if (!vueStoryStems.has(reactStoryStem)) {
      warnings.push(`React story stem \"${reactStoryStem}\" has no matching Vue story file`)
    }
  }

  for (const vueStoryStem of vueStoryStems) {
    if (!reactStoryStems.has(vueStoryStem)) {
      warnings.push(`Vue story stem \"${vueStoryStem}\" has no matching React story file`)
    }
  }

  warnings.push(...buildCrossFrameworkExportWarnings(map))

  return warnings
}

function buildFamilyMapReport(map: FamilyMap): string {
  return [
    `Family: ${map.family}`,
    "",
    buildFrameworkMapSection(map, "react"),
    "",
    buildFrameworkMapSection(map, "vue"),
  ].join("\n")
}

function buildCoverageSection(map: FamilyMap, framework: FrameworkName): string {
  const frameworkMap = getFrameworkMap(map, framework)
  const sections = frameworkMap.storyFiles.map((storyFile) => {
    const heading =
      storyFile.title ?? `${frameworkMap.label} ${toPascalCase(map.family)} (missing title)`
    const exports =
      storyFile.exports.length > 0
        ? storyFile.exports.map((item) => `- ${item}`).join("\n")
        : "- None"

    return [
      `### ${heading}`,
      `File: ${toRelativePath(map.repoRoot, storyFile.path)}`,
      "Stories:",
      exports,
    ].join("\n")
  })

  return [
    `## ${frameworkMap.label} story coverage`,
    sections.length > 0 ? sections.join("\n\n") : "- No story files found",
    "",
    `## ${frameworkMap.label} docs`,
    renderPathList(map.repoRoot, frameworkMap.docsFiles),
    "",
    `## ${frameworkMap.label} story tests`,
    renderPathList(map.repoRoot, frameworkMap.storyTests),
  ].join("\n")
}

function collectCoverageWarnings(map: FamilyMap): string[] {
  return [
    ...buildFrameworkCoverageWarnings(map, "react"),
    ...buildFrameworkCoverageWarnings(map, "vue"),
    ...buildCrossFrameworkWarnings(map),
  ]
}

function buildCoverageReport(map: FamilyMap): string {
  const warnings = collectCoverageWarnings(map)

  return [
    `Family: ${map.family}`,
    "",
    buildCoverageSection(map, "react"),
    "",
    buildCoverageSection(map, "vue"),
    "",
    "## Cross-framework gaps and warnings",
    warnings.length > 0 ? warnings.map((warning) => `- ${warning}`).join("\n") : "- None",
  ].join("\n")
}

function findMatchingStoryFile(
  frameworkMap: FrameworkFamilyMap,
  stem: string,
): StoryFileSummary | undefined {
  return frameworkMap.storyFiles.find((storyFile) => storyFile.stem === stem)
}

function findMatchingComponentFile(
  frameworkMap: FrameworkFamilyMap,
  stem: string,
): string | undefined {
  return frameworkMap.componentFiles.find((path) => getStemWithoutExtension(path) === stem)
}

function findMatchingTests(paths: string[], stem: string): string[] {
  return paths.filter((path) => basename(path).includes(stem))
}

function collectAllFrameworkFiles(frameworkMap: FrameworkFamilyMap): string[] {
  return uniqueSorted([
    ...frameworkMap.componentFiles,
    ...(frameworkMap.sourceIndexFile ? [frameworkMap.sourceIndexFile] : []),
    ...frameworkMap.storyFiles.map((storyFile) => storyFile.path),
    ...frameworkMap.docsFiles,
    ...frameworkMap.componentTests,
    ...frameworkMap.storyTests,
  ])
}

function buildImpactSummary(map: FamilyMap, resolution: FamilyResolution): ImpactSummary {
  const notes: string[] = []
  const primary: string[] = []
  const secondary: string[] = []

  if (!resolution.targetPath || !resolution.targetFramework) {
    for (const framework of frameworksInOrder) {
      const frameworkMap = getFrameworkMap(map, framework)
      primary.push(...frameworkMap.componentFiles)
      primary.push(...frameworkMap.storyFiles.map((storyFile) => storyFile.path))
      secondary.push(
        ...(frameworkMap.sourceIndexFile ? [frameworkMap.sourceIndexFile] : []),
        ...frameworkMap.docsFiles,
        ...frameworkMap.componentTests,
        ...frameworkMap.storyTests,
      )
    }

    notes.push(
      "Family-level impact includes both React and Vue source files and both Storybook apps",
    )

    return {
      title: `Impact summary for family ${map.family}`,
      primary: uniqueSorted(primary),
      secondary: uniqueSorted(secondary.filter((path) => !primary.includes(path))),
      notes,
    }
  }

  const currentFrameworkMap = getFrameworkMap(map, resolution.targetFramework)
  const otherFramework = resolution.targetFramework === "react" ? "vue" : "react"
  const otherFrameworkMap = getFrameworkMap(map, otherFramework)
  const targetPath = resolution.targetPath
  const targetStem = getStemWithoutExtension(targetPath)
  const targetRelativePath = toRelativePath(map.repoRoot, targetPath)
  const sourceRootPrefix = `${currentFrameworkMap.sourceRoot}/${map.family}/`
  const storyRootPrefix = `${currentFrameworkMap.storyRoot}/${map.family}/`
  const baseComponentFile = findMatchingComponentFile(currentFrameworkMap, map.family)
  const baseStoryFile = findMatchingStoryFile(currentFrameworkMap, map.family)

  primary.push(targetPath)

  if (targetRelativePath.startsWith(sourceRootPrefix)) {
    const matchingStoryFile = findMatchingStoryFile(currentFrameworkMap, targetStem)
    if (matchingStoryFile) {
      primary.push(matchingStoryFile.path)
    }

    primary.push(...findMatchingTests(currentFrameworkMap.componentTests, targetStem))

    if (currentFrameworkMap.sourceIndexFile) {
      primary.push(currentFrameworkMap.sourceIndexFile)
    }

    if (targetStem === map.family) {
      secondary.push(
        ...currentFrameworkMap.componentFiles.filter((path) => path !== targetPath),
        ...currentFrameworkMap.storyFiles
          .filter((storyFile) => storyFile.stem !== targetStem)
          .map((storyFile) => storyFile.path),
      )
      notes.push(
        `${currentFrameworkMap.label} base component changes often affect wrappers and sibling stories`,
      )
    } else {
      if (baseComponentFile) {
        secondary.push(baseComponentFile)
      }

      if (baseStoryFile) {
        secondary.push(baseStoryFile.path)
      }

      notes.push(
        `${currentFrameworkMap.label} wrappers usually depend on the base family component behavior`,
      )
    }
  }

  if (targetRelativePath.startsWith(storyRootPrefix)) {
    const matchingComponentFile = findMatchingComponentFile(currentFrameworkMap, targetStem)
    if (matchingComponentFile) {
      primary.push(matchingComponentFile)
    }

    primary.push(...findMatchingTests(currentFrameworkMap.componentTests, targetStem))

    if (targetStem === map.family) {
      secondary.push(
        ...currentFrameworkMap.componentFiles.filter(
          (path) => getStemWithoutExtension(path) !== targetStem,
        ),
        ...currentFrameworkMap.storyFiles
          .filter((storyFile) => storyFile.stem !== targetStem)
          .map((storyFile) => storyFile.path),
      )
      notes.push(
        `${currentFrameworkMap.label} base family stories often affect wrapper stories and sibling components`,
      )
    } else {
      if (baseComponentFile) {
        secondary.push(baseComponentFile)
      }

      if (baseStoryFile) {
        secondary.push(baseStoryFile.path)
      }

      notes.push(
        `${currentFrameworkMap.label} wrapper stories usually depend on the base family component behavior`,
      )
    }
  }

  if (basename(targetPath) === "Introduction.mdx") {
    secondary.push(
      ...currentFrameworkMap.componentFiles,
      ...currentFrameworkMap.storyFiles.map((storyFile) => storyFile.path),
    )
    notes.push(`${currentFrameworkMap.label} introduction docs usually reflect the whole family`)
  }

  const matchingOtherFrameworkComponent = findMatchingComponentFile(otherFrameworkMap, targetStem)
  const matchingOtherFrameworkStory = findMatchingStoryFile(otherFrameworkMap, targetStem)

  if (matchingOtherFrameworkComponent) {
    secondary.push(matchingOtherFrameworkComponent)
  }

  if (matchingOtherFrameworkStory) {
    secondary.push(matchingOtherFrameworkStory.path)
  }

  secondary.push(...otherFrameworkMap.docsFiles, ...otherFrameworkMap.storyTests)

  if (matchingOtherFrameworkComponent || matchingOtherFrameworkStory) {
    notes.push(`${otherFrameworkMap.label} parity should be checked for the same family and stem`)
  }

  secondary.push(...currentFrameworkMap.docsFiles, ...currentFrameworkMap.storyTests)

  return {
    title: `Impact summary for ${targetRelativePath}`,
    primary: uniqueSorted(primary),
    secondary: uniqueSorted(secondary.filter((path) => !primary.includes(path))),
    notes,
  }
}

function buildImpactReport(map: FamilyMap, summary: ImpactSummary): string {
  return [
    summary.title,
    "",
    "## Primary impact",
    renderPathList(map.repoRoot, summary.primary),
    "",
    "## Secondary impact",
    renderPathList(map.repoRoot, summary.secondary),
    "",
    "## Notes",
    summary.notes.length > 0 ? summary.notes.map((note) => `- ${note}`).join("\n") : "- None",
  ].join("\n")
}

function buildStrengths(map: FamilyMap): string[] {
  const strengths: string[] = []

  for (const framework of frameworksInOrder) {
    const frameworkMap = getFrameworkMap(map, framework)
    const componentStems = getStoryBearingComponentStems(frameworkMap.componentFiles, map.family)
    const storyStems = getCanonicalStoryStems(frameworkMap.storyFiles)

    if (frameworkMap.sourceDirExists && frameworkMap.storyDirExists) {
      strengths.push(`${frameworkMap.label} source and Storybook family directories both exist`)
    }

    if (frameworkMap.componentFiles.length > 0 && frameworkMap.storyFiles.length > 0) {
      strengths.push(
        `${frameworkMap.label} family has both implementation files and Storybook coverage`,
      )
    }

    const hasOneToOneCoverage =
      componentStems.size > 0 &&
      componentStems.size === storyStems.size &&
      [...componentStems].every((stem) => storyStems.has(stem))

    if (hasOneToOneCoverage) {
      strengths.push(`${frameworkMap.label} component stems and story stems are aligned one-to-one`)
    }

    if (frameworkMap.docsFiles.length > 0) {
      strengths.push(`${frameworkMap.label} family introduction docs exist`)
    }

    if (frameworkMap.storyTests.some((path) => basename(path).includes("taxonomy"))) {
      strengths.push(`${frameworkMap.label} Storybook taxonomy test exists`)
    }

    if (frameworkMap.componentTests.length > 0 && frameworkMap.storyTests.length > 0) {
      strengths.push(`${frameworkMap.label} has both component tests and Storybook/docs tests`)
    }
  }

  const crossWarnings = buildCrossFrameworkWarnings(map)
  if (crossWarnings.length === 0) {
    strengths.push("React and Vue family stems are aligned across source and Storybook")
    strengths.push("React and Vue export surfaces are aligned")
  }

  return strengths
}

function buildReviewReport(map: FamilyMap): string {
  const reviewedFiles = uniqueSorted(
    frameworksInOrder.flatMap((framework) =>
      collectAllFrameworkFiles(getFrameworkMap(map, framework)),
    ),
  )
  const strengths = buildStrengths(map)
  const warnings = collectCoverageWarnings(map)
  const groupedWarnings = groupWarningsBySeverity(warnings)
  const healthScore = calculateHealthScore(groupedWarnings, strengths)
  const mergeReadiness =
    warnings.length === 0
      ? "Family structure looks healthy across React and Vue and coverage is consistent for v1 heuristics."
      : "Family structure is useful, but the warnings below should be reviewed before treating cross-framework coverage as complete."

  return [
    "## Files Reviewed",
    renderPathList(map.repoRoot, reviewedFiles),
    "",
    "## Health score",
    `- Score: ${healthScore}/100 (${getHealthLabel(healthScore)})`,
    `- Severity: critical ${groupedWarnings.critical.length}, warning ${groupedWarnings.warning.length}, suggestion ${groupedWarnings.suggestion.length}`,
    "",
    "## Strengths",
    strengths.length > 0 ? strengths.map((strength) => `- ${strength}`).join("\n") : "- None",
    "",
    "## Warnings",
    warnings.length > 0 ? warnings.map((warning) => `- ${warning}`).join("\n") : "- None",
    "",
    "## Summary",
    `${toPascalCase(map.family)} family review: ${mergeReadiness}`,
  ].join("\n")
}

function classifyWarningSeverity(warning: string): WarningSeverity {
  const criticalSignals = [
    "source directory is missing",
    "storybook directory is missing",
    "no react component files were found",
    "no vue component files were found",
    "no react storybook story files were found",
    "no vue storybook story files were found",
    "no react index.ts export surface was found",
    "no vue index.ts export surface was found",
    "missing react story file",
    "missing vue story file",
    "has no matching react component file",
    "has no matching vue component file",
    "has no matching react story file",
    "has no matching vue story file",
    "is missing from react index.ts",
    "is missing from vue index.ts",
  ]
  const warningSignals = [
    "no react introduction.mdx file was found",
    "no vue introduction.mdx file was found",
    "no react taxonomy test was found",
    "no vue taxonomy test was found",
    "no react introduction docs test was found",
    "no vue introduction docs test was found",
    "story title",
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

function groupWarningsBySeverity(warnings: string[]): Record<WarningSeverity, string[]> {
  return warnings.reduce<Record<WarningSeverity, string[]>>(
    (groups, warning) => {
      const severity = classifyWarningSeverity(warning)
      groups[severity].push(warning)
      return groups
    },
    {
      critical: [],
      warning: [],
      suggestion: [],
    },
  )
}

function calculateSeverityScore(groups: Record<WarningSeverity, string[]>): number {
  return groups.critical.length * 100 + groups.warning.length * 10 + groups.suggestion.length
}

function calculateHealthScore(
  groupedWarnings: Record<WarningSeverity, string[]>,
  strengths: string[],
): number {
  const rawScore =
    100 -
    groupedWarnings.critical.length * 25 -
    groupedWarnings.warning.length * 10 -
    groupedWarnings.suggestion.length * 3 +
    strengths.length * 2

  return Math.max(0, Math.min(100, rawScore))
}

function getHealthLabel(score: number): string {
  if (score >= 90) {
    return "excellent"
  }

  if (score >= 75) {
    return "strong"
  }

  if (score >= 60) {
    return "fair"
  }

  if (score >= 40) {
    return "fragile"
  }

  return "critical"
}

function slugifyFilter(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function formatTimestampForFile(date: Date): string {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}

function renderSeveritySection(title: string, warnings: string[]): string {
  return [
    title,
    warnings.length > 0 ? warnings.map((warning) => `  - ${warning}`).join("\n") : "  - None",
  ].join("\n")
}

function buildAuditEntries(familyMaps: FamilyMap[]): AuditEntry[] {
  return familyMaps.map((map) => {
    const warnings = collectCoverageWarnings(map)
    const groupedWarnings = groupWarningsBySeverity(warnings)
    const strengths = buildStrengths(map)

    return {
      family: map.family,
      warnings,
      groupedWarnings,
      severityScore: calculateSeverityScore(groupedWarnings),
      healthScore: calculateHealthScore(groupedWarnings, strengths),
      strengths,
    }
  })
}

function buildAuditScoreTable(entries: AuditEntry[]): string {
  const sortedEntries = [...entries].sort((left, right) => {
    if (left.healthScore !== right.healthScore) {
      return left.healthScore - right.healthScore
    }

    if (right.severityScore !== left.severityScore) {
      return right.severityScore - left.severityScore
    }

    return left.family.localeCompare(right.family)
  })

  return [
    "## Family health table",
    "| Family | Score | Label | Critical | Warning | Suggestion |",
    "| --- | ---: | --- | ---: | ---: | ---: |",
    ...sortedEntries.map(
      (entry) =>
        `| ${entry.family} | ${entry.healthScore} | ${getHealthLabel(entry.healthScore)} | ${entry.groupedWarnings.critical.length} | ${entry.groupedWarnings.warning.length} | ${entry.groupedWarnings.suggestion.length} |`,
    ),
  ].join("\n")
}

async function buildAuditReport(repoRoot: string, familyFilter: string): Promise<string> {
  const normalizedFilter = familyFilter.trim()
  const allFamilies = getAvailableFamiliesSync(repoRoot)
  const matchedFamilies =
    normalizedFilter.length > 0
      ? allFamilies.filter((family) => family.startsWith(normalizedFilter))
      : allFamilies

  if (matchedFamilies.length === 0) {
    return normalizedFilter.length > 0
      ? `No component families matched filter \"${normalizedFilter}\".`
      : "No component families were found."
  }

  const familyMaps = await Promise.all(
    matchedFamilies.map((family) => buildFamilyMap(family, repoRoot)),
  )

  const auditEntries = buildAuditEntries(familyMaps)

  const needsAttention = auditEntries
    .filter((entry) => entry.warnings.length > 0)
    .sort((left, right) => {
      if (right.severityScore !== left.severityScore) {
        return right.severityScore - left.severityScore
      }

      return left.family.localeCompare(right.family)
    })

  const healthyFamilies = auditEntries
    .filter((entry) => entry.warnings.length === 0)
    .sort((left, right) => {
      if (right.healthScore !== left.healthScore) {
        return right.healthScore - left.healthScore
      }

      if (right.strengths.length !== left.strengths.length) {
        return right.strengths.length - left.strengths.length
      }

      return left.family.localeCompare(right.family)
    })

  const severityTotals = auditEntries.reduce(
    (totals, entry) => ({
      critical: totals.critical + entry.groupedWarnings.critical.length,
      warning: totals.warning + entry.groupedWarnings.warning.length,
      suggestion: totals.suggestion + entry.groupedWarnings.suggestion.length,
    }),
    { critical: 0, warning: 0, suggestion: 0 },
  )

  const healthySummary =
    healthyFamilies.length > 0
      ? healthyFamilies
          .map(
            (entry) =>
              `- ${entry.family} — ${entry.healthScore}/100 (${getHealthLabel(entry.healthScore)})`,
          )
          .join("\n")
      : "- None"

  const attentionSummary =
    needsAttention.length > 0
      ? needsAttention
          .map((entry) =>
            [
              `### ${entry.family} — ${entry.healthScore}/100 (${getHealthLabel(entry.healthScore)}), critical ${entry.groupedWarnings.critical.length}, warning ${entry.groupedWarnings.warning.length}, suggestion ${entry.groupedWarnings.suggestion.length}`,
              renderSeveritySection("Critical", entry.groupedWarnings.critical),
              "",
              renderSeveritySection("Warnings", entry.groupedWarnings.warning),
              "",
              renderSeveritySection("Suggestions", entry.groupedWarnings.suggestion),
            ].join("\n"),
          )
          .join("\n\n")
      : "- None"

  return [
    "## Summary",
    `Audit target: ${normalizedFilter.length > 0 ? `families matching \"${normalizedFilter}\"` : "all component families"}`,
    `Families scanned: ${matchedFamilies.length}`,
    `Healthy families: ${healthyFamilies.length}`,
    `Families with findings: ${needsAttention.length}`,
    `Severity totals: critical ${severityTotals.critical}, warning ${severityTotals.warning}, suggestion ${severityTotals.suggestion}`,
    "",
    buildAuditScoreTable(auditEntries),
    "",
    "## Needs attention",
    attentionSummary,
    "",
    "## Strongest healthy families",
    healthySummary,
  ].join("\n")
}

async function writeMarkdownReportWithSnapshot(
  reportsDirectory: string,
  baseFileName: string,
  reportContent: string,
): Promise<MarkdownExportPaths> {
  const timestamp = formatTimestampForFile(new Date())
  const latestPath = join(reportsDirectory, `${baseFileName}.md`)
  const snapshotPath = join(reportsDirectory, `${baseFileName}-${timestamp}.md`)

  await mkdir(reportsDirectory, { recursive: true })
  await writeFile(latestPath, reportContent, "utf8")
  await writeFile(snapshotPath, reportContent, "utf8")

  return {
    latestPath,
    snapshotPath,
  }
}

async function writeAuditMarkdownReport(
  repoRoot: string,
  familyFilter: string,
): Promise<MarkdownExportPaths> {
  const normalizedFilter = familyFilter.trim()
  const reportContent = await buildAuditReport(repoRoot, normalizedFilter)
  const reportsDirectory = join(repoRoot, ".pi/reports")
  const slug = slugifyFilter(normalizedFilter)
  const baseFileName = slug.length > 0 ? `story-audit-${slug}` : "story-audit"

  return writeMarkdownReportWithSnapshot(reportsDirectory, baseFileName, reportContent)
}

function getFrameworkFilePath(map: FamilyMap, relativePath: string): string {
  return toRelativePath(map.repoRoot, join(map.repoRoot, relativePath))
}

function buildActionItemsForWarning(map: FamilyMap, warning: string): string[] {
  const reactIndex = getFrameworkMap(map, "react").sourceIndexFile
  const vueIndex = getFrameworkMap(map, "vue").sourceIndexFile
  const actions: string[] = []

  if (warning.includes("React source directory is missing for this family")) {
    actions.push(
      `Create ${getFrameworkFilePath(map, `${frameworkConfigs.react.sourceRoot}/${map.family}/`)} and seed the React family files.`,
    )
  }

  if (warning.includes("Vue source directory is missing for this family")) {
    actions.push(
      `Create ${getFrameworkFilePath(map, `${frameworkConfigs.vue.sourceRoot}/${map.family}/`)} and seed the Vue family files.`,
    )
  }

  if (warning.includes("React Storybook directory is missing for this family")) {
    actions.push(
      `Create ${getFrameworkFilePath(map, `${frameworkConfigs.react.storyRoot}/${map.family}/`)} and add the React Storybook family files.`,
    )
  }

  if (warning.includes("Vue Storybook directory is missing for this family")) {
    actions.push(
      `Create ${getFrameworkFilePath(map, `${frameworkConfigs.vue.storyRoot}/${map.family}/`)} and add the Vue Storybook family files.`,
    )
  }

  if (warning.includes("No React component files were found")) {
    actions.push(
      `Add the missing React component files under ${getFrameworkFilePath(map, `${frameworkConfigs.react.sourceRoot}/${map.family}/`)}.`,
    )
  }

  if (warning.includes("No Vue component files were found")) {
    actions.push(
      `Add the missing Vue component files under ${getFrameworkFilePath(map, `${frameworkConfigs.vue.sourceRoot}/${map.family}/`)}.`,
    )
  }

  if (warning.includes("No React Storybook story files were found")) {
    actions.push(
      `Add the missing React Storybook files under ${getFrameworkFilePath(map, `${frameworkConfigs.react.storyRoot}/${map.family}/`)}.`,
    )
  }

  if (warning.includes("No Vue Storybook story files were found")) {
    actions.push(
      `Add the missing Vue Storybook files under ${getFrameworkFilePath(map, `${frameworkConfigs.vue.storyRoot}/${map.family}/`)}.`,
    )
  }

  if (warning.includes("No React index.ts export surface was found")) {
    actions.push(
      `Create ${getFrameworkFilePath(map, `${frameworkConfigs.react.sourceRoot}/${map.family}/index.ts`)} and export the full React family surface.`,
    )
  }

  if (warning.includes("No Vue index.ts export surface was found")) {
    actions.push(
      `Create ${getFrameworkFilePath(map, `${frameworkConfigs.vue.sourceRoot}/${map.family}/index.ts`)} and export the full Vue family surface.`,
    )
  }

  if (warning.includes("No React Introduction.mdx file was found")) {
    actions.push(
      `Add ${getFrameworkFilePath(map, `${frameworkConfigs.react.storyRoot}/${map.family}/Introduction.mdx`)} to document the React family taxonomy and usage.`,
    )
  }

  if (warning.includes("No Vue Introduction.mdx file was found")) {
    actions.push(
      `Add ${getFrameworkFilePath(map, `${frameworkConfigs.vue.storyRoot}/${map.family}/Introduction.mdx`)} to document the Vue family taxonomy and usage.`,
    )
  }

  if (warning.includes("No React taxonomy test was found")) {
    actions.push(
      `Add a React Storybook taxonomy test under ${getFrameworkFilePath(map, `${frameworkConfigs.react.storyRoot}/${map.family}/__tests__`)}.`,
    )
  }

  if (warning.includes("No Vue taxonomy test was found")) {
    actions.push(
      `Add a Vue Storybook taxonomy test under ${getFrameworkFilePath(map, `${frameworkConfigs.vue.storyRoot}/${map.family}/__tests__`)}.`,
    )
  }

  if (warning.includes("No React introduction docs test was found")) {
    actions.push(
      `Add a React introduction docs test under ${getFrameworkFilePath(map, `${frameworkConfigs.react.storyRoot}/${map.family}/__tests__`)}.`,
    )
  }

  if (warning.includes("No Vue introduction docs test was found")) {
    actions.push(
      `Add a Vue introduction docs test under ${getFrameworkFilePath(map, `${frameworkConfigs.vue.storyRoot}/${map.family}/__tests__`)}.`,
    )
  }

  const missingStoryMatch = warning.match(
    /Missing (React|Vue) story file for component stem \"([^\"]+)\"/,
  )
  if (missingStoryMatch) {
    const framework = missingStoryMatch[1].toLowerCase() as FrameworkName
    const stem = missingStoryMatch[2]
    const config = frameworkConfigs[framework]
    actions.push(
      `Add ${getFrameworkFilePath(map, `${config.storyRoot}/${map.family}/${stem}.stories.${framework === "react" ? "tsx" : "ts"}`)} for ${frameworkConfigs[framework].label} parity.`,
    )
  }

  const componentMismatchMatch = warning.match(
    /Story stem \"([^\"]+)\" has no matching (React|Vue) component file/,
  )
  if (componentMismatchMatch) {
    const stem = componentMismatchMatch[1]
    const framework = componentMismatchMatch[2].toLowerCase() as FrameworkName
    const config = frameworkConfigs[framework]
    actions.push(
      `Add or rename ${getFrameworkFilePath(map, `${config.sourceRoot}/${map.family}/${stem}.${framework === "react" ? "tsx" : "ts"}`)} to match the Storybook family.`,
    )
  }

  const storyMismatchMatch = warning.match(
    /(React|Vue) story stem \"([^\"]+)\" has no matching (React|Vue) story file/,
  )
  if (storyMismatchMatch) {
    const sourceFramework = storyMismatchMatch[1].toLowerCase() as FrameworkName
    const stem = storyMismatchMatch[2]
    const targetFramework = storyMismatchMatch[3].toLowerCase() as FrameworkName
    const targetConfig = frameworkConfigs[targetFramework]
    actions.push(
      `Mirror ${frameworkConfigs[sourceFramework].label} story coverage by adding ${getFrameworkFilePath(map, `${targetConfig.storyRoot}/${map.family}/${stem}.stories.${targetFramework === "react" ? "tsx" : "ts"}`)}.`,
    )
  }

  const exportMismatchMatch = warning.match(
    /(React|Vue) (value|type) export \"([^\"]+)\" is missing from (React|Vue) index.ts/,
  )
  if (exportMismatchMatch) {
    const exportKind = exportMismatchMatch[2]
    const exportName = exportMismatchMatch[3]
    const targetFramework = exportMismatchMatch[4].toLowerCase() as FrameworkName
    const targetIndex = targetFramework === "react" ? reactIndex : vueIndex
    if (targetIndex) {
      actions.push(
        `Add the missing ${exportKind} export \"${exportName}\" to ${toRelativePath(map.repoRoot, targetIndex)}.`,
      )
    }
  }

  const titleMismatchMatch = warning.match(
    /(React|Vue) story title \"([^\"]+)\" should be \"([^\"]+)\" for ([^\n]+)/,
  )
  if (titleMismatchMatch) {
    actions.push(
      `Update the meta title in ${titleMismatchMatch[4]} to \"${titleMismatchMatch[3]}\".`,
    )
  }

  if (actions.length > 0) {
    return uniqueSorted(actions)
  }

  return [`Review and resolve: ${warning}`]
}

function buildFixPlanReport(map: FamilyMap): string {
  const warnings = collectCoverageWarnings(map)
  const groupedWarnings = groupWarningsBySeverity(warnings)
  const strengths = buildStrengths(map)
  const healthScore = calculateHealthScore(groupedWarnings, strengths)

  if (warnings.length === 0) {
    return [
      `Family: ${map.family}`,
      "",
      "## Status",
      `- Health score: ${healthScore}/100 (${getHealthLabel(healthScore)})`,
      "- No fix plan needed. This family is currently healthy according to the Storybook companion heuristics.",
      "",
      "## Follow-up",
      "- Keep React and Vue parity intact when adding new components, stories, docs, or exports.",
    ].join("\n")
  }

  const criticalActions = uniqueSorted(
    groupedWarnings.critical.flatMap((warning) => buildActionItemsForWarning(map, warning)),
  )
  const warningActions = uniqueSorted(
    groupedWarnings.warning.flatMap((warning) => buildActionItemsForWarning(map, warning)),
  )
  const suggestionActions = uniqueSorted(
    groupedWarnings.suggestion.flatMap((warning) => buildActionItemsForWarning(map, warning)),
  )

  return [
    `Family: ${map.family}`,
    "",
    "## Health score",
    `- Score: ${healthScore}/100 (${getHealthLabel(healthScore)})`,
    "",
    "## Severity summary",
    `- Critical: ${groupedWarnings.critical.length}`,
    `- Warning: ${groupedWarnings.warning.length}`,
    `- Suggestion: ${groupedWarnings.suggestion.length}`,
    "",
    "## Critical fixes",
    criticalActions.length > 0
      ? criticalActions.map((action) => `- [ ] ${action}`).join("\n")
      : "- None",
    "",
    "## Warning fixes",
    warningActions.length > 0
      ? warningActions.map((action) => `- [ ] ${action}`).join("\n")
      : "- None",
    "",
    "## Suggestion fixes",
    suggestionActions.length > 0
      ? suggestionActions.map((action) => `- [ ] ${action}`).join("\n")
      : "- None",
  ].join("\n")
}

async function writeFixPlanMarkdownReport(map: FamilyMap): Promise<MarkdownExportPaths> {
  const reportsDirectory = join(map.repoRoot, ".pi/reports")
  const reportContent = buildFixPlanReport(map)
  const baseFileName = `story-fix-plan-${map.family}`

  return writeMarkdownReportWithSnapshot(reportsDirectory, baseFileName, reportContent)
}

function sendReport(pi: ExtensionAPI, title: string, body: string): void {
  pi.sendMessage({
    customType: STORYBOOK_REPORT_TYPE,
    content: `${title}\n\n${body}`,
    display: true,
    details: {
      title,
      timestamp: Date.now(),
    },
  })
}

export default function storybookCompanionExtension(pi: ExtensionAPI): void {
  pi.registerMessageRenderer(STORYBOOK_REPORT_TYPE, (message, _options, theme) => {
    const box = new Box(1, 1, (text) => theme.bg("customMessageBg", text))
    box.addChild(new Text(String(message.content), 0, 0))
    return box
  })

  pi.registerCommand("story-map", {
    description: "Map a Marwes component family to React and Vue stories, docs, tests, and exports",
    getArgumentCompletions: getFamilyArgumentCompletions,
    handler: async (args, ctx) => {
      try {
        const resolution = await resolveFamilyInput(args, ctx.cwd)
        const familyMap = await buildFamilyMap(resolution.family, resolution.repoRoot)
        sendReport(pi, `/story-map ${resolution.family}`, buildFamilyMapReport(familyMap))
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error")
      }
    },
  })

  pi.registerCommand("story-coverage", {
    description: "Summarize React and Vue Storybook coverage for a Marwes component family",
    getArgumentCompletions: getFamilyArgumentCompletions,
    handler: async (args, ctx) => {
      try {
        const resolution = await resolveFamilyInput(args, ctx.cwd)
        const familyMap = await buildFamilyMap(resolution.family, resolution.repoRoot)
        sendReport(pi, `/story-coverage ${resolution.family}`, buildCoverageReport(familyMap))
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error")
      }
    },
  })

  pi.registerCommand("story-impact", {
    description: "Show likely related React and Vue files when a Marwes component family changes",
    getArgumentCompletions: getFamilyArgumentCompletions,
    handler: async (args, ctx) => {
      try {
        const resolution = await resolveFamilyInput(args, ctx.cwd)
        const familyMap = await buildFamilyMap(resolution.family, resolution.repoRoot)
        const impactSummary = buildImpactSummary(familyMap, resolution)
        sendReport(pi, `/story-impact ${args.trim()}`, buildImpactReport(familyMap, impactSummary))
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error")
      }
    },
  })

  pi.registerCommand("story-review", {
    description:
      "Review the structure and Storybook coverage of a Marwes component family across React and Vue",
    getArgumentCompletions: getFamilyArgumentCompletions,
    handler: async (args, ctx) => {
      try {
        const resolution = await resolveFamilyInput(args, ctx.cwd)
        const familyMap = await buildFamilyMap(resolution.family, resolution.repoRoot)
        sendReport(pi, `/story-review ${resolution.family}`, buildReviewReport(familyMap))
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error")
      }
    },
  })

  pi.registerCommand("story-audit", {
    description: "Audit Storybook coverage across all Marwes component families",
    getArgumentCompletions: getFamilyArgumentCompletions,
    handler: async (args, ctx) => {
      try {
        const repoRoot = await findRepoRoot(ctx.cwd)
        if (!repoRoot) {
          throw new Error("Could not find the Marwes repo root from the current working directory")
        }

        const report = await buildAuditReport(repoRoot, args)
        const title = args.trim().length > 0 ? `/story-audit ${args.trim()}` : "/story-audit"
        sendReport(pi, title, report)
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error")
      }
    },
  })

  pi.registerCommand("story-fix-plan", {
    description: "Generate a cleanup checklist for a Marwes component family",
    getArgumentCompletions: getFamilyArgumentCompletions,
    handler: async (args, ctx) => {
      try {
        const resolution = await resolveFamilyInput(args, ctx.cwd)
        const familyMap = await buildFamilyMap(resolution.family, resolution.repoRoot)
        sendReport(pi, `/story-fix-plan ${resolution.family}`, buildFixPlanReport(familyMap))
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error")
      }
    },
  })

  pi.registerCommand("story-audit-export", {
    description: "Export the Storybook audit report to Markdown under .pi/reports/",
    getArgumentCompletions: getFamilyArgumentCompletions,
    handler: async (args, ctx) => {
      try {
        const repoRoot = await findRepoRoot(ctx.cwd)
        if (!repoRoot) {
          throw new Error("Could not find the Marwes repo root from the current working directory")
        }

        const outputPaths = await writeAuditMarkdownReport(repoRoot, args)
        const relativeLatestPath = toRelativePath(repoRoot, outputPaths.latestPath)
        const relativeSnapshotPath = toRelativePath(repoRoot, outputPaths.snapshotPath)
        sendReport(
          pi,
          args.trim().length > 0 ? `/story-audit-export ${args.trim()}` : "/story-audit-export",
          [
            "## Export complete",
            `- Wrote latest Markdown report to ${relativeLatestPath}`,
            `- Wrote timestamped snapshot to ${relativeSnapshotPath}`,
            "",
            "## Next step",
            `- Open ${relativeLatestPath} for the current audit view or archive ${relativeSnapshotPath} as a snapshot.`,
          ].join("\n"),
        )
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error")
      }
    },
  })

  pi.registerCommand("story-fix-plan-export", {
    description: "Export a family fix plan to Markdown under .pi/reports/",
    getArgumentCompletions: getFamilyArgumentCompletions,
    handler: async (args, ctx) => {
      try {
        const resolution = await resolveFamilyInput(args, ctx.cwd)
        const familyMap = await buildFamilyMap(resolution.family, resolution.repoRoot)
        const outputPaths = await writeFixPlanMarkdownReport(familyMap)
        const relativeLatestPath = toRelativePath(resolution.repoRoot, outputPaths.latestPath)
        const relativeSnapshotPath = toRelativePath(resolution.repoRoot, outputPaths.snapshotPath)
        sendReport(
          pi,
          `/story-fix-plan-export ${resolution.family}`,
          [
            "## Export complete",
            `- Wrote latest fix plan to ${relativeLatestPath}`,
            `- Wrote timestamped snapshot to ${relativeSnapshotPath}`,
            "",
            "## Next step",
            `- Open ${relativeLatestPath} and work through the markdown checkboxes for ${resolution.family}.`,
          ].join("\n"),
        )
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error")
      }
    },
  })
}
