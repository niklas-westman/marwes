import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import ErrorToast from "../lib/components/toast/ErrorToast.svelte"
import InfoToast from "../lib/components/toast/InfoToast.svelte"
import SuccessToast from "../lib/components/toast/SuccessToast.svelte"
import Toast from "../lib/components/toast/Toast.svelte"
import WarningToast from "../lib/components/toast/WarningToast.svelte"

describe("Toast", () => {
  it("renders with role status", () => {
    const { container } = render(Toast)
    const toast = container.querySelector('[role="status"]')
    expect(toast).not.toBeNull()
  })

  it("sets aria-live attribute", () => {
    const { container } = render(Toast)
    const toast = container.querySelector('[role="status"]')
    expect(toast?.getAttribute("aria-live")).toBeTruthy()
  })

  it("sets aria-atomic to true", () => {
    const { container } = render(Toast)
    const toast = container.querySelector('[role="status"]')
    expect(toast?.getAttribute("aria-atomic")).toBe("true")
  })

  it("includes mw-toast class", () => {
    const { container } = render(Toast)
    const toast = container.querySelector('[role="status"]')
    expect(toast?.className).toContain("mw-toast")
  })

  it("renders dismiss button when ondismiss is provided", () => {
    const { container } = render(Toast, {
      props: { ondismiss: () => {} },
    })
    const dismissBtn = container.querySelector(".mw-toast__dismiss")
    expect(dismissBtn).not.toBeNull()
  })

  it("does not render dismiss button without ondismiss", () => {
    const { container } = render(Toast)
    const dismissBtn = container.querySelector(".mw-toast__dismiss")
    expect(dismissBtn).toBeNull()
  })
})

describe("Purpose toasts", () => {
  it("ErrorToast sets data-purpose", () => {
    const { container } = render(ErrorToast)
    const toast = container.querySelector('[data-purpose="error-toast"]')
    expect(toast).not.toBeNull()
  })

  it("InfoToast sets data-purpose", () => {
    const { container } = render(InfoToast)
    const toast = container.querySelector('[data-purpose="info-toast"]')
    expect(toast).not.toBeNull()
  })

  it("SuccessToast sets data-purpose", () => {
    const { container } = render(SuccessToast)
    const toast = container.querySelector('[data-purpose="success-toast"]')
    expect(toast).not.toBeNull()
  })

  it("WarningToast sets data-purpose", () => {
    const { container } = render(WarningToast)
    const toast = container.querySelector('[data-purpose="warning-toast"]')
    expect(toast).not.toBeNull()
  })
})
