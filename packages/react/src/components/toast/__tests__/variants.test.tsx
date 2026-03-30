import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ErrorToast, InfoToast, SuccessToast, WarningToast } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("SuccessToast", () => {
  it("adds success metadata and defaults to the outline emphasis", () => {
    renderWithProvider(<SuccessToast>Saved successfully.</SuccessToast>)

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("success-toast")
    expect(toast.getAttribute("data-intent")).toBe("success")
    expect(toast.className).toContain("mw-toast--outline")
    expect(toast.querySelector(".mw-toast__icon svg")).not.toBeNull()
  })
})

describe("ErrorToast", () => {
  it("uses assertive announcements for urgent errors and defaults to outline", () => {
    renderWithProvider(<ErrorToast>Publishing failed.</ErrorToast>)

    const toast = screen.getByRole("alert")
    expect(toast.getAttribute("data-purpose")).toBe("error-toast")
    expect(toast.getAttribute("data-intent")).toBe("error")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("WarningToast", () => {
  it("adds warning metadata", () => {
    renderWithProvider(<WarningToast>Storage is almost full.</WarningToast>)

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("warning-toast")
    expect(toast.getAttribute("data-intent")).toBe("warning")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("InfoToast", () => {
  it("adds info metadata", () => {
    renderWithProvider(<InfoToast>New release notes are available.</InfoToast>)

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("info-toast")
    expect(toast.getAttribute("data-intent")).toBe("info")
    expect(toast.className).toContain("mw-toast--outline")
  })
})
