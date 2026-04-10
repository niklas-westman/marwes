import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Tooltip } from "../tooltip"

function renderWithProvider(component: unknown, props: Record<string, unknown>) {
  const { children, ...componentProps } = props

  render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, componentProps, {
                default: () => children,
              }),
          })
      },
    }),
  )
}

describe("Vue Tooltip (Atom)", () => {
  it("renders a tooltip bubble with the core recipe class", () => {
    renderWithProvider(Tooltip, { children: "Tooltip text" })

    const tooltip = screen.getByRole("tooltip")
    expect(tooltip.tagName).toBe("SPAN")
    expect(tooltip.className).toContain("mw-tooltip")
    expect(tooltip).toHaveAttribute("data-component", "tooltip")
  })

  it("passes through the id and merges className", () => {
    renderWithProvider(Tooltip, {
      id: "help-tooltip",
      className: "custom-tooltip",
      children: "Tooltip text",
    })

    const tooltip = screen.getByRole("tooltip")
    expect(tooltip.id).toBe("help-tooltip")
    expect(tooltip.className).toContain("custom-tooltip")
  })
})
