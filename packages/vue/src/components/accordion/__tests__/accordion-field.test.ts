import userEvent from "@testing-library/user-event"
import { render, screen, within } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h, ref } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { AccordionField, type AccordionFieldProps } from "../accordion-field"

function renderAccordionField(props: AccordionFieldProps & Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(AccordionField as unknown as string, props),
          })
      },
    }),
  )
}

const testItems = [
  { value: "shipping", title: "Shipping", content: "Shipping details" },
  { value: "billing", title: "Billing", content: "Billing details" },
  { value: "returns", title: "Returns", content: "Returns policy" },
]

describe("Vue AccordionField", () => {
  it("renders VNode item content through the canonical content property", () => {
    renderAccordionField({
      label: "Order info",
      items: [
        {
          value: "shipping",
          title: "Shipping",
          content: h("strong", "Shipping details"),
        },
      ],
    })

    expect(screen.getByText("Shipping details").tagName).toBe("STRONG")
  })

  it("renders a labeled group with all accordion items", () => {
    renderAccordionField({ label: "Order info", items: testItems })

    const group = screen.getByRole("group", { name: /order info/i })
    expect(group).toBeTruthy()

    const buttons = within(group).getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("defaultOpenItems opens only specified panels on mount", () => {
    renderAccordionField({
      label: "Order info",
      items: testItems,
      defaultOpenItems: ["shipping"],
    })

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    expect(shippingButton.getAttribute("aria-expanded")).toBe("true")

    const billingButton = screen.getByRole("button", { name: /billing/i })
    expect(billingButton.getAttribute("aria-expanded")).toBe("false")
  })

  it("single-open mode: opening one item closes others", async () => {
    const user = userEvent.setup()
    renderAccordionField({
      label: "Order info",
      items: testItems,
      defaultOpenItems: ["shipping"],
      multiple: false,
    })

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    const billingButton = screen.getByRole("button", { name: /billing/i })

    expect(shippingButton.getAttribute("aria-expanded")).toBe("true")

    await user.click(billingButton)

    expect(billingButton.getAttribute("aria-expanded")).toBe("true")
    expect(shippingButton.getAttribute("aria-expanded")).toBe("false")
  })

  it("multi-open mode: multiple items stay open simultaneously", async () => {
    const user = userEvent.setup()
    renderAccordionField({
      label: "Order info",
      items: testItems,
      defaultOpenItems: ["shipping"],
      multiple: true,
    })

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    const billingButton = screen.getByRole("button", { name: /billing/i })

    await user.click(billingButton)

    expect(shippingButton.getAttribute("aria-expanded")).toBe("true")
    expect(billingButton.getAttribute("aria-expanded")).toBe("true")
  })

  it("controlled via v-model: uses modelValue and emits update:modelValue", async () => {
    const user = userEvent.setup()
    const updateHandler = vi.fn()

    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(AccordionField as unknown as string, {
                  label: "Order info",
                  items: testItems,
                  modelValue: ["shipping"],
                  "onUpdate:modelValue": updateHandler,
                }),
            })
        },
      }),
    )

    const billingButton = screen.getByRole("button", { name: /billing/i })
    await user.click(billingButton)

    expect(updateHandler).toHaveBeenCalledWith(["shipping", "billing"])
  })

  it("disabled prevents all toggle interactions", async () => {
    const user = userEvent.setup()
    renderAccordionField({
      label: "Order info",
      items: testItems,
      disabled: true,
    })

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    await user.click(shippingButton)

    expect(shippingButton.getAttribute("aria-expanded")).toBe("false")
  })

  it("wires description into aria-describedby on the group", () => {
    renderAccordionField({
      label: "Order info",
      description: "Expand sections to view details",
      items: testItems,
    })

    const group = screen.getByRole("group")
    const describedBy = group.getAttribute("aria-describedby") ?? ""
    const descriptionText = screen.getByText("Expand sections to view details")
    const descriptionEl = descriptionText.closest("[id]") as HTMLElement | null

    expect(descriptionEl).not.toBeNull()
    expect(describedBy.split(/\s+/)).toContain(descriptionEl?.id ?? "")
  })

  it("shows error with aria-invalid and live region", () => {
    renderAccordionField({
      label: "Order info",
      error: "Please review all sections",
      items: testItems,
    })

    const group = screen.getByRole("group")
    expect(group.getAttribute("aria-invalid")).toBe("true")

    const errorText = screen.getByText("Please review all sections")
    expect(errorText.closest('[aria-live="polite"]')).not.toBeNull()
  })

  it("per-item disabled prevents only that item from toggling", async () => {
    const user = userEvent.setup()
    const mixedItems = [
      { value: "shipping", title: "Shipping", content: "Shipping" },
      { value: "billing", title: "Billing", content: "Billing", disabled: true },
      { value: "returns", title: "Returns", content: "Returns" },
    ]

    renderAccordionField({ label: "Order info", items: mixedItems })

    const shippingButton = screen.getByRole("button", { name: /shipping/i })
    const billingButton = screen.getByRole("button", { name: /billing/i })

    await user.click(shippingButton)
    expect(shippingButton.getAttribute("aria-expanded")).toBe("true")

    await user.click(billingButton)
    expect(billingButton.getAttribute("aria-expanded")).toBe("false")
  })

  it("dataAttributes are spread onto the wrapper", () => {
    renderAccordionField({
      label: "FAQ",
      items: testItems,
      dataAttributes: { "data-purpose": "faq" },
    })

    const group = screen.getByRole("group")
    expect(group.getAttribute("data-purpose")).toBe("faq")
  })
})
