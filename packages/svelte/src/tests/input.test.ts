import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Input from "../lib/components/input/Input.svelte"

describe("Input", () => {
  it("renders an input element", () => {
    const { container } = render(Input)
    const input = container.querySelector("input")
    expect(input).not.toBeNull()
  })

  it("includes mw-input class", () => {
    const { container } = render(Input)
    const input = container.querySelector("input")
    expect(input?.classList.contains("mw-input")).toBe(true)
  })

  it("merges user class", () => {
    const { container } = render(Input, { props: { class: "custom" } })
    const input = container.querySelector("input")
    expect(input?.classList.contains("mw-input")).toBe(true)
    expect(input?.classList.contains("custom")).toBe(true)
  })

  it("applies placeholder", () => {
    const { container } = render(Input, { props: { placeholder: "Enter text" } })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input?.placeholder).toBe("Enter text")
  })

  it("applies disabled attribute", () => {
    const { container } = render(Input, { props: { disabled: true } })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input?.disabled).toBe(true)
  })
})
