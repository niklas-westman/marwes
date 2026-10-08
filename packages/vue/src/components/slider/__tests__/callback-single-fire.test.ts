/**
 * Vue adapter: a change callback passed as a prop must run exactly once per change. The component
 * also emits the matching events, which Vue resolves to the same prop handlers.
 */
import { fireEvent, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { renderInProvider } from "../../../test-support/render-in-provider"
import { Slider } from "../slider"

describe("Vue Slider change callbacks", () => {
  it("calls onValueChange once per input and onChange once per change event", async () => {
    const onValueChange = vi.fn()
    const onChange = vi.fn()
    renderInProvider(Slider, { ariaLabel: "Radius", min: 0, max: 100, onValueChange, onChange })

    const slider = screen.getByRole("slider")
    await fireEvent.update(slider, "40")
    expect(onValueChange.mock.calls).toEqual([[40]])

    await fireEvent.change(slider)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
