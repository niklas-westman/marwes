/**
 * Svelte adapter: Tests OptionRadioGroup against the shared radio-group contract.
 */
import "@testing-library/jest-dom/vitest"
import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import { runRadioGroupFieldContract } from "../../../../tests/contracts/radio-group-field.contract"
import RadioGroupFieldContractFixture from "./type-fixtures/RadioGroupFieldContractFixture.svelte"
import RadioVariantFixture from "./type-fixtures/RadioVariantFixture.svelte"

runRadioGroupFieldContract("svelte", {
  renderRadioGroup(args = {}) {
    render(RadioGroupFieldContractFixture, {
      props: {
        name: args.name ?? "choices",
        label: args.label ?? "Pick one",
        options: args.options ?? [
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
          { value: "c", label: "Gamma" },
        ],
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
        ...(args.value !== undefined ? { value: args.value } : {}),
        ...(args.onValueChange !== undefined ? { onchange: args.onValueChange } : {}),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.required !== undefined ? { required: args.required } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role) as HTMLInputElement[]
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async click(element) {
    await fireEvent.click(element)
  },
})

describe("OptionRadioGroup structure: svelte", () => {
  it("does not render a native fieldset border container", () => {
    const { container } = render(RadioGroupFieldContractFixture, {
      props: {
        name: "theme",
        label: "Theme",
        options: [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ],
      },
    })

    expect(container.querySelector("fieldset")).toBeNull()
    expect(container.querySelector('[data-purpose="selection"]')).toHaveClass(
      "mw-radio-group-field",
    )
  })
})

describe("Radio option label typography: svelte", () => {
  it("uses the canonical label typography for YesNoRadioGroup option labels", () => {
    render(RadioVariantFixture, { props: { component: "yes-no" } })

    expect(screen.getByText("Yes")).toHaveClass("mw-text", "mw-text--label")
    expect(screen.getByText("No")).toHaveClass("mw-text", "mw-text--label")
  })

  it("uses the canonical label typography for RatingRadioGroup option labels", () => {
    render(RadioVariantFixture, { props: { component: "rating" } })

    expect(screen.getByText("1")).toHaveClass("mw-text", "mw-text--label")
    expect(screen.getByText("2")).toHaveClass("mw-text", "mw-text--label")
  })
})
