/**
 * Shared contract for the SegmentedControl atom — every core option reaches the DOM in each adapter.
 */
import type { SegmentedControlOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

/** The item shape every adapter accepts, reduced to the fields core models. */
export interface SegmentedControlContractItem {
  value: string
  label?: string
  disabled?: boolean
  ariaLabel?: string
}

export interface SegmentedControlContractHarness {
  renderSegmentedControlItems(items: readonly SegmentedControlContractItem[]): Promise<void> | void
  /** Renders the base component with raw core options. */
  renderSegmentedControlOptions(options: SegmentedControlOptions): Promise<void> | void
  getSegmentedControlRoot(): HTMLElement
}

type SegmentedControlOptionCase = {
  options: SegmentedControlOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core SegmentedControlOptions field fails to compile until every adapter's
// handling of it is described by a case.
interface SegmentedControlItemCase {
  items: readonly SegmentedControlContractItem[]
  expectRendered: (radios: NodeListOf<HTMLElement>) => void
}

const segmentedControlItemCases: Record<
  keyof SegmentedControlContractItem,
  SegmentedControlItemCase
> = {
  value: {
    items: [{ value: "a" }, { value: "b" }],
    expectRendered: (radios) => expect(radios).toHaveLength(2),
  },
  label: {
    items: [{ value: "a", label: "Alpha" }],
    expectRendered: (radios) => expect(radios[0]).toHaveTextContent("Alpha"),
  },
  disabled: {
    items: [{ value: "a", label: "Alpha", disabled: true }],
    expectRendered: (radios) => expect(radios[0]).toHaveAttribute("aria-disabled", "true"),
  },
  ariaLabel: {
    items: [{ value: "a", ariaLabel: "Alpha option" }],
    expectRendered: (radios) => expect(radios[0]).toHaveAttribute("aria-label", "Alpha option"),
  },
}

const segmentedControlOptionCases: Record<
  keyof SegmentedControlOptions,
  SegmentedControlOptionCase
> = {
  value: {
    options: { value: "b" },
    expectRendered: (root) =>
      expect(root.querySelector('[role="radio"][aria-checked="true"]')).toHaveTextContent("Beta"),
  },
  disabled: {
    options: { disabled: true },
    expectRendered: (root) => {
      expect(root).toHaveAttribute("aria-disabled", "true")
      expect(root).toHaveClass("mw-segmented-control--disabled")
    },
  },
  ariaLabel: {
    options: { ariaLabel: "Layout" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-label", "Layout"),
  },
  ariaLabelledBy: {
    options: { ariaLabelledBy: "layout-heading" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-labelledby", "layout-heading"),
  },
  ariaDescribedBy: {
    options: { ariaDescribedBy: "layout-help" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-describedby", "layout-help"),
  },
  label: {
    options: { label: "Layout mode" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-label", "Layout mode"),
  },
  variant: {
    options: { variant: "pill" },
    expectRendered: (root) => expect(root).toHaveClass("mw-segmented-control--pill"),
  },
  size: {
    options: { size: "sm" },
    expectRendered: (root) => expect(root).toHaveClass("mw-segmented-control--sm"),
  },
  fullWidth: {
    options: { fullWidth: true },
    expectRendered: (root) => expect(root).toHaveClass("mw-segmented-control--full-width"),
  },
}

export function runSegmentedControlContract(
  adapterName: string,
  harness: SegmentedControlContractHarness,
): void {
  describe(`SegmentedControl contract: ${adapterName}`, () => {
    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(segmentedControlOptionCases))(
        "%s",
        async (_optionName, optionCase) => {
          await harness.renderSegmentedControlOptions(optionCase.options)

          const root = harness.getSegmentedControlRoot()
          expect(root).toBeInTheDocument()
          optionCase.expectRendered(root)
        },
      )
    })

    describe("every item option reaches the DOM", () => {
      it.each(Object.entries(segmentedControlItemCases))("%s", async (_optionName, itemCase) => {
        await harness.renderSegmentedControlItems(itemCase.items)

        const root = harness.getSegmentedControlRoot()
        itemCase.expectRendered(root.querySelectorAll<HTMLElement>('[role="radio"]'))
      })
    })
  })
}
