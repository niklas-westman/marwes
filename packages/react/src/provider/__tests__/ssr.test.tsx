/**
 * React adapter: Tests server-side rendering compatibility — verifies that the provider
 * and theme system render without errors in a non-browser environment.
 */
import { ThemeMode } from "@marwes-ui/core"
import {
  MarwesThemeScript,
  MarwesThemeStyle,
  createMarwesThemeScript,
  createMarwesThemeStyle,
} from "@marwes-ui/react/ssr"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

describe("React SSR theme helpers", () => {
  it("renders the theme script with a CSP nonce", () => {
    const markup = renderToStaticMarkup(
      <MarwesThemeScript
        nonce="nonce-123"
        storageKey="marwes-theme"
        defaultPreference="system"
        target="html"
        attribute="class"
      />,
    )

    expect(markup).toContain('nonce="nonce-123"')
    expect(markup).toContain('data-marwes-ssr-theme-script="true"')
    expect(markup).toContain('"storageKey":"marwes-theme"')
    expect(markup).toContain('"defaultPreference":"system"')
    expect(markup).toContain('"target":"html"')
  })

  it("renders light and dark CSS rules with a CSP nonce", () => {
    const markup = renderToStaticMarkup(
      <MarwesThemeStyle
        nonce="nonce-123"
        lightTheme={{ color: { primary: "#123456" } }}
        darkTheme={{ color: { primary: "#abcdef" } }}
        target="html"
        attribute="class"
      />,
    )

    expect(markup).toContain('nonce="nonce-123"')
    expect(markup).toContain('data-marwes-ssr-theme-style="true"')
    expect(markup).toContain("--mw-color-primary-base: #123456;")
    expect(markup).toContain("--mw-color-primary-base: #abcdef;")
    expect(markup).toContain("background-color: var(--mw-color-background);")
    expect(markup).toContain("color: var(--mw-color-text);")
    expect(markup).toContain("html.light [data-marwes-theme]")
    expect(markup).toContain("html.dark [data-marwes-theme]")
  })

  it("exports deterministic string helpers from the SSR entry", () => {
    expect(createMarwesThemeScript({ storageKey: "marwes-theme" })).toBe(
      createMarwesThemeScript({ storageKey: "marwes-theme" }),
    )
    expect(
      createMarwesThemeStyle({
        lightTheme: { mode: ThemeMode.dark },
        darkTheme: { mode: ThemeMode.light },
      }),
    ).toContain('[data-marwes-theme][data-marwes-mode="dark"]')
  })
})
