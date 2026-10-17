import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { GovernanceReport } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { reflectionImageIO } from "../source-promotion/webp-conversion.js"
import { createHtmlReport, serializeReportData, verifiedPortableArtifact } from "./html-report.js"
import { getCatalog, hash, inputFingerprint, readReport } from "./store.js"
import type { ProviderCatalog } from "./ui-provider.js"

vi.mock("./store.js", async (original) => ({
  ...(await original<typeof import("./store.js")>()),
  getCatalog: vi.fn(),
  inputFingerprint: vi.fn(),
  readReport: vi.fn(),
}))
const roots: string[] = []
const fingerprint = "a".repeat(64)
const PNG = createRequire(import.meta.resolve("reflection-check"))("pngjs").PNG
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "governance-html-"))
  roots.push(root)
  const runRoot = join(root, ".reflection/governance/exact-run")
  mkdirSync(runRoot, { recursive: true })
  const png = new PNG({ width: 2, height: 2 })
  png.data.fill(255)
  const bytes: Buffer = PNG.sync.write(png)
  writeFileSync(join(runRoot, "design.png"), bytes)
  writeFileSync(join(runRoot, "runtime.png"), bytes)
  const report: GovernanceReport = {
    schemaVersion: 1,
    runId: "exact-run",
    family: "button",
    startedAt: "2026-10-16T00:00:00Z",
    finishedAt: "2026-10-16T00:01:00Z",
    fingerprint,
    environment: { browser: "chromium" },
    freshness: { state: "current", reasons: [] },
    review: { state: "unreviewed" },
    outcome: "failed",
    cases: [
      {
        caseId: "button.basic",
        adapter: "react",
        mode: "light",
        sourceUrl: "https://figma.com/design/file",
        measurements: [],
        outcomes: {
          integrity: "passed",
          structural: "not-run",
          visual: "failed",
          behavior: "not-run",
          coverage: "passed",
        },
        unsupported: [],
        artifacts: [
          { path: "design.png", sha256: hash(bytes), mimeType: "image/png", role: "reference" },
          { path: "runtime.png", sha256: hash(bytes), mimeType: "image/png", role: "actual" },
        ],
      },
    ],
  }
  const catalog: ProviderCatalog = {
    families: [
      {
        family: "button",
        runId: report.runId,
        freshness: report.freshness,
        review: report.review,
        outcome: report.outcome,
        coverage: {
          requiredItems: 2,
          coveredItems: 1,
          complete: false,
          items: [
            {
              itemId: "basic.light",
              label: "Basic </script><img onerror=alert(1)>",
              mode: "light",
              caseId: "button.basic",
              requiredProofs: ["visual"],
              gaps: [],
            },
            {
              itemId: "missing.light",
              label: "Missing",
              mode: "light",
              requiredProofs: ["visual"],
              gaps: ["Missing fixture"],
            },
          ],
        },
      },
    ],
  }
  writeFileSync(join(runRoot, "report.json"), JSON.stringify(report))
  const familyRoot = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(familyRoot, { recursive: true })
  writeFileSync(
    join(familyRoot, "reflection-contract.json"),
    JSON.stringify({
      cases: [
        {
          caseId: "button.basic",
          mode: "light",
          comparison: { threshold: { maxDiffPixels: 60 }, strict: true },
        },
      ],
    }),
  )
  vi.mocked(inputFingerprint).mockReturnValue(fingerprint)
  vi.mocked(getCatalog).mockReturnValue(catalog as ReturnType<typeof getCatalog>)
  vi.mocked(readReport).mockImplementation(() => structuredClone(report))
  return { root, report, catalog, runRoot }
}
beforeEach(() => vi.clearAllMocks())
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe("portable exact-run HTML evidence", () => {
  it("embeds only the explicit run, keeps missing rows and adapter gaps, and exposes no operations", async () => {
    const { root } = fixture()
    const result = await createHtmlReport(root, { family: "button", runId: "exact-run" })
    expect(getCatalog).toHaveBeenCalledWith(root, { family: "button", runId: "exact-run" })
    expect(result.payload.provider.families).toHaveLength(1)
    const family = requireValue(result.payload.provider.families[0])
    expect(family.inventory.requiredItems).toBe(2)
    expect(family.items).toHaveLength(2)
    expect(requireValue(family.items[1]).comparisons.every((row) => row.state === "missing")).toBe(
      true,
    )
    expect(requireValue(requireValue(family.items[0]).comparisons[1]).artifacts).toEqual([])
    expect(
      requireValue(requireValue(family.items[0]).comparisons[0]).artifacts.every((artifact) =>
        artifact.href.startsWith("data:image/png;base64,"),
      ),
    ).toBe(true)
    expect(result.payload.provider.capabilities).toEqual({
      readArtifacts: true,
      readOnly: true,
      startValidation: false,
      acceptReview: false,
      promoteReferences: false,
    })
    expect(result.html).not.toContain("/api/jobs")
    expect(result.html).not.toContain("<!--REPORT_")
    expect(result.summary).toMatchObject({ requiredItems: 2, comparisonCount: 6, artifactCount: 2 })
  })
  it("recomputes supplementary pixel metrics without rewriting a canonical failed result", async () => {
    const { root, report, runRoot } = fixture()
    const result = await createHtmlReport(root, { family: "button", runId: "exact-run" })
    const metric = requireValue(Object.values(result.payload.visualMetrics)[0])
    expect(metric).toMatchObject({
      diffPixels: 0,
      diffRatio: 0,
      threshold: { maxDiffPixels: 60 },
      thresholdAvailability: "exact-run-policy",
      provenance: "recomputed-from-verified-images",
    })
    expect(
      requireValue(
        requireValue(requireValue(result.payload.provider.families[0]).items[0]).comparisons[0],
      ).outcomes?.visual,
    ).toBe("failed")
    expect(JSON.parse(readFileSync(join(runRoot, "report.json"), "utf8"))).toEqual(report)
  })
  it("decodes and embeds lossless WebP references with PNG runtime captures", async () => {
    const { root, report, runRoot } = fixture()
    const codec = await reflectionImageIO()
    const source = join(runRoot, "design.png")
    const target = join(runRoot, "design.webp")
    await codec.promoteBaselineImage(source, target)
    requireValue(report.cases[0]).artifacts[0] = {
      path: "design.webp",
      mimeType: "image/webp",
      role: "reference",
      sha256: hash(readFileSync(target)),
    }
    const result = await createHtmlReport(root, { family: "button", runId: "exact-run" })
    expect(
      requireValue(
        requireValue(
          requireValue(requireValue(result.payload.provider.families[0]).items[0]).comparisons[0],
        ).artifacts[0],
      ).href,
    ).toMatch(/^data:image\/webp;base64,/)
    expect(requireValue(Object.values(result.payload.visualMetrics)[0]).diffPixels).toBe(0)
  })
  it("escapes malicious report strings and includes a restrictive offline CSP", async () => {
    const { root } = fixture()
    const { html } = await createHtmlReport(root, { family: "button", runId: "exact-run" })
    expect(html).not.toContain("Basic </script><img")
    expect(html).toContain("Basic \\u003c/script\\u003e")
    expect(html).toContain("connect-src 'none'")
    expect(html).toContain("script-src 'sha256-")
    expect(JSON.parse(serializeReportData({ value: "<&>\u2028\u2029" }))).toEqual({
      value: "<&>\u2028\u2029",
    })
  })
  it("omits historical active thresholds rather than using current policy", async () => {
    const { root, report } = fixture()
    report.fingerprint = "b".repeat(64)
    report.freshness = { state: "stale", reasons: ["Changed inputs"] }
    const result = await createHtmlReport(root, { family: "button", runId: "exact-run" })
    expect(Object.values(result.payload.visualMetrics)[0]).toMatchObject({
      thresholdAvailability: "unavailable",
    })
    expect(Object.values(result.payload.visualMetrics)[0]).not.toHaveProperty("threshold")
    expect(result.payload.artifactWarnings).toHaveLength(1)
  })
  it("does not embed artifacts for a changed required selection", async () => {
    const { root, catalog } = fixture()
    requireValue(
      requireValue(requireValue(requireValue(catalog.families[0]).coverage).items)[0],
    ).evidenceMatch = "changed"
    const result = await createHtmlReport(root, { family: "button", runId: "exact-run" })
    expect(result.summary.artifactCount).toBe(0)
    expect(result.payload.visualMetrics).toEqual({})
    expect(
      requireValue(
        requireValue(requireValue(result.payload.provider.families[0]).items[0]).comparisons[0],
      ).state,
    ).toBe("unmatched")
  })
  it("refuses corrupt bytes, unsupported MIME, MIME disagreement, invalid images and escaped symlinks", async () => {
    const { root, report, runRoot } = fixture()
    const artifact = requireValue(requireValue(report.cases[0]).artifacts[0])
    await expect(
      verifiedPortableArtifact(root, report.runId, { ...artifact, sha256: "c".repeat(64) }),
    ).rejects.toThrow("hash differs")
    await expect(
      verifiedPortableArtifact(root, report.runId, { ...artifact, mimeType: "text/html" }),
    ).rejects.toThrow("MIME")
    await expect(
      verifiedPortableArtifact(root, report.runId, { ...artifact, mimeType: "image/webp" }),
    ).rejects.toThrow("MIME")
    writeFileSync(join(runRoot, "invalid.png"), "not an image")
    await expect(
      verifiedPortableArtifact(root, report.runId, {
        ...artifact,
        path: "invalid.png",
        sha256: hash("not an image"),
      }),
    ).rejects.toThrow()
    writeFileSync(join(root, "outside.png"), "outside")
    symlinkSync(join(root, "outside.png"), join(runRoot, "escape.png"))
    await expect(
      verifiedPortableArtifact(root, report.runId, {
        ...artifact,
        path: "escape.png",
        sha256: hash("outside"),
      }),
    ).rejects.toThrow("escaped")
  })
  it("omits unsupported optional artifacts explicitly while retaining their manifest provenance", async () => {
    const { root, report, runRoot } = fixture()
    writeFileSync(join(runRoot, "notes.txt"), "notes")
    requireValue(report.cases[0]).artifacts.push({
      path: "notes.txt",
      mimeType: "text/plain",
      sha256: hash("notes"),
    })
    const result = await createHtmlReport(root, { family: "button", runId: "exact-run" })
    expect(result.payload.artifactWarnings).toHaveLength(1)
    expect(
      requireValue(
        requireValue(requireValue(result.payload.provider.families[0]).items[0]).comparisons[0],
      ).artifacts,
    ).toHaveLength(2)
    expect(result.payload.manifest.artifacts).toHaveLength(3)
  })
  it("refuses input changes during export and never falls back after an explicit-run error", async () => {
    const { root } = fixture()
    vi.mocked(inputFingerprint).mockReturnValueOnce(fingerprint).mockReturnValueOnce("b".repeat(64))
    await expect(createHtmlReport(root, { family: "button", runId: "exact-run" })).rejects.toThrow(
      "changed during",
    )
    vi.mocked(getCatalog).mockImplementationOnce(() => {
      throw Error("Exact run corrupt")
    })
    await expect(createHtmlReport(root, { family: "button", runId: "exact-run" })).rejects.toThrow(
      "Exact run corrupt",
    )
  })
})
