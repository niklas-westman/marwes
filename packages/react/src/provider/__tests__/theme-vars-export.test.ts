/**
 * React adapter: Verifies that core theme variable helpers (mwThemeVars, mwVar, etc.)
 * are re-exported from the adapter package root.
 */
import { mwStyledTheme, mwThemeVarNames, mwThemeVars, mwVar } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"
import * as publicApi from "../../index"

describe("React theme variable exports", () => {
  it("re-exports core theme variable helpers from the package root", () => {
    expect(publicApi.mwThemeVars).toBe(mwThemeVars)
    expect(publicApi.mwThemeVarNames).toBe(mwThemeVarNames)
    expect(publicApi.mwStyledTheme).toBe(mwStyledTheme)
    expect(publicApi.mwVar).toBe(mwVar)
  })
})
