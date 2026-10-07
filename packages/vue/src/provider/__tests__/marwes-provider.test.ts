/**
 * Vue adapter: Tests the MarwesProvider component — theme context injection,
 * mode toggling, dark/light detection, and provider nesting behavior.
 */
import type { MwTheme, ResolvedTheme } from "@marwes-ui/core"
import { ThemeMode, resolveThemeInput } from "@marwes-ui/core"
import { fireEvent, render, screen } from "@testing-library/vue"
import { afterEach, describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
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
    expect(capturedThemes[0]?.color.primary.base).toBe("#2F31FC")
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

  it("passes CSS-provider mwTheme to the default scoped slot", () => {
    const capturedThemes: MwTheme[] = []

    render(
      defineComponent({
        setup() {
          return () =>
            h(
              MarwesProvider,
              { theme: { breakpoint: { tablet: 1024 } } },
              {
                default: ({ mwTheme }: { mwTheme: MwTheme }) => {
                  capturedThemes.push(mwTheme)
                  return h("output", mwTheme.spacing.sp16)
                },
              },
            )
        },
      }),
    )

    expect(screen.getByText("var(--mw-spacing-sp-16)")).toBeInTheDocument()
    expect(capturedThemes[0]?.color.textMuted).toBe("var(--mw-color-text-muted)")
    expect(capturedThemes[0]?.typography.paragraph.sm.fontSize).toBe(
      "var(--mw-typography-paragraph-sm-font-size)",
    )
    expect(capturedThemes[0]?.breakpoint.tablet).toBe(1024)
    expect(capturedThemes[0]?.media.tabletAndAbove).toBe("@media (min-width: 1024px)")
    expect(capturedThemes[0]?.media.tabletAndBelow).toBe("@media (max-width: 1023.98px)")
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
