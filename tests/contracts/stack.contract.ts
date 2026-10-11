/**
 * Shared contract for the Stack family — every declared layout value reaches the DOM as a
 * resolved data attribute and, for gap/padding, as a token-backed --mw-stack-* var.
 * React, Vue and Svelte all run this contract so the declared surface cannot drift.
 */
import {
  type StackItemOptions,
  type StackItemSizingOptions,
  type StackOptions,
  stackAlignItemsValues,
  stackAsValues,
  stackDirections,
  stackItemAsValues,
  stackJustifyContentValues,
  stackSizings,
  stackWraps,
} from "@marwes-ui/core"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

export type StackContractHarness = {
  /**
   * Renders one Stack. `style` uses kebab-case CSS property names (custom properties
   * included); each harness serialises it to its framework's style input.
   */
  renderStack(args: {
    options?: StackOptions
    attributes?: Record<string, string>
    style?: Record<string, string>
    children?: string
  }): Promise<void> | void
  renderStackItem(args: {
    options?: StackItemOptions
    attributes?: Record<string, string>
  }): Promise<void> | void
  /** Stack as="ul" with two StackItem as="li" children reading "First" and "Second". */
  renderList(): Promise<void> | void
  /** A Stack containing a nested Stack (with the given sizing) followed by a StackItem. */
  renderNested(sizing: StackItemSizingOptions): Promise<void> | void
  getStack(): HTMLElement
  getStackItem(): HTMLElement
}

type StackOptionCase<Options> = {
  options: Options
  expectRendered: (element: HTMLElement) => void
}

function expectVar(element: HTMLElement, name: string, token: string): void {
  expect(element.style.getPropertyValue(name)).toBe(`var(--mw-spacing-${token})`)
}

// Exhaustive on purpose: a new core StackOptions field fails to compile until every adapter's
// handling of it is described by a case.
const stackOptionCases: Record<keyof StackOptions, StackOptionCase<StackOptions>> = {
  direction: {
    options: { direction: "row" },
    expectRendered: (element) => expect(element).toHaveAttribute("data-direction", "row"),
  },
  gap: {
    options: { gap: "sp-16" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-row-gap", "sp-16")
      expect(element).toHaveAttribute("data-column-gap", "sp-16")
      expectVar(element, "--mw-stack-row-gap", "sp-16")
      expectVar(element, "--mw-stack-column-gap", "sp-16")
    },
  },
  rowGap: {
    options: { rowGap: "sp-24" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-row-gap", "sp-24")
      expectVar(element, "--mw-stack-row-gap", "sp-24")
    },
  },
  columnGap: {
    options: { columnGap: "sp-32" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-column-gap", "sp-32")
      expectVar(element, "--mw-stack-column-gap", "sp-32")
    },
  },
  padding: {
    options: { padding: "sp-8" },
    expectRendered: (element) => {
      for (const side of ["top", "right", "bottom", "left"]) {
        expect(element).toHaveAttribute(`data-padding-${side}`, "sp-8")
        expectVar(element, `--mw-stack-padding-${side}`, "sp-8")
      }
    },
  },
  paddingX: {
    options: { paddingX: "sp-12" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-padding-left", "sp-12")
      expect(element).toHaveAttribute("data-padding-right", "sp-12")
      expect(element).toHaveAttribute("data-padding-top", "sp-0")
      expectVar(element, "--mw-stack-padding-left", "sp-12")
    },
  },
  paddingY: {
    options: { paddingY: "sp-4" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-padding-top", "sp-4")
      expect(element).toHaveAttribute("data-padding-bottom", "sp-4")
      expect(element).toHaveAttribute("data-padding-left", "sp-0")
      expectVar(element, "--mw-stack-padding-bottom", "sp-4")
    },
  },
  paddingTop: {
    options: { paddingTop: "sp-40" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-padding-top", "sp-40")
      expectVar(element, "--mw-stack-padding-top", "sp-40")
    },
  },
  paddingRight: {
    options: { paddingRight: "sp-48" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-padding-right", "sp-48")
      expectVar(element, "--mw-stack-padding-right", "sp-48")
    },
  },
  paddingBottom: {
    options: { paddingBottom: "sp-56" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-padding-bottom", "sp-56")
      expectVar(element, "--mw-stack-padding-bottom", "sp-56")
    },
  },
  paddingLeft: {
    options: { paddingLeft: "sp-64" },
    expectRendered: (element) => {
      expect(element).toHaveAttribute("data-padding-left", "sp-64")
      expectVar(element, "--mw-stack-padding-left", "sp-64")
    },
  },
  alignItems: {
    options: { alignItems: "center" },
    expectRendered: (element) => expect(element).toHaveAttribute("data-align-items", "center"),
  },
  justifyContent: {
    options: { justifyContent: "space-between" },
    expectRendered: (element) =>
      expect(element).toHaveAttribute("data-justify-content", "space-between"),
  },
  wrap: {
    options: { wrap: "wrap" },
    expectRendered: (element) => expect(element).toHaveAttribute("data-wrap", "wrap"),
  },
  as: {
    options: { as: "section" },
    expectRendered: (element) => expect(element.tagName).toBe("SECTION"),
  },
  horizontalSizing: {
    options: { horizontalSizing: "fill" },
    expectRendered: (element) => expect(element).toHaveAttribute("data-horizontal-sizing", "fill"),
  },
  verticalSizing: {
    options: { verticalSizing: "fix" },
    expectRendered: (element) => expect(element).toHaveAttribute("data-vertical-sizing", "fix"),
  },
}

const stackItemOptionCases: Record<keyof StackItemOptions, StackOptionCase<StackItemOptions>> = {
  as: {
    options: { as: "li" },
    expectRendered: (element) => expect(element.tagName).toBe("LI"),
  },
  horizontalSizing: {
    options: { horizontalSizing: "fill" },
    expectRendered: (element) => expect(element).toHaveAttribute("data-horizontal-sizing", "fill"),
  },
  verticalSizing: {
    options: { verticalSizing: "fill" },
    expectRendered: (element) => expect(element).toHaveAttribute("data-vertical-sizing", "fill"),
  },
}

async function expectRenderToThrowTypeError(render: () => Promise<void> | void): Promise<void> {
  await expect(Promise.resolve().then(render)).rejects.toThrow(TypeError)
}

export function runStackContract(adapterName: string, harness: StackContractHarness): void {
  describe(`Stack contract: ${adapterName}`, () => {
    it("renders a div stack with every resolved default as a data attribute", async () => {
      await harness.renderStack({})

      const stack = harness.getStack()
      expect(stack.tagName).toBe("DIV")
      expect(stack.className).toContain("mw-stack")
      expect(stack).toHaveAttribute("data-component", "stack")
      expect(stack).toHaveAttribute("data-direction", "column")
      expect(stack).toHaveAttribute("data-row-gap", "sp-0")
      expect(stack).toHaveAttribute("data-column-gap", "sp-0")
      for (const side of ["top", "right", "bottom", "left"]) {
        expect(stack).toHaveAttribute(`data-padding-${side}`, "sp-0")
      }
      expect(stack).toHaveAttribute("data-align-items", "start")
      expect(stack).toHaveAttribute("data-justify-content", "start")
      expect(stack).toHaveAttribute("data-wrap", "nowrap")
      expect(stack).toHaveAttribute("data-horizontal-sizing", "hug")
      expect(stack).toHaveAttribute("data-vertical-sizing", "hug")
    })

    describe("every core Stack option reaches the DOM", () => {
      it.each(Object.entries(stackOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderStack({ options: optionCase.options })
        optionCase.expectRendered(harness.getStack())
      })
    })

    describe("every core StackItem option reaches the DOM", () => {
      it.each(Object.entries(stackItemOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderStackItem({ options: optionCase.options })
        optionCase.expectRendered(harness.getStackItem())
      })
    })

    describe("every allowed value reaches its data attribute", () => {
      it.each(stackDirections)("direction %s", async (direction) => {
        await harness.renderStack({ options: { direction } })
        expect(harness.getStack()).toHaveAttribute("data-direction", direction)
      })

      it.each(stackAlignItemsValues)("alignItems %s", async (alignItems) => {
        await harness.renderStack({ options: { alignItems } })
        expect(harness.getStack()).toHaveAttribute("data-align-items", alignItems)
      })

      it.each(stackJustifyContentValues)("justifyContent %s", async (justifyContent) => {
        await harness.renderStack({ options: { justifyContent } })
        expect(harness.getStack()).toHaveAttribute("data-justify-content", justifyContent)
      })

      it.each(stackWraps)("wrap %s", async (wrap) => {
        await harness.renderStack({ options: { wrap } })
        expect(harness.getStack()).toHaveAttribute("data-wrap", wrap)
      })

      it.each(stackSizings)("Stack and StackItem sizing %s", async (sizing) => {
        await harness.renderStack({
          options: { horizontalSizing: sizing, verticalSizing: sizing },
        })
        expect(harness.getStack()).toHaveAttribute("data-horizontal-sizing", sizing)
        expect(harness.getStack()).toHaveAttribute("data-vertical-sizing", sizing)
      })

      it.each(stackSizings)("StackItem sizing %s", async (sizing) => {
        await harness.renderStackItem({
          options: { horizontalSizing: sizing, verticalSizing: sizing },
        })
        expect(harness.getStackItem()).toHaveAttribute("data-horizontal-sizing", sizing)
        expect(harness.getStackItem()).toHaveAttribute("data-vertical-sizing", sizing)
      })

      it.each(stackAsValues)("Stack as %s", async (as) => {
        await harness.renderStack({ options: { as } })
        expect(harness.getStack().tagName).toBe(as.toUpperCase())
      })

      it.each(stackItemAsValues)("StackItem as %s", async (as) => {
        await harness.renderStackItem({ options: { as } })
        expect(harness.getStackItem().tagName).toBe(as.toUpperCase())
      })
    })

    it("lets rowGap/columnGap win over gap", async () => {
      await harness.renderStack({ options: { gap: "sp-16", rowGap: "sp-8" } })

      const stack = harness.getStack()
      expect(stack).toHaveAttribute("data-row-gap", "sp-8")
      expect(stack).toHaveAttribute("data-column-gap", "sp-16")
      expectVar(stack, "--mw-stack-row-gap", "sp-8")
      expectVar(stack, "--mw-stack-column-gap", "sp-16")
    })

    it("resolves padding as side over axis over shorthand", async () => {
      await harness.renderStack({
        options: { padding: "sp-4", paddingX: "sp-8", paddingY: "sp-12", paddingTop: "sp-16" },
      })

      const stack = harness.getStack()
      expect(stack).toHaveAttribute("data-padding-top", "sp-16")
      expect(stack).toHaveAttribute("data-padding-bottom", "sp-12")
      expect(stack).toHaveAttribute("data-padding-left", "sp-8")
      expect(stack).toHaveAttribute("data-padding-right", "sp-8")
    })

    it("emits only token-backed var(--mw-spacing-sp-*) values for the stack vars", async () => {
      await harness.renderStack({ options: { gap: "sp-120", padding: "sp-2" } })

      const stack = harness.getStack()
      for (const name of [
        "--mw-stack-row-gap",
        "--mw-stack-column-gap",
        "--mw-stack-padding-top",
        "--mw-stack-padding-right",
        "--mw-stack-padding-bottom",
        "--mw-stack-padding-left",
      ]) {
        expect(stack.style.getPropertyValue(name)).toMatch(/^var\(--mw-spacing-sp-\d+\)$/)
      }
    })

    it("keeps the token-backed vars when a consumer style tries to override them", async () => {
      await harness.renderStack({
        options: { gap: "sp-16", direction: "column" },
        style: { "--mw-stack-row-gap": "3px", "flex-direction": "row", color: "red" },
      })

      const stack = harness.getStack()
      expectVar(stack, "--mw-stack-row-gap", "sp-16")
      // Other style keys pass through. The declared data-direction still reports the declared
      // value, so the divergence is detectable by comparing computed CSS with data-*.
      expect(stack.style.flexDirection).toBe("row")
      expect(stack.style.color).toBe("red")
      expect(stack).toHaveAttribute("data-direction", "column")
    })

    it("passes native attributes through and keeps data-component owned by the recipe", async () => {
      await harness.renderStack({
        attributes: {
          "aria-label": "Filters",
          id: "filters",
          "data-testid": "filters-stack",
          "data-component": "custom",
        },
      })

      const stack = harness.getStack()
      expect(stack).toHaveAttribute("aria-label", "Filters")
      expect(stack).toHaveAttribute("id", "filters")
      expect(stack).toHaveAttribute("data-testid", "filters-stack")
      expect(stack).toHaveAttribute("data-component", "stack")
    })

    it("passes native attributes through on StackItem", async () => {
      await harness.renderStackItem({
        attributes: { id: "item", "data-testid": "stack-item", "data-component": "custom" },
      })

      const item = harness.getStackItem()
      expect(item).toHaveAttribute("id", "item")
      expect(item).toHaveAttribute("data-testid", "stack-item")
      expect(item).toHaveAttribute("data-component", "stack-item")
    })

    it("renders text children", async () => {
      await harness.renderStack({ children: "Stack content" })
      expect(harness.getStack()).toHaveTextContent("Stack content")
    })

    it("renders a ul of li items in source order", async () => {
      await harness.renderList()

      const stack = harness.getStack()
      expect(stack.tagName).toBe("UL")
      expect(stack.className).toContain("mw-stack")
      const items = Array.from(stack.children) as HTMLElement[]
      expect(items.map((item) => item.tagName)).toEqual(["LI", "LI"])
      expect(items.map((item) => item.textContent?.trim())).toEqual(["First", "Second"])
      for (const item of items) {
        expect(item).toHaveAttribute("data-component", "stack-item")
        expect(item.className).toContain("mw-stack-item")
      }
    })

    it("emits the declared sizing on a nested Stack", async () => {
      await harness.renderNested({ horizontalSizing: "fill", verticalSizing: "fix" })

      const outer = harness.getStack()
      const children = Array.from(outer.children) as HTMLElement[]
      expect(children.map((child) => child.getAttribute("data-component"))).toEqual([
        "stack",
        "stack-item",
      ])
      expect(children[0]).toHaveAttribute("data-horizontal-sizing", "fill")
      expect(children[0]).toHaveAttribute("data-vertical-sizing", "fix")
      expect(children[1]).toHaveAttribute("data-horizontal-sizing", "hug")
      expect(children[1]).toHaveAttribute("data-vertical-sizing", "hug")
    })

    it("emits hug/hug on a nested Stack when sizing is undeclared", async () => {
      await harness.renderNested({})

      const nested = harness.getStack().children[0] as HTMLElement
      expect(nested).toHaveAttribute("data-component", "stack")
      expect(nested).toHaveAttribute("data-horizontal-sizing", "hug")
      expect(nested).toHaveAttribute("data-vertical-sizing", "hug")
    })

    describe("rejects values outside the allowed sets", () => {
      // React's dev renderer re-dispatches render errors as window error events; cancelling
      // them keeps the expected TypeError from being reported as an uncaught exception.
      const cancelWindowError = (event: ErrorEvent) => event.preventDefault()

      beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => undefined)
        vi.spyOn(console, "warn").mockImplementation(() => undefined)
        window.addEventListener("error", cancelWindowError)
      })

      afterEach(() => {
        window.removeEventListener("error", cancelWindowError)
        vi.restoreAllMocks()
      })

      it("throws a TypeError for a non-token gap", async () => {
        await expectRenderToThrowTypeError(() =>
          harness.renderStack({ options: { gap: "12px" } as unknown as StackOptions }),
        )
      })

      it("throws a TypeError for a non-token padding", async () => {
        await expectRenderToThrowTypeError(() =>
          harness.renderStack({ options: { paddingTop: "sp-6" } as unknown as StackOptions }),
        )
      })

      it("throws a TypeError for an invalid enum value", async () => {
        await expectRenderToThrowTypeError(() =>
          harness.renderStack({
            options: { direction: "horizontal" } as unknown as StackOptions,
          }),
        )
      })

      it("throws a TypeError for alignItems stretch, which is declared per child as fill", async () => {
        await expectRenderToThrowTypeError(() =>
          harness.renderStack({ options: { alignItems: "stretch" } as unknown as StackOptions }),
        )
      })

      it("throws a TypeError for an invalid as", async () => {
        await expectRenderToThrowTypeError(() =>
          harness.renderStack({ options: { as: "script" } as unknown as StackOptions }),
        )
      })
    })
  })
}
