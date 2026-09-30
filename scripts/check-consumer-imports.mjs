import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicApi = JSON.parse(readFileSync(path.join(repoRoot, "artifacts/public-api.json"), "utf8"))
const publicNames = new Map(
  publicApi.packages.map((packageRecord) => [
    packageRecord.importPath,
    new Set(packageRecord.exports.map((entry) => entry.name)),
  ]),
)
const internalAtoms = new Set([
  "Accordion",
  "Checkbox",
  "DatePicker",
  "Input",
  "InputOtp",
  "Pagination",
  "Radio",
  "RichText",
  "SegmentedControl",
  "Select",
  "Slider",
  "Switch",
  "Textarea",
])
const findings = []

function listFiles(root, predicate) {
  if (!existsSync(root)) return []
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(root, entry.name)
    return entry.isDirectory()
      ? listFiles(absolutePath, predicate)
      : predicate(absolutePath)
        ? [absolutePath]
        : []
  })
}

function consumerFiles() {
  const fixed = [
    "README.md",
    "packages/react/README.md",
    "packages/vue/README.md",
    "packages/svelte/README.md",
    "apps/dashboard-teaser/README.md",
  ].map((relativePath) => path.join(repoRoot, relativePath))
  const introductions = ["react", "vue", "svelte"].flatMap((framework) =>
    listFiles(
      path.join(repoRoot, `apps/storybook-${framework}/src`),
      (filePath) => path.basename(filePath) === "Introduction.mdx",
    ),
  )
  const fixtures = listFiles(
    path.join(repoRoot, "apps/dashboard-teaser/src"),
    (filePath) => /\.(?:ts|tsx|vue|svelte)$/.test(filePath) && !filePath.includes(".test."),
  )
  const generatedDocs = listFiles(path.join(repoRoot, "apps/dashboard-teaser/docs"), (filePath) =>
    filePath.endsWith(".html"),
  )
  const aiGuides = listFiles(path.join(repoRoot, "apps/dashboard-teaser/public/ai"), (filePath) =>
    /\.(?:md|mdx)$/.test(filePath),
  )

  return [
    ...new Set([...fixed, ...introductions, ...fixtures, ...generatedDocs, ...aiGuides]),
  ].filter(existsSync)
}

function expectedFramework(relativePath) {
  for (const framework of ["react", "vue", "svelte"]) {
    if (
      relativePath === `packages/${framework}/README.md` ||
      relativePath.startsWith(`apps/storybook-${framework}/`) ||
      relativePath === `apps/dashboard-teaser/public/ai/${framework}.md`
    ) {
      return framework
    }
  }
  if (relativePath.endsWith(".tsx")) return "react"
  if (relativePath.endsWith(".vue")) return "vue"
  if (relativePath.endsWith(".svelte")) return "svelte"
  return undefined
}

function importedNames(clause) {
  return clause
    .split(",")
    .map(
      (part) =>
        part
          .replace(/^\s*type\s+/, "")
          .trim()
          .split(/\s+as\s+/)[0],
    )
    .filter(Boolean)
}

function validateFile(filePath) {
  const relativePath = path.relative(repoRoot, filePath).replaceAll("\\", "/")
  const expected = expectedFramework(relativePath)
  const content = readFileSync(filePath, "utf8")
  const importPattern =
    /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["'](@marwes-ui\/(react|vue|svelte)(\/[^"']*)?)["']/g

  for (const match of content.matchAll(importPattern)) {
    const [, clause, packagePath, framework, subpath] = match
    const rootImport = `@marwes-ui/${framework}`
    const names = importedNames(clause)

    if (expected && framework !== expected) {
      findings.push(`${relativePath}: expected ${expected} imports, found ${packagePath}`)
    }
    if (subpath) {
      findings.push(`${relativePath}: private adapter deep import ${packagePath}`)
    }

    for (const name of names) {
      if (!publicNames.get(rootImport)?.has(name)) {
        findings.push(`${relativePath}: ${name} is not exported by ${rootImport}`)
      }
      if (internalAtoms.has(name)) {
        findings.push(
          `${relativePath}: ${name} is an internal atom; document its Field or Purpose component`,
        )
      }
    }
  }

  const encodedImportPattern =
    /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+&quot;(@marwes-ui\/(react|vue|svelte)(\/[^&]+)?)&quot;/g
  for (const match of content.matchAll(encodedImportPattern)) {
    const [, clause, packagePath, framework, subpath] = match
    const rootImport = `@marwes-ui/${framework}`
    if (subpath) findings.push(`${relativePath}: private adapter deep import ${packagePath}`)
    for (const name of importedNames(clause)) {
      if (!publicNames.get(rootImport)?.has(name)) {
        findings.push(`${relativePath}: ${name} is not exported by ${rootImport}`)
      }
      if (internalAtoms.has(name)) {
        findings.push(
          `${relativePath}: ${name} is an internal atom; document its Field or Purpose component`,
        )
      }
    }
  }

  for (const match of content.matchAll(
    /(?:from\s+|import\s*\()["']([^"']*packages\/(?:react|vue|svelte)\/src[^"']*)["']/g,
  )) {
    findings.push(`${relativePath}: private adapter source import ${match[1]}`)
  }
}

for (const filePath of consumerFiles()) validateFile(filePath)

if (findings.length > 0) {
  console.error(
    ["Consumer import validation failed:", ...findings.map((item) => `- ${item}`)].join("\n"),
  )
  process.exitCode = 1
} else {
  console.log("✓ Consumer imports use public, framework-correct adapter exports")
}
