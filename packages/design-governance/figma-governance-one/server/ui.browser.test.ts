import { mkdir } from "node:fs/promises"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import type { CoverageItem } from "../../src/contracts/coverage.js"
import type { GovernanceReport } from "../../src/contracts/report.js"
import { requireValue } from "../../src/contracts/require-value.js"
import { serveGovernanceUI } from "./server.js"
let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})
// Synthetic reports test presentation states only. They are not Marwes design evidence.
function fixture(state: string): GovernanceReport {
  return {
    schemaVersion: 1,
    runId: "fixture-run",
    family: "button",
    fingerprint: "a".repeat(64),
    startedAt: "2026-10-14T07:00:00Z",
    finishedAt: "2026-10-14T07:00:01Z",
    environment: { browser: "Synthetic UI fixture" },
    outcome: state === "passed" ? "passed" : state === "failed" ? "failed" : "blocked",
    freshness: {
      state: state === "stale" ? "stale" : "current",
      reasons: state === "stale" ? ["Synthetic changed-input fixture"] : [],
    },
    review: { state: "unreviewed" },
    cases: [
      {
        caseId: "button.basic",
        mode: "light",
        adapter: "react",
        sourceUrl: "https://www.figma.com/design/fixture?node-id=1-2",
        artifacts: [],
        unsupported: state === "unsupported" ? ["Glyph rasterization not covered"] : [],
        outcomes: {
          integrity: "passed",
          structural: state === "failed" ? "failed" : "passed",
          visual: state === "passed" ? "passed" : "not-run",
          behavior: "not-run",
          coverage: state === "unsupported" ? "unsupported" : "passed",
        },
        measurements: [
          {
            part: "root",
            selector: "button",
            property: "paddingTop",
            expected: 12,
            actual: state === "failed" ? 18 : 12,
            delta: state === "failed" ? 6 : 0,
            tolerance: 0.1,
            outcome: state === "failed" ? "failed" : "passed",
            source: {
              fileKey: "fixture-file",
              nodeId: "1:2",
              propertyPath: "paddingTop",
            },
          },
        ],
      },
    ],
  }
}
describe("evidence inspector presentation fixtures", () => {
  for (const state of ["passed", "failed", "stale", "unsupported", "never-run", "malformed"]) {
    it(`preserves ${state} proof boundaries`, async () => {
      const report = fixture(state)
      const app = await serveGovernanceUI("/tmp/ui-fixture", {
        port: 0,
        operations: {
          getCatalog: () => ({
            families: [
              {
                family: "button",
                cases: [
                  {
                    caseId: "button.basic",
                    mode: "light",
                    adapter: "react",
                    runId: state === "never-run" ? null : "fixture-run",
                    outcome: report.outcome,
                    freshness: state === "never-run" ? "never-run" : report.freshness.state,
                  },
                ],
                freshness: report.freshness,
                review: report.review,
                outcome: report.outcome,
              },
            ],
          }),
          readReport: () => {
            if (state === "malformed") throw Error("Malformed fixture report")
            return report
          },
          verifyFamily: async () => {},
        },
      })
      const page = await browser.newPage({
        viewport: { width: 1360, height: 1000 },
      })
      try {
        await page.goto(app.url)
        await page.waitForSelector("#case-name")
        if (state === "never-run")
          await page
            .getByText("Never run. No captured component or current design proof is available.")
            .waitFor()
        else if (state === "malformed")
          await page
            .getByText("Could not load selected evidence: Malformed fixture report")
            .waitFor()
        else {
          await page.getByText("root / paddingTop").waitFor()
          expect(await page.locator("#measurements").textContent()).toContain(
            state === "failed" ? "18" : "12",
          )
          expect(await page.locator("#coverage").textContent()).toContain("unreviewed")
          if (state === "stale")
            expect(await page.locator("#coverage").textContent()).toContain(
              "Synthetic changed-input fixture",
            )
          if (state === "unsupported")
            expect(await page.locator("#coverage").textContent()).toContain(
              "Glyph rasterization not covered",
            )
          expect(await page.locator("#capture").textContent()).toContain("No actual screenshot")
        }
        await page.locator("#adapter").selectOption("vue")
        expect(await page.locator("#matrix").textContent()).toContain("No represented cases")
        await page.locator("#adapter").selectOption("all")
        await page.keyboard.press("Tab")
        await mkdir("../../.reflection/governance-ui-fixtures", {
          recursive: true,
        })
        await page.screenshot({
          path: `../../.reflection/governance-ui-fixtures/${state}.png`,
          fullPage: true,
        })
      } finally {
        await page.close()
        await app.close()
      }
    })
  }
  it("filters independent proof failures without shrinking required coverage or changing staged reruns", async () => {
    const report = fixture("passed")
    const outcomes = [
      { id: "visual-failed", visual: "failed" },
      { id: "pressed", visual: "unsupported" },
      { id: "geometry", structural: "failed" },
      { id: "activation", behavior: "failed" },
      { id: "integrity-failed", integrity: "failed" },
      { id: "coverage-failed", coverage: "failed" },
      { id: "capture-error", visual: "error" },
      { id: "pending", visual: "not-run" },
    ]
    report.cases = outcomes.flatMap(({ id, ...changed }) =>
      ["react", "vue", "svelte"].map((adapter) => ({
        ...requireValue(report.cases[0]),
        caseId: id,
        adapter: adapter as "react" | "vue" | "svelte",
        outcomes: {
          integrity: "passed",
          structural: "passed",
          visual: "passed",
          behavior: "passed",
          coverage: "passed",
          ...changed,
          ...(id === "visual-failed" && adapter !== "react" ? { visual: "passed" } : {}),
        } as GovernanceReport["cases"][number]["outcomes"],
      })),
    )
    let verification: unknown
    const items: CoverageItem[] = [
      ...outcomes.map(
        ({ id }): CoverageItem => ({
          itemId: id,
          label: id,
          mode: "light",
          caseId: id,
          requiredProofs: id === "activation" ? ["behavior"] : ["structural", "visual", "behavior"],
          gaps: [],
        }),
      ),
      {
        itemId: "missing-visual",
        label: "Missing visual fixture",
        mode: "light",
        requiredProofs: ["visual"],
        gaps: ["Missing fixture"],
      },
      {
        itemId: "missing-behavior",
        label: "Missing behavior fixture",
        mode: "dark",
        requiredProofs: ["behavior"],
        gaps: ["Missing fixture"],
      },
    ]
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              inputScope: "staged",
              stageId: "12345678-1234-1234-1234-123456789abc",
              stageHash: "d".repeat(64),
              coverage: { items },
              cases: report.cases.map((c) => ({
                ...c,
                runId: report.runId,
                outcome: "blocked",
                freshness: "current",
              })),
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async (_root, request) => {
          verification = request
        },
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page.locator('[data-item="missing-visual"]').waitFor()
      const denominator = await page.locator("#family-coverage-count").textContent()
      expect(denominator).toContain("10 required items · 8 fixture mapped · 2 missing fixtures")
      expect(await page.locator("#case-count").textContent()).toBe(
        "10 visible / 10 required item/mode combinations",
      )
      await page.locator("#mode").selectOption("light")
      expect(await page.locator("#case-count").textContent()).toBe(
        "9 visible / 10 required item/mode combinations",
      )
      await page.locator("#mode").selectOption("all")
      await page.getByRole("combobox", { name: "Proof", exact: true }).selectOption("visual")
      expect(await page.locator("#matrix tr[data-item]").count()).toBe(10)
      await page.getByRole("combobox", { name: "Result", exact: true }).selectOption("failed")
      expect(await page.locator("#matrix tr[data-item]").getAttribute("data-item")).toBe(
        "visual-failed",
      )
      expect(await page.locator("#matrix .case-button").count()).toBe(3)
      await page.locator("#adapter").selectOption("vue")
      expect(await page.locator("#matrix tr[data-item]").count()).toBe(0)
      await page.locator("#adapter").selectOption("react")
      expect(await page.locator("#matrix tr[data-item]").getAttribute("data-item")).toBe(
        "visual-failed",
      )
      await page.locator("#adapter").selectOption("all")
      await page.locator("#proof").selectOption("structural")
      expect(await page.locator("#matrix tr[data-item]").getAttribute("data-item")).toBe("geometry")
      await page.locator("#proof").selectOption("behavior")
      expect(await page.locator("#matrix tr[data-item]").getAttribute("data-item")).toBe(
        "activation",
      )
      for (const [proof, id] of [
        ["integrity", "integrity-failed"],
        ["coverage", "coverage-failed"],
      ]) {
        await page.locator("#proof").selectOption(requireValue(proof))
        expect(await page.locator("#matrix tr[data-item]").getAttribute("data-item")).toBe(id)
      }
      await page.locator("#proof").selectOption("visual")
      for (const [result, id] of [
        ["unsupported", "pressed"],
        ["error", "capture-error"],
        ["not-run", "pending"],
      ]) {
        await page.locator("#result").selectOption(requireValue(result))
        expect(await page.locator("#matrix tr[data-item]").getAttribute("data-item")).toBe(id)
      }
      await page.locator("#result").selectOption("blocked")
      expect(await page.locator('[data-item="missing-visual"]').count()).toBe(1)
      expect(await page.locator('[data-item="missing-behavior"]').count()).toBe(0)
      expect(await page.locator('[data-item="activation"]').count()).toBe(0)
      for (const proof of ["integrity", "coverage", "structural"]) {
        await page.locator("#proof").selectOption(proof)
        expect(await page.locator('[data-item="missing-behavior"]').count()).toBe(0)
      }
      await page.locator("#proof").selectOption("behavior")
      expect(await page.locator('[data-item="missing-behavior"]').count()).toBe(1)
      expect(await page.locator('[data-item="missing-visual"]').count()).toBe(0)
      await page.locator("#proof").selectOption("all")
      expect(await page.locator('[data-item="missing-behavior"]').count()).toBe(1)
      await page.locator("#result").selectOption("all")
      expect(await page.locator("#matrix tr[data-item]").count()).toBe(10)
      expect(await page.locator("#family-coverage-count").textContent()).toBe(denominator)
      await page.locator("#adapter").selectOption("vue")
      await page.locator("#proof").selectOption("visual")
      await page.locator("#result").selectOption("unsupported")
      expect(await page.locator("#matrix .case-button").count()).toBe(1)
      expect(await page.locator("#matrix .case-button").getAttribute("data-adapter")).toBe("vue")
      await page.locator("#mode").selectOption("light")
      expect(await page.locator("#case-count").textContent()).toBe(
        "1 visible / 10 required item/mode combinations",
      )
      await page.locator("#run").click()
      await page.waitForFunction(() => !document.querySelector<HTMLButtonElement>("#run")?.disabled)
      expect(verification).toMatchObject({
        family: "button",
        adapters: ["vue"],
        stageId: "12345678-1234-1234-1234-123456789abc",
      })
      expect(await page.locator("#proof").inputValue()).toBe("visual")
      expect(await page.locator("#result").inputValue()).toBe("unsupported")
      expect(await page.locator("#family-coverage-count").textContent()).toBe(denominator)
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("keeps duplicate case IDs in different modes separate", async () => {
    const report = fixture("failed")
    report.cases.push({
      ...requireValue(report.cases[0]),
      mode: "dark",
      measurements: [
        {
          ...requireValue(requireValue(report.cases[0]).measurements[0]),
          expected: 24,
          actual: 25,
          delta: 1,
        },
      ],
    })
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: report.cases.map((c) => ({
                caseId: c.caseId,
                mode: c.mode,
                adapter: c.adapter,
                runId: report.runId,
                outcome: "failed",
                freshness: "current",
              })),
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page.locator('button[data-mode="dark"]').click()
      await page.getByText("button.basic / dark / react", { exact: true }).waitFor()
      await page.waitForFunction(() =>
        document.querySelector("#measurements")?.textContent?.includes("24"),
      )
      expect(await page.locator("#measurements").textContent()).toContain("25")
      expect(await page.locator("#matrix tr").count()).toBe(2)
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("shows uncovered family variants and visual failure despite structural success", async () => {
    const report = fixture("failed")
    const item = requireValue(report.cases[0])
    item.outcomes.structural = "passed"
    item.outcomes.visual = "failed"
    requireValue(item.measurements[0]).outcome = "passed"
    item.limitations = ["Exact glyph pixels are not structurally verified"]
    requireValue(item.measurements[0]).source.collectionId = "collection-fixture"
    requireValue(item.measurements[0]).source.modeId = "mode-fixture"
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: [
                {
                  caseId: item.caseId,
                  mode: item.mode,
                  adapter: item.adapter,
                  runId: report.runId,
                  outcome: "failed",
                  outcomes: item.outcomes,
                  freshness: "current",
                },
              ],
              coverage: {
                registeredCases: 4,
                structuralEnrolledCases: 4,
                uncoveredVariants: [
                  {
                    source: "figma",
                    id: "fixture-node",
                    name: "Theme=dark, Size=lg",
                    reason: "No registered case mapping",
                  },
                  {
                    source: "registry",
                    id: "fixture-public",
                    name: "icon button",
                    reason: "No structural source proof",
                  },
                ],
                uncovered: ["Public coverage remains incomplete"],
              },
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page.getByText("2 uncovered source / public variants.", { exact: true }).waitFor()
      const matrix = await page.locator("#matrix button").textContent()
      expect(matrix?.trim().startsWith("automated failed")).toBe(true)
      expect(matrix).toContain("structural: passed")
      expect(matrix).toContain("visual: failed")
      await page.getByText("Inspect uncovered variants (2)", { exact: true }).click()
      await page.getByText("Theme=dark, Size=lg", { exact: true }).waitFor()
      expect(await page.locator("#family-coverage").textContent()).toContain("fixture-public")
      await page
        .getByText("Proof limitation: Exact glyph pixels are not structurally verified", {
          exact: true,
        })
        .waitFor()
      expect(await page.locator("#source").textContent()).toContain(
        "collection-fixture / mode-fixture",
      )
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("retains the setup cause when an invalid run captured no cases", async () => {
    const report = fixture("failed")
    report.cases = []
    report.outcome = "blocked"
    report.freshness = {
      state: "invalid",
      reasons: ["Portal already in use: Port 5173 is busy"],
    }
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              freshness: report.freshness,
              cases: [
                {
                  caseId: "button.basic",
                  adapter: "react",
                  mode: "light",
                  runId: report.runId,
                  outcome: "blocked",
                  freshness: "invalid",
                },
              ],
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page.waitForFunction(() =>
        document
          .querySelector("#notice")
          ?.textContent?.includes("Validation could not capture the selected case"),
      )
      expect(await page.locator("#notice").textContent()).toContain(
        "Portal already in use: Port 5173 is busy",
      )
      expect(await page.locator("#coverage").textContent()).toContain(
        "Selected-case proof is unavailable",
      )
      expect(await page.locator("#measurements").textContent()).toContain(
        "No selected-case measurements",
      )
      expect(await page.locator("#proofs").textContent()).not.toContain("passed")
      expect(await page.locator("#capture img").count()).toBe(0)
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("keeps missing required items visible beside exact design and adapter captures", async () => {
    const report = fixture("passed")
    report.cases = ["react", "vue", "svelte"].map((adapter) => ({
      ...requireValue(report.cases[0]),
      adapter: adapter as "react" | "vue" | "svelte",
      artifacts: ["expected", "actual"].map((kind) => ({
        path: `${adapter}/button.basic-light-${kind}.png`,
        mimeType: "image/png",
        sha256: "b".repeat(64),
        role: kind === "expected" ? ("reference" as const) : ("actual" as const),
      })),
    }))
    let reads = 0
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              freshness: report.freshness,
              review: report.review,
              cases: report.cases.map((c) => ({
                caseId: c.caseId,
                mode: c.mode,
                adapter: c.adapter,
                runId: report.runId,
                outcome: "passed",
                freshness: "current",
              })),
              coverage: {
                items: [
                  {
                    itemId: "mapped",
                    label: "Primary default",
                    mode: "light",
                    caseId: "button.basic",
                    gaps: [],
                  },
                  {
                    itemId: "missing",
                    label: "Primary pressed dark",
                    mode: "dark",
                    gaps: ["No enrolled Figma state"],
                    sourceUrl: "javascript:alert(1)",
                  },
                ],
              },
            },
          ],
        }),
        readReport: () => {
          ++reads
          return report
        },
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      // Pixels are synthetic presentation assets, never governance evidence.
      await page.route("**/api/artifact?**", (route) =>
        route.fulfill({
          contentType: "image/png",
          body: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
            "base64",
          ),
        }),
      )
      await page.goto(app.url)
      await page.locator('#matrix [data-runtime="0-svelte"] img').waitFor()
      expect(await page.locator("#matrix tr").count()).toBe(2)
      expect(await page.locator("#family-coverage-count").textContent()).toContain(
        "2 required items · 1 fixture mapped · 1 missing fixtures",
      )
      expect(await page.locator('[data-item="missing"]').textContent()).toContain(
        "Missing fixture mapping",
      )
      expect(await page.locator('#matrix a[href^="javascript:"]').count()).toBe(0)
      expect(await page.locator('#matrix [data-design="0"] img').getAttribute("src")).toBe(
        "/api/artifact?run=fixture-run&path=react%2Fbutton.basic-light-expected.png",
      )
      for (const adapter of ["react", "vue", "svelte"])
        expect(
          await page.locator(`#matrix [data-runtime="0-${adapter}"] img`).getAttribute("src"),
        ).toBe(`/api/artifact?run=fixture-run&path=${adapter}%2Fbutton.basic-light-actual.png`)
      expect(await page.locator('[data-item="missing"] img').count()).toBe(0)
      expect(reads).toBe(1)
      await mkdir("../../.reflection/governance-ui-fixtures", { recursive: true })
      await page.screenshot({
        path: "../../.reflection/governance-ui-fixtures/required-comparisons.png",
        fullPage: true,
      })
      await page.locator("#result").selectOption("blocked")
      expect(await page.locator("#matrix tr").count()).toBe(1)
      expect(await page.locator("#matrix").textContent()).toContain("Primary pressed dark")
      await page.locator("#adapter").selectOption("vue")
      expect(await page.locator("#matrix-columns").textContent()).toContain("vue")
      expect(await page.locator("#matrix-columns").textContent()).not.toContain("react")
      await page.locator("#mode").selectOption("dark")
      expect(await page.locator("#matrix tr").count()).toBe(1)
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("uses declared image roles and scopes structural captures without guessing filenames", async () => {
    const report = fixture("passed")
    const selected = requireValue(report.cases[0])
    selected.outcomes.visual = "unsupported"
    selected.artifacts = [
      {
        path: "misleading-expected-actual-capture.png",
        mimeType: "image/png",
        sha256: "b".repeat(64),
        role: "diff",
      },
      { path: "untyped-expected-actual.png", mimeType: "image/png", sha256: "b".repeat(64) },
      { path: "source.webp", mimeType: "image/webp", sha256: "b".repeat(64), role: "reference" },
      { path: "held-pointer.png", mimeType: "image/png", sha256: "b".repeat(64), role: "capture" },
    ]
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: [
                {
                  caseId: selected.caseId,
                  mode: selected.mode,
                  adapter: selected.adapter,
                  runId: report.runId,
                  outcomes: selected.outcomes,
                  outcome: "blocked",
                  freshness: "current",
                },
              ],
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.route("**/api/artifact?**", (route) =>
        route.fulfill({
          contentType: "image/png",
          body: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
            "base64",
          ),
        }),
      )
      for (const visual of ["unsupported", "not-run"] as const) {
        selected.outcomes.visual = visual
        await page.goto(app.url)
        await page.locator('#matrix [data-runtime="0-react"] img').waitFor()
        await page.locator("#capture img").waitFor()
        expect(await page.locator('#matrix [data-design="0"] img').getAttribute("src")).toContain(
          "path=source.webp",
        )
        expect(
          await page.locator('#matrix [data-runtime="0-react"] img').getAttribute("src"),
        ).toContain("path=held-pointer.png")
        expect(await page.locator("#capture img").getAttribute("src")).toContain(
          "path=held-pointer.png",
        )
        expect(await page.locator("#matrix").textContent()).toContain(
          `Structural capture — visual proof ${visual}`,
        )
        expect(await page.locator("#capture").textContent()).toContain(
          `Structural capture — visual proof ${visual}`,
        )
        expect(await page.locator('img[src*="misleading"], img[src*="untyped"]').count()).toBe(0)
      }
      selected.artifacts.push({
        path: "comparison.webp",
        mimeType: "image/webp",
        sha256: "b".repeat(64),
        role: "actual",
      })
      await page.goto(app.url)
      await page.locator('#matrix [data-runtime="0-react"] img').waitFor()
      await page.locator("#capture img").waitFor()
      expect(
        await page.locator('#matrix [data-runtime="0-react"] img').getAttribute("src"),
      ).toContain("path=comparison.webp")
      expect(await page.locator("#capture img").getAttribute("src")).toContain(
        "path=comparison.webp",
      )
      expect(await page.locator("#matrix").textContent()).not.toContain("Structural capture —")
      expect(selected.outcomes.visual).toBe("not-run")
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("labels stale captures and does not replace missing exact-run artifacts", async () => {
    const report = fixture("stale")
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: [
                {
                  caseId: "button.basic",
                  mode: "light",
                  adapter: "react",
                  runId: report.runId,
                  outcome: "passed",
                  freshness: "stale",
                },
              ],
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page.getByText("Missing runtime capture", { exact: true }).waitFor()
      expect(await page.locator("#matrix").textContent()).toContain("stale · review unreviewed")
      expect(await page.locator("#matrix").textContent()).toContain(
        "Missing design reference evidence",
      )
      expect(await page.locator("#matrix img").count()).toBe(0)
      expect(await page.locator("#matrix button").textContent()).not.toContain("automated passed")
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("never uses another mode's artifacts when the exact case is absent", async () => {
    const report = fixture("passed")
    requireValue(report.cases[0]).mode = "dark"
    requireValue(report.cases[0]).artifacts = [
      { path: "dark/expected.png", mimeType: "image/png", sha256: "c".repeat(64) },
    ]
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: [
                {
                  caseId: "button.basic",
                  mode: "light",
                  adapter: "react",
                  runId: report.runId,
                  outcome: "passed",
                  freshness: "current",
                },
              ],
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page
        .getByText("Exact run evidence unavailable; no substitute", { exact: true })
        .waitFor()
      expect(await page.locator("#matrix img").count()).toBe(0)
      expect(await page.locator("#capture img").count()).toBe(0)
      expect(await page.locator("#notice").textContent()).toContain(
        "Selected case is absent from this exact run",
      )
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("keeps behavior obligations separate from reused visual evidence and other visual gaps", async () => {
    const report = fixture("passed")
    requireValue(report.cases[0]).outcomes.behavior = "passed"
    requireValue(report.cases[0]).artifacts = [
      {
        path: "button.basic-expected.png",
        mimeType: "image/png",
        sha256: "b".repeat(64),
        role: "reference",
      },
      {
        path: "button.basic-actual.png",
        mimeType: "image/png",
        sha256: "b".repeat(64),
        role: "actual",
      },
      {
        path: "button.basic-behavior.json",
        mimeType: "application/json",
        sha256: "b".repeat(64),
        role: "behavior",
      },
    ]
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: [
                {
                  caseId: "button.basic",
                  mode: "light",
                  adapter: "react",
                  runId: report.runId,
                  outcome: "passed",
                  outcomes: requireValue(report.cases[0]).outcomes,
                  freshness: "current",
                },
              ],
              coverage: {
                items: [
                  {
                    itemId: "behavior",
                    label: "Activation obligation",
                    caseId: "button.basic",
                    mode: "light",
                    requiredProofs: ["behavior"],
                    gaps: [],
                  },
                  {
                    itemId: "visual",
                    label: "Default visual",
                    caseId: "button.basic",
                    mode: "light",
                    requiredProofs: ["visual"],
                    gaps: [],
                  },
                  {
                    itemId: "missing-visual",
                    label: "Pressed visual",
                    mode: "light",
                    requiredProofs: ["visual"],
                    gaps: ["Missing visual fixture"],
                  },
                ],
              },
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.route("**/api/artifact?**", (route) =>
        route.fulfill({
          contentType: "image/png",
          body: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
            "base64",
          ),
        }),
      )
      await page.goto(app.url)
      await page
        .locator('[data-item="behavior"]')
        .getByText("Behavior: passed · inspect assertions and artifacts", { exact: true })
        .waitFor()
      expect(await page.locator('[data-item="behavior"]').textContent()).toContain(
        "Behavior obligation — no visual reference required",
      )
      expect(await page.locator('[data-item="behavior"] img').count()).toBe(0)
      expect(await page.locator('[data-item="behavior"] .cell-proofs').textContent()).toBe(
        "behavior: passed",
      )
      expect(await page.locator('[data-item="visual"] img').count()).toBe(2)
      expect(await page.locator('[data-item="missing-visual"]').textContent()).toContain(
        "Missing design reference evidence",
      )
      await page.locator('[data-item="behavior"] button').click()
      await page
        .locator("#source")
        .getByText("Behavior obligation — no visual reference required", { exact: true })
        .waitFor()
      expect(await page.locator("#source img, #capture img").count()).toBe(0)
      expect(await page.locator("#proofs").textContent()).not.toContain("visual")
      expect(await page.locator("#capture").textContent()).toContain("button.basic-behavior.json")
      expect(await page.locator("#capture").textContent()).not.toContain("button.basic-actual.png")
      expect(await page.locator("#measurements").textContent()).toContain(
        "Behavior assertions are recorded in the linked exact-run behavior artifacts",
      )
      expect(await page.locator("#measurements").textContent()).not.toContain("root / paddingTop")
      await page.locator('[data-item="visual"] button').click()
      await page.locator("#capture img").waitFor({ state: "attached" })
      await page.locator("#result").selectOption("blocked")
      expect(await page.locator("#matrix tr").count()).toBe(3) // Missing Vue/Svelte proof remains a real gap.
      expect(await page.locator('[data-item="missing-visual"]').textContent()).toContain(
        "Missing visual fixture",
      )
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("recognizes projected behavior-only case reports without inventory proof metadata", async () => {
    const report = fixture("passed")
    Object.assign(requireValue(report.cases[0]), { proofScope: "behavior-only" })
    requireValue(report.cases[0]).outcomes.behavior = "passed"
    requireValue(report.cases[0]).outcomes.visual = "not-run"
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: [
                {
                  caseId: "button.basic",
                  mode: "light",
                  adapter: "react",
                  runId: report.runId,
                  outcome: "passed",
                  freshness: "current",
                },
              ],
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page
        .locator("#source")
        .getByText("Behavior obligation — no visual reference required", { exact: true })
        .waitFor()
      expect(await page.locator("#matrix").textContent()).not.toContain(
        "Missing design reference evidence",
      )
      expect(await page.locator("#matrix").textContent()).not.toContain("Missing runtime capture")
      expect(await page.locator("#proofs").textContent()).not.toContain("visual")
      expect(await page.locator("#coverage").textContent()).toContain(
        "Visual reference is not required",
      )
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("does not let a projected behavior report satisfy a required visual row", async () => {
    const report = fixture("passed")
    Object.assign(requireValue(report.cases[0]), { proofScope: "behavior-only" })
    requireValue(report.cases[0]).outcomes.behavior = "passed"
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: [
                {
                  caseId: "button.basic",
                  mode: "light",
                  adapter: "react",
                  runId: report.runId,
                  outcome: "passed",
                  freshness: "current",
                },
              ],
              coverage: {
                items: [
                  {
                    itemId: "behavior",
                    label: "Activation",
                    caseId: "button.basic",
                    mode: "light",
                    requiredProofs: ["behavior"],
                    gaps: [],
                  },
                  {
                    itemId: "visual",
                    label: "Visual required",
                    caseId: "button.basic",
                    mode: "light",
                    requiredProofs: ["visual"],
                    gaps: ["Missing visual proof"],
                  },
                ],
              },
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page
        .locator('[data-item="behavior"]')
        .getByText("Behavior: passed · inspect assertions and artifacts", { exact: true })
        .waitFor()
      expect(await page.locator('[data-item="visual"]').textContent()).toContain(
        "Missing design reference evidence",
      )
      expect(await page.locator('[data-item="visual"]').textContent()).not.toContain(
        "no visual reference required",
      )
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("labels staged evidence and explicitly requests its exact stage", async () => {
    const report = fixture("passed")
    report.environment = {
      evidenceScope: "staged",
      stageId: "fixture-stage",
      stageHash: "d".repeat(64),
    }
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              inputScope: "staged",
              stageId: "fixture-stage",
              stageHash: "d".repeat(64),
              cases: [
                {
                  caseId: "button.basic",
                  mode: "light",
                  adapter: "react",
                  runId: report.runId,
                  outcome: "passed",
                  freshness: "current",
                },
              ],
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async () => {},
      },
    })
    const page = await browser.newPage()
    let submitted: Record<string, unknown> | undefined
    try {
      await page.route("**/api/jobs", (route) => {
        submitted = route.request().postDataJSON()
        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ error: "Synthetic request inspection" }),
        })
      })
      await page.goto(app.url)
      await page
        .locator("#source")
        .getByText("Staged reference · awaiting promotion approval", { exact: true })
        .waitFor()
      expect(await page.locator("#family-summary").textContent()).toContain(
        "Staged reference · awaiting promotion approval",
      )
      expect(await page.locator("#source").textContent()).toContain("fixture-stage")
      expect(await page.locator("#source").textContent()).toContain("d".repeat(64))
      await page.locator("#adapter").selectOption("react")
      await page.getByRole("button", { name: "Run validation" }).click()
      await page
        .getByText("Could not start validation: Synthetic request inspection", { exact: true })
        .waitFor()
      expect(submitted).toEqual({ family: "button", adapter: "react", stageId: "fixture-stage" })
    } finally {
      await page.close()
      await app.close()
    }
  })
  it("runs the selected registered adapter and reloads evidence after a job", async () => {
    const calls: string[] = []
    const report = fixture("failed")
    const app = await serveGovernanceUI("/tmp/ui-fixture", {
      port: 0,
      operations: {
        getCatalog: () => ({
          families: [
            {
              family: "button",
              cases: [
                {
                  caseId: "button.basic",
                  mode: "light",
                  adapter: "react",
                  runId: null,
                  freshness: "never-run",
                },
              ],
            },
          ],
        }),
        readReport: () => report,
        verifyFamily: async (_root, selection) => {
          calls.push(selection.adapters.join(","))
        },
      },
    })
    const page = await browser.newPage()
    try {
      await page.goto(app.url)
      await page.getByRole("button", { name: "Run validation" }).waitFor()
      await page.locator("#adapter").selectOption("react")
      const request = page.waitForRequest(
        (request) => request.url().endsWith("/api/jobs") && request.method() === "POST",
      )
      await page.getByRole("button", { name: "Run validation" }).click()
      expect((await request).postDataJSON()).toEqual({ family: "button", adapter: "react" })
      await page.getByText("Validation finished. Inspect the proof outcomes below.").waitFor()
      expect(calls).toEqual(["react"])
    } finally {
      await page.close()
      await app.close()
    }
  })
})

it("keeps changed and missing current requirements visible without borrowing matched case evidence", async () => {
  const report = fixture("passed")
  requireValue(report.cases[0]).outcomes.behavior = "passed"
  requireValue(report.cases[0]).artifacts = ["expected", "actual"].map((role) => ({
    path: `button-basic-${role}.png`,
    mimeType: "image/png",
    sha256: "b".repeat(64),
    role: role === "expected" ? ("reference" as const) : ("actual" as const),
  }))
  const app = await serveGovernanceUI("/tmp/ui-fixture", {
    port: 0,
    operations: {
      getCatalog: () => ({
        families: [
          {
            family: "button",
            freshness: report.freshness,
            review: report.review,
            cases: [
              {
                caseId: "button.basic",
                mode: "light",
                adapter: "react",
                runId: report.runId,
                outcome: "passed",
                outcomes: requireValue(report.cases[0]).outcomes,
                freshness: "current",
              },
            ],
            coverage: {
              items: [
                {
                  itemId: "matched",
                  label: "Exact old selection",
                  mode: "light",
                  caseId: "button.basic",
                  requiredProofs: ["visual"],
                  evidenceMatch: "matched",
                  gaps: [],
                },
                {
                  itemId: "changed",
                  label: "Changed design selection",
                  mode: "light",
                  caseId: "button.basic",
                  requiredProofs: ["visual"],
                  evidenceMatch: "changed",
                  gaps: [],
                },
                {
                  itemId: "missing",
                  label: "New behavior obligation",
                  mode: "light",
                  caseId: "button.basic",
                  requiredProofs: ["behavior"],
                  evidenceMatch: "missing",
                  gaps: [],
                },
              ],
            },
          },
        ],
      }),
      readReport: () => report,
      verifyFamily: async () => {},
    },
  })
  const page = await browser.newPage()
  try {
    await page.route("**/api/artifact?**", (route) =>
      route.fulfill({
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
          "base64",
        ),
      }),
    )
    await page.goto(app.url)
    await page.locator('[data-item="matched"] img').first().waitFor()
    expect(await page.locator("#matrix tr").count()).toBe(3)
    for (const id of ["changed", "missing"]) {
      const row = page.locator(`[data-item="${id}"]`)
      expect(await row.locator("img").count()).toBe(0)
      expect(await row.textContent()).toContain("unmatched")
      expect(await row.textContent()).not.toContain("behavior: passed")
      await row.locator("button").click()
      expect(await page.locator("#capture").textContent()).toContain("No matching evidence")
      expect(await page.locator("#case-detail img").count()).toBe(0)
      expect(await page.locator("#measurements").textContent()).toBe("")
    }
    await page.selectOption("#adapter", "react")
    await page.selectOption("#result", "blocked")
    expect(await page.locator("#matrix tr").count()).toBe(2)
  } finally {
    await page.close()
    await app.close()
  }
})
