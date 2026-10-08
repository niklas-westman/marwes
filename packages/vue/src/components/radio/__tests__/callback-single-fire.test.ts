/**
 * Vue adapter: a change callback passed as a prop must run exactly once per change. The components
 * also emit the matching event, which Vue resolves to the same prop handler.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { renderInProvider } from "../../../test-support/render-in-provider"
import { Radio } from "../radio"
import { RadioGroupField } from "../radio-group-field"

describe("Vue radio change callbacks", () => {
  it("calls Radio onCheckedChange and onChange once per selection", async () => {
    const onCheckedChange = vi.fn()
    const onChange = vi.fn()
    renderInProvider(Radio, { ariaLabel: "Option", onCheckedChange, onChange })

    await userEvent.setup().click(screen.getByRole("radio"))

    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("calls RadioGroupField onChange once per selection", async () => {
    const onChange = vi.fn()
    renderInProvider(RadioGroupField, {
      name: "plan",
      label: "Plan",
      options: [
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta" },
      ],
      onChange,
    })

    await userEvent.setup().click(screen.getByRole("radio", { name: "Beta" }))

    expect(onChange.mock.calls).toEqual([["b"]])
  })
})
