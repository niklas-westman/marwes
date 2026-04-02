import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { resolveThemeInput } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"
import { firstEditionTheme } from "../src/firstEdition"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const pkgJsonPath = resolve(pkgDir, "package.json")

describe("@marwes-ui/presets package exports", () => {
  it("declares firstEdition exports and shipped css file", () => {
    const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8")) as {
      exports: Record<string, string | { default?: string }>
      files: string[]
    }

    expect(pkg.exports["./firstEdition"]).toBeTruthy()
    expect(pkg.exports["./firstEdition/styles.css"]).toBe("./src/firstEdition/styles.css")
    expect(pkg.files).toContain("src/firstEdition/styles.css")

    expect(existsSync(resolve(pkgDir, "src/firstEdition/styles.css"))).toBe(true)
    expect(existsSync(resolve(pkgDir, "src/firstEdition/index.ts"))).toBe(true)
  })

  it("firstEditionTheme is a valid ThemeInput with expected brand, font, and ui fields", () => {
    expect(firstEditionTheme.color?.primary).toEqual({
      base: "#2F31FC",
      label: "#FFFFFF",
      labelDisabled: "rgba(255,255,255,0.5)",
    })
    expect(firstEditionTheme.font?.primary).toContain("Instrument Sans")
    expect(firstEditionTheme.ui?.radius).toBe(4)
    expect(firstEditionTheme.ui?.density).toBe("comfortable")
    // Must NOT include icon — removed from ThemeInput in Phase 0
    expect((firstEditionTheme as Record<string, unknown>).icon).toBeUndefined()
  })

  it("firstEditionTheme resolves a white primary label for filled components", () => {
    const resolved = resolveThemeInput(firstEditionTheme)

    expect(resolved.color.primary.base).toBe("#2F31FC")
    expect(resolved.color.primary.label).toBe("#FFFFFF")
    expect(resolved.color.primary.labelDisabled).toBe("rgba(255,255,255,0.5)")
  })
})
