/**
 * Svelte adapter: Tests field compound molecules — CheckboxField,
 * CheckboxGroupField, RadioGroupField, and SwitchField label, description, and error wiring.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import CheckboxField from "../lib/components/checkbox/CheckboxField.svelte"
import CheckboxGroupField from "../lib/components/checkbox/CheckboxGroupField.svelte"
import RadioGroupField from "../lib/components/radio/RadioGroupField.svelte"
import SwitchField from "../lib/components/switch/SwitchField.svelte"

describe("CheckboxField", () => {
  it("renders with a label", () => {
    const { container } = render(CheckboxField, {
      props: { label: "Accept terms" },
    })
    const label = container.querySelector("label")
    expect(label?.textContent).toContain("Accept terms")
  })

  it("renders a checkbox input", () => {
    const { container } = render(CheckboxField, {
      props: { label: "Accept terms" },
    })
    const input = container.querySelector('input[type="checkbox"]')
    expect(input).not.toBeNull()
  })

  it("shows description when provided", () => {
    const { container } = render(CheckboxField, {
      props: { label: "Accept terms", description: "Required" },
    })
    expect(container.textContent).toContain("Required")
  })

  it("shows error when provided", () => {
    const { container } = render(CheckboxField, {
      props: { label: "Accept terms", error: "Must accept" },
    })
    expect(container.textContent).toContain("Must accept")
  })
})

describe("CheckboxGroupField", () => {
  it("renders with a legend label", () => {
    const { container } = render(CheckboxGroupField, {
      props: { label: "Options" },
    })
    const legend = container.querySelector("legend")
    expect(legend?.textContent).toContain("Options")
  })

  it("shows error when provided", () => {
    const { container } = render(CheckboxGroupField, {
      props: { label: "Options", error: "Select at least one" },
    })
    expect(container.textContent).toContain("Select at least one")
  })
})

describe("RadioGroupField", () => {
  it("renders with a legend label", () => {
    const { container } = render(RadioGroupField, {
      props: { label: "Choice" },
    })
    const legend = container.querySelector("legend")
    expect(legend?.textContent).toContain("Choice")
  })

  it("shows error when provided", () => {
    const { container } = render(RadioGroupField, {
      props: { label: "Choice", error: "Pick one" },
    })
    expect(container.textContent).toContain("Pick one")
  })

  it("shows description when provided", () => {
    const { container } = render(RadioGroupField, {
      props: { label: "Choice", description: "Select your preference" },
    })
    expect(container.textContent).toContain("Select your preference")
  })
})

describe("SwitchField", () => {
  it("renders with a label", () => {
    const { container } = render(SwitchField, {
      props: { label: "Notifications" },
    })
    expect(container.textContent).toContain("Notifications")
  })

  it("renders a switch button", () => {
    const { container } = render(SwitchField, {
      props: { label: "Notifications" },
    })
    const btn = container.querySelector('[role="switch"]')
    expect(btn).not.toBeNull()
  })

  it("shows description when provided", () => {
    const { container } = render(SwitchField, {
      props: { label: "Notifications", description: "Get email alerts" },
    })
    expect(container.textContent).toContain("Get email alerts")
  })

  it("shows error when provided", () => {
    const { container } = render(SwitchField, {
      props: { label: "Notifications", error: "Required" },
    })
    expect(container.textContent).toContain("Required")
  })
})
