import { readFile, readdir, stat } from "node:fs/promises"
import { resolve } from "node:path"
import process from "node:process"

const repositoryRoot = process.cwd()

const scannedRoots = [
  "packages/core/src/components",
  "packages/react/src/components",
  "packages/vue/src/components",
]

const skippedDirectories = new Set(["node_modules", "dist", ".git"])
const sourceExtensions = new Set([".ts", ".tsx", ".vue"])

const checks = [
  {
    id: "core-dom-access",
    description: "core must stay framework/browser agnostic",
    appliesTo: (path) => path.startsWith("packages/core/src/components/"),
    pattern: /\b(document|window|HTMLElement)\b/,
  },
  {
    id: "react-imports-vue",
    description: "React adapter must not import Vue adapter/runtime code",
    appliesTo: (path) => path.startsWith("packages/react/src/components/"),
    pattern: /from\s+["'](?:@marwes-ui\/vue|.*packages\/vue|vue)["']/,
  },
  {
    id: "vue-imports-react",
    description: "Vue adapter must not import React adapter/runtime code",
    appliesTo: (path) => path.startsWith("packages/vue/src/components/"),
    pattern: /from\s+["'](?:@marwes-ui\/react|.*packages\/react|react)["']/,
  },
  {
    id: "adapter-imports-presets",
    description: "framework component adapters must not import preset CSS or preset runtime",
    appliesTo: (path) =>
      path.startsWith("packages/react/src/components/") ||
      path.startsWith("packages/vue/src/components/"),
    pattern: /from\s+["'](?:@marwes-ui\/presets|.*packages\/presets)/,
  },
  {
    id: "adapter-hardcoded-color",
    description:
      "framework component adapters should not hardcode visual tokens; put visual language in presets",
    appliesTo: (path) =>
      path.startsWith("packages/react/src/components/") ||
      path.startsWith("packages/vue/src/components/"),
    pattern: /#[0-9a-fA-F]{3,8}\b/,
  },
]

function normalizePath(path) {
  return path.replace(/\\/g, "/")
}

function extensionOf(path) {
  const match = path.match(/\.[^.]+$/)
  return match?.[0] ?? ""
}

async function collectSourceFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (skippedDirectories.has(entry.name) || entry.name === "__tests__") {
      continue
    }

    const entryPath = resolve(directoryPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(entryPath)))
      continue
    }

    if (entry.isFile() && sourceExtensions.has(extensionOf(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

async function pathExists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

const files = []
for (const root of scannedRoots) {
  const absoluteRoot = resolve(repositoryRoot, root)
  if (await pathExists(absoluteRoot)) {
    files.push(...(await collectSourceFiles(absoluteRoot)))
  }
}

const violations = []

for (const file of files) {
  const relativePath = normalizePath(file.replace(`${repositoryRoot}/`, ""))
  const contents = await readFile(file, "utf8")
  const lines = contents.split("\n")

  for (const check of checks) {
    if (!check.appliesTo(relativePath)) continue

    for (const [index, line] of lines.entries()) {
      if (check.pattern.test(line)) {
        violations.push({
          check,
          path: relativePath,
          lineNumber: index + 1,
          line: line.trim(),
        })
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Adapter/core boundary check failed:")
  console.error("")

  for (const violation of violations) {
    console.error(`- ${violation.path}:${violation.lineNumber}`)
    console.error(`  ${violation.check.id}: ${violation.check.description}`)
    console.error(`  ${violation.line}`)
  }

  process.exit(1)
}

console.log(`✓ Adapter/core boundary check passed (${files.length} source files)`)
