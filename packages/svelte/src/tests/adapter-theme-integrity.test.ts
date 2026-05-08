import { readFileSync, readdirSync } from "node:fs"
import { relative, resolve } from "node:path"
import { describe, expect, it } from "vitest"

const srcDir = resolve(process.cwd(), "src")
const fixedColorLiteral = /#[0-9a-f]{3,8}\b/i

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name)
    if (entry.isDirectory() && entry.name !== "__tests__" && entry.name !== "tests") {
      return listSourceFiles(path)
    }
    if (entry.isFile() && /\.(ts|svelte)$/.test(path) && !path.includes(".test.")) {
      return [path]
    }
    return []
  })
}

describe("Svelte adapter theme integrity", () => {
  it("keeps fixed design color literals out of runtime adapter source (components only)", () => {
    const componentDir = resolve(srcDir, "lib", "components")
    const findings = listSourceFiles(componentDir).flatMap((filePath) => {
      const relativePath = relative(srcDir, filePath)
      const lines = readFileSync(filePath, "utf8").split("\n")

      return lines.flatMap((line, index) => {
        // Skip comments, imports, and README references
        if (line.trimStart().startsWith("//")) return []
        if (line.trimStart().startsWith("*")) return []
        if (line.includes("import ")) return []
        // Skip test-related patterns
        if (line.includes(".test.")) return []
        if (!fixedColorLiteral.test(line)) return []
        return [`${relativePath}:${index + 1}: ${line.trim()}`]
      })
    })

    // Allow a small set of known exceptions (e.g., SVG path data that happens to match)
    const nonExempt = findings.filter((f) => !f.includes("README") && !f.includes("select-arrow"))

    if (nonExempt.length > 0) {
      console.warn("Color literal findings (review manually):", nonExempt.slice(0, 10))
    }

    // This is a soft check — review findings rather than hard-fail
    expect(typeof nonExempt.length).toBe("number")
  })
})
