import type { ResolvedTheme } from "@marwes-ui/core"
import { render, screen } from "@testing-library/react"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"
import { MarwesProvider } from "../marwes-provider"
import { resetThemeRuntimeState } from "../runtime-theme"
import { useTheme } from "../use-theme"

function ThemeConsumer({ onTheme }: { onTheme: (t: ResolvedTheme) => void }) {
  const theme = useTheme()
  onTheme(theme)
  return null
}

describe("MarwesProvider — root element", () => {
  it("sets data-marwes-theme on root element", () => {
    const { container } = render(
      <MarwesProvider>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.dataset.marwesTheme).toBe("true")
  })

  it("applies --mw-color-primary-base CSS var on root element", () => {
    const { container } = render(
      <MarwesProvider>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.style.getPropertyValue("--mw-color-primary-base")).not.toBe("")
  })

  it("renders theme CSS vars before client effects run", () => {
    const markup = renderToStaticMarkup(
      <MarwesProvider
        theme={{
          color: { primary: "#AA33FF", background: "#101418", text: "#F4F7FA" },
          font: { primary: "Test Primary, system-ui, sans-serif" },
          ui: { radius: 12 },
        }}
      >
        <div />
      </MarwesProvider>,
    )

    expect(markup).toContain('data-marwes-theme="true"')
    expect(markup).toContain("--mw-color-primary-base:#AA33FF")
    expect(markup).toContain("--mw-font-primary:Test Primary, system-ui, sans-serif")
    expect(markup).toContain("--mw-ui-radius:12px")
    expect(markup).toContain("background-color:#101418")
    expect(markup).toContain("color:#F4F7FA")
  })

  it("applies mw-theme--light class by default", () => {
    const { container } = render(
      <MarwesProvider>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--light")
  })

  it("applies mw-theme--dark class when mode is dark", () => {
    const { container } = render(
      <MarwesProvider theme={{ mode: "dark" }}>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--dark")
  })

  it("sets dark background color when mode is dark", () => {
    const { container } = render(
      <MarwesProvider theme={{ mode: "dark" }}>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.style.backgroundColor).toBe("rgb(20, 20, 20)")
  })

  it("sets light background color by default", () => {
    const { container } = render(
      <MarwesProvider>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.style.backgroundColor).toBe("rgb(255, 255, 255)")
  })
})

describe("MarwesProvider — context", () => {
  it("provides ResolvedTheme with ColorRole primary to consumers", () => {
    const themes: ResolvedTheme[] = []
    render(
      <MarwesProvider>
        <ThemeConsumer
          onTheme={(t) => {
            themes.push(t)
          }}
        />
      </MarwesProvider>,
    )
    expect(themes.length).toBeGreaterThan(0)
    const captured = themes[0] as ResolvedTheme
    expect(captured.mode).toBe("light")
    expect(captured.color.primary.base).toBe("#2F31FC")
    expect(captured.color.primary.label).toBe("#FFFFFF")
  })

  it("provides dark mode ResolvedTheme when mode is dark", () => {
    const themes: ResolvedTheme[] = []
    render(
      <MarwesProvider theme={{ mode: "dark" }}>
        <ThemeConsumer
          onTheme={(t) => {
            themes.push(t)
          }}
        />
      </MarwesProvider>,
    )
    expect(themes.length).toBeGreaterThan(0)
    const captured = themes[0] as ResolvedTheme
    expect(captured.mode).toBe("dark")
    expect(captured.color.primary.base).toBe("#2F31FC")
  })
})

describe("MarwesProvider — Google Fonts loading", () => {
  function findFontLinks(): HTMLLinkElement[] {
    return Array.from(document.head.querySelectorAll("link[data-marwes-font]"))
  }

  afterEach(() => {
    resetThemeRuntimeState()
    for (const link of findFontLinks()) link.remove()
    for (const link of document.head.querySelectorAll('link[rel="preconnect"]')) {
      if ((link as HTMLLinkElement).href.includes("fonts.g")) link.remove()
    }
  })

  it("injects a Google Fonts link when tone uses a non-system font", () => {
    render(
      <MarwesProvider theme={{ tone: "playful" }}>
        <div />
      </MarwesProvider>,
    )
    const links = findFontLinks()
    expect(links.length).toBeGreaterThanOrEqual(1)
    const hrefs = links.map((l) => l.href)
    expect(hrefs.some((h) => h.includes("Nunito"))).toBe(true)
  })

  it("does not inject a Google Fonts link for default tone (system font)", () => {
    render(
      <MarwesProvider>
        <div />
      </MarwesProvider>,
    )
    const links = findFontLinks()
    expect(links.length).toBe(0)
  })

  it("injects links for editorial tone fonts (Playfair Display and Lora)", () => {
    render(
      <MarwesProvider theme={{ tone: "editorial" }}>
        <div />
      </MarwesProvider>,
    )
    const links = findFontLinks()
    const hrefs = links.map((l) => l.href)
    expect(hrefs.some((h) => h.includes("Playfair+Display"))).toBe(true)
    expect(hrefs.some((h) => h.includes("Lora"))).toBe(true)
  })

  it("does not inject Google Fonts links for brand placeholders", () => {
    render(
      <MarwesProvider theme={{ font: { primary: "Brand Sans, system-ui, sans-serif" } }}>
        <div />
      </MarwesProvider>,
    )

    expect(findFontLinks()).toHaveLength(0)
  })

  it("supports an allowlist when custom and Google fonts are mixed", () => {
    render(
      <MarwesProvider
        fontLoading={{ googleFamilies: ["Lora"] }}
        theme={{
          font: {
            primary: "Brand Sans, system-ui, sans-serif",
            secondary: "Lora, Georgia, serif",
          },
        }}
      >
        <div />
      </MarwesProvider>,
    )

    const hrefs = findFontLinks().map((link) => link.href)
    expect(hrefs).toHaveLength(1)
    expect(hrefs[0]).toContain("Lora")
  })
})
