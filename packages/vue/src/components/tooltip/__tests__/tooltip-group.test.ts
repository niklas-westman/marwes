import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h, ref } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
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

describe("Vue TooltipGroup (Molecule)", () => {
  it("shows the tooltip bubble on hover and wires aria-describedby", async () => {
    const user = userEvent.setup()

    renderWithProvider(() =>
      h(TooltipGroup, {
        content: "Helpful context",
        triggerLabel: "Show help",
      }),
    )

    const trigger = screen.getByRole("button", { name: /show help/i })
    expect(screen.queryByRole("tooltip")).toBeNull()

    await user.hover(trigger)

    const tooltip = screen.getByRole("tooltip")
    expect(tooltip).toHaveTextContent("Helpful context")
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id)
  })

  it("hides the tooltip bubble after Escape", async () => {
    const user = userEvent.setup()

    renderWithProvider(() =>
      h(TooltipGroup, {
        content: "Helpful context",
        triggerLabel: "Show help",
        defaultOpen: true,
      }),
    )

    const trigger = screen.getByRole("button", { name: /show help/i })
    expect(screen.getByRole("tooltip")).toBeTruthy()

    await user.click(trigger)
    await user.keyboard("{Escape}")

    expect(screen.queryByRole("tooltip")).toBeNull()
    expect(trigger).not.toHaveAttribute("aria-describedby")
  })

  it("supports controlled open state changes", async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()

    const Example = defineComponent({
      setup() {
        const open = ref(true)

        return () =>
          h(TooltipGroup, {
            content: "Helpful context",
            triggerLabel: "Show help",
            open: open.value,
            onOpenChange: handleOpenChange,
          })
      },
    })

    renderWithProvider(() => h(Example))

    const trigger = screen.getByRole("button", { name: /show help/i })
    expect(screen.getByRole("tooltip")).toBeTruthy()

    await user.hover(trigger)
    await user.unhover(trigger)

    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })
})
