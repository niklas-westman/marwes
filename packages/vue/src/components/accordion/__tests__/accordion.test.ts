/**
 * Vue adapter: Tests the Accordion component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h, ref } from "vue"
import { runAccordionContract } from "../../../../../../tests/contracts/accordion.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Accordion, type AccordionProps } from "../accordion"
import { AccordionField } from "../accordion-field"

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

runAccordionContract("vue", {
  async renderAccordion(args = {}) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(
                  Accordion,
                  {
                    ...(args.open !== undefined ? { open: args.open } : {}),
                    ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
                    ...(args.onToggle !== undefined ? { onToggle: args.onToggle } : {}),
                  },
                  {
                    title: () => args.title ?? "Shipping details",
                    default: () => "Panel content",
                  },
                ),
            })
        },
      }),
    )
  },
  async renderAccordionField(args) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(AccordionField, {
                  label: args.label,
                  ...(args.description !== undefined ? { description: args.description } : {}),
                  ...(args.error !== undefined ? { error: args.error } : {}),
                  ...(args.ariaDescribedBy !== undefined
                    ? { ariaDescribedBy: args.ariaDescribedBy }
                    : {}),
                  items:
                    args.items?.map((item) => ({
                      value: item.value,
                      title: item.title,
                      content: item.content,
                      ...(item.disabled !== undefined ? { disabled: item.disabled } : {}),
                    })) ?? [],
                  ...(args.multiple !== undefined ? { multiple: args.multiple } : {}),
                  ...(args.defaultOpenItems !== undefined
                    ? { defaultOpenItems: args.defaultOpenItems }
                    : {}),
                  ...(args.openItems !== undefined ? { openItems: args.openItems } : {}),
                  ...(args.onOpenItemsChange !== undefined
                    ? { onOpenItemsChange: args.onOpenItemsChange }
                    : {}),
                  ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
                }),
            })
        },
      }),
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})

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
    expect(trigger).toBeDisabled()

    await user.click(trigger)

    expect(toggleHandler).not.toHaveBeenCalled()
  })

  it("generates aria ids when id is omitted", () => {
    renderAccordion({ open: true })

    const trigger = screen.getByRole("button", { name: /test title/i })
    const panel = screen.getByRole("region")

    expect(trigger.id).toMatch(/^mw-accordion-\d+-trigger$/)
    expect(panel.id).toMatch(/^mw-accordion-\d+-panel$/)
    expect(trigger).toHaveAttribute("aria-controls", panel.id)
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id)
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
