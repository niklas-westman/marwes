/**
 * Svelte adapter: tests Drawer base class, a11y wiring, variants, and close behavior.
 */
import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Drawer from "../lib/components/drawer/Drawer.svelte"

describe("Drawer", () => {
  it("renders a panel with role dialog", () => {
    const { container } = render(Drawer, {
      props: { title: "Test drawer" },
    })
    const drawer = container.querySelector('.mw-drawer__panel[role="dialog"]')
    expect(drawer).not.toBeNull()
  })

  it("uses the title as the accessible name via aria-labelledby", () => {
    const { container } = render(Drawer, {
      props: { title: "Drawer title" },
    })
    const drawer = container.querySelector('[role="dialog"]')
    const labelledBy = drawer?.getAttribute("aria-labelledby")
    expect(labelledBy).toBeTruthy()

    const titleEl = container.querySelector(`#${labelledBy}`)
    expect(titleEl?.textContent).toBe("Drawer title")
  })

  it("wires description via aria-describedby", () => {
    const { container } = render(Drawer, {
      props: {
        title: "Test",
        description: "Describe the purpose.",
      },
    })
    const drawer = container.querySelector('[role="dialog"]')
    const describedBy = drawer?.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()

    const descEl = container.querySelector(`#${describedBy}`)
    expect(descEl?.textContent).toBe("Describe the purpose.")
  })

  it("falls back to aria-label when no title is provided", () => {
    const { container } = render(Drawer, {
      props: { ariaLabel: "Filters" },
    })
    const drawer = container.querySelector('[role="dialog"]')
    expect(drawer?.getAttribute("aria-label")).toBe("Filters")
    expect(drawer?.getAttribute("aria-labelledby")).toBeNull()
  })

  it("renders size, placement, footer, and scrim state from the core recipe", () => {
    const { container } = render(Drawer, {
      props: {
        title: "Panel",
        size: "large",
        placement: "left",
        showScrim: false,
        showFooter: false,
      },
    })
    const root = container.querySelector(".mw-drawer")

    expect(root?.className).toContain("mw-drawer--large")
    expect(root?.className).toContain("mw-drawer--left")
    expect(root?.className).toContain("mw-drawer--without-footer")
    expect(root?.getAttribute("data-scrim")).toBe("false")
    expect(container.querySelector(".mw-drawer__scrim")).toBeNull()
  })

  it("calls onclose from the close button and dismissible scrim", async () => {
    const onclose = vi.fn()
    const { container } = render(Drawer, {
      props: { title: "Close me", onclose },
    })

    await fireEvent.click(container.querySelector(".mw-drawer__close") as HTMLElement)
    await fireEvent.click(container.querySelector(".mw-drawer__scrim") as HTMLElement)

    expect(onclose).toHaveBeenCalledTimes(2)
  })
})
