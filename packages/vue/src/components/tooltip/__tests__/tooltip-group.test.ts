import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runTooltipContract } from "../../../../../../tests/contracts/tooltip.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Tooltip, type TooltipProps } from "../tooltip"
import { TooltipGroup } from "../tooltip-group"

function renderWithProvider(child: () => unknown) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: child,
          })
      },
    }),
  )
}

runTooltipContract("vue", {
  async renderTooltip(args = {}) {
    renderWithProvider(() =>
      h(
        Tooltip,
        {
          ...(args.id !== undefined ? ({ id: args.id } satisfies TooltipProps) : {}),
        },
        {
          default: () => args.children ?? "Helpful billing context",
        },
      ),
    )
  },
  async renderTooltipGroup(args = {}) {
    renderWithProvider(() => [
      h(TooltipGroup, {
        content: args.content ?? "Helpful billing context",
        ...(args.triggerLabel !== undefined ? { triggerLabel: args.triggerLabel } : {}),
        ...(args.open !== undefined ? { open: args.open } : {}),
        ...(args.defaultOpen !== undefined ? { defaultOpen: args.defaultOpen } : {}),
        ...(args.onOpenChange !== undefined ? { onOpenChange: args.onOpenChange } : {}),
        ...(args.tooltipId !== undefined ? { tooltipId: args.tooltipId } : {}),
      }),
      h(
        "button",
        {
          type: "button",
        },
        "Outside",
      ),
    ])
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async hover(element) {
    await userEvent.setup().hover(element)
  },
  async unhover(element) {
    await userEvent.setup().unhover(element)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
  async tab() {
    await userEvent.setup().tab()
  },
  async keyboard(text) {
    await userEvent.setup().keyboard(text)
  },
})

describe("Vue TooltipGroup specifics", () => {
  it("supports renderable node content inside the tooltip bubble", () => {
    renderWithProvider(() =>
      h(TooltipGroup, {
        content: h("strong", null, "Helpful billing context"),
        triggerLabel: "Show billing help",
        defaultOpen: true,
      }),
    )

    const tooltip = screen.getByRole("tooltip")
    const emphasizedText = screen.getByText("Helpful billing context")

    expect(tooltip).toContainElement(emphasizedText)
    expect(emphasizedText.tagName).toBe("STRONG")
  })
})
