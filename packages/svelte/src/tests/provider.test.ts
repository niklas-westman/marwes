/**
 * Svelte adapter: Tests the MarwesProvider — theme context injection
 * and provider rendering.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import MarwesProvider from "../lib/provider/MarwesProvider.svelte"
import ProviderThemeSnippetFixture from "./provider-theme-snippet-fixture.svelte"

describe("MarwesProvider", () => {
  it("renders children with data-marwes-theme attribute", () => {
    const { container } = render(MarwesProvider)
    const wrapper = container.querySelector("[data-marwes-theme]")
    expect(wrapper).not.toBeNull()
    expect(wrapper?.getAttribute("data-marwes-theme")).toBe("true")
  })

  it("sets data-marwes-mode attribute", () => {
    const { container } = render(MarwesProvider)
    const wrapper = container.querySelector("[data-marwes-mode]")
    expect(wrapper).not.toBeNull()
    const mode = wrapper?.getAttribute("data-marwes-mode")
    expect(mode === "light" || mode === "dark").toBe(true)
  })

  it("applies mw-theme--light or mw-theme--dark class", () => {
    const { container } = render(MarwesProvider)
    const wrapper = container.querySelector("[data-marwes-theme]")
    expect(
      wrapper?.classList.contains("mw-theme--light") ||
        wrapper?.classList.contains("mw-theme--dark"),
    ).toBe(true)
  })

  it("emits inline --mw-* CSS variables", () => {
    const { container } = render(MarwesProvider)
    const wrapper = container.querySelector("[data-marwes-theme]") as HTMLElement
    expect(wrapper?.getAttribute("style")).toContain("--mw-")
  })

  it("passes CSS-provider mwTheme to the children snippet", () => {
    const { getByText } = render(ProviderThemeSnippetFixture)
    expect(getByText("var(--mw-spacing-sp-16):@media (min-width: 1024px)")).not.toBeNull()
  })

  it("defaults system preference to light when matchMedia is unavailable", () => {
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      configurable: true,
      writable: true,
    })

    try {
      const { container, unmount } = render(MarwesProvider, {
        props: { defaultPreference: "system" },
      })
      const wrapper = container.querySelector("[data-marwes-theme]")

      expect(wrapper?.classList.contains("mw-theme--light")).toBe(true)
      expect(wrapper?.getAttribute("data-marwes-mode")).toBe("light")
      unmount()
    } finally {
      Object.defineProperty(window, "matchMedia", {
        value: originalMatchMedia,
        configurable: true,
        writable: true,
      })
    }
  })
})
