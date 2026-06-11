/**
 * React adapter: Verifies that the Button barrel re-exports all public symbols
 * from both the component directory and the package root.
 */
import { describe, expect, it } from "vitest"
import * as buttonComponents from ".."
import * as publicApi from "../../../index"

describe("button barrel exports", () => {
  it("exports the complete button domain surface", () => {
    expect(buttonComponents.Button).toBeDefined()
    expect(buttonComponents.IconButton).toBeDefined()
    expect(buttonComponents.PrimaryButton).toBeDefined()
    expect(buttonComponents.SecondaryButton).toBeDefined()
    expect(buttonComponents.TextButton).toBeDefined()
    expect(buttonComponents.DestructiveButton).toBeDefined()
    expect(buttonComponents.CreateButton).toBeDefined()
    expect(buttonComponents.SubmitButton).toBeDefined()
    expect(buttonComponents.CancelButton).toBeDefined()
    expect(buttonComponents.LinkButton).toBeDefined()
    expect(buttonComponents.SaveButton).toBeDefined()
    expect(buttonComponents.ConfirmButton).toBeDefined()
    expect(buttonComponents.VerifyButton).toBeDefined()
    expect(buttonComponents.EditButton).toBeDefined()
    expect(buttonComponents.CloseButton).toBeDefined()
    expect(buttonComponents.RefreshButton).toBeDefined()
    expect(buttonComponents.UploadButton).toBeDefined()
    expect(buttonComponents.DownloadButton).toBeDefined()
    expect(buttonComponents.CopyButton).toBeDefined()
    expect(buttonComponents.SearchButton).toBeDefined()
    expect(buttonComponents.FilterButton).toBeDefined()
    expect(buttonComponents.SortButton).toBeDefined()
    expect(buttonComponents.DropdownButton).toBeDefined()
    expect(buttonComponents.SuccessButton).toBeDefined()
  })

  it("re-exports the same button symbols from package root", () => {
    expect(publicApi.Button).toBe(buttonComponents.Button)
    expect(publicApi.IconButton).toBe(buttonComponents.IconButton)
    expect(publicApi.PrimaryButton).toBe(buttonComponents.PrimaryButton)
    expect(publicApi.SecondaryButton).toBe(buttonComponents.SecondaryButton)
    expect(publicApi.TextButton).toBe(buttonComponents.TextButton)
    expect(publicApi.DestructiveButton).toBe(buttonComponents.DestructiveButton)
    expect(publicApi.CreateButton).toBe(buttonComponents.CreateButton)
    expect(publicApi.SubmitButton).toBe(buttonComponents.SubmitButton)
    expect(publicApi.CancelButton).toBe(buttonComponents.CancelButton)
    expect(publicApi.LinkButton).toBe(buttonComponents.LinkButton)
    expect(publicApi.SaveButton).toBe(buttonComponents.SaveButton)
    expect(publicApi.ConfirmButton).toBe(buttonComponents.ConfirmButton)
    expect(publicApi.VerifyButton).toBe(buttonComponents.VerifyButton)
    expect(publicApi.EditButton).toBe(buttonComponents.EditButton)
    expect(publicApi.CloseButton).toBe(buttonComponents.CloseButton)
    expect(publicApi.RefreshButton).toBe(buttonComponents.RefreshButton)
    expect(publicApi.UploadButton).toBe(buttonComponents.UploadButton)
    expect(publicApi.DownloadButton).toBe(buttonComponents.DownloadButton)
    expect(publicApi.CopyButton).toBe(buttonComponents.CopyButton)
    expect(publicApi.SearchButton).toBe(buttonComponents.SearchButton)
    expect(publicApi.FilterButton).toBe(buttonComponents.FilterButton)
    expect(publicApi.SortButton).toBe(buttonComponents.SortButton)
    expect(publicApi.DropdownButton).toBe(buttonComponents.DropdownButton)
    expect(publicApi.SuccessButton).toBe(buttonComponents.SuccessButton)
  })
})
