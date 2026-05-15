/**
 * Svelte Toast introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected layers and action guidance.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Svelte toast introduction docs", () => {
  it("documents atom, molecule, and purpose toast layers", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    const expectedContent = [
      "Toast",
      "ToastContainer",
      "ToastProvider",
      "useToast",
      "SuccessToast",
      "ErrorToast",
      "WarningToast",
      "InfoToast",
      "toastWhyPurposeComponents",
      "toastPurposeComponentReference",
      "mw-toast__action-button",
      "adapter escape hatch",
      "Button` or `CancelButton",
      "pauses auto-dismiss while the toast is hovered or focused",
      "duration: null",
      'A literal string like `action="Close"` is visual inline text only.',
    ]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
