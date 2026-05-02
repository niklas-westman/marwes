import { execFileSync } from "node:child_process"
import { appendFileSync } from "node:fs"

const args = new Map()
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index]
  if (arg === "--") continue
  if (!arg.startsWith("--")) continue
  args.set(arg, process.argv[index + 1])
  index += 1
}

const base = args.get("--base") ?? process.env.CHANGESET_BASE_REF ?? "origin/main"
const headRef = process.env.GITHUB_HEAD_REF ?? ""
const actor = process.env.GITHUB_ACTOR ?? ""

const releasePrBranch = headRef.startsWith("changeset-release/")
const botActor = actor === "github-actions[bot]"

function changedFiles() {
  try {
    const output = execFileSync(
      "git",
      ["diff", "--name-only", "--diff-filter=ACMRTD", `${base}...HEAD`],
      { encoding: "utf8" },
    )

    return output
      .split("\n")
      .map((file) => file.trim())
      .filter(Boolean)
  } catch (error) {
    console.error(`Failed to compare this branch against ${base}.`)
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

function writeSummary(markdown) {
  if (!process.env.GITHUB_STEP_SUMMARY) return
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`)
}

const files = changedFiles()
const packageChanges = files.filter((file) => file.startsWith("packages/"))
const changesetFiles = files.filter((file) => /^\.changeset\/[^/]+\.md$/.test(file))

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
