import type { ResolvedTheme } from "@marwes-ui/core"
import { ThemeMode, resolveThemeInput } from "@marwes-ui/core"
import { fireEvent, render, screen, waitFor } from "@testing-library/vue"
import { afterEach, describe, expect, it, vi } from "vitest"
import { defineComponent, h, nextTick } from "vue"
import { MarwesProvider } from "../marwes-provider"
import { resetThemeRuntimeState } from "../runtime-theme"
import { themeToRootStyle } from "../runtime-theme"
import { useTheme } from "../use-theme"
import { useThemeMode } from "../use-theme-mode"

function ThemeConsumer({ onTheme }: { onTheme: (theme: ResolvedTheme) => void }) {
  return defineComponent({
    name: "ThemeConsumer",
    setup() {
      const theme = useTheme()
      onTheme(theme)
      return () => null
    },
  })
}

const ThemeModeConsumer = defineComponent({
  name: "ThemeModeConsumer",
  setup() {
    const { mode, toggleMode, isDark, isLight } = useThemeMode()

    return () =>
      h(
        "button",
        { type: "button", onClick: toggleMode },
        `${mode.value}:${isDark.value ? "dark" : "not-dark"}:${
          isLight.value ? "light" : "not-light"
        }`,
      )
  },
})

const ThemePreferenceConsumer = defineComponent({
  name: "ThemePreferenceConsumer",
  setup() {
    const { mode, preference, systemMode, isSystem, setPreference, setMode, toggleMode } =
      useThemeMode()

    return () =>
      h("div", [
        h(
          "output",
          `${mode.value}:${preference.value}:${systemMode.value}:${
            isSystem.value ? "system" : "concrete"
          }`,
        ),
        h("button", { type: "button", onClick: () => setPreference("system") }, "system"),
        h(
          "button",
          { type: "button", onClick: () => setPreference(ThemeMode.dark) },
          "dark preference",
        ),
        h("button", { type: "button", onClick: () => setMode(ThemeMode.dark) }, "dark mode"),
        h("button", { type: "button", onClick: toggleMode }, "toggle"),
      ])
  },
})

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
    const { container } = render(MarwesProvider, {
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.dataset.marwesTheme).toBe("true")
    expect(rootElement.dataset.marwesMode).toBe(ThemeMode.light)
  })

  it("applies --mw-color-primary-base CSS var on root element", () => {
    const { container } = render(MarwesProvider, {
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.style.getPropertyValue("--mw-color-primary-base")).not.toBe("")
  })

  it("builds root styles for first render theme CSS vars", () => {
    const style = themeToRootStyle(
      resolveThemeInput({
        color: { primary: "#AA33FF", background: "#101418", text: "#F4F7FA" },
        font: { primary: "Test Primary, system-ui, sans-serif" },
        ui: { radius: 12 },
      }),
    )

    expect(style["--mw-color-primary-base"]).toBe("#AA33FF")
    expect(style["--mw-font-primary"]).toBe("Test Primary, system-ui, sans-serif")
    expect(style["--mw-ui-radius"]).toBe("12px")
    expect(style.backgroundColor).toBe("#101418")
    expect(style.color).toBe("#F4F7FA")
  })

  it("omits inline variables when using the style-tag variable strategy", () => {
    const { container } = render(MarwesProvider, {
      props: {
        variableStrategy: "style-tag",
      },
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.dataset.marwesMode).toBe(ThemeMode.light)
    expect(rootElement.style.getPropertyValue("--mw-color-primary-base")).toBe("")
  })

  it("applies mw-theme--light class by default", () => {
    const { container } = render(MarwesProvider, {
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--light")
  })

  it("applies mw-theme--dark class when mode is dark", () => {
    const { container } = render(MarwesProvider, {
      props: {
        theme: { mode: ThemeMode.dark },
      },
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--dark")
  })

  it("applies mw-theme--dark class when defaultMode is dark", () => {
    const { container } = render(MarwesProvider, {
      props: {
        defaultMode: ThemeMode.dark,
      },
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--dark")
    expect(rootElement.style.backgroundColor).toBe("rgb(15, 15, 15)")
  })

  it("lets controlled mode win over defaultMode", () => {
    const { container } = render(MarwesProvider, {
      props: {
        defaultMode: ThemeMode.dark,
        mode: ThemeMode.light,
      },
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--light")
  })

  it("keeps theme.mode working over defaultMode", () => {
    const { container } = render(MarwesProvider, {
      props: {
        defaultMode: ThemeMode.light,
        theme: { mode: ThemeMode.dark },
      },
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--dark")
  })

  it("keeps default provider target scoped to the provider root", () => {
    const { container } = render(MarwesProvider, {
      props: {
        defaultMode: ThemeMode.dark,
      },
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--dark")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
    expect(document.body.classList.contains("dark")).toBe(false)
  })

  it("syncs html class target and preserves unrelated classes", async () => {
    document.documentElement.className = "app-shell dark"

    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { target: "html", defaultMode: ThemeMode.light },
              {
                default: () => h(ThemeModeConsumer),
              },
            )
        },
      }),
    )

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--light")
    expect(document.documentElement.classList.contains("app-shell")).toBe(true)
    expect(document.documentElement.classList.contains("light")).toBe(true)
    expect(document.documentElement.classList.contains("dark")).toBe(false)

    await fireEvent.click(screen.getByRole("button"))
    expect(rootElement.className).toContain("mw-theme--dark")
    expect(document.documentElement.classList.contains("app-shell")).toBe(true)
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    expect(document.documentElement.classList.contains("light")).toBe(false)
  })

  it("syncs body data attribute target on mode changes", async () => {
    document.body.className = "app-body"

    render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { target: "body", attribute: "data-mode", defaultMode: ThemeMode.dark },
              {
                default: () => h(ThemeModeConsumer),
              },
            )
        },
      }),
    )

    expect(document.body.classList.contains("app-body")).toBe(true)
    expect(document.body.getAttribute("data-mode")).toBe("dark")

    await fireEvent.click(screen.getByRole("button"))
    expect(document.body.classList.contains("app-body")).toBe(true)
    expect(document.body.getAttribute("data-mode")).toBe("light")
  })

  it("supports data-theme attribute target", () => {
    render(MarwesProvider, {
      props: {
        target: "html",
        attribute: "data-theme",
        defaultMode: ThemeMode.dark,
      },
      slots: {
        default: () => h("div"),
      },
    })

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark")
  })

  it("inserts and removes transition suppression style when requested", () => {
    const callbacks: FrameRequestCallback[] = []
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callbacks.push(callback)
      return callbacks.length
    })

    render(MarwesProvider, {
      props: {
        target: "html",
        disableTransitionOnChange: true,
      },
      slots: {
        default: () => h("div"),
      },
    })

    expect(document.head.querySelector("[data-marwes-disable-transitions]")).not.toBeNull()
    callbacks.shift()?.(0)
    expect(document.head.querySelector("[data-marwes-disable-transitions]")).toBeNull()
  })
})

describe("MarwesProvider — context", () => {
  it("provides ResolvedTheme with ColorRole primary to consumers", () => {
    const capturedThemes: ResolvedTheme[] = []

    const ConsumerComponent = ThemeConsumer({
      onTheme(theme) {
        capturedThemes.push(theme)
      },
    })

    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => h(ConsumerComponent),
            })
        },
      }),
    )

    expect(capturedThemes.length).toBeGreaterThan(0)
    expect(capturedThemes[0]?.mode).toBe(ThemeMode.light)
    expect(capturedThemes[0]?.color.primary.base).toBe("#2F31FC")
    expect(capturedThemes[0]?.color.primary.label).toBe("#FFFFFF")
  })

  it("provides dark mode ResolvedTheme when mode is dark", () => {
    const capturedThemes: ResolvedTheme[] = []

    const ConsumerComponent = ThemeConsumer({
      onTheme(theme) {
        capturedThemes.push(theme)
      },
    })

    render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { theme: { mode: ThemeMode.dark } },
              {
                default: () => h(ConsumerComponent),
              },
            )
        },
      }),
    )

    expect(capturedThemes.length).toBeGreaterThan(0)
    expect(capturedThemes[0]?.mode).toBe(ThemeMode.dark)
    expect(capturedThemes[0]?.color.primary.base).toBe("#5859FC")
  })

  it("keeps useTheme returning a ResolvedTheme", () => {
    const capturedThemes: ResolvedTheme[] = []

    const ConsumerComponent = ThemeConsumer({
      onTheme(theme) {
        capturedThemes.push(theme)
      },
    })

    render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { defaultMode: ThemeMode.dark },
              {
                default: () => h(ConsumerComponent),
              },
            )
        },
      }),
    )

    expect(capturedThemes[0]?.mode).toBe(ThemeMode.dark)
    expect(capturedThemes[0]?.color.background).toBe("#0F0F0F")
  })

  it("switches provider-owned mode through useThemeMode().toggleMode()", async () => {
    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => h(ThemeModeConsumer),
            })
        },
      }),
    )

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--light")
    expect(screen.getByRole("button")).toHaveTextContent("light:not-dark:light")

    await fireEvent.click(screen.getByRole("button"))
    expect(rootElement.className).toContain("mw-theme--dark")
    expect(screen.getByRole("button")).toHaveTextContent("dark:dark:not-light")

    await fireEvent.click(screen.getByRole("button"))
    expect(rootElement.className).toContain("mw-theme--light")
    expect(screen.getByRole("button")).toHaveTextContent("light:not-dark:light")
  })

  it("calls onModeChange when provider-owned mode changes", async () => {
    const onModeChange = vi.fn()

    render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { onModeChange },
              {
                default: () => h(ThemeModeConsumer),
              },
            )
        },
      }),
    )

    await fireEvent.click(screen.getByRole("button"))
    expect(onModeChange).toHaveBeenCalledWith(ThemeMode.dark)
  })
})

describe("MarwesProvider — theme preference", () => {
  it("resolves defaultPreference system from matchMedia", () => {
    mockSystemMode(ThemeMode.dark)

    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { defaultPreference: "system" },
              {
                default: () => h(ThemePreferenceConsumer),
              },
            )
        },
      }),
    )

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--dark")
    expect(screen.getByText("dark:system:dark:system")).toBeInTheDocument()
  })

  it("lets controlled preference win over concrete mode and theme.mode", () => {
    mockSystemMode(ThemeMode.dark)

    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              {
                preference: "system",
                mode: ThemeMode.light,
                theme: { mode: ThemeMode.light },
              },
              {
                default: () => h(ThemePreferenceConsumer),
              },
            )
        },
      }),
    )

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.className).toContain("mw-theme--dark")
    expect(screen.getByText("dark:system:dark:system")).toBeInTheDocument()
  })

  it("sets system preference without returning system as mode", async () => {
    mockSystemMode(ThemeMode.dark)

    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { defaultMode: ThemeMode.light },
              {
                default: () => h(ThemePreferenceConsumer),
              },
            )
        },
      }),
    )

    const rootElement = container.firstElementChild as HTMLElement
    expect(screen.getByText("light:light:dark:concrete")).toBeInTheDocument()

    await fireEvent.click(screen.getByRole("button", { name: "system" }))

    expect(rootElement.className).toContain("mw-theme--dark")
    expect(screen.getByText("dark:system:dark:system")).toBeInTheDocument()
    expect(screen.queryByText(/^system:/)).not.toBeInTheDocument()
  })

  it("reads stored preference after mount when storageKey is enabled", async () => {
    mockLocalStorage({ "marwes-theme": "dark" })

    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { storageKey: "marwes-theme", defaultMode: ThemeMode.light },
              {
                default: () => h(ThemePreferenceConsumer),
              },
            )
        },
      }),
    )

    const rootElement = container.firstElementChild as HTMLElement
    await waitFor(() => expect(rootElement.className).toContain("mw-theme--dark"))
    expect(screen.getByText("dark:dark:light:concrete")).toBeInTheDocument()
  })

  it("writes stored preference when setPreference is called", async () => {
    const storage = mockLocalStorage()

    render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { storageKey: "marwes-theme" },
              {
                default: () => h(ThemePreferenceConsumer),
              },
            )
        },
      }),
    )

    await fireEvent.click(screen.getByRole("button", { name: "system" }))
    expect(storage.getItem("marwes-theme")).toBe("system")
  })

  it("ignores storage read and write failures", async () => {
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
        defineComponent({
          setup() {
            return () =>
              h(
                MarwesProvider,
                { storageKey: "marwes-theme" },
                {
                  default: () => h(ThemePreferenceConsumer),
                },
              )
          },
        }),
      )
    }).not.toThrow()

    await expect(
      fireEvent.click(screen.getByRole("button", { name: "system" })),
    ).resolves.not.toThrow()
  })

  it("updates resolved mode on system changes only while preference is system", async () => {
    const system = mockSystemMode(ThemeMode.light)

    render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { defaultPreference: "system" },
              {
                default: () => h(ThemePreferenceConsumer),
              },
            )
        },
      }),
    )

    expect(screen.getByText("light:system:light:system")).toBeInTheDocument()

    system.setMode(ThemeMode.dark)
    await nextTick()
    expect(screen.getByText("dark:system:dark:system")).toBeInTheDocument()

    await fireEvent.click(screen.getByRole("button", { name: "dark preference" }))
    expect(screen.getByText("dark:dark:dark:concrete")).toBeInTheDocument()

    system.setMode(ThemeMode.light)
    await nextTick()
    expect(screen.getByText("dark:dark:dark:concrete")).toBeInTheDocument()
  })

  it("keeps setMode as a concrete light and dark convenience", async () => {
    const onModeChange = vi.fn()
    const onPreferenceChange = vi.fn()

    render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { onModeChange, onPreferenceChange },
              {
                default: () => h(ThemePreferenceConsumer),
              },
            )
        },
      }),
    )

    await fireEvent.click(screen.getByRole("button", { name: "dark mode" }))
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

    for (const linkElement of findFontLinks()) {
      linkElement.remove()
    }

    for (const linkElement of document.head.querySelectorAll('link[rel="preconnect"]')) {
      if ((linkElement as HTMLLinkElement).href.includes("fonts.g")) {
        linkElement.remove()
      }
    }
  })

  it("injects a Google Fonts link when tone uses a non-system font", () => {
    render(MarwesProvider, {
      props: {
        theme: { tone: "playful" },
      },
      slots: {
        default: () => h("div"),
      },
    })

    const fontLinks = findFontLinks()
    expect(fontLinks.length).toBeGreaterThanOrEqual(1)
    expect(fontLinks.some((linkElement) => linkElement.href.includes("Nunito"))).toBe(true)
  })

  it("does not inject a Google Fonts link for default tone", () => {
    render(MarwesProvider, {
      slots: {
        default: () => h("div"),
      },
    })

    expect(findFontLinks()).toHaveLength(0)
  })

  it("does not inject Google Fonts links for brand placeholders", () => {
    render(MarwesProvider, {
      props: {
        theme: { font: { primary: "Brand Sans, system-ui, sans-serif" } },
      },
      slots: {
        default: () => h("div"),
      },
    })

    expect(findFontLinks()).toHaveLength(0)
  })

  it("supports an allowlist when custom and Google fonts are mixed", () => {
    render(MarwesProvider, {
      props: {
        fontLoading: { googleFamilies: ["Lora"] },
        theme: {
          font: {
            primary: "Brand Sans, system-ui, sans-serif",
            secondary: "Lora, Georgia, serif",
          },
        },
      },
      slots: {
        default: () => h("div"),
      },
    })

    const hrefs = findFontLinks().map((linkElement) => linkElement.href)
    expect(hrefs).toHaveLength(1)
    expect(hrefs[0]).toContain("Lora")
  })
})
