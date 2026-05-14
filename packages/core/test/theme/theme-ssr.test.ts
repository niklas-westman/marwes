/**
 * Tests SSR theme helpers — the inline script generator (no-eval, XSS-safe),
 * server-side mode resolution, and dual-mode CSS style sheet generation.
 * These are used by framework integrations to avoid flash-of-wrong-theme.
 */
import { describe, expect, it } from "vitest"
import {
  ThemeMode,
  createMarwesThemeScript,
  createMarwesThemeStyle,
  resolveServerThemeMode,
} from "../../src"

describe("theme SSR helpers", () => {
  it("creates a deterministic no-eval theme script", () => {
    const script = createMarwesThemeScript({
      storageKey: "marwes-theme",
      defaultPreference: "system",
      target: "html",
      attribute: "class",
    })

    expect(script).toBe(
      createMarwesThemeScript({
        storageKey: "marwes-theme",
        defaultPreference: "system",
        target: "html",
        attribute: "class",
      }),
    )
    expect(script).toContain('"storageKey":"marwes-theme"')
    expect(script).toContain('"defaultPreference":"system"')
    expect(script).toContain('"target":"html"')
    expect(script).toContain("querySelectorAll")
    expect(script).not.toContain("eval")
  })

  it("escapes script data for inline script contexts", () => {
    const script = createMarwesThemeScript({ storageKey: "</script>" })

    expect(script).toContain("\\u003c/script>")
    expect(script).not.toContain("</script>")
  })

  it("resolves server system preference through an explicit fallback", () => {
    expect(resolveServerThemeMode({ preference: "system", systemFallback: ThemeMode.dark })).toBe(
      ThemeMode.dark,
    )
    expect(
      resolveServerThemeMode({ preference: ThemeMode.light, systemFallback: ThemeMode.dark }),
    ).toBe(ThemeMode.light)
  })

  it("creates light and dark style rules from theme input", () => {
    const style = createMarwesThemeStyle({
      lightTheme: { color: { primary: "#123456" } },
      darkTheme: { color: { primary: "#abcdef" } },
      target: "html",
      attribute: "class",
    })

    expect(style).toContain("--mw-color-primary-base: #123456;")
    expect(style).toContain("--mw-color-primary-base: #abcdef;")
    expect(style).toContain("html.light [data-marwes-theme]")
    expect(style).toContain("html.dark [data-marwes-theme]")
  })
})
