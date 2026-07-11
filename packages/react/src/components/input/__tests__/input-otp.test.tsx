/**
 * React adapter: Tests the Input Otp component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { runInputOtpContract } from "../../../../../../tests/contracts/input-otp.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { InputOtpField } from "../input-otp-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runInputOtpContract("react", {
  async renderInputOtp(args = {}) {
    const inputOtpProps = {
      label: args.label ?? "Verification code",
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      inputOtp: {
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
        ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
        ...(args.onValueChange ? { onValueChange: args.onValueChange } : {}),
      },
    }

    renderWithProvider(<InputOtpField {...inputOtpProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-otp-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-otp-field__error")
  },
  queryOtpCells() {
    return Array.from(document.querySelectorAll(".mw-input-otp__cell")) as HTMLElement[]
  },
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})

describe("React InputOtp", () => {
  it("renders six OTP cells with label and helper text", () => {
    renderWithProvider(
      <InputOtpField
        label="Verification code"
        helperText="Enter the 6-digit code sent to your email"
      />,
    )

    const inputElement = screen.getByRole("textbox", { name: /verification code/i })
    const otpCells = Array.from(document.querySelectorAll(".mw-input-otp__cell"))

    expect(inputElement).toHaveAttribute("autocomplete", "one-time-code")
    expect(otpCells).toHaveLength(6)
    expect(otpCells.map((otpCellElement) => otpCellElement.textContent)).toEqual([
      "·",
      "·",
      "·",
      "·",
      "·",
      "·",
    ])
    expect(screen.getByText(/enter the 6-digit code/i)).toBeInTheDocument()
  })

  it("sanitizes typed content down to digits and mirrors it into the cells", async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()

    renderWithProvider(<InputOtpField label="Verification code" inputOtp={{ onValueChange }} />)

    const inputElement = screen.getByRole("textbox", { name: /verification code/i })

    await user.type(inputElement, "12a34")

    const otpCells = Array.from(document.querySelectorAll(".mw-input-otp__cell"))

    expect(onValueChange).toHaveBeenLastCalledWith("1234")
    expect(inputElement).toHaveValue("1234")
    expect(otpCells.map((otpCellElement) => otpCellElement.textContent)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "·",
      "·",
    ])
  })

  it("marks the hidden input invalid and wires the error region", () => {
    renderWithProvider(<InputOtpField label="Verification code" error="Code expired" />)

    const inputElement = screen.getByRole("textbox", { name: /verification code/i })
    const errorElement = screen.getByText("Code expired")
    const errorRegionElement = errorElement.parentElement

    expect(errorRegionElement?.id).toBeTruthy()
    expect(inputElement).toHaveAttribute("aria-invalid", "true")
    expect(inputElement).toHaveAttribute("aria-describedby", errorRegionElement?.id)
  })
})
