import { BadgeVariant } from "@marwes-ui/core"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Badge } from "../badge"

function renderWithProvider(component: unknown, props: Record<string, unknown>) {
  render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(component as never, props, { default: () => props.children }),
          })
      },
    }),
  )
}

describe("Vue Badge (Atom)", () => {
  it("renders a span with mw-badge class", () => {
    renderWithProvider(Badge, { children: "Active" })

    const badge = screen.getByText("Active")
    expect(badge.tagName).toBe("SPAN")
    expect(badge.className).toContain("mw-badge")
  })

  it("applies variant class", () => {
    renderWithProvider(Badge, { variant: BadgeVariant.success, children: "Done" })

    const badge = screen.getByText("Done")
    expect(badge.className).toContain("mw-badge--success")
  })

  it("defaults to neutral variant", () => {
    renderWithProvider(Badge, { children: "Default" })

    const badge = screen.getByText("Default")
    expect(badge.className).toContain("mw-badge--neutral")
  })

  it("sets aria-label when ariaLabel is provided", () => {
    renderWithProvider(Badge, { ariaLabel: "status indicator", children: "OK" })

    const badge = screen.getByText("OK")
    expect(badge.getAttribute("aria-label")).toBe("status indicator")
  })

  it("spreads dataAttributes onto the element", () => {
    renderWithProvider(Badge, {
      dataAttributes: { "data-purpose": "status" },
      children: "Active",
    })

    const badge = screen.getByText("Active")
    expect(badge.getAttribute("data-purpose")).toBe("status")
  })

  it("merges custom className", () => {
    renderWithProvider(Badge, { className: "custom-badge", children: "Tag" })

    const badge = screen.getByText("Tag")
    expect(badge.className).toContain("mw-badge")
    expect(badge.className).toContain("custom-badge")
  })
})
