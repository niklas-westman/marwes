import { describe, expect, it } from "vitest"

export type TooltipContractHarness = {
  renderTooltip(args?: {
    id?: string
    children?: string
  }): Promise<void> | void
  renderTooltipGroup(args?: {
    content?: string
    triggerLabel?: string
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    tooltipId?: string
  }): Promise<void> | void
  getByRole(role: "tooltip" | "button", options?: { name?: RegExp | string }): HTMLElement
  queryByRole(role: "tooltip" | "button", options?: { name?: RegExp | string }): HTMLElement | null
  getByText(text: string): HTMLElement
  hover(element: HTMLElement): Promise<void>
  unhover(element: HTMLElement): Promise<void>
  click(element: HTMLElement): Promise<void>
  tab(): Promise<void>
  keyboard(text: string): Promise<void>
}

export function runTooltipContract(adapterName: string, harness: TooltipContractHarness): void {
  describe(`Tooltip contract: ${adapterName}`, () => {
    it("renders the tooltip atom with role tooltip and preserves the provided id", async () => {
      await harness.renderTooltip({
        id: "billing-tooltip",
        children: "Helpful billing context",
      })

      const tooltip = harness.getByRole("tooltip")

      expect(tooltip.tagName).toBe("SPAN")
      expect(tooltip).toHaveAttribute("id", "billing-tooltip")
      expect(tooltip).toHaveAttribute("data-component", "tooltip")
      expect(harness.getByText("Helpful billing context")).toBeInTheDocument()
    })

    it("names the tooltip trigger from triggerLabel and keeps aria-describedby off while closed", async () => {
      await harness.renderTooltipGroup({
        content: "Helpful billing context",
        triggerLabel: "Show billing help",
      })

      const trigger = harness.getByRole("button", { name: /show billing help/i })

      expect(trigger).toBeInTheDocument()
      expect(trigger).not.toHaveAttribute("aria-describedby")
      expect(harness.queryByRole("tooltip")).toBeNull()
    })

    it("falls back to the default trigger label when none is provided", async () => {
      await harness.renderTooltipGroup({
        content: "Helpful billing context",
      })

      expect(harness.getByRole("button", { name: /show tooltip/i })).toBeInTheDocument()
    })

    it("opens on hover and wires aria-describedby to the tooltip id", async () => {
      await harness.renderTooltipGroup({
        content: "Helpful billing context",
        triggerLabel: "Show billing help",
      })

      const trigger = harness.getByRole("button", { name: /show billing help/i })
      await harness.hover(trigger)

      const tooltip = harness.getByRole("tooltip")

      expect(harness.getByText("Helpful billing context")).toBeInTheDocument()
      expect(tooltip.id).toBeTruthy()
      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id)
    })

    it("opens on focus and closes again when focus leaves the tooltip group", async () => {
      await harness.renderTooltipGroup({
        content: "Helpful billing context",
        triggerLabel: "Show billing help",
      })

      await harness.tab()

      const trigger = harness.getByRole("button", { name: /show billing help/i })
      const tooltip = harness.getByRole("tooltip")

      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id)

      await harness.tab()

      expect(harness.queryByRole("tooltip")).toBeNull()
      expect(trigger).not.toHaveAttribute("aria-describedby")
    })

    it("dismisses on Escape and removes aria-describedby", async () => {
      await harness.renderTooltipGroup({
        content: "Helpful billing context",
        triggerLabel: "Show billing help",
        defaultOpen: true,
      })

      const trigger = harness.getByRole("button", { name: /show billing help/i })
      await harness.click(trigger)
      await harness.keyboard("{Escape}")

      expect(harness.queryByRole("tooltip")).toBeNull()
      expect(trigger).not.toHaveAttribute("aria-describedby")
    })

    it("keeps controlled open state as the source of truth while emitting the next value", async () => {
      const emittedValues: boolean[] = []

      await harness.renderTooltipGroup({
        content: "Helpful billing context",
        triggerLabel: "Show billing help",
        open: true,
        tooltipId: "controlled-tooltip",
        onOpenChange: (open) => {
          emittedValues.push(open)
        },
      })

      const trigger = harness.getByRole("button", { name: /show billing help/i })
      await harness.tab()
      await harness.tab()

      const tooltip = harness.getByRole("tooltip")

      expect(emittedValues).toContain(false)
      expect(tooltip).toHaveAttribute("id", "controlled-tooltip")
      expect(trigger).toHaveAttribute("aria-describedby", "controlled-tooltip")
    })
  })
}
