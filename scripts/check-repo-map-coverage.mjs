import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import process from "node:process"

const repoMapPath = "docs/reference/repo-map.md"
const packageJsonPath = "package.json"

const requiredPaths = [
  "docs/start-here.md",
  "docs/reference/repo-map.md",
  "docs/reference/testing.md",
  "docs/reference/architecture.md",
  "docs/reference/accessibility.md",
  "docs/audits/status.md",
  "docs/registry/README.md",
  "docs/blocks/README.md",
  "artifacts/component-registry.json",
]

const requiredCommands = [
  "check:changed",
  "check:adapter-boundaries",
  "validate:family",
  "validate:docs",
  "validate:packages",
  "validate:release",
  "registry:check",
  "docs:links",
]

const requiredPhrases = [
  "Code and generated artifacts",
  "Reference docs",
  "Registry family docs",
  "Audit docs",
  "Guides and blocks",
  "Planning docs",
  "Blocks are not package APIs",
  "Planning docs lifecycle",
]

const repoMap = await readFile(repoMapPath, "utf8")
const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))
const scripts = packageJson.scripts ?? {}

const findings = []

for (const path of requiredPaths) {
  if (!repoMap.includes(path)) {
    findings.push(`${repoMapPath} does not mention required path: ${path}`)
  }

  if (!existsSync(path)) {
    findings.push(`Required repo-map path does not exist: ${path}`)
  }
}

for (const command of requiredCommands) {
  if (!repoMap.includes(command)) {
    findings.push(`${repoMapPath} does not mention required command: ${command}`)
  }

  if (!scripts[command]) {
    findings.push(`Required package.json script does not exist: ${command}`)
  }
}

for (const phrase of requiredPhrases) {
  if (!repoMap.includes(phrase)) {
    findings.push(`${repoMapPath} is missing required routing phrase: ${phrase}`)
  }
}

if (findings.length > 0) {
  console.error("Repo map coverage check failed:")
  console.error("")
  for (const finding of findings) {
    console.error(`- ${finding}`)
  }
  process.exit(1)
}

console.log(
  `✓ Repo map coverage check passed (${requiredPaths.length} paths, ${requiredCommands.length} commands)`,
)
