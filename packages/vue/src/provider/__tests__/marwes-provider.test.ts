import type { ResolvedTheme } from "@marwes-ui/core"
import { render } from "@testing-library/vue"
import { afterEach, describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../marwes-provider"
import { resetThemeRuntimeState } from "../runtime-theme"
import { useTheme } from "../use-theme"

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
        theme: { mode: "dark" },
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
    expect(capturedThemes[0]?.color.primary.base).toBeDefined()
    expect(capturedThemes[0]?.color.primary.label).toBeDefined()
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
})
