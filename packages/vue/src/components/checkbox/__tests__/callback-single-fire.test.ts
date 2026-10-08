/**
 * Vue adapter: a change callback passed as a prop must run exactly once per change. The component
 * also emits the matching event, which Vue resolves to the same prop handler.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { renderInProvider } from "../../../test-support/render-in-provider"
import { Checkbox } from "../checkbox"

describe("Vue Checkbox change callbacks", () => {
  it("calls onCheckedChange and onChange once per toggle", async () => {
    const onCheckedChange = vi.fn()
    const onChange = vi.fn()
    renderInProvider(Checkbox, { ariaLabel: "Agree", onCheckedChange, onChange })

    await userEvent.setup().click(screen.getByRole("checkbox"))

    expect(onCheckedChange.mock.calls).toEqual([[true]])
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
