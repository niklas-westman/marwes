import { spawnSync } from "node:child_process"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const checks = [
  ["node", ["scripts/generate-public-api.mjs", "--check"]],
  ["node", ["scripts/generate-consumer-docs.mjs", "--check"]],
  ["node", ["scripts/generate-dashboard-docs.mjs", "--check"]],
  ["node", ["scripts/check-consumer-imports.mjs"]],
  ["pnpm", ["exec", "tsc", "-p", "apps/dashboard-teaser/tsconfig.fixtures.react.json"]],
  ["pnpm", ["exec", "vue-tsc", "-p", "apps/dashboard-teaser/tsconfig.fixtures.vue.json"]],
  [
    "pnpm",
    [
      "--filter",
      "@marwes-ui/svelte",
      "exec",
      "svelte-check",
      "--workspace",
      "../../apps/dashboard-teaser",
      "--tsconfig",
      "./tsconfig.fixtures.svelte.json",
      "--threshold",
      "error",
    ],
  ],
  ["node", ["scripts/generate-ai-docs.mjs", "--check"]],
]

for (const [command, args] of checks) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: "inherit",
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

console.log("✓ Consumer API, docs, imports, and framework fixtures are verified")
