import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runDialogContract } from "../../../../../../tests/contracts/dialog.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ConfirmDialog, DestructiveDialog, InfoDialog } from "../variants"

function renderWithProvider(component: unknown, props: Record<string, unknown>, content: string) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, props, {
                default: () => content,
              }),
          })
      },
    }),
  )
}

runDialogContract("vue", {
  renderConfirm() {
    renderWithProvider(
      ConfirmDialog,
      {
        open: true,
        portalTarget: null,
        title: "Publish update",
        description: "This notifies subscribers immediately.",
      },
      "Review the release notes before confirming.",
    )
  },
  renderDestructive() {
    renderWithProvider(
      DestructiveDialog,
      {
        open: true,
        portalTarget: null,
        title: "Delete workspace",
        description: "This cannot be undone.",
      },
      "All projects and members will be removed.",
    )
  },
  renderInfo() {
    renderWithProvider(
      InfoDialog,
      {
        open: true,
        portalTarget: null,
        title: "Maintenance notice",
        description: "The workspace will be read-only for 10 minutes.",
      },
      "Save your work before the maintenance window begins.",
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

describe("Vue ConfirmDialog", () => {
  it("adds confirm metadata and default actions", () => {
    renderWithProvider(
      ConfirmDialog,
      {
        open: true,
        portalTarget: null,
        title: "Publish update",
        description: "This notifies subscribers immediately.",
      },
      "Review the release notes before confirming.",
    )

    const dialog = screen.getByRole("dialog", { name: /publish update/i })
    expect(dialog.getAttribute("data-purpose")).toBe("confirm-dialog")
    expect(dialog.getAttribute("data-intent")).toBe("confirm")
    expect(screen.getByRole("button", { name: /cancel/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /confirm/i })).toBeTruthy()
  })
})

describe("Vue DestructiveDialog", () => {
  it("adds destructive metadata and a danger action", () => {
    renderWithProvider(
      DestructiveDialog,
      {
        open: true,
        portalTarget: null,
        title: "Delete workspace",
        description: "This cannot be undone.",
      },
      "All projects and members will be removed.",
    )

    const dialog = screen.getByRole("dialog", { name: /delete workspace/i })
    expect(dialog.getAttribute("data-purpose")).toBe("destructive-dialog")
    expect(dialog.getAttribute("data-intent")).toBe("destructive")
    expect(screen.getByRole("button", { name: /delete/i })).toBeTruthy()
  })
})

describe("Vue InfoDialog", () => {
  it("adds info metadata and a single acknowledgement action", () => {
    renderWithProvider(
      InfoDialog,
      {
        open: true,
        portalTarget: null,
        title: "Maintenance notice",
        description: "The workspace will be read-only for 10 minutes.",
      },
      "Save your work before the maintenance window begins.",
    )

    const dialog = screen.getByRole("dialog", { name: /maintenance notice/i })
    expect(dialog.getAttribute("data-purpose")).toBe("info-dialog")
    expect(dialog.getAttribute("data-intent")).toBe("info")
    expect(screen.getByRole("button", { name: /okay/i })).toBeTruthy()
  })
})
