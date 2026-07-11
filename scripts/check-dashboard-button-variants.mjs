import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dashboardSrc = path.join(repoRoot, "apps/dashboard-teaser/src")
const buttonVariantPattern = /<Button\b[^>]*\bvariant=["']([^"']+)["']/g

async function collectTsxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return collectTsxFiles(entryPath)
      }

      return entry.isFile() && entry.name.endsWith(".tsx") ? [entryPath] : []
    }),
  )

  return files.flat()
}

const violations = []

for (const file of await collectTsxFiles(dashboardSrc)) {
  const source = await readFile(file, "utf8")

  for (const match of source.matchAll(buttonVariantPattern)) {
    const line = source.slice(0, match.index).split("\n").length
    violations.push({
      file: path.relative(process.cwd(), file),
      line,
      variant: match[1],
    })
  }
}

if (violations.length > 0) {
  console.error("Use ButtonVariant.* for dashboard-teaser Button variants.")
  console.error("String literals hide the preferred design-system token from AI/code review.")
  console.error("")

  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line} uses variant="${violation.variant}"`)
  }

  process.exit(1)
}
