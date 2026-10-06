/**
 * Shared contract for the Spacing atom — decorative div with default
 * metadata and size token/scale multiplier support.
 */
import type { SpacingOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type SpacingSize =
  | "sp-0"
  | "sp-2"
  | "sp-4"
  | "sp-8"
  | "sp-12"
  | "sp-16"
  | "sp-24"
  | "sp-32"
  | "sp-40"
  | "sp-48"
  | "sp-56"
  | "sp-64"
  | "sp-72"
  | "sp-80"
  | "sp-88"
  | "sp-96"
  | "sp-104"
  | "sp-112"
  | "sp-120"

export type SpacingContractHarness = {
  renderSpacing(args?: {
    size?: SpacingSize
    scale?: number
    /** Extra native attributes the consumer passes through to the element. */
    attributes?: Record<string, string>
  }): Promise<void> | void
  getSpacingElement(): HTMLElement | null
  /** Renders the base Spacing with raw core options. */
  renderSpacingOptions(options: SpacingOptions): Promise<void> | void
  getSpacingRoot(): HTMLElement
}

type SpacingOptionCase = {
  options: SpacingOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core SpacingOptions field fails to compile until every adapter's
// handling of it is described by a case.
const spacingOptionCases: Record<keyof SpacingOptions, SpacingOptionCase> = {
  size: {
    options: { size: "sp-32" },
    expectRendered: (root) => expect(root).toHaveAttribute("data-size", "sp-32"),
  },
  scale: {
    options: { size: "sp-8", scale: 2 },
    expectRendered: (root) =>
      expect(root.style.getPropertyValue("--mw-spacing-value")).toBe(
        "calc(var(--mw-spacing-sp-8) * 2)",
      ),
  },
}

export function runSpacingContract(adapterName: string, harness: SpacingContractHarness): void {
  describe(`Spacing contract: ${adapterName}`, () => {
    it("renders a decorative spacing div with default metadata", async () => {
      await harness.renderSpacing()

      const spacingElement = harness.getSpacingElement()
      expect(spacingElement).not.toBeNull()
      expect(spacingElement?.tagName).toBe("DIV")
      expect(spacingElement).toHaveAttribute("aria-hidden", "true")
      expect(spacingElement).toHaveAttribute("data-component", "spacing")
      expect(spacingElement).toHaveAttribute("data-size", "sp-24")
      expect(spacingElement?.className).toContain("mw-spacing")
    })

    it("supports size tokens and scale multipliers without leaking raw props", async () => {
      await harness.renderSpacing({ size: "sp-32", scale: 2 })

      const spacingElement = harness.getSpacingElement()
      expect(spacingElement).not.toBeNull()
      expect(spacingElement).toHaveAttribute("data-size", "sp-32")
      expect(spacingElement).not.toHaveAttribute("scale")
      expect(spacingElement?.style.getPropertyValue("--mw-spacing-value")).toBe(
        "calc(var(--mw-spacing-sp-32) * 2)",
      )
    })

    it("forwards native attributes to the spacing element", async () => {
      await harness.renderSpacing({ attributes: { "data-track-id": "spacer-1" } })

      const spacingElement = harness.getSpacingElement()
      expect(spacingElement).toHaveAttribute("data-track-id", "spacer-1")
      expect(spacingElement).toHaveAttribute("data-component", "spacing")
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(spacingOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderSpacingOptions(optionCase.options)

        const element = harness.getSpacingRoot()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
