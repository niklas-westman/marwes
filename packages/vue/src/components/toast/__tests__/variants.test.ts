import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runToastContract } from "../../../../../../tests/contracts/toast.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ErrorToast, InfoToast, SuccessToast, WarningToast } from "../variants"

function renderWithProvider(component: string, children: string) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component, null, {
                default: () => children,
              }),
          })
      },
    }),
  )
}

runToastContract("vue", {
  renderSuccess() {
    renderWithProvider(SuccessToast as unknown as string, "Saved successfully.")
  },
  renderError() {
    renderWithProvider(ErrorToast as unknown as string, "Publishing failed.")
  },
  renderWarning() {
    renderWithProvider(WarningToast as unknown as string, "Storage is almost full.")
  },
  renderInfo() {
    renderWithProvider(InfoToast as unknown as string, "New release notes are available.")
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})

describe("Vue SuccessToast", () => {
  it("adds success metadata", () => {
    renderWithProvider(SuccessToast as unknown as string, "Saved successfully.")

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("success-toast")
    expect(toast.getAttribute("data-intent")).toBe("success")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("Vue ErrorToast", () => {
  it("uses alert semantics", () => {
    renderWithProvider(ErrorToast as unknown as string, "Publishing failed.")

    const toast = screen.getByRole("alert")
    expect(toast.getAttribute("data-purpose")).toBe("error-toast")
    expect(toast.getAttribute("data-intent")).toBe("error")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("Vue WarningToast", () => {
  it("adds warning metadata", () => {
    renderWithProvider(WarningToast as unknown as string, "Storage is almost full.")

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("warning-toast")
    expect(toast.getAttribute("data-intent")).toBe("warning")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("Vue InfoToast", () => {
  it("adds info metadata", () => {
    renderWithProvider(InfoToast as unknown as string, "New release notes are available.")

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("info-toast")
    expect(toast.getAttribute("data-intent")).toBe("info")
    expect(toast.className).toContain("mw-toast--outline")
  })
})
