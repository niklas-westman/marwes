/**
 * Svelte adapter: Tests the Banner atom — rendering, variant classes, a11y roles,
 * icon visibility, dismiss button, and purpose variants.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Banner from "../lib/components/banner/Banner.svelte"
import ErrorBanner from "../lib/components/banner/ErrorBanner.svelte"
import InfoBanner from "../lib/components/banner/InfoBanner.svelte"
import SuccessBanner from "../lib/components/banner/SuccessBanner.svelte"
import WarningBanner from "../lib/components/banner/WarningBanner.svelte"

describe("Banner", () => {
  it("renders with mw-banner class and neutral variant by default", () => {
    const { container } = render(Banner)
    const root = container.querySelector("[data-component='banner']")
    expect(root).not.toBeNull()
    expect(root?.classList.contains("mw-banner")).toBe(true)
    expect(root?.classList.contains("mw-banner--neutral")).toBe(true)
  })

  it("applies variant class for info", () => {
    const { container } = render(Banner, { props: { variant: "info" } })
    const root = container.querySelector("[data-component='banner']")
    expect(root?.classList.contains("mw-banner--info")).toBe(true)
  })

  it("uses role=status for info/success/neutral", () => {
    const { container } = render(Banner, { props: { variant: "info" } })
    const root = container.querySelector("[role='status']")
    expect(root).not.toBeNull()
    expect(root?.getAttribute("aria-live")).toBe("polite")
  })

  it("uses role=alert for error/warning", () => {
    const { container } = render(Banner, { props: { variant: "error" } })
    const root = container.querySelector("[role='alert']")
    expect(root).not.toBeNull()
    expect(root?.getAttribute("aria-live")).toBe("assertive")
  })

  it("shows icon by default", () => {
    const { container } = render(Banner)
    const icon = container.querySelector(".mw-banner__icon")
    expect(icon).not.toBeNull()
  })

  it("hides icon when showIcon is false", () => {
    const { container } = render(Banner, { props: { showIcon: false } })
    const icon = container.querySelector(".mw-banner__icon")
    expect(icon).toBeNull()
  })

  it("shows dismiss button by default", () => {
    const { container } = render(Banner)
    const dismiss = container.querySelector(".mw-banner__dismiss")
    expect(dismiss).not.toBeNull()
    expect(dismiss?.getAttribute("aria-label")).toBe("Dismiss banner")
  })

  it("hides dismiss button when dismissible is false", () => {
    const { container } = render(Banner, { props: { dismissible: false } })
    const dismiss = container.querySelector(".mw-banner__dismiss")
    expect(dismiss).toBeNull()
  })
})

describe("Banner purpose variants", () => {
  it("InfoBanner renders with info variant", () => {
    const { container } = render(InfoBanner)
    const root = container.querySelector("[data-component='banner']")
    expect(root?.classList.contains("mw-banner--info")).toBe(true)
  })

  it("SuccessBanner renders with success variant", () => {
    const { container } = render(SuccessBanner)
    const root = container.querySelector("[data-component='banner']")
    expect(root?.classList.contains("mw-banner--success")).toBe(true)
  })

  it("WarningBanner renders with warning variant", () => {
    const { container } = render(WarningBanner)
    const root = container.querySelector("[data-component='banner']")
    expect(root?.classList.contains("mw-banner--warning")).toBe(true)
  })

  it("ErrorBanner renders with error variant", () => {
    const { container } = render(ErrorBanner)
    const root = container.querySelector("[data-component='banner']")
    expect(root?.classList.contains("mw-banner--error")).toBe(true)
  })
})
