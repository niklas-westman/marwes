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

const base = args.get("--base") ?? process.env.CHANGE_BASE_REF ?? "origin/main"

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
}

function run(label, command, commandArgs) {
  console.log("")
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

function changedFiles() {
  try {
    const committed = splitFiles(
      git(["diff", "--name-only", "--diff-filter=ACMRTD", `${base}...HEAD`]),
    )
    const unstaged = splitFiles(git(["diff", "--name-only", "--diff-filter=ACMRTD"]))
    const staged = splitFiles(git(["diff", "--cached", "--name-only", "--diff-filter=ACMRTD"]))
    const untracked = splitFiles(git(["ls-files", "--others", "--exclude-standard"]))

    return [...new Set([...committed, ...unstaged, ...staged, ...untracked])].sort((left, right) =>
      left.localeCompare(right),
    )
  } catch (error) {
    console.error(`Failed to compare this branch against ${base}.`)
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
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
  return files.filter((file) => existsSync(file))
}

const files = changedFiles()
const families = [...new Set(files.map(familyFromPath).filter(Boolean))].sort((a, b) =>
  a.localeCompare(b),
)
const docsChanged = files.some((file) => file.endsWith(".md") || file.startsWith("docs/"))
const sourceChanged = files.some(
  (file) => /^(packages|apps|scripts|tests)\//.test(file) || file === "package.json",
)

console.log(`Changed-scope validation base: ${base}`)
console.log(files.length === 0 ? "No changed files." : `Changed files: ${files.length}`)
if (families.length > 0) console.log(`Changed families: ${families.join(", ")}`)

run("Adapter/core boundary check", "pnpm", ["check:adapter-boundaries"])

const biomeTargets = existingBiomeTargets(files)
if (biomeTargets.length > 0) {
  run("Biome changed files", "pnpm", ["exec", "biome", "check", ...biomeTargets])
}

if (docsChanged) {
  run("Docs links", "pnpm", ["docs:links"])
  run("Docs/API drift", "pnpm", ["docs:api"])
}

if (families.length > 0) {
  for (const family of families) {
    run(`Family validation: ${family}`, "pnpm", ["validate:family", family])
  }
} else if (sourceChanged) {
  run("Package typecheck", "pnpm", ["test:typecheck:packages"])
}

run("Whitespace diff check", "git", ["diff", "--check"])

console.log("")
console.log("✓ Changed-scope validation passed")
