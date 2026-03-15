import { describe, expect, it } from "vitest"

export type HeadingLevel = 1 | 2 | 3
export type HeadingSize = "h1" | "h2" | "h3"

export type HeadingContractHarness = {
  renderHeading(args: {
    level: HeadingLevel
    text: string
    size?: HeadingSize
    id?: string
    ariaLabel?: string
  }): Promise<void> | void
  getByRole(
    role: "heading",
    options: {
      name: RegExp
      level: HeadingLevel
    },
  ): HTMLElement
}

export function runHeadingContract(adapterName: string, harness: HeadingContractHarness): void {
  describe(`Heading contract: ${adapterName}`, () => {
    it("renders semantic heading levels", async () => {
      await harness.renderHeading({ level: 2, text: "Profile settings" })

      const headingElement = harness.getByRole("heading", {
        name: /profile settings/i,
        level: 2,
      })

      expect(headingElement.tagName).toBe("H2")
      expect(headingElement.className).toContain("mw-heading--h2")
    })

    it("supports visual size override and heading metadata", async () => {
      await harness.renderHeading({
        level: 3,
        text: "Overview",
        size: "h1",
        id: "overview-heading",
        ariaLabel: "Overview",
      })

      const headingElement = harness.getByRole("heading", { name: /overview/i, level: 3 })
      expect(headingElement.tagName).toBe("H3")
      expect(headingElement).toHaveAttribute("id", "overview-heading")
      expect(headingElement).toHaveAttribute("aria-label", "Overview")
      expect(headingElement.className).toContain("mw-heading--h1")
    })
  })
}
