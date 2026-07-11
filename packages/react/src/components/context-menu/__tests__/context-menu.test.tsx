import { IconName } from "@marwes-ui/core"
import { fireEvent, render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ContextMenu } from "../context-menu"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("ContextMenu", () => {
  it("renders a labelled menu with button-backed menu items and dividers", () => {
    renderWithProvider(
      <ContextMenu
        ariaLabel="File actions"
        items={[
          { value: "edit", label: "Edit", icon: IconName.Edit },
          { kind: "divider" },
          { value: "delete", label: "Delete", icon: IconName.Trash, destructive: true },
        ]}
      />,
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

  it("emits selected action values and ignores disabled items", () => {
    const onSelect = vi.fn()

    renderWithProvider(
      <ContextMenu
        items={[
          { value: "preview", label: "Preview" },
          { value: "download", label: "Download", disabled: true },
        ]}
        onSelect={onSelect}
      />,
    )

    fireEvent.click(screen.getByRole("menuitem", { name: /preview/i }))
    fireEvent.click(screen.getByRole("menuitem", { name: /download/i }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(
      "preview",
      expect.objectContaining({ value: "preview", label: "Preview" }),
    )
    expect(screen.getByRole("menuitem", { name: /download/i })).toBeDisabled()
  })
})
