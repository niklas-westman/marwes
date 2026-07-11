/**
 * Svelte adapter: Tests purpose variant components — BadgeGroup,
 * PrimaryButton, SecondaryButton, DestructiveButton, ConfirmButton,
 * and CancelButton class and attribute defaults.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import CancelButton from "../lib/components/button/CancelButton.svelte"
import ConfirmButton from "../lib/components/button/ConfirmButton.svelte"
import DestructiveButton from "../lib/components/button/DestructiveButton.svelte"
import IconButton from "../lib/components/button/IconButton.svelte"
import PrimaryButton from "../lib/components/button/PrimaryButton.svelte"
import SecondaryButton from "../lib/components/button/SecondaryButton.svelte"
import BadgeGroupContractFixture from "./type-fixtures/BadgeGroupContractFixture.svelte"

describe("BadgeGroup", () => {
  it("includes mw-badge-group class", () => {
    const { container } = render(BadgeGroupContractFixture, { props: { label: "Tags" } })
    const el = container.querySelector(".mw-badge-group")
    expect(el).not.toBeNull()
  })

  it("renders a fieldset with legend", () => {
    const { container } = render(BadgeGroupContractFixture, { props: { label: "Tags" } })
    const legend = container.querySelector("legend")
    expect(legend?.textContent).toContain("Tags")
  })
})

describe("Button purpose variants", () => {
  it("PrimaryButton renders with primary variant class", () => {
    const { container } = render(PrimaryButton)
    const btn = container.querySelector("button")
    expect(btn?.className).toContain("mw-btn--primary")
  })

  it("PrimaryButton sets data-variant=primary", () => {
    const { container } = render(PrimaryButton)
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("data-variant")).toBe("primary")
  })

  it("SecondaryButton renders with secondary variant class", () => {
    const { container } = render(SecondaryButton)
    const btn = container.querySelector("button")
    expect(btn?.className).toContain("mw-btn--secondary")
  })

  it("DestructiveButton renders with danger variant", () => {
    const { container } = render(DestructiveButton)
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("data-variant")).toBe("danger")
    expect(btn?.className).toContain("mw-btn--danger")
  })

  it("IconButton renders as an accessible square icon-only control", () => {
    const { container } = render(IconButton, { props: { icon: "x", ariaLabel: "Close" } })
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("aria-label")).toBe("Close")
    expect(btn?.getAttribute("data-icon-only")).toBe("true")
    expect(btn?.querySelector(".mw-btn__label")).toBeNull()
    expect(btn?.querySelector("svg")).not.toBeNull()
  })

  it("IconButton accepts label as the accessible name", () => {
    const { container } = render(IconButton, { props: { icon: "x", label: "Close" } })
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("aria-label")).toBe("Close")
  })

  it("ConfirmButton renders as a button", () => {
    const { container } = render(ConfirmButton)
    const btn = container.querySelector("button")
    expect(btn).not.toBeNull()
    expect(btn?.className).toContain("mw-btn")
  })

  it("CancelButton renders as a button", () => {
    const { container } = render(CancelButton)
    const btn = container.querySelector("button")
    expect(btn).not.toBeNull()
    expect(btn?.className).toContain("mw-btn")
  })
})
