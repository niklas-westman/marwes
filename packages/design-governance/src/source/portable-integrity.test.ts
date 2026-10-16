import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { afterAll, describe, expect, it } from "vitest"
import { createOfflineProofFixture } from "./offline-test-fixture.ts"
import { validatePortableIntegrity } from "./portable-integrity.ts"
import { configuredSourceIdentity, loadSnapshot } from "./snapshot.ts"
const root = createOfflineProofFixture()
// Families still on the old capture cannot share Button's promoted identity.
const unpromotedRoot = createOfflineProofFixture("badge")
afterAll(() => {
  rmSync(root, { recursive: true, force: true })
  rmSync(unpromotedRoot, { recursive: true, force: true })
})
describe("portable integrity proof", () => {
  it("verifies real committed Button proof with no ignored Figma export files", () => {
    const offline = mkdtempSync(join(tmpdir(), "marwes-offline-"))
    try {
      mkdirSync(join(offline, ".pi"), { recursive: true })
      cpSync(join(root, ".pi/figma-sync.json"), join(offline, ".pi/figma-sync.json"))
      const families = "packages/design-governance/reflection-families"
      mkdirSync(join(offline, families), { recursive: true })
      cpSync(join(root, families, "button"), join(offline, families, "button"), { recursive: true })
      cpSync(
        join(root, families, "source-frame-registry.json"),
        join(offline, families, "source-frame-registry.json"),
      )
      expect(existsSync(join(offline, ".figma"))).toBe(false)
      expect(loadSnapshot(offline, "button").family).toBe("button")
      expect(validatePortableIntegrity(offline, "button")).toMatchObject({
        status: "passed",
        details: [],
      })
      expect(
        validatePortableIntegrity(offline, "button").warnings?.some((warning) =>
          warning.includes("live Figma freshness is not established"),
        ),
      ).toBe(true)
      const identity = configuredSourceIdentity(offline)
      mkdirSync(join(identity.live, "tokens"), { recursive: true })
      writeFileSync(identity.variablesPath, JSON.stringify({ fileKey: identity.fileKey }))
      expect(() => loadSnapshot(offline, "button")).toThrow("local variables changed")
      rmSync(identity.variablesPath)
      expect(() => loadSnapshot(offline, "button")).not.toThrow()
      writeFileSync(
        identity.manifestPath,
        JSON.stringify({ fileKey: identity.fileKey, version: "changed", lastModified: "changed" }),
      )
      expect(() => loadSnapshot(offline, "button")).toThrow("local manifest changed")
    } finally {
      rmSync(offline, { recursive: true })
    }
  })
  it("verifies unchanged Button and Badge receipts without loading raw exports", () => {
    expect(validatePortableIntegrity(root, "button")).toMatchObject({
      status: "passed",
      details: [],
    })
    expect(validatePortableIntegrity(unpromotedRoot, "badge")).toMatchObject({
      status: "passed",
      details: [],
    })
  })
  it("keeps historical optional generated nodes advisory unless strict is requested", () => {
    const dialog = validatePortableIntegrity(unpromotedRoot, "dialog")
    expect(dialog.status).toBe("passed")
    expect(dialog.warnings?.length).toBeGreaterThan(0)
    expect(validatePortableIntegrity(unpromotedRoot, "dialog", { strict: true }).status).toBe(
      "failed",
    )
  })
  it("blocks incomplete imported dependencies", () => {
    expect(validatePortableIntegrity(unpromotedRoot, "switch")).toMatchObject({ status: "failed" })
    expect(
      validatePortableIntegrity(unpromotedRoot, "switch").details.some((detail) =>
        detail.includes("VariableID:1358:5086"),
      ),
    ).toBe(true)
  })
})
