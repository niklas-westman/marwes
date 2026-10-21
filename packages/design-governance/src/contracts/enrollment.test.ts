import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"
import { missingRequiredCases, structuralEnrollmentRequired } from "./enrollment.js"
const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
it("blocks removed required mappings without conflating advisory public variants", () => {
  const registered = [
    { caseId: "button.basic", mode: "light" },
    { caseId: "button.secondary", mode: "light" },
  ]
  expect(
    missingRequiredCases(true, registered, [registered[0] ?? { caseId: "", mode: "" }]),
  ).toEqual(["button.secondary/light: required structural mapping missing"])
  expect(missingRequiredCases(false, registered, [])).toEqual([])
})
it("preserves declared enrollment when the whole sidecar is deleted", () => {
  const root = mkdtempSync(join(tmpdir(), "governance-enrollment-"))
  roots.push(root)
  const directory = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    join(directory, "reflection-contract.json"),
    JSON.stringify({ structuralContract: "structural-contract.json" }),
  )
  expect(structuralEnrollmentRequired(root, "button")).toBe(true)
  expect(
    missingRequiredCases(
      structuralEnrollmentRequired(root, "button"),
      [{ caseId: "button.basic", mode: "light" }],
      [],
    ),
  ).toHaveLength(1)
})
