/**
 * React adapter: Static analysis guard: scans adapter source files for hardcoded color
 * literals (#hex, rgba) to ensure all colors flow through theme variables.
 */
import { readFileSync, readdirSync } from "node:fs"
import { relative, resolve } from "node:path"
import { describe, expect, it } from "vitest"

const srcDir = resolve(import.meta.dirname, "../..")
const fixedColorLiteral = /#[0-9a-f]{3,8}|rgba?\(/i

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name)

    if (entry.isDirectory() && entry.name !== "__tests__") return listSourceFiles(path)
    if (entry.isFile() && /\.(ts|tsx)$/.test(path)) return [path]

    return []
  })
}

describe("React adapter theme integrity", () => {
  it("keeps fixed design color literals out of runtime adapter source", () => {
    const findings = listSourceFiles(srcDir).flatMap((filePath) => {
      const relativePath = relative(srcDir, filePath)
      const lines = readFileSync(filePath, "utf8").split("\n")

      return lines.flatMap((line, index) => {
        if (!fixedColorLiteral.test(line)) return []
        return [`${relativePath}:${index + 1}:${line}`]
      })
    })

    expect(findings).toEqual([])
  })
})
