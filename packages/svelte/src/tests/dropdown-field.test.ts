/**
 * Svelte adapter: Tests DropdownField against the shared cross-framework contract.
 */
import "@testing-library/jest-dom/vitest"
import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import { runDropdownFieldContract } from "../../../../tests/contracts/dropdown-field.contract"
import DropdownField from "../lib/components/input/DropdownField.svelte"

runDropdownFieldContract("svelte", {
  renderDropdownField(args) {
    render(DropdownField, {
      props: {
        label: args.label,
        ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
        ...(args.error !== undefined ? { error: args.error } : {}),
        ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
        select: {
          options: [
            { value: "se", label: "Sweden" },
            { value: "us", label: "United States" },
          ],
          placeholder: "Choose an option",
          ...(args.select ?? {}),
        },
      },
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
  queryPurposeRegion() {
    return document.querySelector('[data-purpose="dropdown"]')
  },
})

describe("DropdownField interactions: svelte", () => {
  it("opens the Marwes listbox and selects an option", async () => {
    render(DropdownField, {
      props: {
        label: "Country",
        select: {
          name: "country",
          options: [
            { value: "se", label: "Sweden" },
            { value: "us", label: "United States" },
          ],
          placeholder: "Choose a country",
        },
      },
    })

    const trigger = screen.getByRole("combobox", { name: /country/i })
    expect(trigger).toHaveTextContent("Choose a country")

    await fireEvent.click(trigger)
    await fireEvent.click(screen.getByRole("option", { name: /sweden/i }))

    expect(trigger).toHaveTextContent("Sweden")
    expect(document.querySelector<HTMLInputElement>('input[name="country"]')?.value).toBe("se")
  })
})
