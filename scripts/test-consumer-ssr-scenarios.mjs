import assert from "node:assert/strict"
import { test } from "node:test"
import { nonceFrameworkBootstraps, themeScenarios } from "./consumer-ssr-scenarios.mjs"

test("theme matrix covers both strategies, system modes and conflicting storage", () => {
  const scenarios = themeScenarios()
  assert.equal(scenarios.length, 12)
  assert.equal(new Set(scenarios.map(({ name }) => name)).size, 12)
  for (const strategy of ["inline", "style-tag"]) {
    const rows = scenarios.filter((row) => row.strategy === strategy)
    assert.equal(rows.filter((row) => row.preference === "system").length, 2)
    assert.equal(rows.filter((row) => row.storedPreference).length, 2)
  }
})
test("CSP fixture preserves explicit helper nonces and only adds missing bootstraps", () => {
  const html =
    '<script nonce="helper">theme()</script><script type="module">boot()</script><style>css</style>'
  const result = nonceFrameworkBootstraps(html)
  assert.ok(result.includes('<script nonce="helper">theme()</script>'))
  assert.ok(result.includes('<script nonce="ssr-fixture" type="module">boot()</script>'))
  assert.equal(nonceFrameworkBootstraps(result), result)
  assert.ok(result.endsWith("<style>css</style>"))
})

test("known blockers stay visible, unrelated regressions fail", async () => {
  const { isKnownBlocked } = await import("./consumer-ssr-scenarios.mjs")
  const flash = {
    framework: "next",
    name: "theme-inline-light-dark",
    reason: "Theme colors must remain stable across hydration",
    issues: [],
  }
  assert.equal(isKnownBlocked(flash), true)
  assert.equal(isKnownBlocked({ ...flash, issues: [{ text: "hydration mismatch" }] }), false)
  assert.equal(isKnownBlocked({ ...flash, name: "theme-style-tag-light-dark" }), false)
  assert.equal(isKnownBlocked({ ...flash, reason: "Timeout" }), false)
  const portal = {
    framework: "react19",
    name: "initially-open",
    reason: "An initially-open modal is absent from server HTML",
    issues: [{ text: "Minified React error #418;" }],
  }
  assert.equal(isKnownBlocked(portal), true)
  assert.equal(isKnownBlocked({ ...portal, framework: "nuxt" }), false)
  assert.equal(
    isKnownBlocked({ ...portal, issues: [...portal.issues, { text: "TypeError" }] }),
    false,
  )
})
