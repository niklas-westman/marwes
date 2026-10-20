import { rmSync } from "node:fs"
import { resolve } from "node:path"
import { chromium } from "playwright"
import { afterAll, expect, it } from "vitest"
import { compileFamily } from "../compile/compile-family.js"
import { requireValue } from "../contracts/require-value.js"
import { createOfflineProofFixture } from "../source/offline-test-fixture.ts"
import { startPortal } from "./portal.js"
const proofRoot = createOfflineProofFixture()
afterAll(() => rmSync(proofRoot, { recursive: true, force: true }))
it("starts simultaneous actual React portals on distinct explicitly allocated ports", async () => {
  const repoRoot = resolve(import.meta.dirname, "../../../..")
  const basic = requireValue(
    compileFamily(proofRoot, "button").cases.find((entry) => entry.caseId === "button.basic"),
  )
  if (!basic) throw Error("Missing Button source case")
  const portals: Awaited<ReturnType<typeof startPortal>>[] = []
  const browser = await chromium.launch({ headless: true })
  try {
    const attempts = await Promise.allSettled([
      startPortal(repoRoot, "react", [basic]),
      startPortal(repoRoot, "react", [basic]),
    ])
    for (const attempt of attempts) if (attempt.status === "fulfilled") portals.push(attempt.value)
    expect(attempts.every((attempt) => attempt.status === "fulfilled")).toBe(true)
    expect(new Set(portals.map((portal) => portal.url)).size).toBe(2)
    expect(portals.every((portal) => new URL(portal.url).port !== "5173")).toBe(true)
    for (const portal of portals) {
      const page = await browser.newPage({ viewport: basic.viewportSize })
      try {
        await page.goto(`${portal.url}${basic.portalPath}`, { waitUntil: "networkidle" })
        await page.waitForFunction(() =>
          Boolean((window as unknown as { __governanceReady?: boolean }).__governanceReady),
        )
        expect(await page.locator(".mw-btn__label").textContent()).toBe("Label")
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
    await Promise.all(portals.map((portal) => portal.close()))
  }
}, 120_000)
