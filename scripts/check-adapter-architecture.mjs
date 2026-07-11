import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { basename, extname, join, resolve } from "node:path"
import process from "node:process"

const repoRoot = process.cwd()
const cssImport = 'import "@marwes-ui/presets/firstEdition/styles.css"'

const frameworkConfigs = {
  react: {
    label: "React",
    sourceRoot: "packages/react/src/components",
    storyRoot: "apps/storybook-react/src/stories",
    rootIndex: "packages/react/src/index.ts",
    packageJson: "packages/react/package.json",
    expectedSourceExtension: ".tsx",
  },
  vue: {
    label: "Vue",
    sourceRoot: "packages/vue/src/components",
    storyRoot: "apps/storybook-vue/src/stories",
    rootIndex: "packages/vue/src/index.ts",
    packageJson: "packages/vue/package.json",
    expectedSourceExtension: ".ts",
  },
  svelte: {
    label: "Svelte",
    sourceRoot: "packages/svelte/src/lib/components",
    storyRoot: "apps/storybook-svelte/src/stories",
    rootIndex: "packages/svelte/src/lib/index.ts",
    packageJson: "packages/svelte/package.json",
    expectedSourceExtension: ".svelte",
  },
}

const frameworksInOrder = ["react", "vue", "svelte"]

const currentAuthorityDocs = [
  "docs/start-here.md",
  "docs/want-to-contribute.md",
  "docs/guides/adding-components.md",
  "docs/guides/svelte-adapter.md",
  "docs/reference/architecture.md",
  "docs/reference/adapter-architecture.md",
  "docs/reference/repo-map.md",
  "docs/reference/testing.md",
]

const forbiddenCurrentDocPhrases = [
  {
    pattern: /React\/Vue(?!\/Svelte)/g,
    reason: "current adapter docs should name React/Vue/Svelte together",
  },
  {
    pattern: /React and Vue(?!,? and Svelte)/g,
    reason:
      "current adapter docs should not present React and Vue as the only first-class adapters",
  },
  {
    pattern: /\bboth frameworks\b/g,
    reason: "current adapter docs should avoid two-framework wording",
  },
]

const findings = []

function normalizePath(path) {
  return path.replace(/\\/g, "/")
}

function fromRoot(path) {
  return normalizePath(join(repoRoot, path))
}

function toRelativePath(path) {
  return normalizePath(path.replace(`${repoRoot}/`, ""))
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right))
}

function addFinding(id, path, message) {
  findings.push({
    id,
    path: normalizePath(path),
    message,
  })
}

async function loadStorybookCompanionConfig() {
  const configPath = resolve(repoRoot, ".pi/storybook-companion.config.ts")
  const configSource = readFileSync(configPath, "utf8")
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
  return config.families[family] ?? {}
}

function isExcludedFamily(config, family) {
  return getFamilyConfig(config, family).excluded ?? false
}

function isStoryOnlyFamily(config, family) {
  return getFamilyConfig(config, family).storyOnly ?? false
}

function readDirectoryNames(rootPath) {
  if (!existsSync(rootPath)) return []

  return readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

function readDirectFiles(directoryPath) {
  if (!existsSync(directoryPath)) return []

  return readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(directoryPath, entry.name))
    .sort((left, right) => left.localeCompare(right))
}

function readFilesRecursive(rootPath) {
  if (!existsSync(rootPath)) return []

  const entries = readdirSync(rootPath, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const entryPath = join(rootPath, entry.name)
    if (entry.isDirectory()) return readFilesRecursive(entryPath)
    if (entry.isFile()) return [entryPath]
    return []
  })
}

function getAvailableFamilies(config) {
  const componentFamilies = frameworksInOrder.flatMap((framework) => {
    const frameworkConfig = frameworkConfigs[framework]
    return readDirectoryNames(fromRoot(frameworkConfig.sourceRoot))
  })

  const storyOnlyFamilies = Object.entries(config.families)
    .filter(([, familyConfig]) => familyConfig.storyOnly)
    .map(([family]) => family)
    .filter((family) =>
      frameworksInOrder.some((framework) => {
        const frameworkConfig = frameworkConfigs[framework]
        return existsSync(fromRoot(join(frameworkConfig.storyRoot, family)))
      }),
    )

  return uniqueSorted(
    [...componentFamilies, ...storyOnlyFamilies].filter(
      (family) => !isExcludedFamily(config, family),
    ),
  )
}

function parseExportSpecifiers(specifierBlock, typeOnly = false) {
  const valueExports = []
  const typeExports = []

  for (const specifier of specifierBlock
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)) {
    const parts = specifier.split(/\s+as\s+/)
    const sourceName = parts[0].trim()
    const exportedName = (parts.at(-1) ?? sourceName).trim().replace(/^type\s+/, "")

    if (typeOnly || sourceName.startsWith("type ")) {
      typeExports.push(exportedName)
      continue
    }

    valueExports.push(exportedName)
  }

  return {
    valueExports: uniqueSorted(valueExports),
    typeExports: uniqueSorted(typeExports),
  }
}

function extractIndexExportSummary(content) {
  const valueExports = []
  const typeExports = []

  for (const match of content.matchAll(
    /export\s+(type\s+)?\{([^}]+)\}\s+from\s+["'`][^"'`]+["'`]/g,
  )) {
    const exportNames = parseExportSpecifiers(match[2], Boolean(match[1]))
    valueExports.push(...exportNames.valueExports)
    typeExports.push(...exportNames.typeExports)
  }

  for (const match of content.matchAll(/export\s+(?:interface|type)\s+([A-Za-z0-9_]+)/g)) {
    typeExports.push(match[1])
  }

  return {
    valueExports: uniqueSorted(valueExports),
    typeExports: uniqueSorted(typeExports),
  }
}

function readExportSummary(indexPath) {
  if (!existsSync(indexPath)) {
    return {
      valueExports: [],
      typeExports: [],
    }
  }

  return extractIndexExportSummary(readFileSync(indexPath, "utf8"))
}

function toKebabCase(value) {
  return value
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase()
}

function storyStemFromPath(path) {
  return toKebabCase(
    basename(path)
      .replace(/\.stories\.(ts|tsx|js|jsx|mdx)$/, "")
      .replace(/\.[^.]+$/, ""),
  )
}

function isStoryFile(path) {
  return /\.stories\.(ts|tsx|js|jsx|mdx)$/.test(normalizePath(path))
}

function getExpectedStoryStems(config, family) {
  const familyConfig = getFamilyConfig(config, family)

  if (familyConfig.canonicalComponentStems) {
    return familyConfig.canonicalComponentStems
  }

  return Object.keys(familyConfig.titleByStem ?? {})
}

function checkFrameworkPackageCssPolicy() {
  for (const framework of frameworksInOrder) {
    const frameworkConfig = frameworkConfigs[framework]
    const rootIndexPath = fromRoot(frameworkConfig.rootIndex)
    const packageJsonPath = fromRoot(frameworkConfig.packageJson)

    const rootIndexContent = existsSync(rootIndexPath) ? readFileSync(rootIndexPath, "utf8") : ""
    if (!rootIndexContent.includes(cssImport)) {
      addFinding(
        "package-css-policy-mismatch",
        frameworkConfig.rootIndex,
        `${frameworkConfig.label} package entry must import firstEdition preset CSS.`,
      )
    }

    const packageJson = existsSync(packageJsonPath)
      ? JSON.parse(readFileSync(packageJsonPath, "utf8"))
      : {}

    if (packageJson.dependencies?.["@marwes-ui/presets"] !== "workspace:*") {
      addFinding(
        "package-css-policy-mismatch",
        frameworkConfig.packageJson,
        `${frameworkConfig.label} package must depend on @marwes-ui/presets as a workspace dependency.`,
      )
    }

    if (packageJson.sideEffects !== true) {
      addFinding(
        "package-css-policy-mismatch",
        frameworkConfig.packageJson,
        `${frameworkConfig.label} package must set sideEffects to true so CSS imports are preserved.`,
      )
    }
  }
}

function checkSourceShape(framework, frameworkConfig, family, sourceDir, sourceFiles) {
  const componentFiles = sourceFiles.filter((path) => basename(path) !== "index.ts")
  const hasExpectedSource = componentFiles.some(
    (path) => extname(path) === frameworkConfig.expectedSourceExtension,
  )

  if (!hasExpectedSource) {
    addFinding(
      "source-shape-mismatch",
      toRelativePath(sourceDir),
      `${frameworkConfig.label} ${family} must include ${frameworkConfig.expectedSourceExtension} component source.`,
    )
  }

  if (framework === "svelte" && !existsSync(join(sourceDir, "types.ts"))) {
    addFinding(
      "source-shape-mismatch",
      toRelativePath(sourceDir),
      `Svelte ${family} must keep component props in a package-local types.ts file.`,
    )
  }
}

function collectFamilyMaps(config, families) {
  const maps = new Map()

  for (const family of families) {
    const storyOnly = isStoryOnlyFamily(config, family)
    const familyMap = {
      family,
      frameworkMaps: {},
    }

    for (const framework of frameworksInOrder) {
      const frameworkConfig = frameworkConfigs[framework]
      const sourceDir = fromRoot(join(frameworkConfig.sourceRoot, family))
      const storyDir = fromRoot(join(frameworkConfig.storyRoot, family))
      const sourceIndex = join(sourceDir, "index.ts")
      const sourceFiles = readDirectFiles(sourceDir)
      const storyFiles = readDirectFiles(storyDir).filter(isStoryFile)

      if (!storyOnly && !existsSync(sourceDir)) {
        addFinding(
          "missing-family-dir",
          toRelativePath(sourceDir),
          `${frameworkConfig.label} is missing the ${family} family directory.`,
        )
      }

      if (!storyOnly && !existsSync(sourceIndex)) {
        addFinding(
          "missing-family-barrel",
          toRelativePath(sourceIndex),
          `${frameworkConfig.label} ${family} must expose a family-level index.ts barrel.`,
        )
      }

      if (!storyOnly && existsSync(sourceDir)) {
        checkSourceShape(framework, frameworkConfig, family, sourceDir, sourceFiles)
      }

      if (!existsSync(storyDir)) {
        addFinding(
          "missing-story-dir",
          toRelativePath(storyDir),
          `${frameworkConfig.label} Storybook is missing the ${family} story directory.`,
        )
      }

      if (!existsSync(join(storyDir, "Introduction.mdx"))) {
        addFinding(
          "missing-introduction",
          toRelativePath(join(storyDir, "Introduction.mdx")),
          `${frameworkConfig.label} ${family} Storybook must include Introduction.mdx.`,
        )
      }

      if (storyFiles.length === 0) {
        addFinding(
          "missing-story",
          toRelativePath(storyDir),
          `${frameworkConfig.label} ${family} Storybook must include at least one story file.`,
        )
      }

      const storyStems = new Set(storyFiles.map(storyStemFromPath))
      for (const expectedStem of getExpectedStoryStems(config, family)) {
        if (!storyStems.has(expectedStem)) {
          addFinding(
            "missing-story",
            toRelativePath(join(storyDir, `${expectedStem}.stories.*`)),
            `${frameworkConfig.label} ${family} Storybook is missing story coverage for ${expectedStem}.`,
          )
        }
      }

      familyMap.frameworkMaps[framework] = {
        framework,
        label: frameworkConfig.label,
        sourceIndex,
        exportSummary: readExportSummary(sourceIndex),
      }
    }

    maps.set(family, familyMap)
  }

  return maps
}

function checkRootExports(maps) {
  for (const framework of frameworksInOrder) {
    const frameworkConfig = frameworkConfigs[framework]
    const rootSummary = readExportSummary(fromRoot(frameworkConfig.rootIndex))

    for (const map of maps.values()) {
      const frameworkMap = map.frameworkMaps[framework]

      for (const valueExport of frameworkMap.exportSummary.valueExports) {
        if (!rootSummary.valueExports.includes(valueExport)) {
          addFinding(
            "missing-root-export",
            frameworkConfig.rootIndex,
            `${frameworkConfig.label} root export is missing ${valueExport} from ${map.family}.`,
          )
        }
      }

      for (const typeExport of frameworkMap.exportSummary.typeExports) {
        if (!rootSummary.typeExports.includes(typeExport)) {
          addFinding(
            "missing-root-export",
            frameworkConfig.rootIndex,
            `${frameworkConfig.label} root type export is missing ${typeExport} from ${map.family}.`,
          )
        }
      }
    }
  }
}

function checkFamilyExportParity(config, maps) {
  for (const map of maps.values()) {
    const familyConfig = getFamilyConfig(config, map.family)

    if (familyConfig.exportParityExempt || familyConfig.storyOnly) continue

    const valueUnion = uniqueSorted(
      frameworksInOrder.flatMap(
        (framework) => map.frameworkMaps[framework].exportSummary.valueExports,
      ),
    )
    const typeUnion = uniqueSorted(
      frameworksInOrder.flatMap(
        (framework) => map.frameworkMaps[framework].exportSummary.typeExports,
      ),
    )

    for (const framework of frameworksInOrder) {
      const frameworkMap = map.frameworkMaps[framework]

      for (const valueExport of valueUnion) {
        if (!frameworkMap.exportSummary.valueExports.includes(valueExport)) {
          addFinding(
            "mismatched-family-value-export",
            toRelativePath(frameworkMap.sourceIndex),
            `${frameworkMap.label} ${map.family} is missing value export ${valueExport}.`,
          )
        }
      }

      for (const typeExport of typeUnion) {
        if (!frameworkMap.exportSummary.typeExports.includes(typeExport)) {
          addFinding(
            "mismatched-family-type-export",
            toRelativePath(frameworkMap.sourceIndex),
            `${frameworkMap.label} ${map.family} is missing type export ${typeExport}.`,
          )
        }
      }
    }
  }
}

function collectSharedContractCalls(rootPath, adapterName) {
  const files = readFilesRecursive(rootPath).filter((path) => /\.(ts|tsx)$/.test(path))
  const calls = new Set()
  const adapterPattern = new RegExp(`["']${adapterName}["']`, "i")

  for (const file of files) {
    const content = readFileSync(file, "utf8")

    for (const match of content.matchAll(/\b(run[A-Za-z0-9]+Contract)\s*\(([^)]*)\)/g)) {
      if (adapterPattern.test(match[2])) {
        calls.add(match[1])
      }
    }
  }

  return calls
}

function checkSharedContractEnrollment() {
  const reactCalls = collectSharedContractCalls(fromRoot("packages/react/src"), "react")
  const vueCalls = collectSharedContractCalls(fromRoot("packages/vue/src"), "vue")
  const svelteCalls = collectSharedContractCalls(fromRoot("packages/svelte/src/tests"), "svelte")
  const requiredCalls = uniqueSorted([...reactCalls].filter((contract) => vueCalls.has(contract)))

  for (const contract of requiredCalls) {
    if (!svelteCalls.has(contract)) {
      addFinding(
        "missing-contract-enrollment",
        "packages/svelte/src/tests",
        `Svelte must enroll in ${contract} because React and Vue both use it.`,
      )
    }
  }

  return {
    reactCalls,
    vueCalls,
    svelteCalls,
    requiredCalls,
  }
}

function checkCurrentAuthorityDocs() {
  for (const docPath of currentAuthorityDocs) {
    const absolutePath = fromRoot(docPath)
    if (!existsSync(absolutePath)) continue

    const lines = readFileSync(absolutePath, "utf8").split("\n")

    for (const [lineIndex, line] of lines.entries()) {
      for (const forbiddenPhrase of forbiddenCurrentDocPhrases) {
        forbiddenPhrase.pattern.lastIndex = 0
        if (forbiddenPhrase.pattern.test(line)) {
          addFinding(
            "current-docs-react-vue-bias",
            `${docPath}:${lineIndex + 1}`,
            forbiddenPhrase.reason,
          )
        }
      }
    }
  }
}

function assertStoryRootsExist() {
  for (const framework of frameworksInOrder) {
    const frameworkConfig = frameworkConfigs[framework]
    const storyRoot = fromRoot(frameworkConfig.storyRoot)
    if (!existsSync(storyRoot) || !statSync(storyRoot).isDirectory()) {
      addFinding(
        "missing-story-dir",
        frameworkConfig.storyRoot,
        `${frameworkConfig.label} Storybook root is missing.`,
      )
    }
  }
}

function printResults(familyCount, requiredContractCount) {
  if (findings.length === 0) {
    console.log(
      `✓ Adapter architecture check passed (${familyCount} families, ${requiredContractCount} shared contract enrollments)`,
    )
    return
  }

  console.error("Adapter architecture check failed:")
  for (const finding of findings) {
    console.error(`- [${finding.id}] ${finding.path}: ${finding.message}`)
  }
  process.exit(1)
}

const config = await loadStorybookCompanionConfig()
const families = getAvailableFamilies(config)

assertStoryRootsExist()
checkFrameworkPackageCssPolicy()
const maps = collectFamilyMaps(config, families)
checkRootExports(maps)
checkFamilyExportParity(config, maps)
const contractSummary = checkSharedContractEnrollment()
checkCurrentAuthorityDocs()
printResults(families.length, contractSummary.requiredCalls.length)
