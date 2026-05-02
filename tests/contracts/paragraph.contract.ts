import { describe, expect, it } from "vitest"

export type ParagraphSize = "sm" | "md" | "lg"

export type ParagraphContractHarness = {
  renderParagraph(args: {
    text: string
    size?: ParagraphSize
    id?: string
  }): Promise<void> | void
  getByText(text: string): HTMLElement
}

export function runParagraphContract(adapterName: string, harness: ParagraphContractHarness): void {
  describe(`Paragraph contract: ${adapterName}`, () => {
    it("renders a native paragraph with default styling and no family-local metadata", async () => {
      await harness.renderParagraph({ text: "Paragraph content" })

      const paragraphElement = harness.getByText("Paragraph content")
      expect(paragraphElement.tagName).toBe("P")
      expect(paragraphElement.className).toContain("mw-p")
      expect(paragraphElement.className).toContain("mw-p--md")
      expect(paragraphElement).not.toHaveAttribute("data-component")
    })

    it("supports size variants and id metadata", async () => {
      await harness.renderParagraph({
        text: "Lead paragraph",
        size: "lg",
        id: "lead-text",
      })

      const paragraphElement = harness.getByText("Lead paragraph")
      expect(paragraphElement).toHaveAttribute("id", "lead-text")
      expect(paragraphElement.className).toContain("mw-p--lg")
    })
  })
}
