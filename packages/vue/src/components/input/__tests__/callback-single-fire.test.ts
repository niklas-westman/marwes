/**
 * Vue adapter: a change callback passed as a prop must run exactly once per change. The components
 * also emit the matching event, which Vue resolves to the same prop handler.
 */
import userEvent from "@testing-library/user-event"
import { fireEvent, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { renderInProvider } from "../../../test-support/render-in-provider"
import { Input } from "../input"
import { InputOtp } from "../input-otp"
import { RichText } from "../rich-text"
import { Select } from "../select"
import { Textarea } from "../textarea"

describe("Vue input change callbacks", () => {
  it("calls Input onValueChange once per keystroke", async () => {
    const onValueChange = vi.fn()
    renderInProvider(Input, { ariaLabel: "Name", onValueChange })

    await userEvent.setup().type(screen.getByRole("textbox"), "ab")

    expect(onValueChange.mock.calls).toEqual([["a"], ["ab"]])
  })

  it("calls Textarea onValueChange once per keystroke", async () => {
    const onValueChange = vi.fn()
    renderInProvider(Textarea, { ariaLabel: "Notes", onValueChange })

    await userEvent.setup().type(screen.getByRole("textbox"), "ab")

    expect(onValueChange.mock.calls).toEqual([["a"], ["ab"]])
  })

  it("calls Select onValueChange once per selection", async () => {
    const onValueChange = vi.fn()
    renderInProvider(Select, {
      ariaLabel: "Plan",
      options: [
        { value: "starter", label: "Starter" },
        { value: "growth", label: "Growth" },
      ],
      onValueChange,
    })

    await userEvent.setup().selectOptions(screen.getByRole("combobox"), "growth")

    expect(onValueChange.mock.calls).toEqual([["growth"]])
  })

  it("calls InputOtp onValueChange once per accepted character", async () => {
    const onValueChange = vi.fn()
    renderInProvider(InputOtp, { ariaLabel: "Code", onValueChange })

    await fireEvent.update(screen.getByRole("textbox"), "1")

    expect(onValueChange.mock.calls).toEqual([["1"]])
  })

  it("calls RichText onValueChange once per edit", async () => {
    const onValueChange = vi.fn()
    renderInProvider(RichText, { ariaLabel: "Body", onValueChange })

    await userEvent.setup().type(screen.getByRole("textbox"), "a")

    expect(onValueChange).toHaveBeenCalledTimes(1)
  })
})
