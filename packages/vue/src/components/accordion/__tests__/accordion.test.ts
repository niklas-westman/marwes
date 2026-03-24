import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h, ref } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Accordion, type AccordionProps } from "../accordion"

function renderAccordion(
  props: AccordionProps & Record<string, unknown>,
  slots?: Record<string, () => unknown>,
) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(Accordion as unknown as string, props, {
                title: slots?.title ?? (() => "Test title"),
                default: slots?.default ?? (() => "Test content"),
              }),
          })
      },
    }),
  )
}

describe("Vue Accordion atom", () => {
  it("renders trigger button and panel", () => {
    renderAccordion({ id: "acc-1", open: true })

    expect(screen.getByRole("button", { name: /test title/i })).toBeTruthy()
    expect(screen.getByRole("region")).toBeTruthy()
  })

  it("emits toggle event when trigger is clicked", async () => {
    const user = userEvent.setup()
    const toggleHandler = vi.fn()

    renderAccordion({ id: "acc-2", open: false, onToggle: toggleHandler })

    const trigger = screen.getByRole("button", { name: /test title/i })
    await user.click(trigger)

    expect(toggleHandler).toHaveBeenCalledTimes(1)
  })

  it("does not emit toggle when disabled", async () => {
    const user = userEvent.setup()
    const toggleHandler = vi.fn()

    renderAccordion({ id: "acc-3", open: false, disabled: true, onToggle: toggleHandler })

    const trigger = screen.getByRole("button", { name: /test title/i })
    await user.click(trigger)

    expect(toggleHandler).not.toHaveBeenCalled()
  })

  it("works with v-model-like @toggle pattern in templates", async () => {
    const user = userEvent.setup()

    render(
      defineComponent({
        setup() {
          const open = ref(false)
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(
                  Accordion,
                  {
                    id: "acc-4",
                    open: open.value,
                    onToggle: () => {
                      open.value = !open.value
                    },
                  },
                  {
                    title: () => "Toggle me",
                    default: () => "Panel content",
                  },
                ),
            })
        },
      }),
    )

    const trigger = screen.getByRole("button", { name: /toggle me/i })

    // Initially closed — panel hidden
    expect(screen.queryByText("Panel content")?.closest("[hidden]")).not.toBeNull()

    // Click to open
    await user.click(trigger)
    const panel = screen.getByText("Panel content").closest("[hidden]")
    expect(panel).toBeNull()

    // Click to close
    await user.click(trigger)
    expect(screen.getByText("Panel content").closest("[hidden]")).not.toBeNull()
  })
})
