/**
 * Verifies that the presets package exports its public API surface
 * (CSS files, theme tokens, and preset configurations).
 */
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
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
      sideEffects: boolean | string[]
    }

    expect(pkg.exports["./firstEdition"]).toBeTruthy()
    expect(pkg.exports["./firstEdition/styles.css"]).toBe("./src/firstEdition/styles.css")
    expect(pkg.files).toContain("src/firstEdition")
    expect(pkg.sideEffects).toEqual(["*.css", "**/*.css"])

    const stylesPath = resolve(pkgDir, "src/firstEdition/styles.css")
    const stylesCss = readFileSync(stylesPath, "utf8")
    const importedCssPaths = [...stylesCss.matchAll(/@import\s+"([^"]+)"/g)]
      .map((match) => match[1] ?? "")
      .filter((importPath) => importPath.startsWith("."))
      .map((importPath) => resolve(dirname(stylesPath), importPath))

    expect(existsSync(stylesPath)).toBe(true)
    expect(existsSync(resolve(pkgDir, "src/firstEdition/index.ts"))).toBe(true)
    expect(stylesCss).toContain('@import "@fontsource/instrument-sans/500.css";')
    expect(importedCssPaths.length).toBeGreaterThan(0)

    for (const importedCssPath of importedCssPaths) {
      expect(existsSync(importedCssPath)).toBe(true)
    }
  })

  it("firstEditionTheme is a valid ThemeInput with expected brand, font, and ui fields", () => {
    expect(firstEditionTheme.color?.primary).toEqual({
      base: "#2F31FC",
      hover: "#2527CA",
      pressed: "#1B1D97",
      disabled: "#8182FC",
      label: "#FFFFFF",
      labelDisabled: "rgba(255,255,255,0.5)",
    })
    expect(firstEditionTheme.color?.success).toBe("#006633")
    expect(firstEditionTheme.color?.warning).toBe("#B45309")
    expect(firstEditionTheme.color?.danger).toEqual({
      base: "#D90429",
      hover: "#A8031F",
      pressed: "#780215",
      disabled: "#FF8A95",
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

  it("matches the provider default first edition baseline", () => {
    const resolvedDefault = resolveThemeInput({})
    const resolvedPreset = resolveThemeInput(firstEditionTheme)

    expect(resolvedDefault.color.primary).toEqual(resolvedPreset.color.primary)
    expect(resolvedDefault.color.danger).toEqual(resolvedPreset.color.danger)
    expect(resolvedDefault.color.success).toEqual(resolvedPreset.color.success)
    expect(resolvedDefault.color.warning).toEqual(resolvedPreset.color.warning)
    expect(resolvedDefault.font.primary).toBe(resolvedPreset.font.primary)
    expect(resolvedDefault.ui).toEqual(resolvedPreset.ui)
  })
})
