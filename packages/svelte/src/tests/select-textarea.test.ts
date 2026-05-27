/**
 * Svelte adapter: Tests Select and Textarea atoms — element type,
 * class, options rendering, and textarea rows/placeholder.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Select from "../lib/components/input/Select.svelte"
import Textarea from "../lib/components/input/Textarea.svelte"
import SelectFieldContractFixture from "./type-fixtures/SelectFieldContractFixture.svelte"
import TextareaFieldContractFixture from "./type-fixtures/TextareaFieldContractFixture.svelte"

const selectOptions = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
]

describe("Select", () => {
  it("renders a select element", () => {
    const { container } = render(Select, { props: { options: selectOptions } })
    const select = container.querySelector("select")
    expect(select).not.toBeNull()
  })

  it("includes mw-select class", () => {
    const { container } = render(Select, { props: { options: selectOptions } })
    const wrapper = container.querySelector(".mw-select")
    expect(wrapper).not.toBeNull()
  })

  it("renders options", () => {
    const { container } = render(Select, { props: { options: selectOptions } })
    const opts = container.querySelectorAll("option")
    expect(opts.length).toBeGreaterThanOrEqual(2)
  })

  it("applies disabled state", () => {
    const { container } = render(Select, {
      props: { options: selectOptions, disabled: true },
    })
    const select = container.querySelector("select") as HTMLSelectElement
    expect(select.disabled).toBe(true)
  })
})

describe("SelectField", () => {
  it("renders with a label", () => {
    const { container } = render(SelectFieldContractFixture, {
      props: { label: "Country", select: { options: selectOptions } },
    })
    const label = container.querySelector("label")
    expect(label?.textContent).toContain("Country")
  })

  it("shows error text", () => {
    const { container } = render(SelectFieldContractFixture, {
      props: { label: "Country", error: "Required", select: { options: selectOptions } },
    })
    expect(container.textContent).toContain("Required")
  })

  it("shows helper text", () => {
    const { container } = render(SelectFieldContractFixture, {
      props: { label: "Country", helperText: "Pick one", select: { options: selectOptions } },
    })
    expect(container.textContent).toContain("Pick one")
  })
})

describe("Textarea", () => {
  it("renders a textarea element", () => {
    const { container } = render(Textarea)
    const textarea = container.querySelector("textarea")
    expect(textarea).not.toBeNull()
  })

  it("includes mw-textarea class", () => {
    const { container } = render(Textarea)
    const textarea = container.querySelector("textarea")
    expect(textarea?.classList.contains("mw-textarea")).toBe(true)
  })

  it("applies placeholder", () => {
    const { container } = render(Textarea, { props: { placeholder: "Enter text" } })
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement
    expect(textarea.placeholder).toBe("Enter text")
  })

  it("applies disabled state", () => {
    const { container } = render(Textarea, { props: { disabled: true } })
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement
    expect(textarea.disabled).toBe(true)
  })
})

describe("TextareaField", () => {
  it("renders with a label", () => {
    const { container } = render(TextareaFieldContractFixture, {
      props: { label: "Message" },
    })
    const label = container.querySelector("label")
    expect(label?.textContent).toContain("Message")
  })

  it("shows error text", () => {
    const { container } = render(TextareaFieldContractFixture, {
      props: { label: "Message", error: "Required" },
    })
    expect(container.textContent).toContain("Required")
  })

  it("shows helper text", () => {
    const { container } = render(TextareaFieldContractFixture, {
      props: { label: "Message", helperText: "Max 500 chars" },
    })
    expect(container.textContent).toContain("Max 500 chars")
  })
})
