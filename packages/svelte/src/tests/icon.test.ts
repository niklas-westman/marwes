import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Icon from "../lib/components/icon/Icon.svelte"

describe("Icon", () => {
  it("renders an svg element", () => {
    const { container } = render(Icon, { props: { name: "search" } })
    const svg = container.querySelector("svg")
    expect(svg).not.toBeNull()
  })

  it("sets aria-hidden when decorative", () => {
    const { container } = render(Icon, { props: { name: "search", decorative: true } })
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("aria-hidden")).toBe("true")
  })

  it("sets aria-label for accessible icons", () => {
    const { container } = render(Icon, {
      props: { name: "search", "aria-label": "Search" },
    })
    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("aria-label")).toBe("Search")
  })

  it("renders path elements for the icon", () => {
    const { container } = render(Icon, { props: { name: "search" } })
    const paths = container.querySelectorAll("path, circle, line, polyline, rect")
    expect(paths.length).toBeGreaterThan(0)
  })
})
