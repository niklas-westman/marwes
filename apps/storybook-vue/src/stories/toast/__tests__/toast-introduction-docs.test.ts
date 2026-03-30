import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue toast introduction docs", () => {
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
      "<template #action>Close</template>",
      "adapter escape hatch",
      "Button` or `CancelButton",
    ]

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }
  })
})
