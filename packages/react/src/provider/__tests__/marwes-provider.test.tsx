import { type ResolvedTheme, ThemeMode } from "@marwes-ui/core"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
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

function ThemePreferenceConsumer() {
  const { mode, preference, systemMode, isSystem, setPreference, setMode, toggleMode } =
    useThemeMode()

  return (
    <div>
      <output>
        {mode}:{preference}:{systemMode}:{isSystem ? "system" : "concrete"}
      </output>
      <button type="button" onClick={() => setPreference("system")}>
        system
      </button>
      <button type="button" onClick={() => setPreference(ThemeMode.dark)}>
        dark preference
      </button>
      <button type="button" onClick={() => setMode(ThemeMode.dark)}>
        dark mode
      </button>
      <button type="button" onClick={toggleMode}>
        toggle
      </button>
    </div>
  )
}

const originalMatchMedia = window.matchMedia
const originalLocalStorage = window.localStorage

function mockSystemMode(initialMode: ThemeMode) {
  let matches = initialMode === ThemeMode.dark
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (_event: "change", listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_event: "change", listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    addListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    dispatchEvent: () => true,
  }))

  return {
    setMode(nextMode: ThemeMode) {
      matches = nextMode === ThemeMode.dark
      const event = { matches } as MediaQueryListEvent
      for (const listener of listeners) {
        listener(event)
      }
    },
  }
}

function mockLocalStorage(initialValues: Record<string, string> = {}) {
  const values = new Map(Object.entries(initialValues))
  const storage = {
    get length() {
      return values.size
    },
    clear: vi.fn(() => {
      values.clear()
    }),
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(values.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => {
      values.delete(key)
    }),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    }),
  } satisfies Storage

  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
  })

  return storage
}

afterEach(() => {
  window.matchMedia = originalMatchMedia
  Object.defineProperty(window, "localStorage", {
    value: originalLocalStorage,
    configurable: true,
  })
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
    expect(root.style.backgroundColor).toBe("rgb(20, 20, 20)")
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
    expect(themes[0]?.color.background).toBe("#141414")
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

  it("calls onModeChange when provider-owned mode changes", () => {
    const onModeChange = vi.fn()

    render(
      <MarwesProvider onModeChange={onModeChange}>
        <ThemeModeConsumer />
      </MarwesProvider>,
    )

    fireEvent.click(screen.getByRole("button"))
    expect(onModeChange).toHaveBeenCalledWith(ThemeMode.dark)
  })
})

describe("MarwesProvider — theme preference", () => {
  it("keeps ThemeInput.mode concrete at the provider boundary", () => {
    // @ts-expect-error — theme.mode is concrete rendered mode and cannot be system.
    const props: MarwesProviderProps = { theme: { mode: "system" }, children: null }
    expect(props).toBeDefined()
  })

  it("resolves defaultPreference system from matchMedia", () => {
    mockSystemMode(ThemeMode.dark)

    const { container } = render(
      <MarwesProvider defaultPreference="system">
        <ThemePreferenceConsumer />
      </MarwesProvider>,
    )

    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--dark")
    expect(screen.getByText("dark:system:dark:system")).toBeInTheDocument()
  })

  it("lets controlled preference win over concrete mode and theme.mode", () => {
    mockSystemMode(ThemeMode.dark)

    const { container } = render(
      <MarwesProvider preference="system" mode={ThemeMode.light} theme={{ mode: ThemeMode.light }}>
        <ThemePreferenceConsumer />
      </MarwesProvider>,
    )

    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain("mw-theme--dark")
    expect(screen.getByText("dark:system:dark:system")).toBeInTheDocument()
  })

  it("sets system preference without returning system as mode", () => {
    mockSystemMode(ThemeMode.dark)

    const { container } = render(
      <MarwesProvider defaultMode={ThemeMode.light}>
        <ThemePreferenceConsumer />
      </MarwesProvider>,
    )

    const root = container.firstElementChild as HTMLElement
    expect(screen.getByText("light:light:dark:concrete")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "system" }))

    expect(root.className).toContain("mw-theme--dark")
    expect(screen.getByText("dark:system:dark:system")).toBeInTheDocument()
    expect(screen.queryByText(/^system:/)).not.toBeInTheDocument()
  })

  it("reads stored preference after mount when storageKey is enabled", async () => {
    mockLocalStorage({ "marwes-theme": "dark" })

    const { container } = render(
      <MarwesProvider storageKey="marwes-theme" defaultMode={ThemeMode.light}>
        <ThemePreferenceConsumer />
      </MarwesProvider>,
    )

    const root = container.firstElementChild as HTMLElement
    await waitFor(() => expect(root.className).toContain("mw-theme--dark"))
    expect(screen.getByText("dark:dark:light:concrete")).toBeInTheDocument()
  })

  it("writes stored preference when setPreference is called", () => {
    const storage = mockLocalStorage()

    render(
      <MarwesProvider storageKey="marwes-theme">
        <ThemePreferenceConsumer />
      </MarwesProvider>,
    )

    fireEvent.click(screen.getByRole("button", { name: "system" }))
    expect(storage.getItem("marwes-theme")).toBe("system")
  })

  it("ignores storage read and write failures", () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem() {
          throw new Error("storage unavailable")
        },
        setItem() {
          throw new Error("storage unavailable")
        },
      },
      configurable: true,
    })

    expect(() => {
      render(
        <MarwesProvider storageKey="marwes-theme">
          <ThemePreferenceConsumer />
        </MarwesProvider>,
      )
    }).not.toThrow()

    expect(() => {
      fireEvent.click(screen.getByRole("button", { name: "system" }))
    }).not.toThrow()
  })

  it("updates resolved mode on system changes only while preference is system", () => {
    const system = mockSystemMode(ThemeMode.light)

    render(
      <MarwesProvider defaultPreference="system">
        <ThemePreferenceConsumer />
      </MarwesProvider>,
    )

    expect(screen.getByText("light:system:light:system")).toBeInTheDocument()

    act(() => {
      system.setMode(ThemeMode.dark)
    })
    expect(screen.getByText("dark:system:dark:system")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "dark preference" }))
    expect(screen.getByText("dark:dark:dark:concrete")).toBeInTheDocument()

    act(() => {
      system.setMode(ThemeMode.light)
    })
    expect(screen.getByText("dark:dark:dark:concrete")).toBeInTheDocument()
  })

  it("keeps setMode as a concrete light and dark convenience", () => {
    const onModeChange = vi.fn()
    const onPreferenceChange = vi.fn()

    render(
      <MarwesProvider onModeChange={onModeChange} onPreferenceChange={onPreferenceChange}>
        <ThemePreferenceConsumer />
      </MarwesProvider>,
    )

    fireEvent.click(screen.getByRole("button", { name: "dark mode" }))
    expect(onModeChange).toHaveBeenCalledWith(ThemeMode.dark)
    expect(onPreferenceChange).toHaveBeenCalledWith(ThemeMode.dark)
    expect(screen.getByText("dark:dark:light:concrete")).toBeInTheDocument()
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
