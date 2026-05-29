#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = resolve(packageRoot, "../..")

function usage() {
  return [
    "Usage:",
    "  pnpm --filter @marwes-ui/design-governance sync [--mode cache|remote]",
    "  pnpm --filter @marwes-ui/design-governance raw-sync --mode cache",
    "  pnpm --filter @marwes-ui/design-governance variables-sync",
    "  pnpm --filter @marwes-ui/design-governance validate --family badge",
    "  pnpm --filter @marwes-ui/design-governance validate --all",
    "  pnpm --filter @marwes-ui/design-governance validate-runtime --family badge",
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
