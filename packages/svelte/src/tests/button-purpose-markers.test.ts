import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import CreateButton from "../lib/components/button/CreateButton.svelte"
import SubmitButton from "../lib/components/button/SubmitButton.svelte"

describe("Button purpose markers", () => {
  for (const [component, purpose, action] of [
    [SubmitButton, "submit", "submit"],
    [CreateButton, "create", "create"],
  ] as const)
    it(`preserves canonical ${purpose} semantics and custom attributes`, () => {
      const { container } = render(component, {
        props: { dataAttributes: { "data-purpose": "incorrect", "data-custom": "retained" } },
      })
      const button = container.querySelector("button")
      if (!button) throw new Error("Expected a rendered purpose button")
      expect(button.getAttribute("data-purpose")).toBe(purpose)
      expect(button.getAttribute("data-action")).toBe(action)
      expect(button.getAttribute("data-custom")).toBe("retained")
      if (purpose === "submit") expect(button.type).toBe("submit")
    })
})
