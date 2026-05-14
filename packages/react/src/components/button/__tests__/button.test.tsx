/**
 * React Button adapter tests.
 *
 * Cross-adapter behavior (click, disabled, loading, link) is covered by the shared
 * button contract. Semantic defaults for purpose buttons (SaveButton, ConfirmButton, etc.)
 * are covered by the button-semantics contract. This file tests React-specific concerns:
 * synthetic events, className merging, and loading spinner rendering.
 */
import type * as React from "react"

import { SpinnerVariants } from "@marwes-ui/core"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  Button,
  CancelButton,
  CloseButton,
  ConfirmButton,
  CopyButton,
  DestructiveButton,
  DownloadButton,
  DropdownButton,
  EditButton,
  FilterButton,
  LinkButton,
  PrimaryButton,
  RefreshButton,
  SaveButton,
  SearchButton,
  SortButton,
  UploadButton,
  VerifyButton,
} from ".."
import { runButtonSemanticsContract } from "../../../../../../tests/contracts/button-semantics.contract"
import { runButtonContract } from "../../../../../../tests/contracts/button.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runButtonContract("react", {
  async renderPrimary(args = {}) {
    const buttonProps = {
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.loading !== undefined ? { loading: args.loading } : {}),
      ...(args.onClick ? { onClick: args.onClick } : {}),
    }

    renderWithProvider(<PrimaryButton {...buttonProps}>{args.text ?? "Primary"}</PrimaryButton>)
  },
  async renderLink(args) {
    const linkProps = {
      href: args.href,
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.onClick ? { onClick: args.onClick } : {}),
    }

    renderWithProvider(<LinkButton {...linkProps}>{args.text}</LinkButton>)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})

runButtonSemanticsContract("react", {
  renderSaveConfirmVerify() {
    renderWithProvider(
      <>
        <SaveButton>Save</SaveButton>
        <ConfirmButton>Confirm</ConfirmButton>
        <VerifyButton>Verify</VerifyButton>
      </>,
    )
  },
  renderLinkButton() {
    renderWithProvider(<LinkButton href="/dashboard">Dashboard</LinkButton>)
  },
  renderCancelEditCloseRefreshDestructive() {
    renderWithProvider(
      <>
        <CancelButton>Cancel</CancelButton>
        <EditButton>Edit</EditButton>
        <CloseButton>Close</CloseButton>
        <RefreshButton>Refresh</RefreshButton>
        <DestructiveButton>Delete</DestructiveButton>
      </>,
    )
  },
  renderWave2Utilities() {
    renderWithProvider(
      <>
        <UploadButton>Upload</UploadButton>
        <DownloadButton>Download</DownloadButton>
        <CopyButton>Copy</CopyButton>
        <SearchButton>Search</SearchButton>
        <FilterButton>Filter</FilterButton>
        <SortButton>Sort</SortButton>
        <DropdownButton>Dropdown</DropdownButton>
      </>,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

describe("React adapter specifics: Button", () => {
  it("passes a React synthetic event to onClick", async () => {
    const onClick = vi.fn()

    renderWithProvider(<PrimaryButton onClick={onClick}>Save</PrimaryButton>)
    await userEvent.setup().click(screen.getByRole("button", { name: /save/i }))

    expect(onClick).toHaveBeenCalledTimes(1)

    const eventArg = onClick.mock.calls[0]?.[0]
    expect(eventArg).toBeDefined()
    expect(typeof eventArg.preventDefault).toBe("function")
    expect(eventArg.nativeEvent).toBeInstanceOf(MouseEvent)
  })

  it("renders a button loading spinner and hides icon affordances while loading", () => {
    renderWithProvider(
      <PrimaryButton loading iconLeft="plus" iconRight="checkCircle">
        Saving
      </PrimaryButton>,
    )

    const buttonElement = screen.getByRole("button", { name: /saving/i })
    const spinnerElement = buttonElement.querySelector('[data-component="spinner"]')

    expect(spinnerElement).not.toBeNull()
    expect(spinnerElement?.getAttribute("data-purpose")).toBe("button-loading")
    expect(spinnerElement?.getAttribute("data-variant")).toBe("classic")
    expect(spinnerElement?.getAttribute("data-size")).toBe("xs")
    expect(spinnerElement?.getAttribute("style")).toContain(
      "--mw-spinner-indicator-color: currentColor",
    )
    expect(buttonElement.querySelector(".mw-icon")).toBeNull()
  })

  it("uses the non-inverted button spinner treatment for secondary loading buttons", () => {
    renderWithProvider(
      <Button variant="secondary" loading>
        Please wait
      </Button>,
    )

    const buttonElement = screen.getByRole("button", { name: /please wait/i })
    const spinnerElement = buttonElement.querySelector('[data-component="spinner"]')

    expect(spinnerElement?.getAttribute("style")).toContain(
      "--mw-spinner-indicator-color: currentColor",
    )
  })

  it("supports object loading with label replacement and a custom spinner variant", () => {
    renderWithProvider(
      <PrimaryButton
        loading={{
          isLoading: true,
          spinnerVariant: SpinnerVariants.dual,
          loadingLabel: "Saving…",
        }}
        iconLeft="plus"
        iconRight="checkCircle"
      >
        Create order
      </PrimaryButton>,
    )

    const buttonElement = screen.getByRole("button", { name: /saving/i })
    const spinnerElement = buttonElement.querySelector('[data-component="spinner"]')

    expect(buttonElement).toHaveTextContent("Saving…")
    expect(screen.queryByText("Create order")).toBeNull()
    expect(spinnerElement?.getAttribute("data-variant")).toBe("dual")
    expect(buttonElement.querySelector(".mw-icon")).toBeNull()
  })

  it("keeps button interaction enabled when disableWhileLoading is false", async () => {
    const onClick = vi.fn()

    renderWithProvider(
      <Button
        variant="secondary"
        loading={{
          isLoading: true,
          disableWhileLoading: false,
          loadingLabel: "Refreshing…",
        }}
        onClick={onClick}
      >
        Refresh
      </Button>,
    )

    const buttonElement = screen.getByRole("button", { name: /refreshing/i })

    expect(buttonElement).toHaveAttribute("aria-busy", "true")
    expect(buttonElement).not.toHaveAttribute("aria-disabled")
    expect(buttonElement).not.toBeDisabled()

    await userEvent.setup().click(buttonElement)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("blocks loading anchors when loading disables interaction", async () => {
    const onClick = vi.fn()

    renderWithProvider(
      <Button
        as="a"
        href="/docs"
        loading={{
          isLoading: true,
          spinnerVariant: SpinnerVariants.ring,
        }}
        onClick={onClick}
      >
        View docs
      </Button>,
    )

    const linkButton = screen.getByRole("link", { name: /view docs/i })
    const spinnerElement = linkButton.querySelector('[data-component="spinner"]')

    expect(linkButton.tagName).toBe("A")
    expect(linkButton).not.toHaveAttribute("href")
    expect(linkButton).toHaveAttribute("role", "link")
    expect(linkButton).toHaveAttribute("aria-busy", "true")
    expect(linkButton).toHaveAttribute("aria-disabled", "true")
    expect(linkButton).toHaveAttribute("tabindex", "-1")
    expect(spinnerElement?.getAttribute("data-variant")).toBe("ring")

    await userEvent.setup().click(linkButton)

    expect(onClick).not.toHaveBeenCalled()
  })

  it("merges className with recipe output", () => {
    renderWithProvider(
      <Button as="button" className="custom-class">
        Styled
      </Button>,
    )

    const button = screen.getByRole("button", { name: /styled/i })
    expect(button).toHaveClass("custom-class")
    expect(button.className).toContain("mw-btn")
  })
})
