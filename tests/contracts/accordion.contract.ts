/**
 * Shared contract for the Accordion atom — trigger/panel wiring,
 * disabled toggle suppression, labeled groups, and description text connection.
 */
import { describe, expect, it } from "vitest"

export type AccordionContractItem = {
  value: string
  title: string
  content: string
  disabled?: boolean
}

export type AccordionContractHarness = {
  renderAccordion(args?: {
    title?: string
    open?: boolean
    disabled?: boolean
    onToggle?: () => void
  }): Promise<void> | void
  renderAccordionField(args: {
    label: string
    description?: string
    error?: string
    ariaDescribedBy?: string
    items?: AccordionContractItem[]
    multiple?: boolean
    defaultOpenItems?: string[]
    openItems?: string[]
    onOpenItemsChange?: (openItems: string[]) => void
    disabled?: boolean
  }): Promise<void> | void
  getByRole(role: "button" | "group" | "region", options?: { name?: RegExp | string }): HTMLElement
  getAllByRole(role: "button"): HTMLElement[]
  getByText(text: string): HTMLElement
  click(element: HTMLElement): Promise<void>
}

const defaultItems: AccordionContractItem[] = [
  { value: "shipping", title: "Shipping", content: "Shipping details" },
  { value: "billing", title: "Billing", content: "Billing details" },
  { value: "returns", title: "Returns", content: "Returns policy" },
]

export function runAccordionContract(adapterName: string, harness: AccordionContractHarness): void {
  describe(`Accordion contract: ${adapterName}`, () => {
    it("wires the trigger to its controlled region", async () => {
      await harness.renderAccordion({
        title: "Shipping details",
        open: true,
      })

      const trigger = harness.getByRole("button", { name: /shipping details/i })
      const panel = harness.getByRole("region", { name: /shipping details/i })

      expect(trigger).toHaveAttribute("aria-expanded", "true")
      expect(trigger.id).toBeTruthy()
      expect(panel.id).toBeTruthy()
      expect(trigger).toHaveAttribute("aria-controls", panel.id)
      expect(panel).toHaveAttribute("aria-labelledby", trigger.id)
    })

    it("disabled accordion does not trigger toggles", async () => {
      let calls = 0

      await harness.renderAccordion({
        title: "Shipping details",
        disabled: true,
        onToggle: () => {
          calls += 1
        },
      })

      const trigger = harness.getByRole("button", { name: /shipping details/i })

      expect(trigger).toBeDisabled()
      expect(trigger).toHaveAttribute("aria-disabled", "true")

      await harness.click(trigger)

      expect(calls).toBe(0)
      expect(trigger).toHaveAttribute("aria-expanded", "false")
    })

    it("renders a labeled accordion group", async () => {
      await harness.renderAccordionField({
        label: "Order info",
        items: defaultItems,
      })

      const group = harness.getByRole("group", { name: /order info/i })
      const buttons = harness.getAllByRole("button")

      expect(group).toBeInTheDocument()
      expect(buttons).toHaveLength(3)
    })

    it("connects description text through aria-describedby on the group", async () => {
      await harness.renderAccordionField({
        label: "Order info",
        description: "Expand sections to view details",
        items: defaultItems,
      })

      const group = harness.getByRole("group", { name: /order info/i })
      const descriptionTextNode = harness.getByText("Expand sections to view details")
      const descriptionElement = descriptionTextNode.closest("[id]") as HTMLElement | null
      const describedBy = group.getAttribute("aria-describedby") ?? ""

      expect(descriptionElement).not.toBeNull()
      expect(descriptionElement?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(descriptionElement?.id ?? "")
    })

    it("connects error text through aria-describedby and marks the group invalid", async () => {
      await harness.renderAccordionField({
        label: "Order info",
        error: "Please review all sections",
        items: defaultItems,
      })

      const group = harness.getByRole("group", { name: /order info/i })
      const errorTextNode = harness.getByText("Please review all sections")
      const errorElement = errorTextNode.closest('[aria-live="polite"]') as HTMLElement | null
      const describedBy = group.getAttribute("aria-describedby") ?? ""

      expect(group).toHaveAttribute("aria-invalid", "true")
      expect(errorElement).not.toBeNull()
      expect(errorElement?.id).toBeTruthy()
      expect(describedBy.split(/\s+/)).toContain(errorElement?.id ?? "")
    })

    it("single-open mode closes other items when a new item opens", async () => {
      await harness.renderAccordionField({
        label: "Order info",
        items: defaultItems,
        multiple: false,
        defaultOpenItems: ["shipping"],
      })

      const shippingButton = harness.getByRole("button", { name: /shipping/i })
      const billingButton = harness.getByRole("button", { name: /billing/i })

      expect(shippingButton).toHaveAttribute("aria-expanded", "true")

      await harness.click(billingButton)

      expect(billingButton).toHaveAttribute("aria-expanded", "true")
      expect(shippingButton).toHaveAttribute("aria-expanded", "false")
    })

    it("multi-open mode keeps multiple items open", async () => {
      await harness.renderAccordionField({
        label: "Order info",
        items: defaultItems,
        multiple: true,
        defaultOpenItems: ["shipping"],
      })

      const shippingButton = harness.getByRole("button", { name: /shipping/i })
      const billingButton = harness.getByRole("button", { name: /billing/i })

      await harness.click(billingButton)

      expect(shippingButton).toHaveAttribute("aria-expanded", "true")
      expect(billingButton).toHaveAttribute("aria-expanded", "true")
    })

    it("controlled openItems remain source-of-truth while onOpenItemsChange receives the next value", async () => {
      const changes: string[][] = []

      await harness.renderAccordionField({
        label: "Order info",
        items: defaultItems,
        openItems: ["shipping"],
        onOpenItemsChange: (openItems) => {
          changes.push(openItems)
        },
      })

      const shippingButton = harness.getByRole("button", { name: /shipping/i })
      const billingButton = harness.getByRole("button", { name: /billing/i })

      await harness.click(billingButton)

      expect(changes).toEqual([["shipping", "billing"]])
      expect(shippingButton).toHaveAttribute("aria-expanded", "true")
      expect(billingButton).toHaveAttribute("aria-expanded", "false")
    })

    it("disabled accordion groups prevent all item toggles", async () => {
      await harness.renderAccordionField({
        label: "Order info",
        items: defaultItems,
        disabled: true,
      })

      const shippingButton = harness.getByRole("button", { name: /shipping/i })

      expect(shippingButton).toBeDisabled()

      await harness.click(shippingButton)

      expect(shippingButton).toHaveAttribute("aria-expanded", "false")
    })

    it("treats empty description and error strings as absent", async () => {
      await harness.renderAccordionField({
        label: "Order info",
        description: "",
        error: "",
        ariaDescribedBy: "external-help",
        items: defaultItems,
      })

      const group = harness.getByRole("group", { name: /order info/i })

      expect(group).toHaveAttribute("aria-describedby", "external-help")
      expect(group).not.toHaveAttribute("aria-invalid", "true")
    })
  })
}
