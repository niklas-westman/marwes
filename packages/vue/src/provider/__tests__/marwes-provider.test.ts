import type { ResolvedTheme } from "@marwes-ui/core"
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

describe("MarwesProvider — root element", () => {
  it("sets data-marwes-theme on root element", () => {
    const { container } = render(MarwesProvider, {
      slots: {
        default: () => h("div"),
      },
    })

    const rootElement = container.firstElementChild as HTMLElement
    expect(rootElement.dataset.marwesTheme).toBe("true")
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
    expect(rootElement.style.backgroundColor).toBe("rgb(20, 20, 20)")
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
    expect(capturedThemes[0]?.color.background).toBe("#141414")
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
