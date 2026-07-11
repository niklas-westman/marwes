#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const result = spawnSync(
  process.execPath,
  [resolve(repoRoot, "packages/design-governance/src/validate.mjs"), ...process.argv.slice(2)],
  {
    cwd: repoRoot,
    stdio: "inherit",
  },
)

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
