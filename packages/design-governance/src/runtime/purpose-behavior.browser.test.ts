import { readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import type { LegacyContract } from "../source/types.js"
import { loadBehaviorContract, runBehavior } from "./behavior.js"
import { startPortal } from "./portal.js"
const repoRoot = resolve(import.meta.dirname, "../../../..")
const contract: LegacyContract = JSON.parse(
  readFileSync(
    join(
      repoRoot,
      "packages/design-governance/reflection-families/button/reflection-contract.json",
    ),
    "utf8",
  ),
) as LegacyContract
const behavior = requireValue(loadBehaviorContract(repoRoot, "button"))
let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
})
afterAll(async () => {
  await browser?.close()
})
for (const adapter of adapters)
  describe(adapter, () => {
    it("verifies public purpose callbacks, local link navigation, loading and disabled suppression", async () => {
      const caseIds = [
        "button.purpose-navigation",
        ...contract.cases
          .filter(
            (entry) =>
              entry.mode === "light" &&
              entry.caseId.startsWith("button.purpose-") &&
              entry.caseId !== "button.purpose-navigation",
          )
          .map((entry) => entry.caseId),
        "button.secondary-loading",
        "button.success-disabled",
      ]
      const cases = caseIds.map((id) => {
        const entry = requireValue(
          contract.cases.find((entry) => entry.caseId === id && entry.mode === "light"),
        )
        if (!entry) throw Error(`Missing behavior fixture ${id}`)
        return entry
      })
      const portal = await startPortal(repoRoot, adapter, cases)
      const page = await browser.newPage()
      try {
        for (const entry of cases) {
          await page.goto(portal.url + entry.portalPath)
          const scenarios = behavior.scenarios.filter(
            (scenario) => scenario.caseId === entry.caseId && scenario.mode === entry.mode,
          )
          expect(scenarios).toHaveLength(1)
          const results = await runBehavior(page, scenarios)
          expect(results, JSON.stringify(results)).toMatchObject([{ outcome: "passed" }])
        }
        const navigation = requireValue(cases[0])
        await page.goto(portal.url + navigation.portalPath)
        await page.route("**/portal.js", async (route) => {
          const response = await route.fetch()
          await route.fulfill({
            response,
            body: (await response.text()).replace(
              "window.__governanceReady=true;",
              "document.querySelector('.mw-btn').setAttribute('href','#incorrect-target'); window.__governanceReady=true;",
            ),
          })
        })
        const defective = requireValue(
          (
            await runBehavior(
              page,
              behavior.scenarios.filter(
                (scenario) =>
                  scenario.caseId === navigation.caseId && scenario.mode === navigation.mode,
              ),
            )
          )[0],
        )
        expect(defective.outcome).toBe("failed")
        expect(
          defective.steps.some((step) => step.kind === "url-hash" && step.outcome === "failed"),
        ).toBe(true)
        expect(
          defective.steps
            .filter((step) => step.kind === "text")
            .every((step) => step.outcome === "passed"),
        ).toBe(true)
      } finally {
        await page.close()
        await portal.close()
      }
    })
  })
