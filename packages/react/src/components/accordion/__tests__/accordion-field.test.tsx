import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { AccordionField } from "../accordion-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

const testItems = [
  { value: "shipping", title: "Shipping", children: <p>Shipping details</p> },
  { value: "billing", title: "Billing", children: <p>Billing details</p> },
  { value: "returns", title: "Returns", children: <p>Returns policy</p> },
]

describe("AccordionField", () => {
  it("renders a labeled group with all accordion items", () => {
    renderWithProvider(<AccordionField label="Order info" items={testItems} />)

    const group = screen.getByRole("group", { name: /order info/i })
    expect(group).toBeTruthy()

    const buttons = within(group).getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("defaultOpenItems opens only specified panels on mount", () => {
    renderWithProvider(
      <AccordionField label="Order info" items={testItems} defaultOpenItems={["shipping"]} />,
    )

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    expect(shippingButton.getAttribute("aria-expanded")).toBe("true")

    const billingButton = screen.getByRole("button", { name: /billing/i })
    expect(billingButton.getAttribute("aria-expanded")).toBe("false")
  })

  it("single-open mode: opening one item closes others", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <AccordionField
        label="Order info"
        items={testItems}
        defaultOpenItems={["shipping"]}
        multiple={false}
      />,
    )

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    const billingButton = screen.getByRole("button", { name: /billing/i })

    expect(shippingButton.getAttribute("aria-expanded")).toBe("true")

    await user.click(billingButton)

    expect(billingButton.getAttribute("aria-expanded")).toBe("true")
    expect(shippingButton.getAttribute("aria-expanded")).toBe("false")
  })

  it("multi-open mode: multiple items stay open simultaneously", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <AccordionField
        label="Order info"
        items={testItems}
        defaultOpenItems={["shipping"]}
        multiple={true}
      />,
    )

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    const billingButton = screen.getByRole("button", { name: /billing/i })

    await user.click(billingButton)

    expect(shippingButton.getAttribute("aria-expanded")).toBe("true")
    expect(billingButton.getAttribute("aria-expanded")).toBe("true")
  })

  it("controlled: uses openItems prop and calls onOpenItemsChange", async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    renderWithProvider(
      <AccordionField
        label="Order info"
        items={testItems}
        openItems={["shipping"]}
        onOpenItemsChange={handleChange}
      />,
    )

    const billingButton = screen.getByRole("button", { name: /billing/i })
    await user.click(billingButton)

    expect(handleChange).toHaveBeenCalledWith(["shipping", "billing"])
  })

  it("disabled prevents all toggle interactions", async () => {
    const user = userEvent.setup()
    renderWithProvider(<AccordionField label="Order info" items={testItems} disabled />)

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    await user.click(shippingButton)

    expect(shippingButton.getAttribute("aria-expanded")).toBe("false")
  })

  it("wires description into aria-describedby on the group", () => {
    renderWithProvider(
      <AccordionField
        label="Order info"
        description="Expand sections to view details"
        items={testItems}
      />,
    )

    const group = screen.getByRole("group")
    const describedBy = group.getAttribute("aria-describedby") ?? ""
    const descriptionText = screen.getByText("Expand sections to view details")
    const descriptionEl = descriptionText.closest("[id]") as HTMLElement | null

    expect(descriptionEl).not.toBeNull()
    expect(describedBy.split(/\s+/)).toContain(descriptionEl?.id ?? "")
  })

  it("shows error with aria-invalid and live region", () => {
    renderWithProvider(
      <AccordionField label="Order info" error="Please review all sections" items={testItems} />,
    )

    const group = screen.getByRole("group")
    expect(group.getAttribute("aria-invalid")).toBe("true")

    const errorText = screen.getByText("Please review all sections")
    expect(errorText.closest('[aria-live="polite"]')).not.toBeNull()
  })

  it("per-item disabled prevents only that item from toggling", async () => {
    const user = userEvent.setup()
    const mixedItems = [
      { value: "shipping", title: "Shipping", children: <p>Shipping</p> },
      { value: "billing", title: "Billing", children: <p>Billing</p>, disabled: true },
      { value: "returns", title: "Returns", children: <p>Returns</p> },
    ]

    renderWithProvider(<AccordionField label="Order info" items={mixedItems} />)

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    const billingButton = screen.getByRole("button", { name: /billing/i })

    await user.click(shippingButton)
    expect(shippingButton.getAttribute("aria-expanded")).toBe("true")

    await user.click(billingButton)
    expect(billingButton.getAttribute("aria-expanded")).toBe("false")
  })

  it("dataAttributes are spread onto the wrapper", () => {
    renderWithProvider(
      <AccordionField label="FAQ" items={testItems} dataAttributes={{ "data-purpose": "faq" }} />,
    )

    const group = screen.getByRole("group")
    expect(group.getAttribute("data-purpose")).toBe("faq")
  })

  it("toggling closed item removes it from open state", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <AccordionField
        label="Order info"
        items={testItems}
        defaultOpenItems={["shipping", "billing"]}
        multiple
      />,
    )

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    await user.click(shippingButton)

    expect(shippingButton.getAttribute("aria-expanded")).toBe("false")

    const billingButton = screen.getByRole("button", { name: /billing/i })
    expect(billingButton.getAttribute("aria-expanded")).toBe("true")
  })
})
