import { execFileSync, spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import process from "node:process"

const args = new Map()
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index]
  if (!arg.startsWith("--")) continue
  const next = process.argv[index + 1]
  if (next && !next.startsWith("--")) {
    args.set(arg, next)
    index += 1
  } else {
    args.set(arg, "true")
  }
}

const explicitBase = args.get("--base")
const base = explicitBase ?? process.env.CHANGE_BASE_REF ?? "origin/main"
const branchMode = args.has("--branch") || Boolean(explicitBase)
const allFamilies = args.has("--all-families")
const familyThreshold = Number(args.get("--family-threshold") ?? 3)

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
}

function run(label, command, commandArgs, reason) {
  console.log("")
  if (reason) console.log(`# ${reason}`)
  console.log(`$ ${[command, ...commandArgs].join(" ")}`)
  const result = spawnSync(command, commandArgs, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "test",
    },
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  if ((result.status ?? 1) !== 0) {
    console.error(`\n${label} failed with exit code ${result.status ?? 1}`)
    process.exit(result.status ?? 1)
  }
}

function splitFiles(output) {
  return output
    .split("\n")
    .map((file) => file.trim())
    .filter(Boolean)
}

function uniqueSorted(files) {
  return [...new Set(files)].sort((left, right) => left.localeCompare(right))
}

function localChangedFiles() {
  const unstaged = splitFiles(git(["diff", "--name-only", "--diff-filter=ACMRTD"]))
  const staged = splitFiles(git(["diff", "--cached", "--name-only", "--diff-filter=ACMRTD"]))
  const untracked = splitFiles(git(["ls-files", "--others", "--exclude-standard"]))

  return uniqueSorted([...unstaged, ...staged, ...untracked])
}

function latestCommitFiles() {
  try {
    return splitFiles(git(["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"]))
  } catch {
    return splitFiles(git(["diff", "--name-only", "--diff-filter=ACMRTD", "HEAD~1..HEAD"]))
  }
}

function branchChangedFiles() {
  try {
    const committed = splitFiles(
      git(["diff", "--name-only", "--diff-filter=ACMRTD", `${base}...HEAD`]),
    )
    return uniqueSorted([...committed, ...localChangedFiles()])
  } catch (error) {
    console.error(`Failed to compare this branch against ${base}.`)
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

function changedFiles() {
  if (branchMode) {
    return {
      files: branchChangedFiles(),
      scope: explicitBase ? `branch against ${base}` : `branch against ${base}`,
      range: `${base}...HEAD plus local changes`,
    }
  }

  const localFiles = localChangedFiles()
  if (localFiles.length > 0) {
    return {
      files: localFiles,
      scope: "local worktree",
      range: "staged, unstaged, and untracked files",
    }
  }

  return {
    files: uniqueSorted(latestCommitFiles()),
    scope: "latest commit",
    range: "HEAD",
  }
}

function familyFromPath(path) {
  const patterns = [
    /^packages\/core\/src\/components\/atoms\/([^/]+)/,
    /^packages\/core\/test\/recipes\/([^/.]+)/,
    /^packages\/presets\/src\/firstEdition\/([^/.]+)\.css$/,
    /^packages\/presets\/test\/([^/.]+)-css-contract\.test\.ts$/,
    /^packages\/react\/src\/components\/([^/]+)/,
    /^packages\/vue\/src\/components\/([^/]+)/,
    /^apps\/storybook-react\/src\/stories\/([^/]+)/,
    /^apps\/storybook-vue\/src\/stories\/([^/]+)/,
    /^tests\/contracts\/([^/.]+)\.contract\.ts$/,
    /^docs\/registry\/families\/([^/]+)/,
    /^docs\/audits\/([^/]+)-family-accessibility\.md$/,
  ]

  for (const pattern of patterns) {
    const match = path.match(pattern)
    if (match) return match[1]
  }

  return null
}

function existingBiomeTargets(files) {
  return files.filter(
    (file) => existsSync(file) && /\.(cjs|css|cts|js|json|jsonc|jsx|mjs|mts|ts|tsx)$/.test(file),
  )
}

function isDocsOnlyFile(file) {
  return (
    file.endsWith(".md") ||
    file.startsWith("docs/") ||
    file === "README.md" ||
    file === "CSS_UPDATE.md" ||
    file.startsWith(".github/")
  )
}

function isSourceFile(file) {
  return /^(packages|apps|scripts|tests)\//.test(file) || file === "package.json"
}

const { files, scope, range } = changedFiles()
const families = uniqueSorted(files.map(familyFromPath).filter(Boolean))
const docsChanged = files.some((file) => file.endsWith(".md") || file.startsWith("docs/"))
const docsOnly = files.length > 0 && files.every(isDocsOnlyFile)
const sourceChanged = files.some(isSourceFile)
const largeFamilyScope = families.length > familyThreshold

console.log("Changed-scope validation")
console.log(`Scope: ${scope}`)
console.log(`Range: ${range}`)
console.log(`Files: ${files.length}`)
if (families.length > 0) console.log(`Families: ${families.join(", ")}`)
if (docsOnly) console.log("Fast path: docs-only")
if (largeFamilyScope) {
  console.log(
    `Large family scope: ${families.length} families exceeds threshold ${familyThreshold}.`,
  )
}

if (files.length === 0) {
  console.log("No changed files.")
  process.exit(0)
}

const biomeTargets = existingBiomeTargets(files)
if (biomeTargets.length > 0) {
  run(
    "Biome changed files",
    "pnpm",
    ["exec", "biome", "check", ...biomeTargets],
    "changed files should stay formatted/linted",
  )
}

if (docsChanged) {
  run(
    "Compass docs-system check",
    "pnpm",
    ["check:compass"],
    "docs changed, so routing/link/API drift rules must pass",
  )
}

if (!docsOnly) {
  run(
    "Adapter/core boundary check",
    "pnpm",
    ["check:adapter-boundaries"],
    "source or tooling changed, so package boundaries must still hold",
  )
}

if (families.length > 0) {
  if (largeFamilyScope && !allFamilies) {
    run(
      "Repo map integrity",
      "pnpm",
      ["check:repo-map"],
      "large family scope detected; run shared integrity once instead of many family gates",
    )
    console.log("")
    console.log(
      `Skipped ${families.length} per-family gates. Re-run with --all-families to validate every family explicitly.`,
    )
  } else {
    for (const family of families) {
      run(
        `Family validation: ${family}`,
        "pnpm",
        ["validate:family", family],
        `family-specific files changed for ${family}`,
      )
    }
  }
} else if (sourceChanged) {
  run(
    "Package typecheck",
    "pnpm",
    ["test:typecheck:packages"],
    "source/tooling changed without a specific family target",
  )
}

run(
  "Whitespace diff check",
  "git",
  ["diff", "--check"],
  "diff should not contain whitespace errors",
)

console.log("")
console.log("✓ Changed-scope validation passed")
