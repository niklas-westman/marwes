/**
 * Svelte adapter: Tests Accordion components — render, class, open state,
 * disabled state, and AccordionField label/error wiring.
 */
import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Accordion from "../lib/components/accordion/Accordion.svelte"
import AccordionField from "../lib/components/accordion/AccordionField.svelte"

describe("Accordion", () => {
  it("renders a button trigger with the title", () => {
    const { container } = render(Accordion, { props: { title: "Section" } })
    const btn = container.querySelector("button")
    expect(btn).not.toBeNull()
    expect(btn?.textContent).toContain("Section")
  })

  it("includes mw-accordion class", () => {
    const { container } = render(Accordion, { props: { title: "Section" } })
    const el = container.querySelector(".mw-accordion")
    expect(el).not.toBeNull()
  })

  it("sets aria-expanded on the trigger", () => {
    const { container } = render(Accordion, { props: { title: "Section", open: false } })
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("aria-expanded")).toBe("false")
  })

  it("shows panel content when open", () => {
    const { container } = render(Accordion, { props: { title: "Section", open: true } })
    const panel = container.querySelector(".mw-accordion__panel")
    expect(panel).not.toBeNull()
    // Panel should not be hidden when open
    expect(panel?.hasAttribute("hidden")).toBe(false)
  })

  it("disables the trigger when disabled", () => {
    const { container } = render(Accordion, { props: { title: "Section", disabled: true } })
    const btn = container.querySelector("button") as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it("fires ontoggle when trigger is clicked", async () => {
    const handler = vi.fn()
    const { container } = render(Accordion, { props: { title: "Section", ontoggle: handler } })
    const btn = container.querySelector("button") as HTMLButtonElement
    await fireEvent.click(btn)
    expect(handler).toHaveBeenCalled()
  })
})

describe("AccordionField", () => {
  const defaultItems = [
    { value: "a", title: "Item A", content: "Content A" },
    { value: "b", title: "Item B", content: "Content B" },
  ]

  it("renders with a label", () => {
    const { container } = render(AccordionField, {
      props: { label: "FAQ", items: defaultItems },
    })
    // AccordionField may use legend or a label element
    expect(container.textContent).toContain("FAQ")
  })

  it("renders accordion items", () => {
    const { container } = render(AccordionField, {
      props: { label: "FAQ", items: defaultItems },
    })
    const buttons = container.querySelectorAll("button")
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it("shows error text when error prop is set", () => {
    const { container } = render(AccordionField, {
      props: { label: "FAQ", items: defaultItems, error: "Required" },
    })
    expect(container.textContent).toContain("Required")
  })

  it("shows description when provided", () => {
    const { container } = render(AccordionField, {
      props: { label: "FAQ", items: defaultItems, description: "Select one" },
    })
    expect(container.textContent).toContain("Select one")
  })
})
