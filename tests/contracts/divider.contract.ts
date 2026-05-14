/**
 * Shared contract for the Divider atom — horizontal separator default,
 * vertical orientation, size variant, and optional id.
 */
import { describe, expect, it } from "vitest"

export type DividerSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
export type DividerOrientation = "horizontal" | "vertical"

export type DividerContractHarness = {
  renderDivider(args?: {
    size?: DividerSize
    orientation?: DividerOrientation
    id?: string
  }): Promise<void> | void
  getByRole(role: "separator"): HTMLElement
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
  })
}
