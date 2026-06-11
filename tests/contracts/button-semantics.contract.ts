/**
 * Shared contract for purpose button semantic defaults.
 *
 * Verifies that every purpose button (SaveButton, ConfirmButton, DestructiveButton, etc.)
 * renders with the correct data-action, data-purpose, variant class, and icon presence.
 * These assertions are adapter-independent — they validate behavior that comes from the
 * core recipe layer, rendered identically across React, Vue, and Svelte.
 */
import { describe, expect, it } from "vitest"

export type ButtonSemanticsContractHarness = {
  renderSaveConfirmVerify(): Promise<void> | void
  renderLinkButton(): Promise<void> | void
  renderCancelEditCloseRefreshDestructive(): Promise<void> | void
  renderWave2Utilities(): Promise<void> | void
  getByRole(role: "button" | "link", options: { name: RegExp }): HTMLElement
}

export function runButtonSemanticsContract(
  adapterName: string,
  h: ButtonSemanticsContractHarness,
): void {
  describe(`Button semantics contract: ${adapterName}`, () => {
    // Wave 1: core action buttons with strong semantic identity
    it("applies Wave 1 semantic defaults for save, confirm, and verify", async () => {
      await h.renderSaveConfirmVerify()

      // SaveButton: primary submit that triggers form persistence
      const saveButton = h.getByRole("button", { name: /save/i })
      expect(saveButton).toHaveAttribute("data-action", "submit")
      expect(saveButton).toHaveAttribute("type", "submit")
      expect(saveButton).toHaveAttribute("data-purpose", "save")
      expect(saveButton).toHaveClass("mw-btn--primary")
      expect(saveButton.querySelector("svg")).toBeNull()

      // ConfirmButton: success-toned positive outcome action
      const confirmButton = h.getByRole("button", { name: /confirm/i })
      expect(confirmButton).toHaveAttribute("data-purpose", "confirm")
      expect(confirmButton).toHaveAttribute("data-outcome", "positive")
      expect(confirmButton).toHaveClass("mw-btn--success")
      expect(confirmButton.querySelector("svg")).toBeNull()

      // VerifyButton: secondary with a verification icon
      const verifyButton = h.getByRole("button", { name: /verify/i })
      expect(verifyButton).toHaveAttribute("data-purpose", "verify")
      expect(verifyButton).toHaveAttribute("data-verification", "true")
      expect(verifyButton).toHaveClass("mw-btn--secondary")
      expect(verifyButton.querySelector("svg")).not.toBeNull()
    })

    // LinkButton: always renders as an anchor with text variant
    it("renders LinkButton as a text navigation link without default icons", async () => {
      await h.renderLinkButton()

      const linkButton = h.getByRole("link", { name: /dashboard/i })
      expect(linkButton).toHaveAttribute("data-action", "navigate")
      expect(linkButton).toHaveAttribute("data-purpose", "navigation")
      expect(linkButton).toHaveClass("mw-btn--text")
      expect(linkButton.querySelector("svg")).toBeNull()
    })

    // Figma-aligned defaults: cancel, edit, close, refresh, and destructive
    it("applies Figma-aligned defaults for cancel, edit, close, refresh, and danger", async () => {
      await h.renderCancelEditCloseRefreshDestructive()

      const cancelButton = h.getByRole("button", { name: /cancel/i })
      expect(cancelButton).toHaveAttribute("data-action", "cancel")
      expect(cancelButton).toHaveAttribute("data-purpose", "cancel")
      expect(cancelButton).toHaveClass("mw-btn--neutral")
      expect(cancelButton.querySelector("svg")).toBeNull()

      // EditButton: secondary with a pencil icon
      const editButton = h.getByRole("button", { name: /edit/i })
      expect(editButton).toHaveAttribute("data-action", "edit")
      expect(editButton).toHaveAttribute("data-purpose", "edit")
      expect(editButton).toHaveClass("mw-btn--secondary")
      expect(editButton.querySelector("svg")).not.toBeNull()

      // CloseButton: neutral cancel action, no icon
      const closeButton = h.getByRole("button", { name: /close/i })
      expect(closeButton).toHaveAttribute("data-action", "cancel")
      expect(closeButton).toHaveAttribute("data-purpose", "close")
      expect(closeButton).toHaveClass("mw-btn--neutral")
      expect(closeButton.querySelector("svg")).toBeNull()

      // RefreshButton: neutral with a refresh icon
      const refreshButton = h.getByRole("button", { name: /refresh/i })
      expect(refreshButton).toHaveAttribute("data-action", "button")
      expect(refreshButton).toHaveAttribute("data-purpose", "refresh")
      expect(refreshButton).toHaveClass("mw-btn--neutral")
      expect(refreshButton.querySelector("svg")).not.toBeNull()

      // DestructiveButton: first-class danger tone, no icon
      const destructiveButton = h.getByRole("button", { name: /delete/i })
      expect(destructiveButton).toHaveAttribute("data-action", "delete")
      expect(destructiveButton).toHaveAttribute("data-purpose", "destructive")
      expect(destructiveButton).toHaveClass("mw-btn--danger")
      expect(destructiveButton).not.toHaveClass("mw-btn--error")
      expect(destructiveButton.querySelector("svg")).toBeNull()
    })

    // Wave 2: utility purpose buttons for data operations
    it("applies Wave 2 semantic defaults for utility purpose buttons", async () => {
      await h.renderWave2Utilities()

      // Upload/Download: secondary with transfer icon
      const uploadButton = h.getByRole("button", { name: /upload/i })
      expect(uploadButton).toHaveAttribute("data-action", "button")
      expect(uploadButton).toHaveAttribute("data-purpose", "upload")
      expect(uploadButton).toHaveAttribute("data-transfer", "upload")
      expect(uploadButton).toHaveClass("mw-btn--secondary")
      expect(uploadButton.querySelector("svg")).not.toBeNull()

      const downloadButton = h.getByRole("button", { name: /download/i })
      expect(downloadButton).toHaveAttribute("data-action", "button")
      expect(downloadButton).toHaveAttribute("data-purpose", "download")
      expect(downloadButton).toHaveAttribute("data-transfer", "download")
      expect(downloadButton).toHaveClass("mw-btn--secondary")
      expect(downloadButton.querySelector("svg")).not.toBeNull()

      // CopyButton: neutral, text only
      const copyButton = h.getByRole("button", { name: /copy/i })
      expect(copyButton).toHaveAttribute("data-action", "button")
      expect(copyButton).toHaveAttribute("data-purpose", "copy")
      expect(copyButton).toHaveAttribute("data-copy", "true")
      expect(copyButton).toHaveClass("mw-btn--neutral")
      expect(copyButton.querySelector("svg")).toBeNull()

      // SearchButton: primary with search icon
      const searchButton = h.getByRole("button", { name: /search/i })
      expect(searchButton).toHaveAttribute("data-action", "button")
      expect(searchButton).toHaveAttribute("data-purpose", "search")
      expect(searchButton).toHaveAttribute("data-search", "true")
      expect(searchButton).toHaveClass("mw-btn--primary")
      expect(searchButton.querySelector("svg")).not.toBeNull()

      // Filter/Sort: neutral, text only
      const filterButton = h.getByRole("button", { name: /filter/i })
      expect(filterButton).toHaveAttribute("data-action", "button")
      expect(filterButton).toHaveAttribute("data-purpose", "filter")
      expect(filterButton).toHaveAttribute("data-filter", "true")
      expect(filterButton).toHaveClass("mw-btn--neutral")
      expect(filterButton.querySelector("svg")).toBeNull()

      const sortButton = h.getByRole("button", { name: /sort/i })
      expect(sortButton).toHaveAttribute("data-action", "button")
      expect(sortButton).toHaveAttribute("data-purpose", "sort")
      expect(sortButton).toHaveAttribute("data-sort", "true")
      expect(sortButton).toHaveClass("mw-btn--neutral")
      expect(sortButton.querySelector("svg")).toBeNull()

      // DropdownButton: secondary with a chevron icon
      const dropdownButton = h.getByRole("button", { name: /dropdown/i })
      expect(dropdownButton).toHaveAttribute("data-action", "button")
      expect(dropdownButton).toHaveAttribute("data-purpose", "dropdown")
      expect(dropdownButton).toHaveAttribute("data-dropdown", "true")
      expect(dropdownButton).toHaveClass("mw-btn--secondary")
      expect(dropdownButton.querySelector("svg")).not.toBeNull()
    })
  })
}
