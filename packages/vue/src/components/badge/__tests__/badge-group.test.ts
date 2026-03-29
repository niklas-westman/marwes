import { BadgeVariant } from "@marwes-ui/core"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Badge } from "../badge"
import { BadgeGroup } from "../badge-group"

function renderBadgeGroup(props: Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(BadgeGroup as unknown as string, props, {
                default: () => [
                  h(Badge, { variant: BadgeVariant.info }, { default: () => "Alpha" }),
                  h(Badge, { variant: BadgeVariant.success }, { default: () => "Beta" }),
                ],
              }),
          })
      },
    }),
  )
}

describe("Vue BadgeGroup (Molecule)", () => {
  it("renders a labeled group container with badge children", () => {
    renderBadgeGroup({ label: "Tags" })

    const group = screen.getByRole("group", { name: /tags/i })
    expect(group).toBeTruthy()
    expect(screen.getByText("Alpha")).toBeTruthy()
    expect(screen.getByText("Beta")).toBeTruthy()
  })

  it("applies mw-badge-group class on the container", () => {
    renderBadgeGroup({ label: "Status" })

    const group = screen.getByRole("group", { name: /status/i })
    expect(group.className).toContain("mw-badge-group")
  })

  it("merges custom className onto the container", () => {
    renderBadgeGroup({ label: "Status", className: "custom-group" })

    const group = screen.getByRole("group", { name: /status/i })
    expect(group.className).toContain("mw-badge-group")
    expect(group.className).toContain("custom-group")
  })

  it("spreads dataAttributes onto the wrapper", () => {
    renderBadgeGroup({ label: "Tags", dataAttributes: { "data-purpose": "status" } })

    const group = screen.getByRole("group", { name: /tags/i })
    expect(group.getAttribute("data-purpose")).toBe("status")
  })

  it("wires label into aria-labelledby on the group", () => {
    renderBadgeGroup({ label: "Categories" })

    const group = screen.getByRole("group")
    const labelledBy = group.getAttribute("aria-labelledby") ?? ""
    expect(labelledBy.length).toBeGreaterThan(0)

    const labelEl = document.getElementById(labelledBy)
    expect(labelEl).not.toBeNull()
    expect(labelEl?.textContent).toContain("Categories")
  })
})
