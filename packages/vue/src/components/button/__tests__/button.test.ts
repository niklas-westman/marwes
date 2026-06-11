/**
 * Vue Button adapter tests.
 *
 * Cross-adapter behavior (click, disabled, loading, link) is covered by the shared
 * button contract. Semantic defaults for purpose buttons are covered by the
 * button-semantics contract. This file tests Vue-specific concerns: attr forwarding,
 * class merging, and loading spinner rendering.
 */
import { SpinnerVariants } from "@marwes-ui/core"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { runButtonSemanticsContract } from "../../../../../../tests/contracts/button-semantics.contract"
import { runButtonContract } from "../../../../../../tests/contracts/button.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Button } from "../button"
import { IconButton } from "../icon-button"
import {
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
} from "../variants"

function renderWithProvider(
  component: unknown,
  props: Record<string, unknown> = {},
  children?: string,
) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(component as never, props, {
                default: children ? () => children : undefined,
              }),
          })
      },
    }),
  )
}

runButtonContract("vue", {
  async renderPrimary(args = {}) {
    const props = {
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.loading !== undefined ? { loading: args.loading } : {}),
      ...(args.onClick ? { onClick: args.onClick } : {}),
    }
    renderWithProvider(PrimaryButton, props, args.text ?? "Primary")
  },
  async renderLink(args) {
    const props = {
      href: args.href,
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.onClick ? { onClick: args.onClick } : {}),
    }
    renderWithProvider(LinkButton, props, args.text)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})

runButtonSemanticsContract("vue", {
  renderSaveConfirmVerify() {
    renderWithProvider(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => [
                h(SaveButton, null, { default: () => "Save" }),
                h(ConfirmButton, null, { default: () => "Confirm" }),
                h(VerifyButton, null, { default: () => "Verify" }),
              ],
            })
        },
      }),
    )
  },
  renderLinkButton() {
    renderWithProvider(LinkButton, { href: "/dashboard" }, "Dashboard")
  },
  renderCancelEditCloseRefreshDestructive() {
    renderWithProvider(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => [
                h(CancelButton, null, { default: () => "Cancel" }),
                h(EditButton, null, { default: () => "Edit" }),
                h(CloseButton, null, { default: () => "Close" }),
                h(RefreshButton, null, { default: () => "Refresh" }),
                h(DestructiveButton, null, { default: () => "Delete" }),
              ],
            })
        },
      }),
    )
  },
  renderWave2Utilities() {
    renderWithProvider(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () => [
                h(UploadButton, null, { default: () => "Upload" }),
                h(DownloadButton, null, { default: () => "Download" }),
                h(CopyButton, null, { default: () => "Copy" }),
                h(SearchButton, null, { default: () => "Search" }),
                h(FilterButton, null, { default: () => "Filter" }),
                h(SortButton, null, { default: () => "Sort" }),
                h(DropdownButton, null, { default: () => "Dropdown" }),
              ],
            })
        },
      }),
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

describe("Vue adapter specifics: Button", () => {
  it("renders a button loading spinner and hides icon affordances while loading", () => {
    renderWithProvider(
      PrimaryButton,
      { loading: true, iconLeft: "plus", iconRight: "checkCircle" },
      "Saving",
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
    renderWithProvider(Button, { variant: "secondary", loading: true }, "Please wait")

    const buttonElement = screen.getByRole("button", { name: /please wait/i })
    const spinnerElement = buttonElement.querySelector('[data-component="spinner"]')

    expect(spinnerElement?.getAttribute("style")).toContain(
      "--mw-spinner-indicator-color: currentColor",
    )
  })

  it("supports object loading with label replacement and a custom spinner variant", () => {
    renderWithProvider(
      PrimaryButton,
      {
        loading: {
          isLoading: true,
          spinnerVariant: SpinnerVariants.dual,
          loadingLabel: "Saving…",
        },
        iconLeft: "plus",
        iconRight: "checkCircle",
      },
      "Create order",
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
      Button,
      {
        variant: "secondary",
        loading: {
          isLoading: true,
          disableWhileLoading: false,
          loadingLabel: "Refreshing…",
        },
        onClick,
      },
      "Refresh",
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
      Button,
      {
        as: "a",
        href: "/docs",
        loading: {
          isLoading: true,
          spinnerVariant: SpinnerVariants.ring,
        },
        onClick,
      },
      "View docs",
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

  it("forwards arbitrary attrs to the rendered element", () => {
    renderWithProvider(PrimaryButton, { "data-testid": "primary-btn" }, "Save")
    expect(screen.getByTestId("primary-btn")).toBeInTheDocument()
  })

  it("merges class attr with recipe output", () => {
    renderWithProvider(Button, { as: "button", class: "custom-class" }, "Styled")
    const button = screen.getByRole("button", { name: /styled/i })
    expect(button).toHaveClass("custom-class")
    expect(button.className).toContain("mw-btn")
  })

  it("renders IconButton as an accessible square icon-only control", () => {
    renderWithProvider(IconButton, { icon: "x", ariaLabel: "Close" })

    const button = screen.getByRole("button", { name: /close/i })

    expect(button).toHaveClass("mw-btn--neutral")
    expect(button).toHaveAttribute("data-icon-only", "true")
    expect(button.querySelector(".mw-btn__label")).toBeNull()
    expect(button.querySelector("svg")).not.toBeNull()
  })
})
