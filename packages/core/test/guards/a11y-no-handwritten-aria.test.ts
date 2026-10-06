/**
 * Guard: adapters write no ARIA by hand. Every aria-* / role attribute reaches the DOM through a
 * core mapper, so React, Vue and Svelte cannot drift from each other or from the contracts.
 *
 * Allowed without a marker (static, decorative, never derived from options or state):
 *   aria-hidden="true", aria-live="polite", role="presentation"
 * Anything else needs an `a11y-allow: <reason>` comment on the same line or within the three lines
 * above it (so one comment can sit above a multi-line element). The reason is read in review, so
 * say why core cannot own it.
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"

const repoRoot = join(__dirname, "../../../..")

const adapterRoots = [
  { name: "react", directory: "packages/react/src/components", extension: ".tsx" },
  { name: "vue", directory: "packages/vue/src/components", extension: ".ts" },
  { name: "svelte", directory: "packages/svelte/src/lib/components", extension: ".svelte" },
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

const writesAria = /(aria-[a-z]+|\brole)[=:"]/
const staticDecorative =
  /aria-hidden[=:]\s*\{?"true"\}?|"aria-hidden": "true"|aria-live[=:]\s*\{?"polite"\}?|"aria-live": "polite"|role[=:]\s*"presentation"/
// Lines that mention ARIA without writing it: mapper calls, imports, comments, native reads.
const notAWrite =
  /Html\w*Attributes|^import |^\/\/|^\*|^\{?\/?\*|biome-ignore|typeof \w+\[?\.?"aria-label"|\["aria-label"\] as string|omitAttrs\(|getAttribute\(|hasAttribute\(|^"aria-label",$|^\? (props|native\w+)\["aria-label"\]/
const allowMarker = /a11y-allow:\s*(\S.*)/

interface Violation {
  location: string
  line: string
}

function findViolations(path: string): Violation[] {
  const lines = readFileSync(path, "utf8").split("\n")

  return lines.flatMap((rawLine, index) => {
    const line = rawLine.trim()
    if (!writesAria.test(line) || notAWrite.test(line) || staticDecorative.test(line)) return []
    const nearbyLines = [line, ...lines.slice(Math.max(0, index - 3), index)]
    if (nearbyLines.some((nearby) => allowMarker.test(nearby))) return []
    return [{ location: `${relative(repoRoot, path)}:${index + 1}`, line: line.slice(0, 110) }]
  })
}

function findMarkersWithoutReason(path: string): string[] {
  return readFileSync(path, "utf8")
    .split("\n")
    .flatMap((line, index) => {
      const marker = line.match(allowMarker)
      const reason = marker?.[1]?.replace(/--!?>|\*\/|\}/g, "").trim() ?? ""
      return line.includes("a11y-allow") && reason.length < 12
        ? [`${relative(repoRoot, path)}:${index + 1}`]
        : []
    })
}

describe("no hand-written ARIA in adapters", () => {
  for (const { name, directory, extension } of adapterRoots) {
    const files = listFiles(join(repoRoot, directory), extension)

    it(`${name} writes ARIA only through core mappers`, () => {
      const violations = files.flatMap(findViolations).map((v) => `${v.location}  ${v.line}`)

      expect(
        violations,
        "Move this into a core a11y resolver + mapper, or add `a11y-allow: <reason>`",
      ).toEqual([])
    })

    it(`${name} a11y-allow markers carry a reason`, () => {
      expect(files.flatMap(findMarkersWithoutReason)).toEqual([])
    })
  }
})
