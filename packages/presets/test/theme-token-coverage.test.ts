/**
 * Static analysis guard: scans all firstEdition CSS files to ensure
 * component-scoped --mw variables and base visual properties (color, background,
 * border-color) are never set from hardcoded color literals.
 */
import { readFileSync, readdirSync } from "node:fs"
import { relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const firstEditionDir = resolve(pkgDir, "src/firstEdition")

const directThemeVarAssignment = /^\s*--mw-[\w-]+:\s*(#[0-9a-f]{3,8}|rgba?\()/i
const directVisualAssignment =
  /^\s*(color|background|background-color|border-color|outline-color|font-family):\s*(#[0-9a-f]{3,8}|rgba?\()/i

const intentionalDirectVisualValues = new Set([
  "molecules/dialog-modal.css:14:  background: rgba(0, 0, 0, 0.6);",
  "spinner.css:17:  --mw-spinner-track-color: #a3a3a3;",
])

function listCssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name)

    if (entry.isDirectory()) return listCssFiles(path)
    if (entry.isFile() && path.endsWith(".css")) return [path]

    return []
  })
}

function collectMatches(pattern: RegExp): string[] {
  return listCssFiles(firstEditionDir).flatMap((filePath) => {
    const relativePath = relative(firstEditionDir, filePath)
    const lines = readFileSync(filePath, "utf8").split("\n")

    return lines.flatMap((line, index) => {
      if (!pattern.test(line)) return []

      const finding = `${relativePath}:${index + 1}:${line}`
      if (intentionalDirectVisualValues.has(finding)) return []

      return [finding]
    })
  })
}

describe("firstEdition theme token coverage", () => {
  it("does not seed component-scoped --mw variables directly from fixed color literals", () => {
    expect(collectMatches(directThemeVarAssignment)).toEqual([])
  })

  it("does not assign base visual properties directly from fixed color literals", () => {
    expect(collectMatches(directVisualAssignment)).toEqual([])
  })
})
