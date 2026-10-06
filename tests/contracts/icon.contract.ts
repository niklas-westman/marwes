/**
 * Shared contract for the Icon atom — decorative default (aria-hidden),
 * decorative fallback without label, and labelled mode with size tokens.
 */
import { type IconOptions, iconRegistry } from "@marwes-ui/core"
import { describe, expect, it, vi } from "vitest"

/** Raw core icon options; adapters map them onto their own prop names. */
export type IconContractArgs = Partial<Omit<IconOptions, "name">> & {
  name?: IconOptions["name"]
  /** Consumer class, not a core option; adapters map it to `className` or `class`. */
  className?: string
}

export type IconContractHarness = {
  renderIcon(args?: IconContractArgs): Promise<void> | void
  getByRole(role: "img", options: { name: RegExp }): SVGElement
  queryByRole(role: "img"): SVGElement | null
  querySvg(): SVGElement | null
}

type IconOptionCase = {
  options: IconContractArgs
  expectRendered: (svg: SVGElement) => void
}

// Exhaustive on purpose: a new core IconOptions field fails to compile until every adapter's
// handling of it is described by a case.
const iconOptionCases: Record<keyof IconOptions, IconOptionCase> = {
  name: {
    options: { name: "home" },
    expectRendered: (svg) => {
      expect(svg).toHaveAttribute("viewBox", iconRegistry.home.viewBox)
      expect(
        svg.querySelectorAll("path, circle, line, polygon, polyline, rect, ellipse"),
      ).toHaveLength(iconRegistry.home.nodes.length)
    },
  },
  size: {
    options: { size: "lg" },
    expectRendered: (svg) => {
      expect(svg).toHaveAttribute("width", "40")
      expect(svg).toHaveClass("mw-icon--lg")
      expect(svg.style.getPropertyValue("--mw-icon-size")).toBe("40px")
    },
  },
  strokeWidth: {
    options: { strokeWidth: "lg" },
    expectRendered: (svg) => {
      expect(svg).toHaveAttribute("stroke-width", "4")
      expect(svg.style.getPropertyValue("--mw-icon-stroke-width")).toBe("4")
    },
  },
  color: {
    options: { color: "primary" },
    expectRendered: (svg) => expect(svg).toHaveClass("mw-icon--primary"),
  },
  ariaLabel: {
    options: { ariaLabel: "Search" },
    expectRendered: (svg) => {
      expect(svg).toHaveAttribute("aria-label", "Search")
      expect(svg).toHaveAttribute("role", "img")
    },
  },
  ariaHidden: {
    options: { ariaLabel: "Search", ariaHidden: true },
    expectRendered: (svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true")
      expect(svg).not.toHaveAttribute("aria-label")
    },
  },
  decorative: {
    options: { decorative: true },
    expectRendered: (svg) => expect(svg).toHaveAttribute("aria-hidden", "true"),
  },
}

export function runIconContract(adapterName: string, harness: IconContractHarness): void {
  describe(`Icon contract: ${adapterName}`, () => {
    it("treats unlabeled icons as decorative", async () => {
      await harness.renderIcon()

      const iconElement = harness.querySvg()
      expect(iconElement).not.toBeNull()
      expect(iconElement).toHaveAttribute("aria-hidden", "true")
      expect(iconElement).not.toHaveAttribute("data-component")
      expect(harness.queryByRole("img")).toBeNull()
    })

    it("keeps decorative fallback when decorative=false is passed without a label", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      await harness.renderIcon({ decorative: false })

      const iconElement = harness.querySvg()
      expect(iconElement).not.toBeNull()
      expect(iconElement).toHaveAttribute("aria-hidden", "true")
      expect(harness.queryByRole("img")).toBeNull()

      warnSpy.mockRestore()
    })

    it("exposes non-decorative icon semantics and size tokens", async () => {
      await harness.renderIcon({
        ariaLabel: "Search",
        size: "lg",
        strokeWidth: "lg",
      })

      const iconElement = harness.getByRole("img", { name: /search/i })
      expect(iconElement).toHaveAttribute("width", "40")
      expect(iconElement).toHaveAttribute("height", "40")
      expect(iconElement).toHaveAttribute("stroke-width", "4")
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(iconOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderIcon(optionCase.options)

        const svg = harness.querySvg()
        expect(svg).not.toBeNull()
        optionCase.expectRendered(svg as SVGElement)
      })
    })

    it("applies the preset class and a custom marker for pixel sizes", async () => {
      await harness.renderIcon({ size: 14 })

      const svg = harness.querySvg()
      expect(svg).toHaveClass("mw-icon")
      expect(svg).toHaveClass("mw-icon--custom")
      expect(svg).toHaveAttribute("width", "14")
      expect((svg as SVGElement).style.getPropertyValue("--mw-icon-size")).toBe("14px")
    })

    it("merges a consumer class with the preset classes", async () => {
      await harness.renderIcon({ className: "custom-icon", size: "md" })

      const svg = harness.querySvg()
      expect(svg).toHaveClass("mw-icon")
      expect(svg).toHaveClass("mw-icon--md")
      expect(svg).toHaveClass("custom-icon")
    })
  })
}
