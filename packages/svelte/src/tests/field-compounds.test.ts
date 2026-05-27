/**
 * Svelte adapter: Tests field compound molecules — CheckboxField,
 * CheckboxGroupField, RadioGroupField, and SwitchField label, description, and error wiring.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import "@testing-library/jest-dom/vitest"
import CheckboxFieldContractFixture from "./type-fixtures/CheckboxFieldContractFixture.svelte"
import CheckboxGroupFieldContractFixture from "./type-fixtures/CheckboxGroupFieldContractFixture.svelte"
import RadioGroupFieldContractFixture from "./type-fixtures/RadioGroupFieldContractFixture.svelte"
import SwitchFieldContractFixture from "./type-fixtures/SwitchFieldContractFixture.svelte"

describe("CheckboxField", () => {
  it("renders with a label", () => {
    const { container } = render(CheckboxFieldContractFixture, {
      props: { label: "Accept terms" },
    })
    const label = container.querySelector("label")
    expect(label?.textContent).toContain("Accept terms")
  })

  it("renders a checkbox input", () => {
    const { container } = render(CheckboxFieldContractFixture, {
      props: { label: "Accept terms" },
    })
    const input = container.querySelector('input[type="checkbox"]')
    expect(input).not.toBeNull()
  })

  it("shows description when provided", () => {
    const { container } = render(CheckboxFieldContractFixture, {
      props: { label: "Accept terms", description: "Required" },
    })
    expect(container.textContent).toContain("Required")
  })

  it("shows error when provided", () => {
    const { container } = render(CheckboxFieldContractFixture, {
      props: { label: "Accept terms", error: "Must accept" },
    })
    expect(container.textContent).toContain("Must accept")
  })
})

describe("CheckboxGroupField", () => {
  it("renders with a legend label", () => {
    const { container } = render(CheckboxGroupFieldContractFixture, {
      props: { label: "Options" },
    })
    const legend = container.querySelector("legend")
    expect(legend?.textContent).toContain("Options")
  })

  it("shows error when provided", () => {
    const { container } = render(CheckboxGroupFieldContractFixture, {
      props: { label: "Options", error: "Select at least one" },
    })
    expect(container.textContent).toContain("Select at least one")
  })
})

describe("RadioGroupField", () => {
  it("renders with a labeled radiogroup", () => {
    const { container } = render(RadioGroupFieldContractFixture, {
      props: { name: "choice", label: "Choice", options: [] },
    })
    const group = container.querySelector('[role="radiogroup"]')
    const label = container.querySelector(".mw-radio-group-field__label .mw-text")

    expect(group).toHaveAccessibleName("Choice")
    expect(label).toHaveClass("mw-text--label")
  })

  it("shows error when provided", () => {
    const { container } = render(RadioGroupFieldContractFixture, {
      props: { name: "choice", label: "Choice", error: "Pick one", options: [] },
    })
    expect(container.textContent).toContain("Pick one")
  })

  it("shows description when provided", () => {
    const { container } = render(RadioGroupFieldContractFixture, {
      props: {
        name: "choice",
        label: "Choice",
        description: "Select your preference",
        options: [],
      },
    })
    expect(container.textContent).toContain("Select your preference")
  })
})

describe("SwitchField", () => {
  it("renders with a label", () => {
    const { container } = render(SwitchFieldContractFixture, {
      props: { label: "Notifications" },
    })
    expect(container.textContent).toContain("Notifications")
  })

  it("renders a switch button", () => {
    const { container } = render(SwitchFieldContractFixture, {
      props: { label: "Notifications" },
    })
    const btn = container.querySelector('[role="switch"]')
    expect(btn).not.toBeNull()
  })

  it("shows description when provided", () => {
    const { container } = render(SwitchFieldContractFixture, {
      props: { label: "Notifications", description: "Get email alerts" },
    })
    expect(container.textContent).toContain("Get email alerts")
  })

  it("shows error when provided", () => {
    const { container } = render(SwitchFieldContractFixture, {
      props: { label: "Notifications", error: "Required" },
    })
    expect(container.textContent).toContain("Required")
  })
})
