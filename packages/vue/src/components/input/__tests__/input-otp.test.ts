import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { InputOtp, type InputOtpProps } from "../input-otp"

function renderWithProvider(props: InputOtpProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(InputOtp, props) })
      },
    }),
  )
}

describe("Vue InputOtp", () => {
  it("renders six OTP cells with label and helper text", () => {
    renderWithProvider({
      label: "Verification code",
      helperText: "Enter the 6-digit code sent to your email",
    })

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

    renderWithProvider({
      label: "Verification code",
      onValueChange,
    })

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
    renderWithProvider({
      label: "Verification code",
      error: "Code expired",
    })

    const inputElement = screen.getByRole("textbox", { name: /verification code/i })
    const errorElement = screen.getByText("Code expired")
    const errorRegionElement = errorElement.parentElement

    expect(errorRegionElement?.id).toBeTruthy()
    expect(inputElement).toHaveAttribute("aria-invalid", "true")
    expect(inputElement).toHaveAttribute("aria-describedby", errorRegionElement?.id)
  })
})
