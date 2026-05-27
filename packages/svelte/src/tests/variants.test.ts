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

  it("DestructiveButton renders with error attribute", () => {
    const { container } = render(DestructiveButton)
    const btn = container.querySelector("button")
    expect(btn?.getAttribute("data-error")).toBe("true")
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
