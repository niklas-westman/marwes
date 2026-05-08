import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Switch from "../lib/components/switch/Switch.svelte"

describe("Switch", () => {
  it("renders a button with role switch", () => {
    const { container } = render(Switch, { props: { ariaLabel: "Toggle" } })
    const btn = container.querySelector('button[role="switch"]')
    expect(btn).not.toBeNull()
  })

  it("sets aria-checked to false by default", () => {
    const { container } = render(Switch, { props: { ariaLabel: "Toggle" } })
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("aria-checked")).toBe("false")
  })

  it("sets aria-checked to true when checked", () => {
    const { container } = render(Switch, {
      props: { checked: true, ariaLabel: "Toggle" },
    })
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("aria-checked")).toBe("true")
  })

  it("fires oncheckedchange on click", async () => {
    const handler = vi.fn()
    const { container } = render(Switch, {
      props: { ariaLabel: "Toggle", oncheckedchange: handler },
    })
    const btn = container.querySelector("button") as HTMLButtonElement
    await fireEvent.click(btn)
    expect(handler).toHaveBeenCalledWith(true)
  })

  it("prevents toggle when disabled", async () => {
    const handler = vi.fn()
    const { container } = render(Switch, {
      props: { disabled: true, ariaLabel: "Toggle", oncheckedchange: handler },
    })
    const btn = container.querySelector("button") as HTMLButtonElement
    await fireEvent.click(btn)
    expect(handler).not.toHaveBeenCalled()
  })

  it("applies style from CSS vars", () => {
    const { container } = render(Switch, {
      props: { ariaLabel: "Toggle" },
    })
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("style")).toBeDefined()
  })

  it("includes mw-switch class", () => {
    const { container } = render(Switch, { props: { ariaLabel: "Toggle" } })
    const btn = container.querySelector("button")
    expect(btn?.className).toContain("mw-switch")
  })
})
