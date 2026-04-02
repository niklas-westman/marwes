import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h, ref } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { DialogModal } from "../dialog-modal"

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

describe("Vue DialogModal", () => {
  it("renders a labeled modal dialog with description and footer actions", () => {
    renderWithProvider(() =>
      h(
        DialogModal,
        {
          open: true,
          portalTarget: null,
          title: "Archive project",
          description: "Archiving hides the project from active views.",
          footer: [
            h("button", { type: "button" }, "Cancel"),
            h("button", { type: "button" }, "Archive"),
          ],
        },
        {
          default: () => [h("p", null, "Project Phoenix will move to the archive.")],
        },
      ),
    )

    const dialog = screen.getByRole("dialog", { name: /archive project/i })
    expect(dialog.getAttribute("aria-describedby")).toContain("description")
    expect(screen.getByText("Project Phoenix will move to the archive.")).toBeTruthy()
    expect(screen.getByRole("button", { name: /close dialog/i })).toBeTruthy()
    expect(dialog.querySelector(".mw-dialog__footer")).not.toBeNull()
  })

  it("supports backdrop dismissal and restores focus to the trigger", async () => {
    const user = userEvent.setup()

    const Example = defineComponent({
      setup() {
        const open = ref(false)

        return () => [
          h(
            "button",
            {
              type: "button",
              onClick: () => {
                open.value = true
              },
            },
            "Open dialog",
          ),
          h(
            DialogModal,
            {
              open: open.value,
              portalTarget: null,
              "onUpdate:open": (nextOpen: boolean) => {
                open.value = nextOpen
              },
              title: "Invite teammate",
              description: "Send an email invitation.",
              footer: h("button", { type: "button" }, "Done"),
            },
            {
              default: () => [h("p", null, "Choose a role before sending the invite.")],
            },
          ),
        ]
      },
    })

    renderWithProvider(() => h(Example))

    const trigger = screen.getByRole("button", { name: /open dialog/i })
    trigger.focus()

    await user.click(trigger)

    expect(screen.getByRole("dialog", { name: /invite teammate/i })).toBeTruthy()

    const overlay = document.querySelector(".mw-dialog-modal")
    if (!(overlay instanceof HTMLElement)) {
      throw new Error("Expected dialog overlay to exist")
    }

    await user.click(overlay)

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /invite teammate/i })).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })
  })

  it("supports escape dismissal", async () => {
    const user = userEvent.setup()

    const Example = defineComponent({
      setup() {
        const open = ref(true)

        return () =>
          h(
            DialogModal,
            {
              open: open.value,
              portalTarget: null,
              "onUpdate:open": (nextOpen: boolean) => {
                open.value = nextOpen
              },
              title: "Rename workspace",
              description: "Update the workspace name for all collaborators.",
              footer: h("button", { type: "button" }, "Save"),
            },
            {
              default: () => [h("input", { "aria-label": "Workspace name", value: "Acme" })],
            },
          )
      },
    })

    renderWithProvider(() => h(Example))

    expect(screen.getByRole("dialog", { name: /rename workspace/i })).toBeTruthy()

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /rename workspace/i })).toBeNull()
    })
  })
})
