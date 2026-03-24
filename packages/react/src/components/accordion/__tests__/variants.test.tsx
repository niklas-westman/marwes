import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { FAQAccordion, SectionsAccordion, SettingsAccordion } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

const testItems = [
  { value: "a", title: "Alpha", children: <p>Alpha content</p> },
  { value: "b", title: "Beta", children: <p>Beta content</p> },
  { value: "c", title: "Gamma", children: <p>Gamma content</p> },
]

describe("FAQAccordion", () => {
  it("renders all items as accordion triggers", () => {
    renderWithProvider(<FAQAccordion label="FAQ" items={testItems} />)

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("has data-purpose=faq", () => {
    renderWithProvider(<FAQAccordion label="FAQ" items={testItems} />)

    const group = screen.getByRole("group")
    expect(group.getAttribute("data-purpose")).toBe("faq")
  })

  it("enforces single-open by default", async () => {
    const user = userEvent.setup()
    renderWithProvider(<FAQAccordion label="FAQ" items={testItems} defaultOpenItems={["a"]} />)

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
    renderWithProvider(<SettingsAccordion label="Settings" items={testItems} />)

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("has data-purpose=settings", () => {
    renderWithProvider(<SettingsAccordion label="Settings" items={testItems} />)

    const group = screen.getByRole("group")
    expect(group.getAttribute("data-purpose")).toBe("settings")
  })

  it("allows multiple items open simultaneously", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <SettingsAccordion label="Settings" items={testItems} defaultOpenItems={["a"]} />,
    )

    const alphaButton = screen.getByRole("button", { name: /alpha/i })
    const betaButton = screen.getByRole("button", { name: /beta/i })

    await user.click(betaButton)

    expect(alphaButton.getAttribute("aria-expanded")).toBe("true")
    expect(betaButton.getAttribute("aria-expanded")).toBe("true")
  })
})

describe("SectionsAccordion", () => {
  it("renders all items as accordion triggers", () => {
    renderWithProvider(<SectionsAccordion label="Sections" items={testItems} />)

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
  })

  it("has data-purpose=sections", () => {
    renderWithProvider(<SectionsAccordion label="Sections" items={testItems} />)

    const group = screen.getByRole("group")
    expect(group.getAttribute("data-purpose")).toBe("sections")
  })

  it("passes through multiple prop (default multi-open)", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <SectionsAccordion label="Sections" items={testItems} defaultOpenItems={["a"]} />,
    )

    const alphaButton = screen.getByRole("button", { name: /alpha/i })
    const betaButton = screen.getByRole("button", { name: /beta/i })

    await user.click(betaButton)

    expect(alphaButton.getAttribute("aria-expanded")).toBe("true")
    expect(betaButton.getAttribute("aria-expanded")).toBe("true")
  })

  it("can be overridden to single-open", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <SectionsAccordion
        label="Sections"
        items={testItems}
        defaultOpenItems={["a"]}
        multiple={false}
      />,
    )

    const alphaButton = screen.getByRole("button", { name: /alpha/i })
    const betaButton = screen.getByRole("button", { name: /beta/i })

    await user.click(betaButton)

    expect(betaButton.getAttribute("aria-expanded")).toBe("true")
    expect(alphaButton.getAttribute("aria-expanded")).toBe("false")
  })
})
