/**
 * Svelte adapter: Tests the Button atom — element rendering, class merging,
 * disabled state, loading busy state, anchor mode, click handling, and data attributes.
 */
import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Button from "../lib/components/button/Button.svelte"

describe("Button", () => {
  it("renders a button element by default", () => {
    const { container } = render(Button)
    const btn = container.querySelector("button")
    expect(btn).not.toBeNull()
  })

  it("includes mw-btn class", () => {
    const { container } = render(Button)
    const btn = container.querySelector("button")
    expect(btn?.classList.contains("mw-btn")).toBe(true)
  })

  it("merges user class", () => {
    const { container } = render(Button, { props: { class: "custom-class" } })
    const btn = container.querySelector("button")
    expect(btn?.classList.contains("mw-btn")).toBe(true)
    expect(btn?.classList.contains("custom-class")).toBe(true)
  })

  it("respects disabled prop", () => {
    const { container } = render(Button, { props: { disabled: true } })
    const btn = container.querySelector("button") as HTMLButtonElement
    expect(btn?.disabled).toBe(true)
  })

  it("sets aria-busy while loading", () => {
    const { container } = render(Button, {
      props: { loading: true },
    })
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("aria-busy")).toBe("true")
  })

  it("passes data attributes", () => {
    const { container } = render(Button, {
      props: { dataAttributes: { "data-custom": "test" } },
    })
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("data-custom")).toBe("test")
  })

  it("renders anchor when as=a and href is provided", () => {
    const { container } = render(Button, {
      props: { as: "a", href: "https://example.com" },
    })
    const anchor = container.querySelector("a")
    expect(anchor).not.toBeNull()
    expect(anchor?.getAttribute("href")).toBe("https://example.com")
  })

  it("fires onclick callback", async () => {
    const handler = vi.fn()
    const { container } = render(Button, {
      props: { onclick: handler },
    })
    const btn = container.querySelector("button") as HTMLButtonElement
    await fireEvent.click(btn)
    expect(handler).toHaveBeenCalledOnce()
  })
})
