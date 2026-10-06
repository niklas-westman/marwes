/**
 * Shared contract for the Paragraph atom — native paragraph rendering
 * with default styling, size variants, and id metadata.
 */
import type { ParagraphOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type ParagraphSize = "sm" | "md" | "lg"

export type ParagraphContractHarness = {
  renderParagraph(args: {
    text: string
    size?: ParagraphSize
    id?: string
  }): Promise<void> | void
  getByText(text: string): HTMLElement
  /** Renders the base component with raw core options. */
  renderParagraphOptions(options: ParagraphOptions): Promise<void> | void
  getParagraphRoot(): HTMLElement
}

type ParagraphOptionCase = {
  options: ParagraphOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core ParagraphOptions field fails to compile until every adapter's
// handling of it is described by a case.
const paragraphOptionCases: Record<keyof ParagraphOptions, ParagraphOptionCase> = {
  size: { options: { size: "lg" }, expectRendered: (root) => expect(root).toHaveClass("mw-p--lg") },
  id: {
    options: { id: "intro" },
    expectRendered: (root) => expect(root).toHaveAttribute("id", "intro"),
  },
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

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(paragraphOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderParagraphOptions(optionCase.options)

        const element = harness.getParagraphRoot()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
