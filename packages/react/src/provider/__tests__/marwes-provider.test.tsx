/**
 * React adapter: Tests the MarwesProvider component — theme context injection,
 * mode toggling, dark/light detection, and provider nesting behavior.
 */
import { type MwTheme, type ResolvedTheme, ThemeMode } from "@marwes-ui/core"
import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../marwes-provider"
import type { MarwesProviderProps } from "../marwes-provider"
import { resetThemeRuntimeState } from "../runtime-theme"
import { useTheme } from "../use-theme"
import { useThemeMode } from "../use-theme-mode"

function ThemeConsumer({ onTheme }: { onTheme: (t: ResolvedTheme) => void }) {
  const theme = useTheme()
  onTheme(theme)
  return null
}

function ThemeModeConsumer() {
  const { mode, toggleMode, isDark, isLight } = useThemeMode()

  return (
    <button type="button" onClick={toggleMode}>
      {mode}:{isDark ? "dark" : "not-dark"}:{isLight ? "light" : "not-light"}
    </button>
  )
}

afterEach(() => {
  document.documentElement.className = ""
  document.body.className = ""
  document.documentElement.removeAttribute("data-theme")
  document.documentElement.removeAttribute("data-mode")
  document.body.removeAttribute("data-theme")
  document.body.removeAttribute("data-mode")
  for (const style of document.head.querySelectorAll("[data-marwes-disable-transitions]")) {
    style.remove()
  }
  vi.restoreAllMocks()
})

describe("MarwesProvider — root element", () => {
  it("sets data-marwes-theme on root element", () => {
    const { container } = render(
      <MarwesProvider>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.dataset.marwesTheme).toBe("true")
    expect(root.dataset.marwesMode).toBe(ThemeMode.light)
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
    expect(markup).toContain('data-marwes-mode="light"')
    expect(markup).toContain("--mw-color-primary-base:#AA33FF")
    expect(markup).toContain("--mw-font-primary:Test Primary, system-ui, sans-serif")
    expect(markup).toContain("--mw-ui-radius:12px")
    expect(markup).toContain("background-color:#101418")
    expect(markup).toContain("color:#F4F7FA")
  })

  it("omits inline variables when using the style-tag variable strategy", () => {
    const markup = renderToStaticMarkup(
      <MarwesProvider variableStrategy="style-tag">
        <div />
      </MarwesProvider>,
    )

    expect(markup).toContain('data-marwes-mode="light"')
    expect(markup).not.toContain("--mw-color-primary-base")
  })

  it("does not add inline variables after mount with the style-tag variable strategy", () => {
    const { container } = render(
      <MarwesProvider variableStrategy="style-tag">
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement

    expect(root.style.getPropertyValue("--mw-color-primary-base")).toBe("")
    expect(root.dataset.marwesMode).toBe(ThemeMode.light)
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
      <MarwesProvider theme={{ mode: ThemeMode.dark }}>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--dark")
  })

  it("applies mw-theme--dark class when defaultMode is dark", () => {
    const { container } = render(
      <MarwesProvider defaultMode={ThemeMode.dark}>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--dark")
    expect(root.style.backgroundColor).toBe("rgb(15, 15, 15)")
  })

  it("lets controlled mode win over defaultMode", () => {
    const { container } = render(
      <MarwesProvider defaultMode={ThemeMode.dark} mode={ThemeMode.light}>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--light")
  })

  it("keeps theme.mode working over defaultMode", () => {
    const { container } = render(
      <MarwesProvider defaultMode={ThemeMode.light} theme={{ mode: ThemeMode.dark }}>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--dark")
  })

  it("sets dark background color when mode is dark", () => {
    const { container } = render(
      <MarwesProvider theme={{ mode: ThemeMode.dark }}>
        <div />
      </MarwesProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.style.backgroundColor).toBe("rgb(15, 15, 15)")
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

  it("keeps default provider target scoped to the provider root", () => {
    const { container } = render(
      <MarwesProvider defaultMode={ThemeMode.dark}>
        <div />
      </MarwesProvider>,
    )

    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--dark")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
    expect(document.body.classList.contains("dark")).toBe(false)
  })

  it("syncs html class target and preserves unrelated classes", () => {
    document.documentElement.className = "app-shell dark"

    const { container } = render(
      <MarwesProvider target="html" defaultMode={ThemeMode.light}>
        <ThemeModeConsumer />
      </MarwesProvider>,
    )

    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--light")
    expect(document.documentElement.classList.contains("app-shell")).toBe(true)
    expect(document.documentElement.classList.contains("light")).toBe(true)
    expect(document.documentElement.classList.contains("dark")).toBe(false)

    fireEvent.click(screen.getByRole("button"))
    expect(root.className).toContain("mw-theme--dark")
    expect(document.documentElement.classList.contains("app-shell")).toBe(true)
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    expect(document.documentElement.classList.contains("light")).toBe(false)
  })

  it("syncs body data attribute target on mode changes", () => {
    document.body.className = "app-body"

    render(
      <MarwesProvider target="body" attribute="data-mode" defaultMode={ThemeMode.dark}>
        <ThemeModeConsumer />
      </MarwesProvider>,
    )

    expect(document.body.classList.contains("app-body")).toBe(true)
    expect(document.body.getAttribute("data-mode")).toBe("dark")

    fireEvent.click(screen.getByRole("button"))
    expect(document.body.classList.contains("app-body")).toBe(true)
    expect(document.body.getAttribute("data-mode")).toBe("light")
  })

  it("supports data-theme attribute target", () => {
    render(
      <MarwesProvider target="html" attribute="data-theme" defaultMode={ThemeMode.dark}>
        <div />
      </MarwesProvider>,
    )

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark")
  })

  it("inserts and removes transition suppression style when requested", () => {
    const callbacks: FrameRequestCallback[] = []
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callbacks.push(callback)
      return callbacks.length
    })

    render(
      <MarwesProvider target="html" disableTransitionOnChange>
        <div />
      </MarwesProvider>,
    )

    expect(document.head.querySelector("[data-marwes-disable-transitions]")).not.toBeNull()
    callbacks.shift()?.(0)
    expect(document.head.querySelector("[data-marwes-disable-transitions]")).toBeNull()
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
    expect(captured.mode).toBe(ThemeMode.light)
    expect(captured.color.primary.base).toBe("#2F31FC")
    expect(captured.color.primary.label).toBe("#FFFFFF")
  })

  it("provides dark mode ResolvedTheme when mode is dark", () => {
    const themes: ResolvedTheme[] = []
    render(
      <MarwesProvider theme={{ mode: ThemeMode.dark }}>
        <ThemeConsumer
          onTheme={(t) => {
            themes.push(t)
          }}
        />
      </MarwesProvider>,
    )
    expect(themes.length).toBeGreaterThan(0)
    const captured = themes[0] as ResolvedTheme
    expect(captured.mode).toBe(ThemeMode.dark)
    expect(captured.color.primary.base).toBe("#2F31FC")
  })

  it("keeps useTheme returning a ResolvedTheme", () => {
    const themes: ResolvedTheme[] = []

    render(
      <MarwesProvider defaultMode={ThemeMode.dark}>
        <ThemeConsumer
          onTheme={(t) => {
            themes.push(t)
          }}
        />
      </MarwesProvider>,
    )

    expect(themes[0]?.mode).toBe(ThemeMode.dark)
    expect(themes[0]?.color.background).toBe("#0F0F0F")
  })

  it("passes CSS-provider mwTheme to render-prop children", () => {
    const themes: MwTheme[] = []

    render(
      <MarwesProvider theme={{ breakpoint: { tablet: 1024 } }}>
        {(mwTheme) => {
          themes.push(mwTheme)
          return <output>{mwTheme.spacing.sp16}</output>
        }}
      </MarwesProvider>,
    )

    expect(screen.getByText("var(--mw-spacing-sp-16)")).toBeInTheDocument()
    expect(themes[0]?.color.textMuted).toBe("var(--mw-color-text-muted)")
    expect(themes[0]?.typography.paragraph.sm.fontSize).toBe(
      "var(--mw-typography-paragraph-sm-font-size)",
    )
    expect(themes[0]?.breakpoint.tablet).toBe(1024)
    expect(themes[0]?.media.tabletAndAbove).toBe("@media (min-width: 1024px)")
    expect(themes[0]?.media.tabletAndBelow).toBe("@media (max-width: 1023.98px)")
  })

  it("switches provider-owned mode through useThemeMode().toggleMode()", () => {
    const { container } = render(
      <MarwesProvider>
        <ThemeModeConsumer />
      </MarwesProvider>,
    )

    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--light")
    expect(screen.getByRole("button")).toHaveTextContent("light:not-dark:light")

    fireEvent.click(screen.getByRole("button"))
    expect(root.className).toContain("mw-theme--dark")
    expect(screen.getByRole("button")).toHaveTextContent("dark:dark:not-light")

    fireEvent.click(screen.getByRole("button"))
    expect(root.className).toContain("mw-theme--light")
    expect(screen.getByRole("button")).toHaveTextContent("light:not-dark:light")
  })
})

describe("MarwesProvider — theme preference", () => {
  it("keeps ThemeInput.mode concrete at the provider boundary", () => {
    // @ts-expect-error — theme.mode is concrete rendered mode and cannot be system.
    const props: MarwesProviderProps = { theme: { mode: "system" }, children: null }
    expect(props).toBeDefined()
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
