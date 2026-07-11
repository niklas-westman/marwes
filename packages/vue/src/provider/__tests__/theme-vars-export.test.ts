/**
 * Vue adapter: Verifies that core theme variable helpers (mwThemeVars, mwVar, etc.)
 * are re-exported from the adapter package root.
 */
import {
  type MwTheme,
  createMwTheme,
  createMwThemeMedia,
  mwStyledTheme,
  mwTheme,
  mwThemeVarNames,
  mwThemeVars,
  mwVar,
} from "@marwes-ui/core"
import { describe, expect, it } from "vitest"
import * as publicApi from "../../index"

describe("Vue theme variable exports", () => {
  it("re-exports core theme variable helpers from the package root", () => {
    const exportedTheme: MwTheme = publicApi.mwTheme

    expect(exportedTheme.spacing.sp16).toBe("var(--mw-spacing-sp-16)")
    expect(publicApi.mwThemeVars).toBe(mwThemeVars)
    expect(publicApi.mwThemeVarNames).toBe(mwThemeVarNames)
    expect(publicApi.mwTheme).toBe(mwTheme)
    expect(publicApi.mwStyledTheme).toBe(mwStyledTheme)
    expect(publicApi.mwVar).toBe(mwVar)
    expect(publicApi.createMwTheme).toBe(createMwTheme)
    expect(publicApi.createMwThemeMedia).toBe(createMwThemeMedia)
  })
})
