import { existsSync } from "node:fs"
import { readFile, readdir, stat } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import process from "node:process"
import { compassConfig } from "./config.mjs"

const repositoryRoot = process.cwd()
const selectedRules = new Set(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--rule="))
    .map((arg) => arg.replace("--rule=", "")),
)
const runAllRules = selectedRules.size === 0
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g

function normalizePath(path) {
  return path.replace(/\\/g, "/")
}

function shouldRun(ruleName) {
  return runAllRules || selectedRules.has(ruleName)
}

async function pathExists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function readRepoFile(relativePath) {
  return readFile(resolve(repositoryRoot, relativePath), "utf8")
}

async function collectMarkdownFiles(directoryPath) {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true })
  const markdownFiles = []

  for (const directoryEntry of directoryEntries) {
    if (compassConfig.skippedDirectories.has(directoryEntry.name)) {
      continue
    }

    const entryPath = resolve(directoryPath, directoryEntry.name)

    if (directoryEntry.isDirectory()) {
      markdownFiles.push(...(await collectMarkdownFiles(entryPath)))
      continue
    }

    if (directoryEntry.isFile() && entryPath.endsWith(".md")) {
      markdownFiles.push(entryPath)
    }
  }

  return markdownFiles
}

function shouldIgnoreLink(linkTarget) {
  return (
    linkTarget.startsWith("#") || linkTarget.startsWith("mailto:") || linkTarget.includes("://")
  )
}

async function checkLinks() {
  const markdownFiles = await collectMarkdownFiles(repositoryRoot)
  const brokenLinks = []

  for (const markdownFilePath of markdownFiles) {
    const markdownContent = await readFile(markdownFilePath, "utf8")
    const matches = markdownContent.matchAll(markdownLinkPattern)

    for (const match of matches) {
      const rawLinkTarget = match[1]

      if (shouldIgnoreLink(rawLinkTarget)) continue

      const cleanLinkTarget = rawLinkTarget.split("#")[0]
      if (!cleanLinkTarget) continue

      const resolvedTargetPath = resolve(dirname(markdownFilePath), cleanLinkTarget)
      if (!(await pathExists(resolvedTargetPath))) {
        brokenLinks.push({ markdownFilePath, rawLinkTarget })
      }
    }
  }

  if (brokenLinks.length > 0) {
    return {
      name: "links",
      failures: brokenLinks.map((brokenLink) => {
        const relativeMarkdownFilePath = normalizePath(
          brokenLink.markdownFilePath.replace(`${repositoryRoot}/`, ""),
        )
        return `${relativeMarkdownFilePath}: broken link ${brokenLink.rawLinkTarget}`
      }),
    }
  }

  return { name: "links", details: `Markdown links valid (${markdownFiles.length} files)` }
}

async function checkApiDrift() {
  const failures = []
  let checkedFiles = 0

  for (const documentationFile of compassConfig.docsApi.documentationFiles) {
    const absolutePath = resolve(repositoryRoot, documentationFile.path)
    if (!(await pathExists(absolutePath))) continue

    checkedFiles += 1
    const fileContent = await readFile(absolutePath, "utf8")

    for (const requiredPattern of documentationFile.requiredPatterns) {
      if (!requiredPattern.pattern.test(fileContent)) {
        failures.push(`${documentationFile.path}: missing ${requiredPattern.description}`)
      }
    }

    for (const forbiddenPattern of [
      ...compassConfig.docsApi.sharedForbiddenPatterns,
      ...(documentationFile.forbiddenPatterns ?? []),
    ]) {
      if (forbiddenPattern.pattern.test(fileContent)) {
        failures.push(`${documentationFile.path}: found ${forbiddenPattern.description}`)
      }
    }
  }

  return failures.length > 0
    ? { name: "api", failures }
    : { name: "api", details: `Docs/API drift checks valid (${checkedFiles} files)` }
}

async function checkRepoMap() {
  const repoMap = await readRepoFile(compassConfig.repoMapPath)
  const packageJson = JSON.parse(await readRepoFile(compassConfig.packageJsonPath))
  const scripts = packageJson.scripts ?? {}
  const failures = []

  for (const path of compassConfig.repoMap.requiredPaths) {
    if (!repoMap.includes(path)) {
      failures.push(`${compassConfig.repoMapPath} does not mention required path: ${path}`)
    }

    if (!existsSync(path)) {
      failures.push(`Required repo-map path does not exist: ${path}`)
    }
  }

  for (const command of compassConfig.repoMap.requiredCommands) {
    if (!repoMap.includes(command)) {
      failures.push(`${compassConfig.repoMapPath} does not mention required command: ${command}`)
    }

    if (!scripts[command]) {
      failures.push(`Required package.json script does not exist: ${command}`)
    }
  }

  for (const phrase of compassConfig.repoMap.requiredPhrases) {
    if (!repoMap.includes(phrase)) {
      failures.push(`${compassConfig.repoMapPath} is missing required routing phrase: ${phrase}`)
    }
  }

  return failures.length > 0
    ? { name: "repo-map", failures }
    : {
        name: "repo-map",
        details: `Repo map coverage valid (${compassConfig.repoMap.requiredPaths.length} paths, ${compassConfig.repoMap.requiredCommands.length} commands)`,
      }
}

async function checkAuthority() {
  const rootReadme = await readRepoFile("README.md")
  const docsIndex = await readRepoFile(compassConfig.docsIndexPath)
  const spec = await readRepoFile(compassConfig.specPath)
  const startHere = await readRepoFile(compassConfig.entrypointPath)
  const failures = []

  if (!rootReadme.includes(compassConfig.entrypointPath)) {
    failures.push(`README.md must point to ${compassConfig.entrypointPath}`)
  }

  if (!docsIndex.includes("full documentation index") || !docsIndex.includes("Start Here")) {
    failures.push(
      `${compassConfig.docsIndexPath} must frame itself as an index and route to Start Here`,
    )
  }

  if (!spec.includes("not the first onboarding route")) {
    failures.push(`${compassConfig.specPath} must not present itself as the first onboarding route`)
  }

  if (!startHere.includes("single starting point") || !startHere.includes("pnpm compass")) {
    failures.push(
      `${compassConfig.entrypointPath} must stay the singular entrypoint and mention pnpm compass`,
    )
  }

  return failures.length > 0
    ? { name: "authority", failures }
    : { name: "authority", details: "Compass authority routing is valid" }
}

async function checkStatusOwnership() {
  const auditReadme = await readRepoFile(compassConfig.auditReadmePath)
  const registryReadme = await readRepoFile("docs/registry/README.md")
  const registryTemplate = await readRepoFile("docs/registry/templates/family.README.template.md")
  const failures = []

  for (const [path, content] of [
    [compassConfig.auditReadmePath, auditReadme],
    ["docs/registry/README.md", registryReadme],
    ["docs/registry/templates/family.README.template.md", registryTemplate],
  ]) {
    if (!content.includes(compassConfig.auditStatusPath)) {
      failures.push(
        `${path} must route compact family status ownership to ${compassConfig.auditStatusPath}`,
      )
    }
  }

  return failures.length > 0
    ? { name: "status-ownership", failures }
    : { name: "status-ownership", details: "Audit status ownership is valid" }
}

async function checkPlanningLifecycle() {
  const planningDirectory = resolve(repositoryRoot, "docs/planning")
  const planningFiles = (await pathExists(planningDirectory))
    ? await collectMarkdownFiles(planningDirectory)
    : []
  const temporaryFiles = planningFiles
    .map((file) => normalizePath(file.replace(`${repositoryRoot}/`, "")))
    .filter((file) => /temp|temporary/i.test(file))

  return temporaryFiles.length > 0
    ? {
        name: "planning-lifecycle",
        failures: temporaryFiles.map(
          (file) => `${file}: temporary planning doc must be removed or promoted before merge`,
        ),
      }
    : { name: "planning-lifecycle", details: "No temporary planning docs remain" }
}

const ruleChecks = [
  ["links", checkLinks],
  ["api", checkApiDrift],
  ["repo-map", checkRepoMap],
  ["authority", checkAuthority],
  ["status-ownership", checkStatusOwnership],
  ["planning-lifecycle", checkPlanningLifecycle],
]

const results = []
for (const [ruleName, ruleCheck] of ruleChecks) {
  if (shouldRun(ruleName)) {
    results.push(await ruleCheck())
  }
}

const unknownRules = [...selectedRules].filter(
  (ruleName) => !ruleChecks.some(([knownRuleName]) => knownRuleName === ruleName),
)

for (const unknownRule of unknownRules) {
  results.push({ name: unknownRule, failures: [`Unknown Compass rule: ${unknownRule}`] })
}

console.log("Compass check")
console.log("")

let failureCount = 0
for (const result of results) {
  if (result.failures?.length) {
    failureCount += result.failures.length
    console.log(`✗ ${result.name}`)
    for (const failure of result.failures) {
      console.log(`  - ${failure}`)
    }
    continue
  }

  console.log(`✓ ${result.name}: ${result.details}`)
}

if (failureCount > 0) {
  console.error("")
  console.error(`Compass check failed (${failureCount} finding${failureCount === 1 ? "" : "s"})`)
  process.exit(1)
}

console.log("")
console.log("✓ Compass check passed")
