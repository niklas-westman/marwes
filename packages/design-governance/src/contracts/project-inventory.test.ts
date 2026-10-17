import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { afterEach, expect, it } from "vitest"
import {
  type ProjectInventoryDefinition,
  projectInventory,
  projectProofs,
  validateProjectInventory,
} from "./project-inventory.js"
import { requireValue } from "./require-value.js"

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
function emptyRoot() {
  const root = mkdtempSync(join(tmpdir(), "marwes-project-inventory-"))
  roots.push(root)
  return root
}
function definition(): ProjectInventoryDefinition {
  return {
    schemaVersion: 1,
    source: {
      fileKey: "pinned",
      captureDate: "2026-10-14",
      version: "pinned-version",
      lastModified: "2026-10-14T15:02:45Z",
      hashes: {
        raw: "a".repeat(64),
        manifest: "b".repeat(64),
        variables: "c".repeat(64),
      },
      authority: "Pinned test capture",
    },
    families: [
      {
        family: "input",
        validationGroups: ["input-fields", "select", "textarea"],
      },
    ],
  }
}
it("cannot certify a denominator that omitted a public family", () => {
  expect(
    validateProjectInventory(
      definition(),
      ["input", "button"],
      ["input-fields", "select", "textarea"],
    ),
  ).toContain("Public family absent from project inventory: button")
})
it("cannot erase an enrolled input subgroup from the project map", () => {
  const value = definition()
  requireValue(value.families[0]).validationGroups = ["input-fields", "select"]
  expect(
    validateProjectInventory(value, ["input"], ["input-fields", "select", "textarea"]),
  ).toContain("Enrolled validation group absent from project inventory: textarea")
})
it("rejects one validation group assigned to two families", () => {
  const value = definition()
  value.families.push({ family: "button", validationGroups: ["select"] })
  expect(() => validateProjectInventory(value, ["input", "button"], [])).toThrow(
    "duplicate validation group",
  )
})
it("retains all required families and unknown item denominators when no enrollment exists", () => {
  const result = projectInventory(emptyRoot())
  expect(result.requiredFamilies).toBe(32)
  expect(result.requiredValidationGroups).toBe(36)
  expect(result.enrolledVisualGroups).toBe(0)
  expect(result.complete).toBe(false)
  expect(result.rollout).toEqual({
    uiIntegration: "unavailable",
    activeWave: "button",
    remainingWaves: "blocked",
  })
  for (const family of result.families)
    for (const group of family.validationGroups) {
      expect(group.requiredItems).toBe(null)
      expect(group.registeredCases).toBe(0)
      expect(group.states.source).toBe("missing")
      expect(group.states.inventory).toBe("missing")
      expect(group.states.review).toBe("missing")
      expect(group.states.promotion).toBe("missing")
      expect(group.complete).toBe(false)
    }
})
it("will not let supplied green evidence manufacture absent enrollment", () => {
  const result = projectInventory(emptyRoot(), () =>
    Object.fromEntries(projectProofs.map((key) => [key, "passed"])),
  )
  expect(
    requireValue(
      requireValue(result.families.find((family) => family.family === "button"))
        .validationGroups[0],
    ).states.fixture,
  ).toBe("missing")
  expect(result.complete).toBe(false)
})
it("retains a newly discovered public family until the explicit map is updated", () => {
  const root = emptyRoot()
  const directory = join(root, "docs/registry/families/new-family")
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    join(directory, "registry.meta.json"),
    JSON.stringify({ displayName: "New family" }),
  )
  const result = projectInventory(root)
  expect(result.requiredFamilies).toBe(33)
  expect(result.families.some((family) => family.family === "new-family")).toBe(true)
  expect(result.gaps).toContain("Public family absent from project inventory: new-family")
})
it("reconciles all public registry families and all five input groups without claiming certification", () => {
  const result = projectInventory(resolve(import.meta.dirname, "../../../.."))
  expect(result.requiredFamilies).toBe(32)
  expect(
    requireValue(result.families.find((family) => family.family === "input")).validationGroups.map(
      (group) => group.group,
    ),
  ).toEqual(["input-fields", "input-otp", "input-types-overview", "select", "textarea"])
  expect(
    requireValue(result.families.find((family) => family.family === "button")).registry
      .allowedPurposes,
  ).toContain("submit")
  expect(result.complete).toBe(false)
})

it("keeps a required subgroup visible after its reflection contract disappears", () => {
  const result = projectInventory(emptyRoot())
  const input = requireValue(result.families.find((family) => family.family === "input"))
  expect(input.validationGroups).toHaveLength(5)
  expect(
    requireValue(input.validationGroups.find((group) => group.group === "textarea")).states.fixture,
  ).toBe("missing")
  expect(input.complete).toBe(false)
})

it("does not allow trusted runtime outcomes to override a mismatched compact source", () => {
  const root = emptyRoot()
  const directory = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(join(directory, "source"), { recursive: true })
  writeFileSync(
    join(directory, "reflection-contract.json"),
    JSON.stringify({
      figmaFileKey: "nybMu3iJUnnOvWtuxjMG8b",
      cases: [{ caseId: "button.basic", mode: "light" }],
    }),
  )
  const wrongSource = {
    fileKey: "old-file",
    capture: { version: "old-version", lastModified: "2026-06-12T11:55:29Z" },
    hashes: {
      raw: "a".repeat(64),
      manifest: "b".repeat(64),
      variables: "c".repeat(64),
    },
  }
  writeFileSync(join(directory, "source/snapshot.json"), JSON.stringify(wrongSource))
  writeFileSync(join(directory, "source/manifest.json"), JSON.stringify(wrongSource))
  const result = projectInventory(root, () => ({ source: "passed" }))
  const button = requireValue(
    requireValue(result.families.find((family) => family.family === "button")).validationGroups[0],
  )
  expect(button.states.source).toBe("failed")
  expect(button.gaps).toContain(
    "Active compact source does not match pinned capture or its integrity binding",
  )
})
