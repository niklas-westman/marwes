/**
 * Shared contract for the Divider atom — horizontal separator default,
 * vertical orientation, size variant, and optional id.
 */
import type { DividerOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type DividerSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
export type DividerOrientation = "horizontal" | "vertical"

export type DividerContractHarness = {
  renderDivider(args?: {
    size?: DividerSize
    orientation?: DividerOrientation
    id?: string
    /** Extra native attributes the consumer passes through to the element. */
    attributes?: Record<string, string>
  }): Promise<void> | void
  getByRole(role: "separator"): HTMLElement
  /** Renders the base Divider with raw core options. */
  renderDividerOptions(options: DividerOptions): Promise<void> | void
  getDividerRoot(): HTMLElement
}

type DividerOptionCase = {
  options: DividerOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core DividerOptions field fails to compile until every adapter's
// handling of it is described by a case.
const dividerOptionCases: Record<keyof DividerOptions, DividerOptionCase> = {
  size: {
    options: { size: "xl" },
    expectRendered: (root) => {
      expect(root).toHaveAttribute("data-size", "xl")
      expect(root).toHaveClass("mw-divider--xl")
    },
  },
  orientation: {
    options: { orientation: "vertical" },
    expectRendered: (root) => {
      expect(root).toHaveAttribute("aria-orientation", "vertical")
      expect(root).toHaveClass("mw-divider--vertical")
    },
  },
  id: {
    options: { id: "rule" },
    expectRendered: (root) => expect(root).toHaveAttribute("id", "rule"),
  },
}

export function runDividerContract(adapterName: string, harness: DividerContractHarness): void {
  describe(`Divider contract: ${adapterName}`, () => {
    it("renders a semantic separator with horizontal orientation by default", async () => {
      await harness.renderDivider()

      const separatorElement = harness.getByRole("separator")
      expect(separatorElement.tagName).toBe("HR")
      expect(separatorElement).toHaveAttribute("aria-orientation", "horizontal")
      expect(separatorElement).toHaveAttribute("data-component", "divider")
      expect(separatorElement).toHaveAttribute("data-orientation", "horizontal")
      expect(separatorElement).toHaveAttribute("data-size", "md")
      expect(separatorElement.className).toContain("mw-divider--horizontal")
      expect(separatorElement.className).toContain("mw-divider--md")
    })

    it("supports vertical orientation, size variant, and optional id", async () => {
      await harness.renderDivider({ orientation: "vertical", size: "xl", id: "section-divider" })

      const separatorElement = harness.getByRole("separator")
      expect(separatorElement).toHaveAttribute("id", "section-divider")
      expect(separatorElement).toHaveAttribute("aria-orientation", "vertical")
      expect(separatorElement).toHaveAttribute("data-component", "divider")
      expect(separatorElement).toHaveAttribute("data-orientation", "vertical")
      expect(separatorElement).toHaveAttribute("data-size", "xl")
      expect(separatorElement.className).toContain("mw-divider--vertical")
      expect(separatorElement.className).toContain("mw-divider--xl")
    })

    it("forwards native attributes to the separator element", async () => {
      await harness.renderDivider({
        attributes: { "aria-label": "Section break", "data-track-id": "divider-1" },
      })

      const separatorElement = harness.getByRole("separator")
      expect(separatorElement).toHaveAttribute("aria-label", "Section break")
      expect(separatorElement).toHaveAttribute("data-track-id", "divider-1")
      expect(separatorElement).toHaveAttribute("data-component", "divider")
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(dividerOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderDividerOptions(optionCase.options)

        const element = harness.getDividerRoot()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
