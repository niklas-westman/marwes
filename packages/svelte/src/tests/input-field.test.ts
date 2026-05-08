import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import InputField from "../lib/components/input/InputField.svelte"

describe("InputField", () => {
  it("renders label associated with input via for/id", () => {
    const { container } = render(InputField, {
      props: { label: "Email", input: {} },
    })
    const label = container.querySelector("label")
    const input = container.querySelector("input")
    expect(label).not.toBeNull()
    expect(input).not.toBeNull()
    expect(label?.getAttribute("for")).toBe(input?.id)
  })

  it("respects custom id", () => {
    const { container } = render(InputField, {
      props: { id: "my-email", label: "Email", input: {} },
    })
    const input = container.querySelector("input")
    expect(input?.id).toBe("my-email")
  })

  it("renders helper text with correct id in aria-describedby", () => {
    const { container } = render(InputField, {
      props: { label: "Name", helperText: "Enter your full name", input: {} },
    })
    const helper = container.querySelector(".mw-input-field__helper")
    const input = container.querySelector("input")
    expect(helper).not.toBeNull()
    expect(helper?.textContent).toContain("Enter your full name")

    const helperId = helper?.id
    expect(helperId).toBeTruthy()
    expect(input?.getAttribute("aria-describedby")).toContain(helperId as string)
  })

  it("renders error with aria-live and sets aria-invalid", () => {
    const { container } = render(InputField, {
      props: { label: "Password", error: "Too short", input: {} },
    })
    const errorEl = container.querySelector(".mw-input-field__error")
    const input = container.querySelector("input")
    expect(errorEl).not.toBeNull()
    expect(errorEl?.getAttribute("aria-live")).toBe("polite")
    expect(errorEl?.textContent).toContain("Too short")
    expect(input?.getAttribute("aria-invalid")).toBe("true")

    const errorId = errorEl?.id
    expect(errorId).toBeTruthy()
    expect(input?.getAttribute("aria-describedby")).toContain(errorId as string)
  })

  it("hides helper text when error is present", () => {
    const { container } = render(InputField, {
      props: { label: "Name", helperText: "Help text", error: "Error text", input: {} },
    })
    const helper = container.querySelector(".mw-input-field__helper")
    expect(helper).toBeNull()
  })

  it("merges external ariaDescribedBy", () => {
    const { container } = render(InputField, {
      props: {
        label: "Name",
        helperText: "Help",
        ariaDescribedBy: "external-hint",
        input: {},
      },
    })
    const input = container.querySelector("input")
    const describedBy = input?.getAttribute("aria-describedby") ?? ""
    expect(describedBy).toContain("external-hint")
  })

  it("applies disabled class", () => {
    const { container } = render(InputField, {
      props: { label: "Name", input: { disabled: true } },
    })
    const wrapper = container.querySelector(".mw-input-field")
    expect(wrapper?.classList.contains("mw-input-field--disabled")).toBe(true)
  })

  it("applies readonly class", () => {
    const { container } = render(InputField, {
      props: { label: "Name", input: { readOnly: true } },
    })
    const wrapper = container.querySelector(".mw-input-field")
    expect(wrapper?.classList.contains("mw-input-field--readonly")).toBe(true)
  })

  it("renders leading symbol", () => {
    const { container } = render(InputField, {
      props: { label: "Amount", leadingSymbol: "$", input: {} },
    })
    const symbol = container.querySelector(".mw-input-field__leading-symbol")
    expect(symbol).not.toBeNull()
    expect(symbol?.textContent).toBe("$")
    expect(symbol?.getAttribute("aria-hidden")).toBe("true")
  })

  it("renders password toggle for password fields", () => {
    const { container } = render(InputField, {
      props: { label: "Password", input: { type: "password" } },
    })
    const toggle = container.querySelector(".mw-input-field__toggle-password")
    expect(toggle).not.toBeNull()
    expect(toggle?.getAttribute("aria-label")).toBe("Show password")
  })

  it("renders search icon for search fields", () => {
    const { container } = render(InputField, {
      props: { label: "Search", input: { type: "search" } },
    })
    const searchIcon = container.querySelector(".mw-input-field__search-icon")
    expect(searchIcon).not.toBeNull()
  })
})
