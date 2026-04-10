import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue button introduction docs", () => {
  it("documents atom, variant, and purpose layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Button (Atom)")
    expect(introDoc).toContain("Variant Wrappers")
    expect(introDoc).toContain("Purpose Wrappers")

    const buttonNames = [
      "PrimaryButton",
      "SecondaryButton",
      "TextButton",
      "SubmitButton",
      "SaveButton",
      "CancelButton",
      "ConfirmButton",
      "VerifyButton",
      "CreateButton",
      "EditButton",
      "UploadButton",
      "DownloadButton",
      "CopyButton",
      "SearchButton",
      "FilterButton",
      "SortButton",
      "DropdownButton",
      "DangerButton",
      "LinkButton",
      "CloseButton",
      "RefreshButton",
    ]

    for (const buttonName of buttonNames) {
      expect(introDoc).toContain(buttonName)
    }

    const skippedButtonNames = ["BackButton", "NextButton", "SettingsButton"]

    for (const buttonName of skippedButtonNames) {
      expect(introDoc).toContain(buttonName)
    }

    expect(introDoc).toContain("structured loading object")
    expect(introDoc).toContain("disableWhileLoading")
    expect(introDoc).toContain("loadingLabel")
    expect(introDoc).toContain("SpinnerVariants")
  })
})
