import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const artifactPath = path.join(repoRoot, "artifacts/public-api.json")
const beginMarker = "<!-- BEGIN GENERATED PUBLIC COMPONENTS -->"
const endMarker = "<!-- END GENERATED PUBLIC COMPONENTS -->"

function titleCase(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function renderNameRows(names) {
  const rows = []
  for (let index = 0; index < names.length; index += 6) {
    rows.push(
      `- ${names
        .slice(index, index + 6)
        .map((name) => `\`${name}\``)
        .join(", ")}`,
    )
  }
  return rows
}

function renderSection(packageRecord) {
  const groups = new Map()
  for (const entry of packageRecord.exports.filter((entry) => entry.kind === "component")) {
    const group = entry.family ?? "framework"
    const names = groups.get(group) ?? []
    names.push(entry.name)
    groups.set(group, names)
  }

  const orderedGroups = [...groups.entries()].sort(([left], [right]) => {
    if (left === "framework") return -1
    if (right === "framework") return 1
    return left.localeCompare(right, "en")
  })
  const content = [
    beginMarker,
    "## Available Components",
    "",
    `Generated from the public root export of \`${packageRecord.importPath}\`. Do not edit this inventory by hand.`,
    "",
  ]

  for (const [family, names] of orderedGroups) {
    names.sort((left, right) => left.localeCompare(right, "en"))
    content.push(`### ${family === "framework" ? "Framework" : titleCase(family)}`, "")
    content.push(...renderNameRows(names), "")
  }

  content.push(endMarker)
  return content.join("\n")
}

function replaceAvailableComponents(readme, generatedSection, relativePath) {
  const markedPattern = new RegExp(`${beginMarker}[\\s\\S]*?${endMarker}`)
  if (markedPattern.test(readme)) return readme.replace(markedPattern, generatedSection)

  const headingPattern = /^## Available Components\s*$[\s\S]*?(?=^##\s|\s*$)/m
  if (!headingPattern.test(readme)) {
    throw new Error(`${relativePath}: missing "## Available Components" section`)
  }

  return readme.replace(headingPattern, `${generatedSection}\n\n`)
}

export function generateConsumerReadmes({ check = false } = {}) {
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"))
  const stale = []

  for (const packageRecord of artifact.packages) {
    const relativePath = `packages/${packageRecord.framework}/README.md`
    const absolutePath = path.join(repoRoot, relativePath)
    const current = readFileSync(absolutePath, "utf8")
    const generated = replaceAvailableComponents(
      current,
      renderSection(packageRecord),
      relativePath,
    )

    if (current === generated) continue
    if (check) stale.push(relativePath)
    else writeFileSync(absolutePath, generated, "utf8")
  }

  if (stale.length > 0) {
    throw new Error(
      `Generated consumer docs are stale: ${stale.join(", ")}. Run pnpm consumer-docs:generate.`,
    )
  }
}

function main() {
  const check = process.argv.includes("--check")
  generateConsumerReadmes({ check })
  console.log(
    check
      ? "✓ Consumer README inventories are up to date"
      : "✓ Generated consumer README inventories",
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
