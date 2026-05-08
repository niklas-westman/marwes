import { describe, expect, it } from "vitest"
import { createMarwesThemeScript, createMarwesThemeStyle } from "../lib/ssr.js"

describe("SSR theme helpers", () => {
  describe("createMarwesThemeScript", () => {
    it("returns a string containing the storage key", () => {
      const result = createMarwesThemeScript({
        storageKey: "marwes-theme",
        defaultPreference: "system",
      })
      expect(result).toContain("marwes-theme")
    })

    it("returns a string containing the default preference", () => {
      const result = createMarwesThemeScript({
        storageKey: "test-key",
        defaultPreference: "light",
      })
      expect(result).toContain("light")
    })

    it("returns a non-empty string", () => {
      const result = createMarwesThemeScript({})
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe("createMarwesThemeStyle", () => {
    it("returns CSS containing theme variables", () => {
      const result = createMarwesThemeStyle({
        lightTheme: { color: { primary: "#123456" } },
      })
      expect(result).toContain("--mw-color-primary-base")
      expect(result).toContain("#123456")
    })

    it("returns CSS for both light and dark when both are provided", () => {
      const result = createMarwesThemeStyle({
        lightTheme: { color: { primary: "#111111" } },
        darkTheme: { color: { primary: "#eeeeee" } },
      })
      expect(result).toContain("#111111")
      expect(result).toContain("#eeeeee")
    })

    it("includes background-color and color base styles", () => {
      const result = createMarwesThemeStyle({
        lightTheme: { color: { primary: "#000000" } },
      })
      expect(result).toContain("background-color")
      expect(result).toContain("color")
    })
  })
})
