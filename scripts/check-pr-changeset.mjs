import { execFileSync } from "node:child_process"
import { appendFileSync, existsSync, readFileSync } from "node:fs"

const args = new Map()
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index]
  if (arg === "--") continue
  if (!arg.startsWith("--")) continue
  const next = process.argv[index + 1]
  if (next && !next.startsWith("--")) {
    args.set(arg, next)
    index += 1
  } else {
    args.set(arg, "true")
  }
}

const base = args.get("--base") ?? process.env.CHANGESET_BASE_REF ?? "origin/main"
const committedOnly = args.has("--committed-only")
const includeLocal = args.has("--include-local") || (!process.env.GITHUB_ACTIONS && !committedOnly)
const headRef = process.env.GITHUB_HEAD_REF ?? ""
const actor = process.env.GITHUB_ACTOR ?? ""

const releasePrBranch = headRef.startsWith("changeset-release/")
const botActor = actor === "github-actions[bot]"
const fixedMarwesPackages = [
  "@marwes-ui/core",
  "@marwes-ui/react",
  "@marwes-ui/presets",
  "@marwes-ui/vue",
]

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
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

function branchChangedFiles() {
  try {
    return splitFiles(git(["diff", "--name-only", "--diff-filter=ACMRTD", `${base}...HEAD`]))
  } catch (error) {
    console.error(`Failed to compare this branch against ${base}.`)
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

function localChangedFiles() {
  const unstaged = splitFiles(git(["diff", "--name-only", "--diff-filter=ACMRTD"]))
  const staged = splitFiles(git(["diff", "--cached", "--name-only", "--diff-filter=ACMRTD"]))
  const untracked = splitFiles(git(["ls-files", "--others", "--exclude-standard"]))

  return uniqueSorted([...unstaged, ...staged, ...untracked])
}

function changedFiles() {
  const branchFiles = branchChangedFiles()

  if (!includeLocal) {
    return {
      files: uniqueSorted(branchFiles),
      scope: `committed branch against ${base}`,
      range: `${base}...HEAD`,
    }
  }

  return {
    files: uniqueSorted([...branchFiles, ...localChangedFiles()]),
    scope: `branch against ${base} plus local changes`,
    range: `${base}...HEAD plus staged, unstaged, and untracked files`,
  }
}

function writeSummary(markdown) {
  if (!process.env.GITHUB_STEP_SUMMARY) return
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`)
}

function readChangesetPackages(file) {
  const content = readFileSync(file, "utf8")
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(content)?.[1]
  if (!frontmatter) return []

  const packages = []
  for (const line of frontmatter.split("\n")) {
    const match = /^["']?([^"':]+)["']?:\s*(patch|minor|major)\s*$/.exec(line.trim())
    if (match?.[1]) packages.push(match[1])
  }

  return packages
}

function validateFixedPackageChangesets(changesetFiles) {
  const failures = []

  for (const file of changesetFiles) {
    const packages = readChangesetPackages(file)
    const fixedPackages = fixedMarwesPackages.filter((packageName) =>
      packages.includes(packageName),
    )

    if (fixedPackages.length === 0 || fixedPackages.length === fixedMarwesPackages.length) {
      continue
    }

    const missing = fixedMarwesPackages.filter((packageName) => !packages.includes(packageName))
    failures.push({ file, included: fixedPackages, missing })
  }

  return failures
}

const { files, scope, range } = changedFiles()
const packageChanges = files.filter((file) => file.startsWith("packages/"))
const changesetFiles = files.filter(
  (file) => /^\.changeset\/[^/]+\.md$/.test(file) && existsSync(file),
)

console.log("Changeset validation")
console.log(`Scope: ${scope}`)
console.log(`Range: ${range}`)
console.log(`Files: ${files.length}`)

if (releasePrBranch || botActor) {
  const reason = releasePrBranch ? `release PR branch \`${headRef}\`` : `bot actor \`${actor}\``
  console.log(`Skipping changeset requirement for ${reason}.`)
  writeSummary(`### Changeset check\n\nSkipped for ${reason}.`)
  process.exit(0)
}

if (packageChanges.length === 0) {
  console.log("No publishable package changes detected under packages/**.")
  writeSummary(
    "### Changeset check\n\nNo publishable package changes detected under `packages/**`.",
  )
  process.exit(0)
}

if (changesetFiles.length > 0) {
  const fixedPackageFailures = validateFixedPackageChangesets(changesetFiles)
  if (fixedPackageFailures.length > 0) {
    const message = [
      "Changesets for fixed Marwes packages must include the full fixed package group.",
      "",
      "The fixed group is:",
      "",
      ...fixedMarwesPackages.map((packageName) => `- \`${packageName}\``),
      "",
      "Partial changesets found:",
      "",
      ...fixedPackageFailures.flatMap(({ file, included, missing }) => [
        `- \`${file}\``,
        `  - included: ${included.map((packageName) => `\`${packageName}\``).join(", ")}`,
        `  - missing: ${missing.map((packageName) => `\`${packageName}\``).join(", ")}`,
      ]),
    ].join("\n")

    console.error(message)
    writeSummary(`### Changeset fixed-package group mismatch\n\n${message}`)
    process.exit(1)
  }

  console.log("Changeset found for package changes:")
  for (const file of changesetFiles) console.log(`- ${file}`)
  writeSummary(
    [
      "### Changeset check",
      "",
      "Package changes detected and a changeset is present.",
      "",
      ...changesetFiles.map((file) => `- \`${file}\``),
    ].join("\n"),
  )
  process.exit(0)
}

const packageList = packageChanges.map((file) => `- \`${file}\``).join("\n")
const message = [
  "This PR changes publishable package files under `packages/**` but does not include a Changesets entry.",
  "",
  "Run locally:",
  "",
  "```bash",
  "pnpm changeset",
  "```",
  "",
  "Choose the release type:",
  "",
  "- `patch`: bug fixes, internal behavior fixes, or package API docs",
  "- `minor`: new public API, new component, or backwards-compatible feature",
  "- `major`: breaking public API or behavior",
  "",
  "Commit the generated `.changeset/*.md` file with this PR.",
  "",
  "If the package change should not produce a release, add an empty changeset instead:",
  "",
  "```bash",
  "pnpm changeset add --empty",
  "```",
  "",
  "Detected package changes:",
  "",
  packageList,
].join("\n")

console.error(message)
writeSummary(`### Changeset required\n\n${message}`)
process.exit(1)
