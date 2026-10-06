/**
 * Shared contract for the SkipLink atom — every core option reaches the DOM in each adapter.
 */
import type { SkipLinkOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface SkipLinkContractHarness {
  /** Renders the base component with raw core options. */
  renderSkipLinkOptions(options: SkipLinkOptions): Promise<void> | void
  getSkipLinkRoot(): HTMLElement
}

type SkipLinkOptionCase = {
  options: SkipLinkOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core SkipLinkOptions field fails to compile until every adapter's
// handling of it is described by a case.
const skipLinkOptionCases: Record<keyof SkipLinkOptions, SkipLinkOptionCase> = {
  href: {
    options: { href: "#main" },
    expectRendered: (root) => expect(root).toHaveAttribute("href", "#main"),
  },
  className: {
    options: { href: "#main", className: "custom-skip" },
    expectRendered: (root) => {
      expect(root).toHaveClass("mw-skip-link")
      expect(root).toHaveClass("custom-skip")
    },
  },
}

export function runSkipLinkContract(adapterName: string, harness: SkipLinkContractHarness): void {
  describe(`SkipLink contract: ${adapterName}`, () => {
    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(skipLinkOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderSkipLinkOptions(optionCase.options)

        const root = harness.getSkipLinkRoot()
        expect(root).toBeInTheDocument()
        optionCase.expectRendered(root)
      })
    })
  })
}
