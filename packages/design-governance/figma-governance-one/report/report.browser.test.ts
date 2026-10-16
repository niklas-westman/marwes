import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { requireValue } from "../../src/contracts/require-value.js"
let browser: Browser
let directory: string
const pixel =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8/x8AAusB9Wl6dtAAAAAASUVORK5CYII="
const role = (value: string) => ({
  id: value,
  role: value,
  sha256: "a".repeat(64),
  mimeType: "image/png",
  href: pixel,
})
const outcomes = {
  integrity: "passed",
  structural: "passed",
  visual: "failed",
  behavior: "passed",
  coverage: "passed",
}
function fixture() {
  const comparison = (
    implementationId: string,
    artifacts = [role("reference"), role("actual"), role("diff")],
  ) => ({
    id: implementationId,
    implementationId,
    runId: "fixture-run",
    state: "recorded",
    outcomes,
    measurements: [],
    artifacts,
    gaps: [],
    limitations: [],
  })
  const item = (id: string, mode = "light") => ({
    id,
    label: id,
    caseId: id as string | null,
    dimensions: { mode, state: "default", size: "medium" },
    visualRequired: true,
    requiredProofs: ["structural", "visual", "behavior"],
    source: { url: "https://www.figma.com/design/example", nodeId: "1:2" } as {
      url: string
      nodeId?: string
      availability?: string
    },
    gaps: [] as string[],
    comparisons: [comparison("react"), comparison("vue"), comparison("svelte")],
  })
  const standard = item("independent-control")
  standard.label = '<img src=x onerror="window.injected=true">'
  const missing = item("missing-control", "dark")
  missing.comparisons = missing.comparisons.map((c) => ({
    ...c,
    state: "missing",
    artifacts: [],
  }))
  const structural = item("pressed-control")
  structural.comparisons = structural.comparisons.map((c) => ({
    ...c,
    outcomes: { ...outcomes, visual: "unsupported" },
    artifacts: [role("capture"), { ...role("evidence"), id: "actual.png" }],
  }))
  const behavior = {
    ...item("behavior-control"),
    visualRequired: false,
    requiredProofs: ["behavior"],
  }
  return {
    schema: "marwes.governance-html/v1",
    exportedAt: "2026-10-16T12:00:00Z",
    inventoryScope: "current-required-inventory",
    artifactWarnings: ["One excluded unusable artifact"],
    visualMetrics: {
      react: {
        diffPixels: 3,
        diffRatio: 0.03,
        threshold: { maxDiffPixels: 2 },
        classification: "failed",
        provenance: "recomputed-from-verified-images",
      },
    },
    manifest: {
      runId: "fixture-run",
      reportSha256: "b".repeat(64),
      inputFingerprintAtExport: "c".repeat(64),
    },
    provider: {
      project: { label: "Independent fixture" },
      implementations: ["react", "vue", "svelte"].map((id) => ({
        id,
        label: id,
      })),
      families: [
        {
          id: "independent",
          outcome: "blocked",
          freshness: {
            state: "stale",
            reasons: ["Inputs changed before export"],
          },
          review: { state: "unreviewed" },
          scope: {
            kind: "staged",
            stageId: "stage-fixture",
            stageHash: "d".repeat(64),
          },
          run: {
            id: "fixture-run",
            fingerprint: "c".repeat(64),
            environment: { reflection: "0.5.1" },
          },
          inventory: {
            requiredItems: 4,
            coveredItems: 3,
            complete: false,
            gaps: ["Missing fixture"],
          },
          items: [standard, missing, structural, behavior],
        },
      ],
    },
  }
}
async function save(data = fixture()) {
  const base = new URL("./", import.meta.url)
  const [shell, css, js] = await Promise.all([
    readFile(new URL("shell.html", base), "utf8"),
    readFile(new URL("report.css", base), "utf8"),
    readFile(new URL("report.js", base), "utf8"),
  ])
  const html = shell
    .replace("<!--REPORT_STYLE-->", () => `<style>${css}</style>`)
    .replace(
      "<!--REPORT_DATA-->",
      () =>
        `<script id="report-data" type="application/json">${JSON.stringify(data).replace(
          /</g,
          "\\u003c",
        )}</script>`,
    )
    .replace("<!--REPORT_SCRIPT-->", () => `<script>${js}</script>`)
  const file = join(directory, `${Math.random()}.html`)
  await writeFile(file, html)
  return pathToFileURL(file).href
}
beforeAll(async () => {
  browser = await chromium.launch()
  directory = await mkdtemp(join(tmpdir(), "governance-report-"))
})
afterAll(async () => {
  await browser?.close()
  await rm(directory, { recursive: true, force: true })
})
describe("portable independent-fixture evidence dashboard", () => {
  it("opens offline with fixed denominator, exact identities, missing rows and safe labels", async () => {
    const page = await browser.newPage()
    const network: string[] = []
    page.on("request", (request) => network.push(request.url()))
    await page.goto(await save())
    expect(await page.locator("#visible-count").textContent()).toBe(
      "4 visible / 4 required item/mode combinations",
    )
    expect(await page.locator("tbody tr").count()).toBe(4)
    expect(await page.locator("h1").textContent()).toContain("independent")
    expect(await page.locator(".banner").textContent()).toContain("Freshness at export: stale")
    expect(await page.locator(".banner").textContent()).toContain("stage-fixture")
    expect(await page.evaluate(() => Boolean("injected" in window && window.injected))).toBe(false)
    expect(await page.locator("img[src=x]").count()).toBe(0)
    expect(network.filter((url) => !url.startsWith("file:") && !url.startsWith("data:"))).toEqual(
      [],
    )
    await page.getByLabel("Theme / mode", { exact: true }).selectOption("dark")
    expect(await page.locator("#visible-count").textContent()).toBe(
      "1 visible / 4 required item/mode combinations",
    )
    expect(await page.locator("tbody").textContent()).toContain("missing-control")
    await page.getByLabel("Theme / mode", { exact: true }).selectOption("all")
    await page.getByLabel("Proof", { exact: true }).selectOption("visual")
    await page.getByLabel("Outcome", { exact: true }).selectOption("unsupported")
    expect(await page.locator("#visible-count").textContent()).toBe(
      "1 visible / 4 required item/mode combinations",
    )
    expect(await page.locator("tbody").textContent()).toContain(
      "Structural capture only · visual unsupported",
    )
    expect(await page.locator("tbody img").count()).toBe(3)
    await page.getByLabel("Outcome", { exact: true }).selectOption("missing")
    expect(await page.locator("#visible-count").textContent()).toBe(
      "1 visible / 4 required item/mode combinations",
    )
    await page.getByLabel("Outcome", { exact: true }).selectOption("all")
    await page.getByLabel("Implementation", { exact: true }).selectOption("vue")
    expect(await page.locator("thead th").allTextContents()).toEqual([
      "Required selection",
      "Figma reference",
      "vue",
    ])
    expect(await page.locator("button").allTextContents()).not.toContain("Promote")
    await page.close()
  })
  it("synchronizes zoom and opens exact-comparison reference/actual/diff inspection", async () => {
    const page = await browser.newPage()
    await page.goto(await save())
    await page.getByLabel("Synchronized image zoom", { exact: true }).fill("2")
    expect(await page.locator("output").textContent()).toBe("200%")
    await page
      .locator("tbody tr")
      .first()
      .getByRole("button", { name: "Inspect reference / actual / diff" })
      .first()
      .click()
    expect(
      await page.locator("dialog").evaluate((dialog) => (dialog as HTMLDialogElement).open),
    ).toBe(true)
    expect(await page.locator("dialog img").count()).toBe(3)
    await page.waitForFunction(() =>
      [...document.querySelectorAll("dialog img")].every(
        (image) => (image as HTMLImageElement).complete,
      ),
    )
    expect(
      await page
        .locator("dialog img")
        .first()
        .evaluate((image) => image.style.width),
    ).toBe("2px")
    await page.keyboard.press("Escape")
    expect(
      await page.locator("dialog").evaluate((dialog) => (dialog as HTMLDialogElement).open),
    ).toBe(false)
    await page.close()
  })
  it("does not borrow another implementation image or guess filename roles", async () => {
    const data = fixture()
    const selected = requireValue(requireValue(data.provider.families[0]).items[0])
    requireValue(selected.comparisons[1]).artifacts = [
      { ...role("evidence"), id: "reference-actual.png" },
      { ...role("actual"), href: "https://example.com/image.png" },
    ]
    requireValue(selected.comparisons[2]).runId = "another-run"
    const page = await browser.newPage()
    await page.goto(await save(data))
    const cells = page.locator("tbody tr").first().locator("td")
    expect(await cells.nth(2).locator("img").count()).toBe(0)
    expect(await cells.nth(3).locator("img").count()).toBe(0)
    expect(await cells.nth(3).textContent()).toContain("No exact-run evidence")
    await page.close()
  })
  it("labels differing adapter references separately and keeps behavior proof independent", async () => {
    const data = fixture()
    const selected = requireValue(requireValue(data.provider.families[0]).items[0])
    requireValue(requireValue(selected.comparisons[1]).artifacts[0]).sha256 = "d".repeat(64)
    const page = await browser.newPage()
    await page.goto(await save(data))
    expect(await page.locator("tbody tr").first().locator("td").first().textContent()).toContain(
      "Adapter references differ",
    )
    expect(
      await page.locator("tbody tr").first().locator("td").first().locator("img").count(),
    ).toBe(3)
    const behavior = page.locator('tr[data-item-id="behavior-control"]')
    expect(await behavior.locator("img").count()).toBe(0)
    expect(await behavior.locator(".badge").allTextContents()).toEqual([
      "behavior: passed",
      "behavior: passed",
      "behavior: passed",
    ])
    await page.getByLabel("Proof", { exact: true }).selectOption("visual")
    await page.getByLabel("Outcome", { exact: true }).selectOption("failed")
    expect(await page.locator("#visible-count").textContent()).toBe(
      "1 visible / 4 required item/mode combinations",
    )
    await page.close()
  })
  it("separates mapped fixtures, row gaps and applicable deduplicated proof tallies", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    const [standard, missing, , behavior] = family.items
    requireValue(missing).caseId = null
    requireValue(missing).gaps = ["Missing fixture"]
    family.items = [requireValue(standard), requireValue(missing), requireValue(behavior)]
    family.inventory = {
      requiredItems: 3,
      coveredItems: 0,
      complete: false,
      gaps: ["Pattern one", "Pattern two", "Missing fixture"],
    }
    requireValue(behavior).comparisons = requireValue(behavior).comparisons.map((c) => ({
      ...c,
      outcomes: { ...c.outcomes, structural: "unsupported", visual: "not-run" },
    }))
    const page = await browser.newPage()
    await page.goto(await save(data))
    const stats = await page.locator(".stat").allTextContents()
    expect(stats).toContain("2Mapped items")
    expect(stats).toContain("1Missing fixtures")
    expect(stats).toContain("1Required rows with gaps")
    for (const tally of await page.locator(".tallies section").allTextContents()) {
      expect(tally).toContain("structural: 1 passed")
      expect(tally).toContain("visual: 1 failed")
      expect(tally).toContain("behavior: 2 passed")
      expect(tally).not.toContain("unsupported")
      expect(tally).not.toContain("not-run")
    }
    await page.close()
  })
  it("unions applicable proof requirements across aliases without duplicating case results", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    const original = requireValue(family.items[0])
    const alias = { ...original, id: "alias", requiredProofs: ["behavior"] }
    original.requiredProofs = ["structural", "visual"]
    family.items = [alias, original]
    family.inventory.requiredItems = 2
    const page = await browser.newPage()
    await page.goto(await save(data))
    for (const tally of await page.locator(".tallies section").allTextContents()) {
      expect(tally).toContain("structural: 1 passed")
      expect(tally).toContain("visual: 1 failed")
      expect(tally).toContain("behavior: 1 passed")
      expect(tally).toContain("1 unique case/mode")
    }
    await page.close()
  })
  for (const width of [1920, 1280]) {
    it(`aligns reference and implementation image frames at ${width}px`, async () => {
      const page = await browser.newPage({ viewport: { width, height: 1000 } })
      await page.goto(await save())
      const row = page.locator("tbody tr").first()
      await page.waitForFunction(() =>
        [...document.querySelectorAll("tbody tr:first-child img")].every(
          (image) => (image as HTMLImageElement).complete,
        ),
      )
      const tops = await row
        .locator("img")
        .evaluateAll((images) => images.map((image) => image.getBoundingClientRect().top))
      expect(tops).toHaveLength(4)
      expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1)
      expect(await row.locator(".proofs").count()).toBe(3)
      const frames = await row
        .locator(".image-viewport")
        .evaluateAll((images) => images.map((image) => image.getBoundingClientRect().top))
      expect(Math.max(...frames) - Math.min(...frames)).toBeLessThan(1)
      await page.close()
    })
  }
  it("does not label structural-only selections as behavior-only", async () => {
    const data = fixture()
    const item = requireValue(requireValue(data.provider.families[0]).items[0])
    item.visualRequired = false
    item.requiredProofs = ["structural"]
    const page = await browser.newPage()
    await page.goto(await save(data))
    const row = page.locator("tbody tr").first()
    expect(await row.textContent()).toContain("No visual proof required for this selection")
    expect(await row.textContent()).not.toContain("behavior-only")
    expect(await row.locator("img").count()).toBe(0)
    await page.close()
  })
  it("puts actionable queues above the inventory and distinguishes design absence from missing evidence", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    const [design, missing, capture, behavior] = family.items
    requireValue(design).source.availability = "needs-design"
    requireValue(design).comparisons = requireValue(design).comparisons.map((c) => ({
      ...c,
      outcomes: { ...c.outcomes, structural: "failed", behavior: "failed" },
      artifacts: [],
    }))
    requireValue(missing).caseId = null
    Reflect.deleteProperty(requireValue(missing).source, "nodeId")
    Reflect.deleteProperty(requireValue(behavior).source, "nodeId")
    const page = await browser.newPage()
    await page.goto(await save(data))
    const positions = await page.evaluate(() => {
      const actions = document.querySelector("#action-overview")
      const table = document.querySelector("table")
      if (!actions || !table) throw new Error("Report overview or comparison table is missing")
      return {
        actions: actions.getBoundingClientRect().top,
        table: table.getBoundingClientRect().top,
      }
    })
    expect(positions.actions).toBeLessThan(positions.table)
    expect(await page.locator(".status-strip").textContent()).toContain("stale")
    expect(await page.locator(".status-strip").textContent()).toContain("staged")
    expect(await page.locator(".status-strip").textContent()).toContain("unreviewed")
    expect(await page.locator("#action-overview").textContent()).toContain(
      "fresh canonical validation",
    )
    expect(await page.locator(".banner").getAttribute("open")).toBeNull()
    expect(
      await page
        .getByRole("button", {
          name: "1 · Skipped — design needed",
          exact: true,
        })
        .count(),
    ).toBe(1)
    expect(
      await page.getByRole("button", { name: "1 · Design mapping needed", exact: true }).count(),
    ).toBe(1)
    await page.getByRole("button", { name: "1 · Skipped — design needed", exact: true }).click()
    expect(await page.locator("#visible-count").textContent()).toBe(
      "1 visible / 4 required item/mode combinations",
    )
    const row = page.locator("tbody tr").first()
    expect(await row.textContent()).toContain("Visual check skipped — design needed")
    expect(await row.locator(".badge").allTextContents()).toContain("visual: failed")
    expect(await row.locator(".badge").allTextContents()).toContain("structural: failed")
    expect(await row.locator(".badge").allTextContents()).toContain("behavior: failed")
    await page.getByLabel("Attention", { exact: true }).selectOption("needs-mapping")
    expect(await page.locator("tbody").textContent()).toContain(
      "Design mapping needed; design availability is unconfirmed",
    )
    expect(await page.locator("tbody").textContent()).not.toContain("Skipped — design needed")
    await page.getByLabel("Attention", { exact: true }).selectOption("capture-tools")
    expect(await page.locator("tbody").textContent()).toContain(requireValue(capture).label)
    expect(await page.locator("tbody").textContent()).not.toContain("Design mapping needed")
    await page.getByLabel("Attention", { exact: true }).selectOption("missing-fixtures")
    expect(await page.locator("#visible-count").textContent()).toBe(
      "1 visible / 4 required item/mode combinations",
    )
    await page.close()
  })
  it("keeps required-row attention counts separate from deduplicated case counts", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    const original = requireValue(family.items[0])
    family.items = [original, { ...original, id: "alias", label: "Alias required row" }]
    family.inventory.requiredItems = 2
    const page = await browser.newPage()
    await page.goto(await save(data))
    const card = page.locator(".action-card").filter({
      has: page.getByRole("button", {
        name: "2 · Recorded visual failures",
        exact: true,
      }),
    })
    expect(await card.textContent()).toContain(
      "2 required rows · 1 unique mapped case/mode selections · 3 recorded adapter results",
    )
    await card.getByRole("button").click()
    expect(await page.locator("#visible-count").textContent()).toBe(
      "2 visible / 2 required item/mode combinations",
    )
    await page.close()
  })
  it("keeps approved rule enrollment separate from unresolved source mapping", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    const rule = requireValue(family.items[1])
    rule.source.availability = "rule-defined"
    Reflect.deleteProperty(rule.source, "nodeId")
    rule.caseId = null
    const page = await browser.newPage()
    await page.goto(await save(data))
    expect(
      await page.getByRole("button", { name: "0 · Design mapping needed", exact: true }).count(),
    ).toBe(1)
    await page
      .getByRole("button", {
        name: "1 · Approved rules to enroll",
        exact: true,
      })
      .click()
    expect(await page.locator("#visible-count").textContent()).toBe(
      "1 visible / 4 required item/mode combinations",
    )
    expect(await page.locator("tbody").textContent()).not.toContain("Design mapping needed")
    expect(await page.locator("tbody").textContent()).not.toContain("Skipped — design needed")
    await page.close()
  })
  it("surfaces applicable nonvisual failures without borrowing inapplicable or merely unsupported proof", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    const behavior = requireValue(family.items[3])
    const structural = requireValue(family.items[0])
    family.items = [behavior, structural]
    family.inventory.requiredItems = 2
    family.inventory.gaps = []
    for (const c of behavior.comparisons)
      c.outcomes = {
        ...outcomes,
        visual: "passed",
        structural: "failed",
        behavior: c.implementationId === "react" ? "failed" : "passed",
        integrity: "failed",
        coverage: "unsupported",
      }
    for (const c of structural.comparisons)
      c.outcomes = {
        ...outcomes,
        visual: "passed",
        integrity: c.implementationId === "vue" ? "error" : "passed",
        structural: c.implementationId === "vue" ? "failed" : "passed",
        coverage: "unsupported",
      }
    const page = await browser.newPage()
    await page.goto(await save(data))
    const card = page.locator(".action-card").filter({
      has: page.getByRole("button", {
        name: "2 · Other required proof failures",
        exact: true,
      }),
    })
    expect(await card.textContent()).toContain(
      "2 required rows · 2 unique mapped case/mode selections · 2 recorded adapter results",
    )
    expect(await card.textContent()).toContain("react: behavior failed")
    expect(await card.textContent()).toContain("vue: structural failed, integrity error")
    expect(await card.textContent()).not.toContain("coverage unsupported")
    expect(await card.textContent()).not.toContain("react: structural failed")
    await card.getByRole("button").click()
    expect(await page.locator("#visible-count").textContent()).toBe(
      "2 visible / 2 required item/mode combinations",
    )
    expect(
      await page
        .getByRole("button", {
          name: "0 · Skipped — design needed",
          exact: true,
        })
        .count(),
    ).toBe(1)
    await page.close()
  })
  it("shows recorded engine and automated outcome and recommends exact-run review when all actions are resolved", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    family.freshness.state = "current"
    family.outcome = "passed"
    family.inventory.complete = true
    family.items = [requireValue(family.items[3])]
    family.inventory.requiredItems = 1
    for (const c of requireValue(family.items[0]).comparisons)
      c.outcomes = {
        ...outcomes,
        visual: "not-run",
        structural: "unsupported",
        behavior: "passed",
      }
    const page = await browser.newPage()
    await page.goto(await save(data))
    expect(await page.locator(".status-strip").textContent()).toContain("Automated result: passed")
    expect(await page.locator(".status-strip").textContent()).toContain(
      "Recorded engine: Reflection 0.5.1",
    )
    expect(await page.locator("#action-overview").textContent()).toContain(
      "owner review of this exact run",
    )
    expect(
      await page
        .getByRole("button", {
          name: "0 · Other required proof failures",
          exact: true,
        })
        .count(),
    ).toBe(0)
    await page.close()
  })
  it("keeps the default six-category overview within a 1280 by 720 viewport", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    requireValue(family.items[1]).source.availability = "needs-mapping"
    requireValue(family.items[2]).source.availability = "rule-defined"
    requireValue(family.items[2]).gaps = ["Needs enrollment"]
    const page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
    })
    await page.goto(await save(data))
    expect(await page.locator(".action-card").count()).toBe(6)
    expect(await page.locator(".action-card > p").count()).toBe(0)
    expect(
      await page
        .locator("#action-overview")
        .evaluate((node) => node.getBoundingClientRect().bottom),
    ).toBeLessThanOrEqual(720)
    await page.close()
  })
  it("does not classify an explicitly deferred design capture as a tool defect", async () => {
    const data = fixture()
    const family = requireValue(data.provider.families[0])
    const item = requireValue(family.items[0])
    item.source.availability = "needs-design"
    Reflect.deleteProperty(item.source, "nodeId")
    item.comparisons = item.comparisons.map((c) => ({
      ...c,
      artifacts: [],
      outcomes: {
        ...c.outcomes,
        visual: "not-run",
        structural: "failed",
        behavior: "failed",
      },
    }))
    family.items = [item]
    family.inventory.requiredItems = 1
    const page = await browser.newPage()
    await page.goto(await save(data))
    expect(
      await page
        .getByRole("button", {
          name: "1 · Skipped — design needed",
          exact: true,
        })
        .count(),
    ).toBe(1)
    expect(
      await page.getByRole("button", { name: "0 · Capture or tool gaps", exact: true }).count(),
    ).toBe(1)
    expect(
      await page
        .getByRole("button", {
          name: "1 · Other required proof failures",
          exact: true,
        })
        .count(),
    ).toBe(1)
    await page.getByLabel("Attention", { exact: true }).selectOption("capture-tools")
    expect(await page.locator("#visible-count").textContent()).toBe(
      "0 visible / 1 required item/mode combinations",
    )
    await page.getByLabel("Attention", { exact: true }).selectOption("needs-design")
    expect(await page.locator("tbody .badge").allTextContents()).toContain("visual: not-run")
    expect(await page.locator("tbody .badge").allTextContents()).toContain("structural: failed")
    expect(await page.locator("tbody .badge").allTextContents()).toContain("behavior: failed")
    await page.close()
  })
})
