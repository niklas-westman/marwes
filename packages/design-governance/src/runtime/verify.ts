import { randomUUID } from "node:crypto"
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { type Browser, chromium } from "playwright"
import type { CompiledCase } from "../compile/compile-family.js"
import { compileFamily } from "../compile/compile-family.js"
import { loadBehaviorFixtures } from "../contracts/behavior-fixtures.js"
import { familyCoverage } from "../contracts/coverage.js"
import { structuralEnrollmentRequired } from "../contracts/enrollment.js"
import {
  type Adapter,
  type CaseReport,
  type Expectation,
  type GovernanceReport,
  adapters,
  composeOutcome,
} from "../contracts/report.js"
import { evidenceRoot, hash, inputFingerprint, writeReport } from "../evidence/store.js"
import { proofInputFingerprint } from "../source-promotion/proof-inputs.js"
import { prepareStagedInputs } from "../source-promotion/staged-inputs.js"
import { validatePortableIntegrity } from "../source/portable-integrity.js"
import type { LegacyContract } from "../source/types.js"
import { behaviorEnrollmentGap, loadBehaviorContract, runBehavior } from "./behavior.js"
import { applyBrowserState } from "./browser-state.js"
import { measure, measureFonts } from "./measure.js"
import { startPortal } from "./portal.js"
import { runVisual } from "./visual.js"
export async function verifyFamily(
  repoRoot: string,
  selection: { family: string; adapters?: Adapter[]; strict?: boolean; stageId?: string },
): Promise<GovernanceReport> {
  const selected = selection.adapters ?? adapters
  if (
    !/^[a-z0-9-]+$/.test(selection.family) ||
    !selected.length ||
    selected.some((adapter) => !adapters.includes(adapter))
  )
    throw Error("Invalid family or adapter selection")
  const startedAt = new Date().toISOString()
  const fingerprint = inputFingerprint(repoRoot)
  const runId = `${selection.family}-${Date.now()}-${randomUUID()}`
  const runRoot = join(evidenceRoot(repoRoot), runId)
  mkdirSync(runRoot, { recursive: true })
  const staged = selection.stageId
    ? await prepareStagedInputs(repoRoot, runRoot, selection.family, selection.stageId)
    : undefined
  const proofRoot = staged?.proofRoot ?? repoRoot
  const cases: CaseReport[] = []
  const environment: Record<string, string> = {
    evidenceScope: staged ? "staged" : "active",
    ...(staged
      ? {
          stageId: staged.stageId,
          stageHash: staged.stageHash,
          proofSnapshotSha256: staged.snapshotSha256,
          proofManifestSha256: staged.manifestSha256,
          proofInputsSha256: staged.proofInputsSha256,
        }
      : {}),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    reflection: JSON.parse(
      readFileSync(join(repoRoot, "node_modules/reflection-check/package.json"), "utf8"),
    ).version,
  }
  let compilation: ReturnType<typeof compileFamily>
  let compilationError: string | undefined
  try {
    compilation = compileFamily(proofRoot, selection.family)
  } catch (error) {
    compilationError = String(error)
    compilation = { family: selection.family, cases: [], uncovered: [compilationError] }
  }
  const contract: LegacyContract = JSON.parse(
    readFileSync(
      join(
        proofRoot,
        "packages/design-governance/reflection-families",
        selection.family,
        "reflection-contract.json",
      ),
      "utf8",
    ),
  )
  const enrolled = structuralEnrollmentRequired(proofRoot, selection.family)
  const integrity = validatePortableIntegrity(proofRoot, selection.family, {
    strict: selection.strict ?? false,
  })
  for (const entry of contract.cases)
    if (!compilation.cases.some((item) => item.caseId === entry.caseId && item.mode === entry.mode))
      compilation.cases.push({
        ...entry,
        expectations: [],
        unsupported: enrolled ? [compilationError ?? "Required case lacks structural mapping"] : [],
      })
  const behavior = loadBehaviorContract(proofRoot, selection.family)
  const coverage = familyCoverage(proofRoot, selection.family, compilation)
  const runtimeCases: (CompiledCase & { proofScope?: "behavior-only" })[] = [
    ...compilation.cases,
    ...(loadBehaviorFixtures(proofRoot, selection.family)?.cases ?? []).map((fixture) => ({
      ...fixture,
      proofScope: "behavior-only" as const,
      expectations: [],
      unsupported: [],
      framing: {
        rootSelector: "#reflection-case-root",
        background: "#ffffff",
        align: "start" as const,
        padding: 0,
      },
    })),
  ]
  const coverageGaps = coverage.complete
    ? []
    : coverage.gaps.map((gap) => `Family coverage: ${gap}`)
  let browser: Browser
  try {
    browser = await chromium.launch({ headless: true })
  } catch (error) {
    const report: GovernanceReport = {
      schemaVersion: 1,
      runId,
      family: selection.family,
      startedAt,
      finishedAt: new Date().toISOString(),
      fingerprint,
      environment,
      cases: [],
      freshness: { state: "invalid", reasons: [String(error)] },
      review: { state: "unreviewed" },
      outcome: "blocked",
    }
    writeReport(repoRoot, report)
    return report
  }
  environment.browser = browser.version()
  try {
    for (const adapter of selected) {
      const portal = await startPortal(repoRoot, adapter, runtimeCases)
      try {
        for (const entry of runtimeCases) {
          const behaviorOnly = entry.proofScope === "behavior-only"
          const behaviorRequired =
            behaviorOnly ||
            coverage.items.some(
              (requirement) =>
                requirement.caseId === entry.caseId &&
                requirement.mode === entry.mode &&
                requirement.requiredProofs.includes("behavior"),
            )
          const item: CaseReport = {
            ...(behaviorOnly ? { proofScope: "behavior-only" as const } : {}),
            caseId: entry.caseId,
            adapter,
            mode: entry.mode,
            sourceUrl: entry.expectations[0]
              ? `https://www.figma.com/design/${entry.expectations[0].source.fileKey}?node-id=${entry.expectations[0].source.nodeId.replace(":", "-")}`
              : "",
            measurements: [],
            requiredProofs: [
              "integrity",
              ...(!behaviorOnly && enrolled ? ["structural" as const] : []),
              ...(!behaviorOnly ? ["visual" as const] : []),
              "coverage",
              ...(behaviorRequired ? ["behavior" as const] : []),
            ],
            outcomes: {
              integrity: behaviorOnly ? "passed" : integrity.status,
              structural: "not-run",
              visual: "not-run",
              behavior: "not-run",
              coverage:
                entry.unsupported.length ||
                coverageGaps.length ||
                (!behaviorOnly && integrity.status !== "passed")
                  ? "unsupported"
                  : "passed",
            },
            unsupported: [
              ...entry.unsupported,
              ...coverageGaps,
              ...(!behaviorOnly && integrity.status !== "passed" ? integrity.details : []),
            ],
            artifacts: [],
            ...(entry.limitations ? { limitations: entry.limitations } : {}),
          }
          cases.push(item)
          const page = await browser.newPage({
            viewport: entry.viewportSize,
            deviceScaleFactor: 1,
            reducedMotion: "reduce",
          })
          try {
            await page.goto(`${portal.url}${entry.portalPath}`, { waitUntil: "networkidle" })
            await page.waitForFunction(
              () =>
                Boolean(
                  (window as unknown as { __governanceReady?: boolean; __governanceError?: string })
                    .__governanceReady ||
                    (window as unknown as { __governanceError?: string }).__governanceError,
                ),
              {},
              { timeout: 60_000 },
            )
            const portalError = await page.evaluate(
              () => (window as unknown as { __governanceError?: string }).__governanceError,
            )
            if (portalError) throw Error(portalError)
            await page.evaluate(async () => {
              await document.fonts.ready
              await new Promise<void>((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
              )
            })
            if (!behaviorOnly) {
              await applyBrowserState(page, entry.browserState)
              const expectations = entry.expectations as Expectation[]
              item.measurements = await measure(page, expectations)
              item.measurements.push(...(await measureFonts(page, expectations)))
              item.outcomes.structural = !expectations.length
                ? "unsupported"
                : item.measurements.some((row) => row.outcome !== "passed")
                  ? "failed"
                  : "passed"
              item.outcomes.coverage = item.unsupported.length ? "unsupported" : "passed"
              const name = `${adapter}-${entry.caseId}-${entry.mode}.png`
              const path = join(runRoot, name)
              await page.screenshot({ path, animations: "disabled" })
              item.artifacts.push({
                path: name,
                sha256: hash(readFileSync(path)),
                mimeType: "image/png",
                role: "capture",
              })
            }
            const scenarios =
              behavior?.scenarios.filter(
                (scenario) => scenario.caseId === entry.caseId && scenario.mode === entry.mode,
              ) ?? []
            if (scenarios.length) {
              const results = await runBehavior(page, scenarios)
              item.outcomes.behavior = results.some((result) => result.outcome === "error")
                ? "error"
                : results.some((result) => result.outcome !== "passed")
                  ? "failed"
                  : "passed"
              const name = `${adapter}-${entry.caseId}-${entry.mode}-behavior.json`
              const bytes = JSON.stringify(
                {
                  schemaVersion: 1,
                  runId,
                  fingerprint,
                  family: selection.family,
                  caseId: entry.caseId,
                  mode: entry.mode,
                  adapter,
                  scenarios,
                  results,
                },
                null,
                2,
              )
              writeFileSync(join(runRoot, name), bytes)
              item.artifacts.push({
                path: name,
                sha256: hash(bytes),
                mimeType: "application/json",
                role: "behavior",
              })
            } else if (behaviorRequired) {
              item.outcomes.behavior = "unsupported"
              item.unsupported.push(
                behaviorEnrollmentGap(behavior, entry.caseId, entry.mode) ??
                  "Behavior scenario not enrolled",
              )
              item.outcomes.coverage = "unsupported"
            }
          } catch (error) {
            if (behaviorOnly) item.outcomes.behavior = "error"
            else item.outcomes.structural = "error"
            item.outcomes.coverage = "error"
            item.unsupported.push(String(error))
          } finally {
            await page.close()
          }
        }
      } finally {
        await portal.close()
      }
      const visual = await runVisual(repoRoot, runRoot, selection.family, adapter, proofRoot)
      for (const item of cases.filter(
        (item) => item.adapter === adapter && item.proofScope !== "behavior-only",
      )) {
        const id = `visual.${adapter}.${item.caseId}.${item.mode}`
        const entry = compilation.cases.find(
          (entry) => entry.caseId === item.caseId && entry.mode === item.mode,
        )
        item.outcomes.visual = entry?.captureRequirement
          ? "unsupported"
          : (visual.outcomes.get(id) ?? "not-run")
        const directory = join(visual.directory, "visual", `${adapter}.${item.caseId}.${item.mode}`)
        for (const role of ["expected", "actual", "diff"]) {
          const path = join(directory, `${role}.png`)
          if (existsSync(path)) {
            const name = `${adapter}-${item.caseId}-${item.mode}-${role}.png`
            copyFileSync(path, join(runRoot, name))
            item.artifacts.push({
              path: name,
              sha256: hash(readFileSync(path)),
              mimeType: "image/png",
              role: role === "expected" ? "reference" : (role as "actual" | "diff"),
            })
          }
        }
      }
    }
  } catch (error) {
    const report: GovernanceReport = {
      schemaVersion: 1,
      runId,
      family: selection.family,
      startedAt,
      finishedAt: new Date().toISOString(),
      fingerprint,
      environment,
      cases,
      freshness: { state: "invalid", reasons: [String(error)] },
      review: { state: "unreviewed" },
      outcome: "blocked",
    }
    writeReport(repoRoot, report)
    return report
  } finally {
    await browser.close()
  }
  let stagedInputError: string | undefined
  if (staged) {
    try {
      if (proofInputFingerprint(proofRoot) !== staged.proofInputsSha256)
        stagedInputError = "Staged proof inputs changed while validation was running"
    } catch (error) {
      stagedInputError = String(error)
    }
  }
  const freshness: GovernanceReport["freshness"] =
    inputFingerprint(repoRoot) === fingerprint && !stagedInputError
      ? { state: "current", reasons: [] }
      : {
          state: "invalid",
          reasons: [stagedInputError ?? "Inputs changed while validation was running"],
        }
  const report: GovernanceReport = {
    schemaVersion: 1,
    runId,
    family: selection.family,
    startedAt,
    finishedAt: new Date().toISOString(),
    fingerprint,
    environment,
    cases,
    freshness,
    review: { state: "unreviewed" },
    outcome: composeOutcome(cases, freshness),
  }
  writeReport(repoRoot, report)
  writeFileSync(join(runRoot, "measurements.json"), JSON.stringify(cases, null, 2))
  return report
}
