/**
 * Vue adapter: Tests Toast purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h, nextTick, onMounted } from "vue"
import { runToastContract } from "../../../../../../tests/contracts/toast.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Toast } from "../toast"
import { ToastContainer } from "../toast-container"
import { ToastProvider, useToast } from "../toast-provider"
import { ErrorToast, InfoToast, SuccessToast, WarningToast } from "../variants"

function renderVariantWithProvider(component: unknown, children: string) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, null, {
                default: () => children,
              }),
          })
      },
    }),
  )
}

runToastContract("vue", {
  async renderRawToast(args) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(
                  Toast as never,
                  {
                    ...(args?.ariaLive ? { ariaLive: args.ariaLive } : {}),
                    ...(args?.dismissible ? { onDismiss: () => {} } : {}),
                  },
                  {
                    default: () => args?.children ?? "Project saved.",
                  },
                ),
            })
        },
      }),
    )

    await nextTick()
  },
  async renderSuccess() {
    renderVariantWithProvider(SuccessToast, "Saved successfully.")
    await nextTick()
  },
  async renderError() {
    renderVariantWithProvider(ErrorToast, "Publishing failed.")
    await nextTick()
  },
  async renderWarning() {
    renderVariantWithProvider(WarningToast, "Storage is almost full.")
    await nextTick()
  },
  async renderInfo() {
    renderVariantWithProvider(InfoToast, "New release notes are available.")
    await nextTick()
  },
  async renderContainer(args) {
    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(ToastContainer as never, {
                  toasts: args.toasts.map((toast) => ({
                    ...toast,
                  })),
                  ...(args.maxVisible !== undefined ? { maxVisible: args.maxVisible } : {}),
                  ...(args.onDismiss ? { onDismiss: args.onDismiss } : {}),
                }),
            })
        },
      }),
    )

    await nextTick()
  },
  async renderProvider(args) {
    const AutoShowToast = defineComponent({
      setup() {
        const toast = useToast()

        onMounted(() => {
          toast.show({
            children: args.toast.children,
            ...(args.toast.intent ? { intent: args.toast.intent } : {}),
            ...(args.toast.duration !== undefined ? { duration: args.toast.duration } : {}),
          })
        })

        return () => h("div", "Toast test harness")
      },
    })

    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(
                  ToastProvider as never,
                  {
                    ...(args.defaultDuration !== undefined
                      ? { defaultDuration: args.defaultDuration }
                      : {}),
                  },
                  {
                    default: () => h(AutoShowToast),
                  },
                ),
            })
        },
      }),
    )

    await nextTick()
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryByText(text) {
    return screen.queryByText(text)
  },
  getContainerItemByText(text) {
    const item = screen.getByText(text).closest(".mw-toast-container__item")

    if (!item) {
      throw new Error(`Toast container item not found for text: ${text}`)
    }

    return item as HTMLElement
  },
  click(element) {
    return fireEvent.click(element)
  },
  hover(element) {
    return fireEvent.mouseEnter(element)
  },
  unhover(element) {
    return fireEvent.mouseLeave(element)
  },
  focus(element) {
    return fireEvent.focusIn(element)
  },
  blur(element) {
    return fireEvent.focusOut(element)
  },
  async advanceTime(ms) {
    vi.advanceTimersByTime(ms)
    await nextTick()
  },
})

describe("Vue SuccessToast", () => {
  it("adds success metadata", async () => {
    renderVariantWithProvider(SuccessToast, "Saved successfully.")
    await nextTick()

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("success-toast")
    expect(toast.getAttribute("data-intent")).toBe("success")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("Vue ErrorToast", () => {
  it("uses alert semantics", async () => {
    renderVariantWithProvider(ErrorToast, "Publishing failed.")
    await nextTick()

    const toast = screen.getByRole("alert")
    expect(toast.getAttribute("data-purpose")).toBe("error-toast")
    expect(toast.getAttribute("data-intent")).toBe("error")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("Vue WarningToast", () => {
  it("adds warning metadata", async () => {
    renderVariantWithProvider(WarningToast, "Storage is almost full.")
    await nextTick()

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("warning-toast")
    expect(toast.getAttribute("data-intent")).toBe("warning")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("Vue InfoToast", () => {
  it("adds info metadata", async () => {
    renderVariantWithProvider(InfoToast, "New release notes are available.")
    await nextTick()

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("info-toast")
    expect(toast.getAttribute("data-intent")).toBe("info")
    expect(toast.className).toContain("mw-toast--outline")
  })
})
