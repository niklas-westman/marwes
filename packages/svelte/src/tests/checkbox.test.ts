/**
 * Svelte adapter: Tests the Checkbox atom — checkbox type, class,
 * checked/indeterminate state, change callback, disabled, and aria-label.
 */
import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Checkbox from "../lib/components/checkbox/Checkbox.svelte"

describe("Checkbox", () => {
  it("renders an input with type checkbox", () => {
    const { container } = render(Checkbox, { props: { ariaLabel: "Accept terms" } })
    const input = container.querySelector('input[type="checkbox"]')
    expect(input).not.toBeNull()
  })

  it("includes mw-checkbox class", () => {
    const { container } = render(Checkbox, { props: { ariaLabel: "Accept terms" } })
    const input = container.querySelector("input")
    expect(input?.classList.contains("mw-checkbox")).toBe(true)
  })

  it("applies checked state", () => {
    const { container } = render(Checkbox, {
      props: { checked: true, ariaLabel: "Accept terms" },
    })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  it("applies uncontrolled default checked state", () => {
    const { container } = render(Checkbox, {
      props: { defaultChecked: true, ariaLabel: "Accept terms" },
    })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  it("applies indeterminate state", () => {
    const { container } = render(Checkbox, {
      props: { indeterminate: true, ariaLabel: "Select all" },
    })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.indeterminate).toBe(true)
  })

  it("fires oncheckedchange with boolean value", async () => {
    const handler = vi.fn()
    const { container } = render(Checkbox, {
      props: { ariaLabel: "Accept terms", oncheckedchange: handler },
    })
    const input = container.querySelector("input") as HTMLInputElement
    await fireEvent.click(input)
    expect(handler).toHaveBeenCalledWith(true)
  })

  it("respects disabled prop", () => {
    const { container } = render(Checkbox, {
      props: { disabled: true, ariaLabel: "Disabled checkbox" },
    })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it("sets aria-label", () => {
    const { container } = render(Checkbox, {
      props: { ariaLabel: "Accept terms" },
    })
    const input = container.querySelector("input")
    expect(input?.getAttribute("aria-label")).toBe("Accept terms")
  })
})
