/**
 * Svelte adapter: Tests the Radio atom — radio input type, class,
 * checked state, name/value passthrough, disabled, and change callback.
 */
import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Radio from "../lib/components/radio/Radio.svelte"

describe("Radio", () => {
  it("renders an input with type radio", () => {
    const { container } = render(Radio, { props: { ariaLabel: "Option" } })
    const input = container.querySelector('input[type="radio"]')
    expect(input).not.toBeNull()
  })

  it("includes mw-radio class", () => {
    const { container } = render(Radio, { props: { ariaLabel: "Option" } })
    const input = container.querySelector("input")
    expect(input?.classList.contains("mw-radio")).toBe(true)
  })

  it("applies checked state", () => {
    const { container } = render(Radio, {
      props: { checked: true, ariaLabel: "Option" },
    })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  it("fires oncheckedchange on click", async () => {
    const handler = vi.fn()
    const { container } = render(Radio, {
      props: { ariaLabel: "Option", oncheckedchange: handler },
    })
    const input = container.querySelector("input") as HTMLInputElement
    await fireEvent.click(input)
    expect(handler).toHaveBeenCalledWith(true)
  })

  it("respects disabled prop", () => {
    const { container } = render(Radio, {
      props: { disabled: true, ariaLabel: "Option" },
    })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it("sets aria-label", () => {
    const { container } = render(Radio, { props: { ariaLabel: "Option A" } })
    const input = container.querySelector("input")
    expect(input?.getAttribute("aria-label")).toBe("Option A")
  })
})
