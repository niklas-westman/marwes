/**
 * Vue adapter: Tests Accordion purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { FAQAccordion, SectionsAccordion, SettingsAccordion } from "../variants"

function renderWithProvider(component: unknown, props: Record<string, unknown>) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component as never, props) })
      },
    }),
  )
}

const testItems = [
  { value: "a", title: "Alpha", content: "Alpha content" },
  { value: "b", title: "Beta", content: "Beta content" },
  { value: "c", title: "Gamma", content: "Gamma content" },
]

describe("FAQAccordion", () => {
  it("renders all items as accordion triggers", () => {
    renderWithProvider(FAQAccordion, { label: "FAQ", items: testItems })

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("has data-purpose=faq", () => {
    renderWithProvider(FAQAccordion, { label: "FAQ", items: testItems })

    const group = screen.getByRole("group")
    expect(group.getAttribute("data-purpose")).toBe("faq")
  })

  it("enforces single-open by default", async () => {
    const user = userEvent.setup()
    renderWithProvider(FAQAccordion, {
      label: "FAQ",
      items: testItems,
      defaultOpenItems: ["a"],
    })

    const alphaButton = screen.getByRole("button", { name: /alpha/i })
    const betaButton = screen.getByRole("button", { name: /beta/i })

    expect(alphaButton.getAttribute("aria-expanded")).toBe("true")

    await user.click(betaButton)

    expect(betaButton.getAttribute("aria-expanded")).toBe("true")
    expect(alphaButton.getAttribute("aria-expanded")).toBe("false")
  })
})

describe("SettingsAccordion", () => {
  it("renders all items as accordion triggers", () => {
    renderWithProvider(SettingsAccordion, { label: "Settings", items: testItems })

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("has data-purpose=settings", () => {
    renderWithProvider(SettingsAccordion, { label: "Settings", items: testItems })

    const group = screen.getByRole("group")
    expect(group.getAttribute("data-purpose")).toBe("settings")
  })

  it("allows multiple items open simultaneously", async () => {
    const user = userEvent.setup()
    renderWithProvider(SettingsAccordion, {
      label: "Settings",
      items: testItems,
      defaultOpenItems: ["a"],
    })

    const alphaButton = screen.getByRole("button", { name: /alpha/i })
    const betaButton = screen.getByRole("button", { name: /beta/i })

    await user.click(betaButton)

    expect(alphaButton.getAttribute("aria-expanded")).toBe("true")
    expect(betaButton.getAttribute("aria-expanded")).toBe("true")
  })
})

describe("SectionsAccordion", () => {
  it("renders all items as accordion triggers", () => {
    renderWithProvider(SectionsAccordion, { label: "Sections", items: testItems })

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("has data-purpose=sections", () => {
    renderWithProvider(SectionsAccordion, { label: "Sections", items: testItems })

    const group = screen.getByRole("group")
    expect(group.getAttribute("data-purpose")).toBe("sections")
  })

  it("defaults to multi-open", async () => {
    const user = userEvent.setup()
    renderWithProvider(SectionsAccordion, {
      label: "Sections",
      items: testItems,
      defaultOpenItems: ["a"],
    })

    const alphaButton = screen.getByRole("button", { name: /alpha/i })
    const betaButton = screen.getByRole("button", { name: /beta/i })

    await user.click(betaButton)

    expect(alphaButton.getAttribute("aria-expanded")).toBe("true")
    expect(betaButton.getAttribute("aria-expanded")).toBe("true")
  })

  it("can be overridden to single-open", async () => {
    const user = userEvent.setup()
    renderWithProvider(SectionsAccordion, {
      label: "Sections",
      items: testItems,
      defaultOpenItems: ["a"],
      multiple: false,
    })

    const alphaButton = screen.getByRole("button", { name: /alpha/i })
    const betaButton = screen.getByRole("button", { name: /beta/i })

    await user.click(betaButton)

    expect(betaButton.getAttribute("aria-expanded")).toBe("true")
    expect(alphaButton.getAttribute("aria-expanded")).toBe("false")
  })
})
