import assert from "node:assert/strict"
import { test } from "node:test"
import { normalizeFamilyName } from "./changed-scope-families.mjs"

test("text-value updates share the input family gate with their adapter implementations", () => {
  const families = ["input", "text-value-updates"].map(normalizeFamilyName)
  assert.deepEqual([...new Set(families)], ["input"])
})
test("existing aliases remain routed and other family names stay visible to validation", () => {
  for (const name of ["rich-text", "input-otp", "select-field", "textarea"]) {
    assert.equal(normalizeFamilyName(name), "input")
  }
  assert.equal(normalizeFamilyName("dialog"), "dialog")
  assert.equal(normalizeFamilyName("unknown-family"), "unknown-family")
})
