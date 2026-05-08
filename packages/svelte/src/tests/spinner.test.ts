import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import ButtonSpinner from "../lib/components/spinner/ButtonSpinner.svelte"
import EmptyStateSpinner from "../lib/components/spinner/EmptyStateSpinner.svelte"
import Spinner from "../lib/components/spinner/Spinner.svelte"

describe("Spinner", () => {
  it("sets data-component attribute", () => {
    const { container } = render(Spinner)
    const el = container.querySelector('[data-component="spinner"]')
    expect(el).not.toBeNull()
  })

  it("includes mw-spinner class", () => {
    const { container } = render(Spinner)
    const el = container.querySelector(".mw-spinner")
    expect(el).not.toBeNull()
  })

  it("renders an svg element", () => {
    const { container } = render(Spinner)
    const svg = container.querySelector("svg")
    expect(svg).not.toBeNull()
  })

  it("sets aria-label when provided", () => {
    const { container } = render(Spinner, { props: { ariaLabel: "Loading" } })
    const el = container.querySelector(".mw-spinner")
    expect(el?.getAttribute("aria-label")).toBe("Loading")
  })

  it("sets aria-hidden when decorative", () => {
    const { container } = render(Spinner, { props: { decorative: true } })
    const el = container.querySelector(".mw-spinner")
    expect(el?.getAttribute("aria-hidden")).toBe("true")
  })
})

describe("ButtonSpinner", () => {
  it("renders with mw-spinner class", () => {
    const { container } = render(ButtonSpinner)
    expect(container.querySelector(".mw-spinner")).not.toBeNull()
  })

  it("defaults to decorative", () => {
    const { container } = render(ButtonSpinner)
    const el = container.querySelector(".mw-spinner")
    expect(el?.getAttribute("aria-hidden")).toBe("true")
  })
})

describe("EmptyStateSpinner", () => {
  it("renders with mw-spinner class", () => {
    const { container } = render(EmptyStateSpinner)
    expect(container.querySelector(".mw-spinner")).not.toBeNull()
  })

  it("renders an svg", () => {
    const { container } = render(EmptyStateSpinner)
    expect(container.querySelector("svg")).not.toBeNull()
  })
})
