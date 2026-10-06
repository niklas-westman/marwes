/**
 * Ratchet: ARIA/role attributes still written by hand in adapter components (outside the typed
 * core mappers). The count per file may only go down. New hand-written ARIA fails the test, and
 * so does removing some without lowering the baseline, so the baseline always tells the truth.
 *
 * Regenerate after moving ARIA into core:  UPDATE_A11Y_BASELINE=1 pnpm --filter @marwes-ui/core test
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"

const repoRoot = join(__dirname, "../../../..")
const baselinePath = join(__dirname, "a11y-handwritten-baseline.json")

const adapterRoots = [
  { directory: "packages/react/src/components", extension: ".tsx" },
  { directory: "packages/vue/src/components", extension: ".ts" },
  { directory: "packages/svelte/src/lib/components", extension: ".svelte" },
]

function listFiles(directory: string, extension: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) return listFiles(path, extension)
    const isSource =
      path.endsWith(extension) && !path.endsWith(".d.ts") && !/__tests__|\.test\./.test(path)
    return isSource ? [path] : []
  })
}

function countHandwrittenAria(path: string): number {
  return readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /(aria-[a-z]+|\brole)[=:"]/.test(line))
    .filter((line) => !/Html\w*Attributes|^import |^\/\/|^\*|biome-ignore/.test(line)).length
}

const currentCounts: Record<string, number> = {}
for (const { directory, extension } of adapterRoots) {
  for (const path of listFiles(join(repoRoot, directory), extension)) {
    const count = countHandwrittenAria(path)
    if (count > 0) currentCounts[relative(repoRoot, path)] = count
  }
}

if (process.env.UPDATE_A11Y_BASELINE) {
  const sorted = Object.fromEntries(
    Object.entries(currentCounts).sort(([a], [b]) => a.localeCompare(b)),
  )
  writeFileSync(baselinePath, `${JSON.stringify(sorted, null, 2)}\n`)
}

const baseline: Record<string, number> = JSON.parse(readFileSync(baselinePath, "utf8"))

describe("hand-written ARIA ratchet", () => {
  it("does not gain hand-written ARIA in any adapter file", () => {
    const grown = Object.entries(currentCounts)
      .filter(([file, count]) => count > (baseline[file] ?? 0))
      .map(([file, count]) => `${file}: ${baseline[file] ?? 0} -> ${count}`)

    expect(grown, "Use a core mapper instead of writing ARIA by hand").toEqual([])
  })

  it("keeps the baseline in step when hand-written ARIA is removed", () => {
    const shrunk = Object.entries(baseline)
      .filter(([file, count]) => (currentCounts[file] ?? 0) < count)
      .map(([file, count]) => `${file}: ${count} -> ${currentCounts[file] ?? 0}`)

    expect(shrunk, "Lower the baseline with UPDATE_A11Y_BASELINE=1").toEqual([])
  })
})
