import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h, ref } from "vue"
import { runDialogModalContract } from "../../../../../../tests/contracts/dialog-modal.contract"
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

runDialogModalContract("vue", {
  renderOpenDialogModal(args = {}) {
    renderWithProvider(() => [
      h(
        "button",
        {
          type: "button",
        },
        "Outside",
      ),
      h(
        DialogModal,
        {
          open: true,
          portalTarget: null,
          ...(args.title !== undefined ? { title: args.title } : {}),
          ...(args.description !== undefined ? { description: args.description } : {}),
          ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
          ...(args.dismissible !== undefined ? { dismissible: args.dismissible } : {}),
          ...(args.closeOnEscape !== undefined ? { closeOnEscape: args.closeOnEscape } : {}),
          ...(args.closeOnScrimClick !== undefined
            ? { closeOnScrimClick: args.closeOnScrimClick }
            : {}),
          ...(args.onOpenChange !== undefined ? { "onUpdate:open": args.onOpenChange } : {}),
          ...(args.showFooter === false
            ? {}
            : {
                footer: [
                  h("button", { type: "button" }, "Cancel"),
                  h("button", { type: "button" }, "Confirm"),
                ],
              }),
        },
        {
          default: () =>
            args.includeInput
              ? [h("input", { "aria-label": "Workspace name", value: "Acme" })]
              : [h("p", null, "Dialog content")],
        },
      ),
      h(
        "button",
        {
          type: "button",
        },
        "After dialog",
      ),
    ])
  },
  renderTriggerDialogModal(args = {}) {
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
              ...(args.title !== undefined ? { title: args.title } : {}),
              ...(args.description !== undefined ? { description: args.description } : {}),
              ...(args.restoreFocus !== undefined ? { restoreFocus: args.restoreFocus } : {}),
              ...(args.closeOnScrimClick !== undefined
                ? { closeOnScrimClick: args.closeOnScrimClick }
                : {}),
              footer: h("button", { type: "button" }, "Done"),
              "onUpdate:open": (nextOpen: boolean) => {
                open.value = nextOpen
              },
            },
            {
              default: () => [h("p", null, "Dialog content")],
            },
          ),
        ]
      },
    })

    renderWithProvider(() => h(Example))
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  getScrim() {
    const scrim = document.querySelector(".mw-dialog-modal__scrim")

    if (!(scrim instanceof HTMLElement)) {
      throw new Error("Expected dialog scrim to exist")
    }

    return scrim
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
  async tab(options) {
    await userEvent.setup().tab(options)
  },
  async keyboard(text) {
    await userEvent.setup().keyboard(text)
  },
  waitFor(assertion) {
    return waitFor(assertion)
  },
})

describe("Vue DialogModal specifics", () => {
  it("does not request close on Escape when escape dismissal is disabled", async () => {
    const emittedValues: boolean[] = []

    renderWithProvider(() =>
      h(
        DialogModal,
        {
          open: true,
          portalTarget: null,
          title: "Rename workspace",
          closeOnEscape: false,
          footer: h("button", { type: "button" }, "Save"),
          "onUpdate:open": (open: boolean) => {
            emittedValues.push(open)
          },
        },
        {
          default: () => [h("input", { "aria-label": "Workspace name", value: "Acme" })],
        },
      ),
    )

    await userEvent.setup().keyboard("{Escape}")

    expect(emittedValues).toEqual([])
    expect(screen.getByRole("dialog", { name: /rename workspace/i })).toBeInTheDocument()
  })

  it("does not request close on scrim click when scrim dismissal is disabled", async () => {
    const emittedValues: boolean[] = []

    renderWithProvider(() =>
      h(
        DialogModal,
        {
          open: true,
          portalTarget: null,
          title: "Invite teammate",
          closeOnScrimClick: false,
          footer: h("button", { type: "button" }, "Done"),
          "onUpdate:open": (open: boolean) => {
            emittedValues.push(open)
          },
        },
        {
          default: () => [h("p", null, "Choose a role before sending the invite.")],
        },
      ),
    )

    const scrim = document.querySelector(".mw-dialog-modal__scrim")
    if (!(scrim instanceof HTMLElement)) {
      throw new Error("Expected dialog scrim to exist")
    }

    await userEvent.setup().click(scrim)

    expect(emittedValues).toEqual([])
    expect(screen.getByRole("dialog", { name: /invite teammate/i })).toBeInTheDocument()
  })
})
