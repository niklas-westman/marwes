/**
 * Shared contract for the ContextMenu atom — every core option reaches the DOM in each adapter.
 */
import { type ContextMenuActionItem, type ContextMenuOptions, IconName } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface ContextMenuContractHarness {
  /** Renders the base component with raw core options. */
  renderContextMenuOptions(options: ContextMenuOptions): Promise<void> | void
  getContextMenuRoot(): HTMLElement
}

type ContextMenuOptionCase = {
  options: ContextMenuOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core ContextMenuOptions field fails to compile until every adapter's
// handling of it is described by a case.
const items = [{ value: "copy", label: "Copy" }] as const

interface MenuItemOptionCase {
  item: ContextMenuActionItem
  expectRendered: (item: HTMLElement) => void
}

const menuItemOptionCases: Record<keyof ContextMenuActionItem, MenuItemOptionCase> = {
  kind: {
    item: { kind: "item", value: "copy", label: "Copy" },
    expectRendered: (item) => expect(item).toHaveTextContent("Copy"),
  },
  value: {
    item: { value: "copy", label: "Copy" },
    expectRendered: (item) => expect(item).toBeInTheDocument(),
  },
  label: {
    item: { value: "copy", label: "Copy text" },
    expectRendered: (item) => expect(item).toHaveTextContent("Copy text"),
  },
  icon: {
    item: { value: "copy", label: "Copy", icon: IconName.Copy },
    expectRendered: (item) => expect(item.querySelector("svg")).toBeInTheDocument(),
  },
  disabled: {
    item: { value: "copy", label: "Copy", disabled: true },
    expectRendered: (item) => expect(item).toHaveAttribute("aria-disabled", "true"),
  },
  destructive: {
    item: { value: "delete", label: "Delete", destructive: true },
    expectRendered: (item) => expect(item.className).toMatch(/destructive/),
  },
  dataAttributes: {
    item: { value: "copy", label: "Copy", dataAttributes: { "data-testid": "copy-item" } },
    expectRendered: (item) =>
      expect(item.closest("[data-testid]")).toHaveAttribute("data-testid", "copy-item"),
  },
}

const contextMenuOptionCases: Record<keyof ContextMenuOptions, ContextMenuOptionCase> = {
  items: {
    options: { items },
    expectRendered: (root) =>
      expect(root.querySelector('[role="menuitem"]')).toHaveTextContent("Copy"),
  },
  ariaLabel: {
    options: { items, ariaLabel: "Row actions" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-label", "Row actions"),
  },
  dataAttributes: {
    options: { items, dataAttributes: { "data-testid": "menu" } },
    expectRendered: (root) => expect(root).toHaveAttribute("data-testid", "menu"),
  },
}

export function runContextMenuContract(
  adapterName: string,
  harness: ContextMenuContractHarness,
): void {
  describe(`ContextMenu contract: ${adapterName}`, () => {
    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(contextMenuOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderContextMenuOptions(optionCase.options)

        const root = harness.getContextMenuRoot()
        expect(root).toBeInTheDocument()
        optionCase.expectRendered(root)
      })
    })

    describe("every action item option reaches the DOM", () => {
      it.each(Object.entries(menuItemOptionCases))("%s", async (_optionName, itemCase) => {
        await harness.renderContextMenuOptions({ items: [itemCase.item] })

        const root = harness.getContextMenuRoot()
        itemCase.expectRendered(root.querySelector('[role="menuitem"]') as HTMLElement)
      })
    })

    it("renders dividers as separators", async () => {
      await harness.renderContextMenuOptions({
        items: [
          { value: "a", label: "A" },
          { kind: "divider", dataAttributes: { "data-testid": "rule" } },
          { value: "b", label: "B" },
        ],
      })

      const root = harness.getContextMenuRoot()
      expect(root.querySelectorAll('[role="menuitem"]')).toHaveLength(2)
      const divider = root.querySelector('[role="separator"]')
      expect(divider).toHaveAttribute("aria-orientation", "horizontal")
    })
  })
}
