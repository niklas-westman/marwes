import { createMarwesThemeScript, createMarwesThemeStyle } from "@marwes-ui/vue/ssr"
import { describe, expect, it } from "vitest"

describe("Vue SSR theme helpers", () => {
  it("creates a deterministic theme script string", () => {
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
  })

  it("creates light and dark CSS rules for Nuxt head style tags", () => {
    const style = createMarwesThemeStyle({
      lightTheme: { color: { primary: "#123456" } },
      darkTheme: { color: { primary: "#abcdef" } },
      target: "html",
      attribute: "class",
    })

    expect(style).toContain("--mw-color-primary-base: #123456;")
    expect(style).toContain("--mw-color-primary-base: #abcdef;")
    expect(style).toContain("background-color: var(--mw-color-background);")
    expect(style).toContain("color: var(--mw-color-text);")
    expect(style).toContain("html.light [data-marwes-theme]")
    expect(style).toContain("html.dark [data-marwes-theme]")
  })
})
