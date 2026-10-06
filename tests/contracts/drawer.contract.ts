/**
 * Shared contract for the Drawer — every core option reaches the DOM in each adapter.
 */
import type { DrawerOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface DrawerContractHarness {
  /** Renders the base Drawer with raw core options, a title, a footer and a close handler. */
  renderDrawerOptions(options: DrawerOptions): Promise<void> | void
  getDrawerRoot(): HTMLElement
}

type DrawerOptionCase = {
  options: DrawerOptions
  expectRendered: (root: HTMLElement) => void
}

const getPanel = (root: HTMLElement): HTMLElement =>
  root.querySelector(".mw-drawer__panel") as HTMLElement

// Exhaustive on purpose: a new core DrawerOptions field fails to compile until every adapter's
// handling of it is described by a case.
const drawerOptionCases: Record<keyof DrawerOptions, DrawerOptionCase> = {
  size: {
    options: { size: "large" },
    expectRendered: (root) => expect(root).toHaveAttribute("data-size", "large"),
  },
  placement: {
    options: { placement: "left" },
    expectRendered: (root) => expect(root).toHaveClass("mw-drawer--left"),
  },
  showFooter: {
    options: { showFooter: false },
    expectRendered: (root) => expect(root).toHaveAttribute("data-footer", "false"),
  },
  dismissible: {
    options: { dismissible: false },
    expectRendered: (root) => {
      expect(root).toHaveAttribute("data-dismissible", "false")
      expect(root.querySelector(".mw-drawer__close")).toBeNull()
    },
  },
  closeLabel: {
    options: { closeLabel: "Stäng" },
    expectRendered: (root) =>
      expect(root.querySelector(".mw-drawer__close")).toHaveAttribute("aria-label", "Stäng"),
  },
  modal: {
    options: { modal: true },
    expectRendered: (root) => expect(getPanel(root)).toHaveAttribute("aria-modal", "true"),
  },
  showScrim: {
    options: { showScrim: false },
    expectRendered: (root) => expect(root).toHaveAttribute("data-scrim", "false"),
  },
  ariaLabel: {
    options: { ariaLabel: "Filters" },
    expectRendered: (root) => expect(getPanel(root)).toHaveAttribute("aria-label", "Filters"),
  },
  ariaLabelledBy: {
    options: { ariaLabelledBy: "label-id" },
    expectRendered: (root) => expect(getPanel(root)).toHaveAttribute("aria-labelledby", "label-id"),
  },
  ariaDescribedBy: {
    options: { ariaDescribedBy: "desc-id" },
    expectRendered: (root) => expect(getPanel(root)).toHaveAttribute("aria-describedby", "desc-id"),
  },
  dataAttributes: {
    options: { dataAttributes: { "data-track": "drw" } },
    expectRendered: (root) => expect(root).toHaveAttribute("data-track", "drw"),
  },
}

export function runDrawerContract(adapterName: string, harness: DrawerContractHarness): void {
  describe(`Drawer contract: ${adapterName}`, () => {
    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(drawerOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderDrawerOptions(optionCase.options)

        const root = harness.getDrawerRoot()
        expect(root).toBeInTheDocument()
        optionCase.expectRendered(root)
      })
    })
  })
}
