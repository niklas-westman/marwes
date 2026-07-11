/**
 * Svelte adapter: Tests additional input components — Select, Textarea,
 * InputField, InputOtp, RichText, and purpose field wrappers.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import RichText from "../lib/components/input/RichText.svelte"
import InputOtpContractFixture from "./type-fixtures/InputOtpContractFixture.svelte"
import RichTextFieldContractFixture from "./type-fixtures/RichTextFieldContractFixture.svelte"

describe("InputOtp", () => {
  it("renders with a label", () => {
    const { container } = render(InputOtpContractFixture, {
      props: { label: "Verification code" },
    })
    const label = container.querySelector("label")
    expect(label?.textContent).toContain("Verification code")
  })

  it("renders OTP input container", () => {
    const { container } = render(InputOtpContractFixture, {
      props: { label: "Code", length: 6 },
    })
    const el = container.querySelector(".mw-input-otp")
    expect(el).not.toBeNull()
    // OTP may use a single hidden input or multiple cells
    const inputs = container.querySelectorAll("input")
    expect(inputs.length).toBeGreaterThanOrEqual(1)
  })

  it("renders with specified length attribute", () => {
    const { container } = render(InputOtpContractFixture, {
      props: { label: "PIN", length: 4 },
    })
    const el = container.querySelector(".mw-input-otp")
    expect(el).not.toBeNull()
  })

  it("includes mw-input-otp class", () => {
    const { container } = render(InputOtpContractFixture, {
      props: { label: "Code" },
    })
    const el = container.querySelector(".mw-input-otp")
    expect(el).not.toBeNull()
  })

  it("shows error text", () => {
    const { container } = render(InputOtpContractFixture, {
      props: { label: "Code", error: "Invalid code" },
    })
    expect(container.textContent).toContain("Invalid code")
  })

  it("shows helper text", () => {
    const { container } = render(InputOtpContractFixture, {
      props: { label: "Code", helperText: "Enter 6 digits" },
    })
    expect(container.textContent).toContain("Enter 6 digits")
  })
})

describe("RichText", () => {
  it("includes mw-rich-text class", () => {
    const { container } = render(RichText, {
      props: { ariaLabel: "Editor" },
    })
    const el = container.querySelector(".mw-rich-text")
    expect(el).not.toBeNull()
  })

  it("renders an editor area", () => {
    const { container } = render(RichText, {
      props: { ariaLabel: "Editor" },
    })
    const editor = container.querySelector("[contenteditable]")
    expect(editor).not.toBeNull()
  })

  it("renders toolbar buttons", () => {
    const { container } = render(RichText, {
      props: { ariaLabel: "Editor" },
    })
    const toolbar = container.querySelector(".mw-rich-text__toolbar")
    expect(toolbar).not.toBeNull()
  })
})

describe("RichTextField", () => {
  it("renders with a label", () => {
    const { container } = render(RichTextFieldContractFixture, {
      props: { label: "Description", editor: {} },
    })
    // RichTextField renders the label text
    expect(container.textContent).toContain("Description")
  })

  it("shows error text", () => {
    const { container } = render(RichTextFieldContractFixture, {
      props: { label: "Description", error: "Required", editor: {} },
    })
    expect(container.textContent).toContain("Required")
  })
})
