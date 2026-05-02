import { describe, expect, it } from "vitest"

export type SpacingSize =
  | "sp-0"
  | "sp-2"
  | "sp-4"
  | "sp-8"
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
  }): Promise<void> | void
  getSpacingElement(): HTMLElement | null
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
  })
}
