#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { existsSync, realpathSync } from "node:fs"
import { resolve } from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const packageRoot = fileURLToPath(new URL("../../", import.meta.url))
const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url))
const reflectionPath = [
  resolve(packageRoot, "node_modules/reflection-check"),
  resolve(repoRoot, "node_modules/reflection-check"),
].find((path) => existsSync(path))
if (!reflectionPath) {
  console.error("Reflection dependencies are missing. Run pnpm install from the repository root.")
  process.exit(1)
}
const reflectionPackageDir = realpathSync(reflectionPath)
const candidateCliPaths = [
  resolve(reflectionPackageDir, "../playwright/cli.js"),
  resolve(packageRoot, "node_modules/playwright/cli.js"),
  resolve(repoRoot, "node_modules/playwright/cli.js"),
]
const playwrightCli = candidateCliPaths.find((path) => existsSync(path))

if (!playwrightCli) {
  console.error("Could not find Playwright CLI from reflection-check dependencies.")
  console.error("Tried:")
  for (const path of candidateCliPaths) console.error(`- ${path}`)
  process.exit(1)
}

const args = process.argv.slice(2).filter((arg) => arg !== "--")
const showHelp = args.includes("--help") || args.includes("-h")
const installArgs = args.length > 0 ? args : ["chromium"]
const commandArgs = showHelp
  ? [playwrightCli, "install", "--help"]
  : [playwrightCli, "install", ...installArgs]
const result = spawnSync(process.execPath, commandArgs, {
  cwd: repoRoot,
  stdio: "inherit",
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
