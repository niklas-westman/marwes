import { SpinnerVariants } from "@marwes-ui/core"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { runButtonContract } from "../../../../../../tests/contracts/button.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Button } from "../button"
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

  it("applies Wave 1 semantic defaults for save, confirm, and verify", () => {
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

    const saveButton = screen.getByRole("button", { name: /save/i })
    expect(saveButton).toHaveAttribute("data-action", "submit")
    expect(saveButton).toHaveAttribute("type", "submit")
    expect(saveButton).toHaveAttribute("data-purpose", "save")
    expect(saveButton).toHaveClass("mw-btn--primary")
    expect(saveButton.querySelector("svg")).toBeNull()

    const confirmButton = screen.getByRole("button", { name: /confirm/i })
    expect(confirmButton).toHaveAttribute("data-purpose", "confirm")
    expect(confirmButton).toHaveAttribute("data-outcome", "positive")
    expect(confirmButton).toHaveClass("mw-btn--success")
    expect(confirmButton.querySelector("svg")).toBeNull()

    const verifyButton = screen.getByRole("button", { name: /verify/i })
    expect(verifyButton).toHaveAttribute("data-purpose", "verify")
    expect(verifyButton).toHaveAttribute("data-verification", "true")
    expect(verifyButton).toHaveClass("mw-btn--secondary")
    expect(verifyButton.querySelector("svg")).not.toBeNull()
  })

  it("renders LinkButton as a text navigation link without default icons", () => {
    renderWithProvider(LinkButton, { href: "/dashboard" }, "Dashboard")

    const linkButton = screen.getByRole("link", { name: /dashboard/i })
    expect(linkButton).toHaveAttribute("data-action", "navigate")
    expect(linkButton).toHaveAttribute("data-purpose", "navigation")
    expect(linkButton).toHaveClass("mw-btn--text")
    expect(linkButton.querySelector("svg")).toBeNull()
  })

  it("applies Figma-aligned defaults for cancel, edit, close, refresh, and danger", () => {
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

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    expect(cancelButton).toHaveAttribute("data-action", "cancel")
    expect(cancelButton).toHaveAttribute("data-purpose", "cancel")
    expect(cancelButton).toHaveClass("mw-btn--neutral")
    expect(cancelButton.querySelector("svg")).toBeNull()

    const editButton = screen.getByRole("button", { name: /edit/i })
    expect(editButton).toHaveAttribute("data-action", "edit")
    expect(editButton).toHaveAttribute("data-purpose", "edit")
    expect(editButton).toHaveClass("mw-btn--secondary")
    expect(editButton.querySelector("svg")).not.toBeNull()

    const closeButton = screen.getByRole("button", { name: /close/i })
    expect(closeButton).toHaveAttribute("data-action", "cancel")
    expect(closeButton).toHaveAttribute("data-purpose", "close")
    expect(closeButton).toHaveClass("mw-btn--neutral")
    expect(closeButton.querySelector("svg")).toBeNull()

    const refreshButton = screen.getByRole("button", { name: /refresh/i })
    expect(refreshButton).toHaveAttribute("data-action", "button")
    expect(refreshButton).toHaveAttribute("data-purpose", "refresh")
    expect(refreshButton).toHaveClass("mw-btn--neutral")
    expect(refreshButton.querySelector("svg")).not.toBeNull()

    const destructiveButton = screen.getByRole("button", { name: /delete/i })
    expect(destructiveButton).toHaveAttribute("data-action", "delete")
    expect(destructiveButton).toHaveAttribute("data-purpose", "destructive")
    expect(destructiveButton).toHaveClass("mw-btn--primary")
    expect(destructiveButton).toHaveClass("mw-btn--error")
    expect(destructiveButton.querySelector("svg")).toBeNull()
  })

  it("applies Wave 2 semantic defaults for utility purpose buttons", () => {
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

    const uploadButton = screen.getByRole("button", { name: /upload/i })
    expect(uploadButton).toHaveAttribute("data-action", "button")
    expect(uploadButton).toHaveAttribute("data-purpose", "upload")
    expect(uploadButton).toHaveAttribute("data-transfer", "upload")
    expect(uploadButton).toHaveClass("mw-btn--secondary")
    expect(uploadButton.querySelector("svg")).not.toBeNull()

    const downloadButton = screen.getByRole("button", { name: /download/i })
    expect(downloadButton).toHaveAttribute("data-action", "button")
    expect(downloadButton).toHaveAttribute("data-purpose", "download")
    expect(downloadButton).toHaveAttribute("data-transfer", "download")
    expect(downloadButton).toHaveClass("mw-btn--secondary")
    expect(downloadButton.querySelector("svg")).not.toBeNull()

    const copyButton = screen.getByRole("button", { name: /copy/i })
    expect(copyButton).toHaveAttribute("data-action", "button")
    expect(copyButton).toHaveAttribute("data-purpose", "copy")
    expect(copyButton).toHaveAttribute("data-copy", "true")
    expect(copyButton).toHaveClass("mw-btn--neutral")
    expect(copyButton.querySelector("svg")).toBeNull()

    const searchButton = screen.getByRole("button", { name: /search/i })
    expect(searchButton).toHaveAttribute("data-action", "button")
    expect(searchButton).toHaveAttribute("data-purpose", "search")
    expect(searchButton).toHaveAttribute("data-search", "true")
    expect(searchButton).toHaveClass("mw-btn--primary")
    expect(searchButton.querySelector("svg")).not.toBeNull()

    const filterButton = screen.getByRole("button", { name: /filter/i })
    expect(filterButton).toHaveAttribute("data-action", "button")
    expect(filterButton).toHaveAttribute("data-purpose", "filter")
    expect(filterButton).toHaveAttribute("data-filter", "true")
    expect(filterButton).toHaveClass("mw-btn--neutral")
    expect(filterButton.querySelector("svg")).toBeNull()

    const sortButton = screen.getByRole("button", { name: /sort/i })
    expect(sortButton).toHaveAttribute("data-action", "button")
    expect(sortButton).toHaveAttribute("data-purpose", "sort")
    expect(sortButton).toHaveAttribute("data-sort", "true")
    expect(sortButton).toHaveClass("mw-btn--neutral")
    expect(sortButton.querySelector("svg")).toBeNull()

    const dropdownButton = screen.getByRole("button", { name: /dropdown/i })
    expect(dropdownButton).toHaveAttribute("data-action", "button")
    expect(dropdownButton).toHaveAttribute("data-purpose", "dropdown")
    expect(dropdownButton).toHaveAttribute("data-dropdown", "true")
    expect(dropdownButton).toHaveClass("mw-btn--secondary")
    expect(dropdownButton.querySelector("svg")).not.toBeNull()
  })
})
