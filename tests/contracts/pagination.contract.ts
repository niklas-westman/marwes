/**
 * Shared contract for the Pagination atom — every core option reaches the DOM in each adapter.
 */
import type { PaginationOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface PaginationContractHarness {
  /** Renders the base component with raw core options. */
  renderPaginationOptions(options: PaginationOptions): Promise<void> | void
  getPaginationRoot(): HTMLElement
}

type PaginationOptionCase = {
  options: PaginationOptions
  expectRendered: (root: HTMLElement) => void
}

// Exhaustive on purpose: a new core PaginationOptions field fails to compile until every adapter's
// handling of it is described by a case.
function pageButtonLabels(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll("ul button")).map((button) => button.textContent ?? "")
}

const longRange = { pageCount: 20, page: 10 } as const

const paginationOptionCases: Record<keyof PaginationOptions, PaginationOptionCase> = {
  page: {
    options: { pageCount: 10, page: 4 },
    expectRendered: (root) =>
      expect(root.querySelector('[aria-current="page"]')).toHaveTextContent("4"),
  },
  pageCount: {
    options: { pageCount: 3, page: 1 },
    expectRendered: (root) => expect(pageButtonLabels(root)).toEqual(["1", "2", "3"]),
  },
  siblingCount: {
    options: { ...longRange, siblingCount: 2 },
    expectRendered: (root) => expect(pageButtonLabels(root)).toContain("12"),
  },
  boundaryCount: {
    options: { ...longRange, boundaryCount: 2 },
    expectRendered: (root) =>
      expect(pageButtonLabels(root)).toEqual(expect.arrayContaining(["2", "19"])),
  },
  maxVisibleItems: {
    options: { ...longRange, maxVisibleItems: 5 },
    expectRendered: (root) => expect(root.querySelectorAll("ul li").length).toBeLessThanOrEqual(5),
  },
  controlDisplay: {
    options: { pageCount: 5, page: 3, controlDisplay: "icon" },
    expectRendered: (root) => expect(root).toHaveAttribute("data-control-display", "icon"),
  },
  showPrevNext: {
    options: {
      pageCount: 5,
      page: 3,
      controlDisplay: "label",
      showPrevNext: false,
      showFirstLast: true,
    },
    expectRendered: (root) => {
      expect(root).not.toHaveTextContent("Previous")
      expect(root).toHaveTextContent("First")
    },
  },
  showFirstLast: {
    options: {
      pageCount: 5,
      page: 3,
      controlDisplay: "label",
      showFirstLast: false,
      showPrevNext: true,
    },
    expectRendered: (root) => {
      expect(root).not.toHaveTextContent("First")
      expect(root).toHaveTextContent("Previous")
    },
  },
  disabled: {
    options: { pageCount: 5, page: 3, disabled: true },
    expectRendered: (root) => {
      const buttons = Array.from(root.querySelectorAll("button"))
      expect(buttons.length).toBeGreaterThan(0)
      for (const button of buttons) expect(button).toBeDisabled()
    },
  },
  ariaLabel: {
    options: { pageCount: 5, ariaLabel: "Results pages" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-label", "Results pages"),
  },
  ariaLabelledBy: {
    options: { pageCount: 5, ariaLabelledBy: "results-heading" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-labelledby", "results-heading"),
  },
  ariaDescribedBy: {
    options: { pageCount: 5, ariaDescribedBy: "results-help" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-describedby", "results-help"),
  },
  firstLabel: {
    options: {
      pageCount: 5,
      page: 3,
      controlDisplay: "label",
      showFirstLast: true,
      firstLabel: "Start",
    },
    expectRendered: (root) => expect(root).toHaveTextContent("Start"),
  },
  previousLabel: {
    options: { pageCount: 5, page: 3, controlDisplay: "label", previousLabel: "Back" },
    expectRendered: (root) => expect(root).toHaveTextContent("Back"),
  },
  nextLabel: {
    options: { pageCount: 5, page: 3, controlDisplay: "label", nextLabel: "Forward" },
    expectRendered: (root) => expect(root).toHaveTextContent("Forward"),
  },
  lastLabel: {
    options: {
      pageCount: 5,
      page: 3,
      controlDisplay: "label",
      showFirstLast: true,
      lastLabel: "End",
    },
    expectRendered: (root) => expect(root).toHaveTextContent("End"),
  },
  getItemAriaLabel: {
    options: {
      pageCount: 5,
      page: 3,
      getItemAriaLabel: ({ type, page }) => (type === "page" ? `Go to page ${page}` : type),
    },
    expectRendered: (root) =>
      expect(root.querySelector('button[aria-label="Go to page 2"]')).toBeInTheDocument(),
  },
}

export function runPaginationContract(
  adapterName: string,
  harness: PaginationContractHarness,
): void {
  describe(`Pagination contract: ${adapterName}`, () => {
    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(paginationOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderPaginationOptions(optionCase.options)

        const root = harness.getPaginationRoot()
        expect(root).toBeInTheDocument()
        optionCase.expectRendered(root)
      })
    })
  })
}
