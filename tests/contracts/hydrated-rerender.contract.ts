import { describe, expect, it } from "vitest"

export interface HydratedRerenderHarness {
  hydrate(props: { label: string; value: string; error?: string }): Promise<string[]>
  rerender(props: { label: string; value: string; error?: string }): void | Promise<void>
  getInput(label: string): HTMLInputElement
}

export function runHydratedRerenderContract(adapter: string, h: HydratedRerenderHarness): void {
  describe(`hydrated rerender: ${adapter}`, () => {
    it("updates the hydrated instance without replacing its control or changing its id", async () => {
      const props = { label: "Contact", value: "Server value" }
      expect(await h.hydrate(props)).toEqual([])
      const input = h.getInput(props.label)
      const ids = Array.from(document.querySelectorAll("[id]")).map((node) => node.id)
      expect(ids.length).toBeGreaterThan(1)
      expect(new Set(ids).size).toBe(ids.length)
      const id = input.id
      expect(input).toHaveValue(props.value)
      await h.rerender({ ...props, value: "Client update", error: "Required" })
      expect(h.getInput(props.label)).toBe(input)
      expect(input.id).toBe(id)
      expect(input).toHaveValue("Client update")
      expect(input).toHaveAttribute("aria-invalid", "true")
      await h.rerender(props)
      expect(h.getInput(props.label)).toBe(input)
      expect(input).toHaveValue(props.value)
      expect(input).not.toHaveAttribute("aria-invalid", "true")
    })
  })
}
