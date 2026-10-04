import assert from "node:assert/strict"
import { createRequire } from "node:module"
import test from "node:test"

const require = createRequire(import.meta.url)
const changesetsRequire = createRequire(require.resolve("@changesets/cli/package.json"))
const configRequire = createRequire(changesetsRequire.resolve("@changesets/config/package.json"))
const micromatchRequire = createRequire(configRequire.resolve("micromatch/package.json"))
const braces = micromatchRequire("braces")

test("patched release tooling rejects excessive nesting before recursive traversal", () => {
  for (const [open, close] of [
    ["{", "}"],
    ["(", ")"],
    ["{(", ")}"],
  ]) {
    for (const suffix of [close.repeat(2000), ""]) {
      const pattern = `${open.repeat(2000)}a${suffix}`
      for (const method of [
        braces,
        braces.parse,
        braces.compile,
        braces.expand,
        braces.stringify,
      ]) {
        assert.throws(() => method(pattern), {
          name: "SyntaxError",
          message: "Pattern nesting exceeds maximum depth (256)",
        })
      }
    }
  }
})

test("patched release tooling preserves normal patterns and literal braces", () => {
  assert.deepEqual(braces.expand("packages/{core,react}/src/*.{ts,tsx}"), [
    "packages/core/src/*.ts",
    "packages/core/src/*.tsx",
    "packages/react/src/*.ts",
    "packages/react/src/*.tsx",
  ])
  assert.equal(braces.compile("{1..3}"), "([1-3])")
  for (const pattern of [
    `${"{".repeat(256)}a${"}".repeat(256)}`,
    `"${"{".repeat(1000)}"`,
    "\\{".repeat(1000),
  ]) {
    assert.doesNotThrow(() => braces.compile(pattern))
  }
})
