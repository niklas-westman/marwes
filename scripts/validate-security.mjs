#!/usr/bin/env node
import { spawnSync } from "node:child_process"

const ignoredDevAdvisories = new Map([
  [
    "GHSA-gv7w-rqvm-qjhr",
    "esbuild binary integrity advisory in dev/build tooling; esbuild 0.28.1 currently breaks Storybook browser a11y runs.",
  ],
  [
    "GHSA-g7r4-m6w7-qqqr",
    "esbuild servedir path traversal advisory for Windows dev servers; production audit remains clean.",
  ],
])

function runPnpm(args) {
  return spawnSync("pnpm", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  })
}

function printCommandOutput(result) {
  if (result.stdout.trim()) {
    console.log(result.stdout.trim())
  }
  if (result.stderr.trim()) {
    console.error(result.stderr.trim())
  }
}

const prodAudit = runPnpm(["audit", "--prod"])
printCommandOutput(prodAudit)

if (prodAudit.status !== 0) {
  console.error("\nSecurity validation failed: production dependencies have audit findings.")
  process.exit(prodAudit.status ?? 1)
}

const fullAudit = runPnpm(["audit", "--json"])

let auditReport
try {
  auditReport = JSON.parse(fullAudit.stdout)
} catch (error) {
  printCommandOutput(fullAudit)
  console.error("\nSecurity validation failed: could not parse pnpm audit JSON.")
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(fullAudit.status || 1)
}

const advisories = Object.values(auditReport.advisories ?? {})
const unexpectedAdvisories = advisories.filter((advisory) => {
  const advisoryId = advisory.github_advisory_id
  return !advisoryId || !ignoredDevAdvisories.has(advisoryId)
})

if (unexpectedAdvisories.length > 0) {
  console.error("\nSecurity validation failed: unexpected audit findings.")
  for (const advisory of unexpectedAdvisories) {
    const advisoryId = advisory.github_advisory_id ?? advisory.id ?? "unknown"
    console.error(`- ${advisoryId} ${advisory.severity}: ${advisory.title}`)
  }
  process.exit(fullAudit.status || 1)
}

if (advisories.length > 0) {
  console.warn("\nSecurity validation ignored known dev-tool advisories:")
  for (const advisory of advisories) {
    const advisoryId = advisory.github_advisory_id
    console.warn(`- ${advisoryId}: ${ignoredDevAdvisories.get(advisoryId)}`)
  }
}

console.log("\nSecurity validation passed")
