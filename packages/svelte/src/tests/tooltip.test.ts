/**
 * Svelte adapter: Tests Tooltip and TooltipGroup — base class,
 * role=tooltip, trigger rendering, and group wrapper.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Tooltip from "../lib/components/tooltip/Tooltip.svelte"
import TooltipGroup from "../lib/components/tooltip/TooltipGroup.svelte"

describe("Tooltip", () => {
  it("renders a span with role=tooltip", () => {
    const { container } = render(Tooltip)
    const el = container.querySelector('[role="tooltip"]')
    expect(el).not.toBeNull()
  })

  it("includes mw-tooltip class", () => {
    const { container } = render(Tooltip)
    const el = container.querySelector(".mw-tooltip")
    expect(el).not.toBeNull()
  })
})

describe("TooltipGroup", () => {
  it("renders with mw-tooltip-group class", () => {
    const { container } = render(TooltipGroup, {
      props: { content: "Help text", triggerLabel: "Show help" },
    })
    const el = container.querySelector(".mw-tooltip-group")
    expect(el).not.toBeNull()
  })

  it("renders a trigger button with accessible label", () => {
    const { container } = render(TooltipGroup, {
      props: { content: "Help text", triggerLabel: "Show help" },
    })
    const btn = container.querySelector('button[aria-label="Show help"]')
    expect(btn).not.toBeNull()
  })

  it("shows tooltip when defaultOpen is true", () => {
    const { container } = render(TooltipGroup, {
      props: { content: "Help text", triggerLabel: "Show help", defaultOpen: true },
    })
    const tooltip = container.querySelector('[role="tooltip"]')
    expect(tooltip).not.toBeNull()
  })

  it("hides tooltip by default", () => {
    const { container } = render(TooltipGroup, {
      props: { content: "Help text", triggerLabel: "Show help" },
    })
    const tooltip = container.querySelector('[role="tooltip"]')
    expect(tooltip).toBeNull()
  })

  it("sets data-component=tooltip-group", () => {
    const { container } = render(TooltipGroup, {
      props: { content: "Help text", triggerLabel: "Show help" },
    })
    const el = container.querySelector('[data-component="tooltip-group"]')
    expect(el).not.toBeNull()
  })
})
