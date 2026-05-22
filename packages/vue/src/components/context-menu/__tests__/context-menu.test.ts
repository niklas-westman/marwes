import { IconName } from "@marwes-ui/core"
import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ContextMenu } from "../context-menu"

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

describe("Vue ContextMenu", () => {
  it("renders a labelled menu with button-backed menu items and dividers", () => {
    renderWithProvider(() =>
      h(ContextMenu, {
        ariaLabel: "File actions",
        items: [
          { value: "edit", label: "Edit", icon: IconName.Edit },
          { kind: "divider" },
          { value: "delete", label: "Delete", icon: IconName.Trash, destructive: true },
        ],
      }),
    )

    const menu = screen.getByRole("menu", { name: /file actions/i })

    expect(menu).toHaveAttribute("data-component", "context-menu")
    expect(screen.getByRole("menuitem", { name: /edit/i })).toHaveAttribute("data-value", "edit")
    expect(screen.getByRole("separator")).toHaveAttribute("data-part", "divider")
    expect(screen.getByRole("menuitem", { name: /delete/i })).toHaveAttribute(
      "data-destructive",
      "true",
    )
  })

  it("emits selected action values and ignores disabled items", async () => {
    const onSelect = vi.fn()

    renderWithProvider(() =>
      h(ContextMenu, {
        items: [
          { value: "preview", label: "Preview" },
          { value: "download", label: "Download", disabled: true },
        ],
        onSelect,
      }),
    )

    await fireEvent.click(screen.getByRole("menuitem", { name: /preview/i }))
    await fireEvent.click(screen.getByRole("menuitem", { name: /download/i }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(
      "preview",
      expect.objectContaining({ value: "preview", label: "Preview" }),
    )
    expect(screen.getByRole("menuitem", { name: /download/i })).toBeDisabled()
  })
})
