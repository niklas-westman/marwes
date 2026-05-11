/**
 * React Toast introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React toast introduction docs", () => {
  it("documents atom, molecule, and purpose toast layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const componentNames = [
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

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }
  })
})
