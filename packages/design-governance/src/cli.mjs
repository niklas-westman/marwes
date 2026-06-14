#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = resolve(packageRoot, "../..")

function usage() {
  return [
    "Usage:",
    "  pnpm governance:status",
    "  pnpm governance:sync -- --mode cache",
    "  pnpm governance:prepare -- --family badge --connect --dry-run",
    "  pnpm governance:ingest -- --family badge --dry-run",
    "  pnpm governance:check -- --family badge",
    "  pnpm governance:visual",
    "  pnpm governance:ci -- --skip-browser-install",
    "  pnpm governance:migrate-contracts -- --dry-run",
    "",
    "Advanced package commands:",
    "  pnpm --filter @marwes-ui/design-governance sync [--mode cache|remote]",
    "  pnpm --filter @marwes-ui/design-governance raw-sync --mode cache",
    "  pnpm --filter @marwes-ui/design-governance variables-sync",
    "  pnpm --filter @marwes-ui/design-governance validate --family badge",
    "  pnpm --filter @marwes-ui/design-governance validate --all",
    "  pnpm --filter @marwes-ui/design-governance validate-runtime --family badge",
    "  pnpm --filter @marwes-ui/design-governance cohesive-check --family button",
    "  pnpm --filter @marwes-ui/design-governance colors",
  ].join("\n")
}

function runScript(scriptPath, args) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    stdio: "inherit",
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  process.exitCode = result.status ?? 1
  return process.exitCode
}

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
  })

  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }

  process.exitCode = result.status ?? 1
  return process.exitCode
}

function readOption(args, name, fallback) {
  const index = args.indexOf(name)
  if (index === -1) return fallback
  const value = args[index + 1]
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`)
  return value
}

function collectOption(args, name) {
  const index = args.indexOf(name)
  if (index === -1) return []
  const value = args[index + 1]
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`)
  return [name, value]
}

function hasSelection(args) {
  return args.includes("--all") || args.includes("--family")
}

function withDefaultAll(args) {
  return hasSelection(args) ? args : ["--all", ...args]
}

function withRequiredArg(args, name) {
  return args.includes(name) ? args : [...args, name]
}

function runSync(args) {
  const mode = readOption(args, "--mode", "cache")
  const skipRaw = args.includes("--skip-raw")
  const skipVariables = args.includes("--skip-variables")
  const commonArgs = [
    ...collectOption(args, "--target"),
    ...collectOption(args, "--config"),
    ...collectOption(args, "--file-key"),
  ]
  const rawArgs = [
    "--mode",
    mode,
    ...collectOption(args, "--target"),
    ...collectOption(args, "--config"),
    ...collectOption(args, "--toolkit"),
  ]
  const variableArgs = ["--accept-any-file", "--no-refresh", ...commonArgs]

  if (args.includes("--no-preserve-vars")) rawArgs.push("--no-preserve-vars")

  if (!skipRaw) {
    const rawStatus = runScript(
      resolve(packageRoot, "src/sync/figma-raw-sync.mjs"),
      rawArgs.filter((arg) => arg !== "--file-key"),
    )
    if (rawStatus !== 0) process.exit(rawStatus)
  }

  if (!skipVariables) {
    const variablesStatus = runScript(
      resolve(packageRoot, "src/sync/figma-variables-sync.mjs"),
      variableArgs,
    )
    if (variablesStatus !== 0) process.exit(variablesStatus)
  }
}

function runCheck(args) {
  const strict = args.includes("--strict")
  const passthrough = args.filter((arg) => arg !== "--strict")
  const selected = withDefaultAll(passthrough)
  const withReceipts = withRequiredArg(selected, "--require-baseline-receipts")
  const finalArgs = strict ? withRequiredArg(withReceipts, "--require-figma-frames") : withReceipts
  runScript(resolve(packageRoot, "src/cohesive-check.mjs"), finalArgs)
}

function runIngest(args) {
  if (args.includes("--source")) {
    const withTarget = args.includes("--target") ? args : ["--target", "active", ...args]
    runScript(resolve(repoRoot, "scripts/reflection/sort-figma-baselines.mjs"), withTarget)
    return
  }

  runScript(
    resolve(repoRoot, "scripts/reflection/write-baseline-receipts.mjs"),
    withDefaultAll(args),
  )
}

function runVisual() {
  const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
  for (const script of ["reflection:doctor", "reflection:visual", "reflection:review"]) {
    const status = runCommand(pnpm, [script])
    if (status !== 0) process.exit(status)
  }
}

function main() {
  const [command, ...rest] = process.argv.slice(2).filter((arg) => arg !== "--")

  if (!command || command === "help" || command === "--help" || command === "-h") {
    console.log(usage())
    return
  }

  if (command === "sync") {
    runSync(rest)
    return
  }

  if (command === "status") {
    runScript(resolve(packageRoot, "src/governance-status.mjs"), rest)
    return
  }

  if (command === "prepare") {
    runScript(resolve(repoRoot, "scripts/reflection/prepare-figma-reflection-frames.mjs"), rest)
    return
  }

  if (command === "ingest") {
    runIngest(rest)
    return
  }

  if (command === "check") {
    runCheck(rest)
    return
  }

  if (command === "visual") {
    runVisual()
    return
  }

  if (command === "ci") {
    runScript(resolve(repoRoot, "scripts/reflection/ci.mjs"), rest)
    return
  }

  if (command === "migrate-contracts") {
    runScript(resolve(repoRoot, "scripts/reflection/migrate-frame-prep-into-contracts.mjs"), rest)
    return
  }

  if (command === "raw-sync") {
    runScript(resolve(packageRoot, "src/sync/figma-raw-sync.mjs"), rest)
    return
  }

  if (command === "variables-sync") {
    runScript(resolve(packageRoot, "src/sync/figma-variables-sync.mjs"), rest)
    return
  }

  if (command === "validate") {
    runScript(resolve(packageRoot, "src/validate.mjs"), rest)
    return
  }

  if (command === "validate-runtime") {
    runScript(resolve(packageRoot, "src/validate.mjs"), [...rest, "--runtime-only"])
    return
  }

  if (command === "cohesive-check") {
    runScript(resolve(packageRoot, "src/cohesive-check.mjs"), rest)
    return
  }

  if (command === "suggest-tokens") {
    runScript(resolve(packageRoot, "src/suggest-tokens.mjs"), rest)
    return
  }

  if (command === "colors") {
    runScript(resolve(packageRoot, "src/validate.mjs"), ["--colors", ...rest])
    return
  }

  throw new Error(`Unknown command: ${command}\n\n${usage()}`)
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
