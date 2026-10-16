import { describe, expect, it } from "vitest"
import type { SourceSnapshot } from "./snapshot.ts"
import { resolveVariable } from "./variables.ts"
const fixture: Pick<SourceSnapshot, "variables" | "collections"> = {
  collections: [
    {
      id: "c",
      defaultModeId: "light",
      modes: [
        { id: "light", name: "Light" },
        { id: "dark", name: "Dark" },
      ],
    },
  ],
  variables: [
    {
      id: "a",
      name: "duplicate",
      collectionId: "c",
      rawValuesByMode: { light: { type: "VARIABLE_ALIAS", id: "b" }, dark: 9 },
    },
    { id: "b", name: "duplicate", collectionId: "c", rawValuesByMode: { light: 12, dark: 18 } },
  ],
}
describe("independent variable resolution", () => {
  it("resolves aliases by ID and explicit collection modes despite duplicate names", () => {
    expect(resolveVariable(fixture, "a", { c: "light" })).toMatchObject({
      value: 12,
      aliasChain: ["a", "b"],
    })
    expect(resolveVariable(fixture, "a", { c: "dark" }).value).toBe(9)
  })
  it("blocks ambiguous modes, missing imported variables and alias cycles", () => {
    expect(() => resolveVariable(fixture, "a", {})).toThrow("Ambiguous")
    expect(() => resolveVariable(fixture, "imported", { c: "light" })).toThrow("Missing")
    const cycle = structuredClone(fixture)
    const values = cycle.variables[1]?.rawValuesByMode
    if (!values) throw new Error("Invalid test fixture")
    values.light = { type: "VARIABLE_ALIAS", id: "a" }
    expect(() => resolveVariable(cycle, "a", { c: "light" })).toThrow("cycle")
  })
})
