#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import process from "node:process"

const args = new Set(process.argv.slice(2).filter((arg) => arg !== "--"))
const strict = args.has("--strict")
const skipBrowserInstall = args.has("--skip-browser-install")
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
const adapters = ["react", "vue", "svelte"]

function run(label, commandArgs, options = {}) {
  console.log("")
  console.log(`# ${label}`)
  console.log(`$ ${[pnpm, ...commandArgs].join(" ")}`)

  const result = spawnSync(pnpm, commandArgs, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "test",
    },
    stdio: "inherit",
  })

  const status = result.status ?? 1
  if (result.error) {
    console.error(result.error.message)
    return 1
  }

  if (status !== 0 && !options.allowFailure) {
    console.error(`\n${label} failed with exit code ${status}`)
    process.exit(status)
  }

  return status
}

run(strict ? "Strict cohesive Reflection contract check" : "Cohesive Reflection contract check", [
  "--filter",
  "@marwes-ui/design-governance",
  "cohesive-check",
  "--",
  "--all",
  "--require-baseline-receipts",
  ...(strict ? ["--require-figma-frames"] : []),
])

if (!skipBrowserInstall) {
  run("Install Reflection browser", [
    "reflection:install-browsers",
    "--",
    "--with-deps",
    "chromium",
  ])
}

let visualStatus = 0
for (const adapter of adapters) {
  const status = run(`Reflection visual CI (${adapter})`, [`reflection:ci:${adapter}`], {
    allowFailure: true,
  })
  if (status !== 0 && visualStatus === 0) visualStatus = status
}

let reviewStatus = 0
for (const adapter of adapters) {
  const status = run(`Reflection review CI (${adapter})`, [`reflection:review:ci:${adapter}`], {
    allowFailure: true,
  })
  if (status !== 0 && reviewStatus === 0) reviewStatus = status
}

if (visualStatus !== 0) {
  console.error(`\nReflection visual CI failed with exit code ${visualStatus}`)
  process.exit(visualStatus)
}

if (reviewStatus !== 0) {
  console.error(`\nReflection review CI failed with exit code ${reviewStatus}`)
  process.exit(reviewStatus)
}

console.log("")
console.log("✓ Cohesive Reflection CI passed")
