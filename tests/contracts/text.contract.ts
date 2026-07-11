/**
 * Shared contract for Text components — non-heading typography styles
 * for display, label, caption, overline, and micro text.
 */
import { describe, expect, it } from "vitest"

export type TextVariant = "display" | "label" | "label-small" | "caption" | "overline" | "micro"
export type TextAs = "span" | "p" | "div"

export interface TextContractHarness {
  renderText(args: {
    text: string
    variant?: TextVariant
    as?: TextAs
    id?: string
  }): Promise<void> | void
  getByText(text: string): HTMLElement
}

export function runTextContract(adapterName: string, harness: TextContractHarness): void {
  describe(`Text contract: ${adapterName}`, () => {
    it("renders caption text by default without heading semantics", async () => {
      await harness.renderText({ text: "Helper text" })

      const textElement = harness.getByText("Helper text")
      expect(textElement.tagName).toBe("SPAN")
      expect(textElement.className).toContain("mw-text")
      expect(textElement.className).toContain("mw-text--caption")
      expect(textElement).not.toHaveAttribute("data-component")
    })

    it("supports overline variant and metadata", async () => {
      await harness.renderText({ text: "Settings", variant: "overline", id: "settings-label" })

      const textElement = harness.getByText("Settings")
      expect(textElement).toHaveAttribute("id", "settings-label")
      expect(textElement.className).toContain("mw-text--overline")
    })

    it("supports label variants", async () => {
      await harness.renderText({ text: "Field label", variant: "label" })
      await harness.renderText({ text: "Small field label", variant: "label-small" })

      const labelElement = harness.getByText("Field label")
      const smallLabelElement = harness.getByText("Small field label")
      expect(labelElement.className).toContain("mw-text--label")
      expect(smallLabelElement.className).toContain("mw-text--label-small")
    })

    it("supports display and micro variants", async () => {
      await harness.renderText({ text: "Hero", variant: "display", as: "div" })
      await harness.renderText({ text: "Meta", variant: "micro" })

      const displayElement = harness.getByText("Hero")
      const microElement = harness.getByText("Meta")
      expect(displayElement.tagName).toBe("DIV")
      expect(displayElement.className).toContain("mw-text--display")
      expect(microElement.className).toContain("mw-text--micro")
    })
  })
}
