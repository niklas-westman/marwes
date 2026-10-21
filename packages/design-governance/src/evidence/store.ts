import { createHash } from "node:crypto"
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { join, relative, resolve } from "node:path"
import { chromium } from "playwright"
import { compileFamily } from "../compile/compile-family.js"
import {
  loadBehaviorFixtures,
  validateBehaviorFixtureEnrollment,
} from "../contracts/behavior-fixtures.js"
import { type CoverageItem, familyCoverage } from "../contracts/coverage.js"
import { structuralEnrollmentRequired } from "../contracts/enrollment.js"
import {
  type GovernanceReport,
  adapters,
  composeOutcome,
  parseReport,
} from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { evaluateHumanReview } from "../review/index.js"
import { loadBehaviorContract, validateBehaviorEvidence } from "../runtime/behavior.js"
import { proofInputFingerprint } from "../source-promotion/proof-inputs.js"
import { parsePromotionStage } from "../source-promotion/stage.js"

export function hash(data: string | Buffer): string {
  return createHash("sha256").update(data).digest("hex")
}
export function evidenceRoot(repoRoot: string): string {
  return join(
    repoRoot,
    process.env.CI ? "artifacts/reflection/governance" : ".reflection/governance",
  )
}
/** Conservative invalidation includes every component/style/fixture and tooling policy. */
export function inputFingerprint(repoRoot: string): string {
  const files: string[] = []
  function walk(path: string) {
    if (!existsSync(path)) return
    const info = statSync(path)
    if (info.isDirectory()) {
      for (const name of readdirSync(path).sort())
        if (
          ![
            "node_modules",
            "dist",
            ".git",
            ".reflection",
            // Promotion's own exclusive lock lives in the family folder it is applying.
            ".governance-promotion.lock",
          ].includes(name)
        )
          walk(join(path, name))
    } else files.push(path)
  }
  for (const path of [
    "packages/core/src",
    "packages/react/src",
    "packages/vue/src",
    "packages/svelte/src",
    "packages/presets/src",
    "packages/design-governance/src",
    "packages/design-governance/reflection-families",
    "docs/registry/families",
    "artifacts/component-registry.json",
    "tests/reflection",
    "apps/storybook-react/reflection.vite.config.ts",
    "apps/storybook-vue/reflection.vite.config.ts",
    "apps/storybook-svelte/reflection.vite.config.ts",
    "reflection.shared.ts",
    "reflection.config.ts",
    "reflection.vue.config.ts",
    "reflection.svelte.config.ts",
    "package.json",
    "packages/design-governance/package.json",
    "pnpm-lock.yaml",
    ".pi/figma-sync.json",
    ".figma/marwes/manifest.json",
    ".figma/marwes/tokens/variables.json",
    "apps/storybook-react/public",
    "apps/storybook-vue/public",
    "apps/storybook-svelte/public",
    "assets",
    "node_modules/@fontsource/instrument-sans",
    "packages/presets/node_modules/@fontsource/instrument-sans",
  ])
    walk(join(repoRoot, path))
  const digest = createHash("sha256")
  digest.update(
    `${process.version}:${process.platform}:${process.arch}:headless:scale1:reduced-motion`,
  )
  const executable = chromium.executablePath()
  digest.update(executable)
  if (existsSync(executable)) digest.update(readFileSync(executable))
  for (const file of files.sort())
    digest.update(relative(repoRoot, file)).update(readFileSync(file))
  return digest.digest("hex")
}
export function writeReport(repoRoot: string, report: GovernanceReport): void {
  parseReport(report)
  const root = evidenceRoot(repoRoot)
  const target = join(root, report.runId)
  if (existsSync(join(target, "report.json"))) throw new Error("Run evidence is immutable")
  mkdirSync(target, { recursive: true })
  const temporary = join(target, "report.json.tmp")
  writeFileSync(temporary, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" })
  renameSync(temporary, join(target, "report.json"))
}
export function readReport(
  repoRoot: string,
  runId: string,
  currentFingerprint = inputFingerprint(repoRoot),
): GovernanceReport {
  if (!/^[a-z0-9-]+$/.test(runId)) throw new Error("Invalid run ID")
  const rawReport = readFileSync(join(evidenceRoot(repoRoot), runId, "report.json"), "utf8")
  const report = parseReport(JSON.parse(rawReport))
  report.review = { state: "unreviewed" }
  const reviewPath = join(evidenceRoot(repoRoot), "reviews", report.family, `${runId}.json`)
  if (existsSync(reviewPath)) {
    try {
      const assessment = evaluateHumanReview(JSON.parse(readFileSync(reviewPath, "utf8")), {
        family: report.family,
        runId,
        evidenceHash: hash(rawReport),
        inputFingerprint: report.fingerprint,
        latestRunId: latestRunId(repoRoot, report.family) ?? runId,
        currentInputFingerprint: currentFingerprint,
        caseIds: report.cases.map((item) => `${item.caseId}:${item.adapter}:${item.mode}`),
        assertionIdsByCase: Object.fromEntries(
          report.cases.map((item) => [
            `${item.caseId}:${item.adapter}:${item.mode}`,
            item.measurements.map((row) => `${row.part}.${row.property}`),
          ]),
        ),
      })
      report.review = {
        ...assessment,
        state: assessment.state === "invalid" ? "stale" : assessment.state,
      }
    } catch (error) {
      report.review = { state: "stale", reasons: [String(error)], exceptions: [] }
    }
  }
  if (report.fingerprint === currentFingerprint) {
    const contractPath = join(
      repoRoot,
      "packages/design-governance/reflection-families",
      report.family,
      "reflection-contract.json",
    )
    if (existsSync(contractPath)) {
      const contract = JSON.parse(readFileSync(contractPath, "utf8")) as {
        cases: { caseId: string; mode: string }[]
      }
      const enrolled = structuralEnrollmentRequired(repoRoot, report.family)
      const behaviorFixtures = loadBehaviorFixtures(repoRoot, report.family)
      const requiredCases = [...contract.cases, ...(behaviorFixtures?.cases ?? [])]
      for (const adapter of new Set(report.cases.map((item) => item.adapter))) {
        for (const entry of requiredCases)
          if (
            !report.cases.some(
              (item) =>
                item.adapter === adapter &&
                item.caseId === entry.caseId &&
                item.mode === entry.mode,
            )
          )
            throw Error("Run missing registered required case")
      }
      const coveragePath = join(
        repoRoot,
        "packages/design-governance/reflection-families",
        report.family,
        "coverage-contract.json",
      )
      const requirements = existsSync(coveragePath)
        ? (JSON.parse(readFileSync(coveragePath, "utf8")).items ?? [])
        : []
      if (behaviorFixtures)
        validateBehaviorFixtureEnrollment(behaviorFixtures, {
          visualCases: contract.cases,
          requirements,
          scenarios: loadBehaviorContract(repoRoot, report.family)?.scenarios ?? [],
        })
      for (const item of report.cases) {
        const behaviorOnly =
          behaviorFixtures?.cases.some(
            (entry) => entry.caseId === item.caseId && entry.mode === item.mode,
          ) ?? false
        if ((item.proofScope === "behavior-only") !== behaviorOnly)
          throw Error("Run changes registered proof scope")
        const behaviorRequired = requirements.some(
          (entry: { caseId?: string; mode: string; requiredProofs: string[] }) =>
            entry.caseId === item.caseId &&
            entry.mode === item.mode &&
            entry.requiredProofs.includes("behavior"),
        )
        if (behaviorRequired && !item.requiredProofs?.includes("behavior"))
          throw Error("Run weakens current required behavior policy")
        const required = behaviorOnly
          ? ["integrity", "behavior", "coverage"]
          : enrolled
            ? ["integrity", "structural", "visual", "coverage"]
            : ["integrity", "visual", "coverage"]
        if (
          item.requiredProofs &&
          required.some(
            (key) =>
              !item.requiredProofs?.includes(
                key as "integrity" | "structural" | "visual" | "behavior" | "coverage",
              ),
          )
        )
          throw Error("Run weakens current required proof policy")
      }
    }
  }
  if (report.runId !== runId) throw new Error("Run ID does not match evidence directory")
  if (report.environment.evidenceScope === "staged") {
    const expectedInputs = report.environment.proofInputsSha256
    if (!expectedInputs || !/^[a-f0-9]{64}$/.test(expectedInputs))
      throw Error("Staged evidence lacks a complete proof input binding")
    const runRoot = join(evidenceRoot(repoRoot), runId)
    if (lstatSync(runRoot).isSymbolicLink()) throw Error("Staged proof run must not be a symlink")
    if (proofInputFingerprint(join(runRoot, "inputs")) !== expectedInputs)
      throw Error("Staged proof inputs changed")
    const stageId = report.environment.stageId ?? ""
    if (!/^[a-f0-9-]{36}$/.test(stageId)) throw Error("Invalid staged evidence identity")
    const stagesRoot = realpathSync(join(evidenceRoot(repoRoot), "stages"))
    const stageRoot = realpathSync(join(stagesRoot, stageId))
    if (!stageRoot.startsWith(`${stagesRoot}/`)) throw Error("Staged evidence path escaped")
    const bytes = readFileSync(join(stageRoot, "manifest.json"))
    if (hash(bytes) !== report.environment.stageHash)
      throw Error("Staged evidence manifest changed")
    const stage = parsePromotionStage(JSON.parse(bytes.toString()))
    if (
      stage.family !== report.family ||
      stage.stageId !== stageId ||
      stage.inputFingerprint !== report.fingerprint
    )
      throw Error("Staged evidence binding differs")
    for (const [index, artifact] of stage.artifacts.entries()) {
      const file = realpathSync(join(stageRoot, "artifacts", String(index)))
      if (!file.startsWith(`${stageRoot}/artifacts/`)) throw Error("Staged artifact path escaped")
      const data = readFileSync(file)
      if (hash(data) !== artifact.sha256 || data.length !== artifact.bytes)
        throw Error("Staged source artifact changed")
    }
  }
  if (report.freshness.state !== "invalid" && report.fingerprint !== currentFingerprint) {
    report.freshness = {
      state: "stale",
      reasons: [
        "Source, implementation, policy, fixture, assets or tool environment changed since this run",
      ],
    }
    if (report.review.state === "accepted" || report.review.state === "rejected")
      report.review.state = "stale"
    report.outcome = composeOutcome(report.cases, report.freshness)
  }
  for (const item of report.cases)
    for (const artifact of item.artifacts) {
      const root = realpathSync(join(evidenceRoot(repoRoot), runId))
      const path = resolve(root, artifact.path)
      if (
        !existsSync(path) ||
        !realpathSync(path).startsWith(`${root}/`) ||
        hash(readFileSync(path)) !== artifact.sha256
      )
        throw new Error(`Artifact missing or corrupted: ${artifact.path}`)
    }
  for (const item of report.cases) {
    const artifacts = item.artifacts.filter((artifact) => artifact.role === "behavior")
    if (artifacts.length > 1) throw Error("Ambiguous behavior evidence")
    for (const artifact of artifacts) {
      const evidence = JSON.parse(
        readFileSync(join(evidenceRoot(repoRoot), runId, artifact.path), "utf8"),
      )
      validateBehaviorEvidence(
        evidence,
        {
          runId,
          fingerprint: report.fingerprint,
          family: report.family,
          caseId: item.caseId,
          mode: item.mode,
          adapter: item.adapter,
        },
        item.outcomes.behavior,
      )
      if (report.fingerprint === currentFingerprint) {
        const proofRoot =
          report.environment.evidenceScope === "staged"
            ? join(evidenceRoot(repoRoot), runId, "inputs")
            : repoRoot
        const declared =
          loadBehaviorContract(proofRoot, report.family)?.scenarios.filter(
            (scenario) => scenario.caseId === item.caseId && scenario.mode === item.mode,
          ) ?? []
        if (JSON.stringify(declared) !== JSON.stringify(evidence.scenarios))
          throw Error("Behavior evidence differs from required scenarios")
      }
    }
  }
  return report
}
function latestRunId(repoRoot: string, family: string): string | undefined {
  const root = evidenceRoot(repoRoot)
  if (!existsSync(root)) return undefined
  const candidates = readdirSync(root)
    .filter((name) => /^[a-z0-9-]+$/.test(name) && statSync(join(root, name)).isDirectory())
    .flatMap((name) => {
      const directory = join(root, name)
      const path = join(directory, "report.json")
      // Canonical run names identify a family even before report.json is written.
      // Distinguish sibling families such as input and input-fields.
      const named = /^(.+?)-(\d{10,})-/.exec(name)
      const belongs = named ? named[1] === family : name.startsWith(`${family}-`)
      const timestamp = named && belongs ? Number(named[2]) : undefined
      const fallbackTime = timestamp ?? statSync(directory).mtimeMs
      try {
        const metadata = JSON.parse(readFileSync(path, "utf8")) as {
          family?: unknown
          finishedAt?: unknown
        }
        if (!belongs && metadata.family !== family) return []
        return [
          {
            name,
            time:
              timestamp ??
              (metadata.family === family &&
              typeof metadata.finishedAt === "string" &&
              Number.isFinite(Date.parse(metadata.finishedAt))
                ? Date.parse(metadata.finishedAt)
                : fallbackTime),
          },
        ]
      } catch {
        // Missing, in-progress and corrupt latest evidence blocks; it never revives an older pass.
        return belongs ? [{ name, time: fallbackTime }] : []
      }
    })
    .sort((a, b) => b.time - a.time)
  const latest = candidates[0]
  return latest?.name
}
function latestReport(
  repoRoot: string,
  family: string,
  fingerprint = inputFingerprint(repoRoot),
): GovernanceReport | undefined {
  const runId = latestRunId(repoRoot, family)
  if (!runId) return undefined
  const report = readReport(repoRoot, runId, fingerprint)
  if (report.family !== family) throw Error("Latest report family differs from requested family")
  return report
}

export function getCurrentCase(
  repoRoot: string,
  selection: { family: string; caseId: string; adapter: string; mode: string },
) {
  const report = latestReport(repoRoot, selection.family)
  return {
    report: report ?? null,
    case:
      report?.cases.find(
        (item) =>
          item.caseId === selection.caseId &&
          item.adapter === selection.adapter &&
          item.mode === selection.mode,
      ) ?? null,
  }
}
export function getCatalog(repoRoot: string, selection?: { family: string; runId: string }) {
  const root = join(repoRoot, "packages/design-governance/reflection-families")
  const fingerprint = inputFingerprint(repoRoot)
  if (
    selection &&
    (!/^[a-z0-9-]+$/.test(selection.family) || !/^[a-z0-9-]+$/.test(selection.runId))
  )
    throw Error("Invalid exact-run selection")
  const selectedReport = selection ? readReport(repoRoot, selection.runId, fingerprint) : undefined
  if (selectedReport && selectedReport.family !== requireValue(selection).family)
    throw Error("Selected report family identity differs")
  const families = readdirSync(root)
    .filter((family) => existsSync(join(root, family, "reflection-contract.json")))
    .filter((family) => !selection || family === selection.family)
    .map((family) => {
      const contract = JSON.parse(
        readFileSync(join(root, family, "reflection-contract.json"), "utf8"),
      ) as { cases: { caseId: string; mode: string }[]; baselineRoot?: string }
      let report: GovernanceReport | undefined
      let error: string | undefined
      try {
        report = selectedReport ?? latestReport(repoRoot, family, fingerprint)
      } catch (cause) {
        error = String(cause)
      }
      let behaviorCases: { caseId: string; mode: string; proofScope: "behavior-only" }[] = []
      try {
        behaviorCases = (loadBehaviorFixtures(repoRoot, family)?.cases ?? []).map((entry) => ({
          ...entry,
          proofScope: "behavior-only" as const,
        }))
      } catch (cause) {
        error = String(cause)
      }
      const registered = [
        ...contract.cases.map((entry) => ({
          ...entry,
          proofScope: undefined as "behavior-only" | undefined,
        })),
        ...behaviorCases,
      ]
      const coverage: {
        registeredCases: number
        structuralEnrolledCases: number
        uncoveredVariants: unknown[]
        uncovered: string[]
        error?: string
        items?: (CoverageItem & { evidenceMatch: "matched" | "changed" | "missing" })[]
        proofItems?: CoverageItem[]
        requiredItems?: number
        coveredItems?: number
        complete?: boolean
      } = {
        registeredCases: registered.length,
        structuralEnrolledCases: 0,
        uncoveredVariants: [],
        uncovered: [],
      }
      let proofRoot = repoRoot
      let currentCompiled: ReturnType<typeof compileFamily> | undefined
      try {
        currentCompiled = compileFamily(repoRoot, family)
      } catch {
        /* Current required inventory remains visible without a compact source. */
      }
      let proofCompiled: ReturnType<typeof compileFamily> | undefined
      try {
        if (report?.environment.evidenceScope === "staged") {
          proofRoot = join(evidenceRoot(repoRoot), report.runId, "inputs")
          const pinned = join(
            proofRoot,
            "packages/design-governance/reflection-families",
            family,
            "source",
          )
          if (
            hash(readFileSync(join(pinned, "snapshot.json"))) !==
              report.environment.proofSnapshotSha256 ||
            hash(readFileSync(join(pinned, "manifest.json"))) !==
              report.environment.proofManifestSha256
          )
            throw Error("Staged proof source inputs changed")
        }
        proofCompiled = proofRoot === repoRoot ? currentCompiled : compileFamily(proofRoot, family)
        coverage.structuralEnrolledCases = proofCompiled?.cases.length ?? 0
        coverage.uncoveredVariants = proofCompiled?.uncoveredVariants ?? []
        coverage.uncovered = proofCompiled?.uncovered ?? []
      } catch (cause) {
        coverage.error = String(cause)
      }
      if (existsSync(join(root, family, "coverage-contract.json"))) {
        try {
          const current = familyCoverage(repoRoot, family, currentCompiled)
          const proof =
            report &&
            (proofRoot !== repoRoot || report.fingerprint === fingerprint) &&
            !coverage.error
              ? familyCoverage(proofRoot, family, proofCompiled)
              : undefined
          const canonical = (value: unknown): unknown =>
            Array.isArray(value)
              ? value.map(canonical)
              : value && typeof value === "object"
                ? Object.fromEntries(
                    Object.entries(value)
                      .filter(([, entry]) => entry !== undefined)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([key, entry]) => [key, canonical(entry)]),
                  )
                : value
          const pinnedContract = proof
            ? (JSON.parse(
                readFileSync(
                  join(
                    proofRoot,
                    "packages/design-governance/reflection-families",
                    family,
                    "reflection-contract.json",
                  ),
                  "utf8",
                ),
              ) as typeof contract)
            : undefined
          const pinnedFixtures = pinnedContract
            ? [
                ...pinnedContract.cases,
                ...(loadBehaviorFixtures(proofRoot, family)?.cases ?? []).map((entry) => ({
                  ...entry,
                  proofScope: "behavior-only" as const,
                })),
              ]
            : []
          const fixtureDefinition = (
            item: CoverageItem,
            fixtures: { caseId: string; mode: string }[],
          ) => {
            const fixture = fixtures.find(
              (entry) => entry.caseId === item.caseId && entry.mode === item.mode,
            ) as { caseId: string; mode: string; baseline?: string } | undefined
            // The validated stage may change only the encoding suffix of a reference.
            // Exact stage/input/artifact hashes remain checked by readReport.
            const projected =
              fixture &&
              report?.environment.evidenceScope === "staged" &&
              typeof fixture.baseline === "string"
                ? { ...fixture, baseline: fixture.baseline.replace(/\.(png|webp)$/, "") }
                : fixture
            return JSON.stringify(canonical(projected ?? null))
          }
          const definition = (item: CoverageItem) =>
            JSON.stringify([
              item.itemId,
              item.caseId,
              item.mode,
              item.source?.nodeId ?? null,
              item.source?.availability ?? null,
              item.source?.reason ?? null,
              item.sourceUrl ?? null,
              Object.entries(item.dimensions ?? {}).sort(),
              [...item.requiredProofs].sort(),
            ])
          const items = current.items.map((item) => {
            const pinned = proof?.items.find((entry) => entry.itemId === item.itemId)
            const matched =
              pinned !== undefined &&
              definition(pinned) === definition(item) &&
              fixtureDefinition(item, registered) === fixtureDefinition(pinned, pinnedFixtures) &&
              (item.requiredProofs.every((proof) => proof === "behavior") ||
                contract.baselineRoot === pinnedContract?.baselineRoot)
            return {
              ...item,
              gaps: matched ? pinned.gaps : item.gaps,
              evidenceMatch: matched
                ? ("matched" as const)
                : pinned
                  ? ("changed" as const)
                  : ("missing" as const),
            }
          })
          Object.assign(coverage, {
            ...current,
            items,
            coveredItems: items.filter((item) => !item.gaps.length).length,
            complete: items.every((item) => !item.gaps.length),
            gaps: items.flatMap((item) => item.gaps.map((gap) => `${item.itemId}: ${gap}`)),
            ...(proof ? { proofItems: proof.items } : {}),
          })
        } catch (cause) {
          coverage.error = String(cause)
        }
      }
      const cases = registered.flatMap((item) =>
        adapters.map((adapter) => {
          const result = report?.cases.find(
            (entry) =>
              entry.caseId === item.caseId &&
              entry.adapter === adapter &&
              entry.mode === item.mode &&
              entry.proofScope === item.proofScope,
          )
          const requirements = coverage.items?.filter(
            (entry) => entry.caseId === item.caseId && entry.mode === item.mode,
          )
          const matches =
            !requirements?.length || requirements.some((entry) => entry.evidenceMatch === "matched")
          const bound = result && matches ? result : undefined
          return {
            caseId: item.caseId,
            mode: item.mode,
            adapter,
            ...(item.proofScope ? { proofScope: item.proofScope } : {}),
            runId: bound ? (report?.runId ?? null) : null,
            outcome: bound && report ? composeOutcome([bound], report.freshness) : "blocked",
            outcomes: bound?.outcomes ?? null,
            freshness: report?.freshness.state ?? (error ? "invalid" : "never-run"),
          }
        }),
      )
      return {
        family,
        cases,
        coverage,
        inputScope: report?.environment.evidenceScope === "staged" ? "staged" : "active",
        stageId: report?.environment.stageId ?? null,
        stageHash: report?.environment.stageHash ?? null,
        runId: report?.runId ?? null,
        freshness: report?.freshness ?? {
          state: error ? "invalid" : "never-run",
          reasons: error ? [error] : [],
        },
        outcome: report?.outcome ?? "blocked",
        review: report?.review ?? { state: "unreviewed" },
        error: error ?? null,
      }
    })
  // Join public inventory so unenrolled families cannot disappear from the UI.
  const registry = join(repoRoot, "artifacts/component-registry.json")
  if (!selection && existsSync(registry)) {
    const data = JSON.parse(readFileSync(registry, "utf8"))
    for (const item of Array.isArray(data) ? data : (data.families ?? []))
      if (
        typeof item.family === "string" &&
        !families.some((family) => family.family === item.family)
      )
        families.push({
          family: item.family,
          cases: [],
          coverage: {
            registeredCases: 0,
            structuralEnrolledCases: 0,
            uncoveredVariants: [],
            uncovered: ["No family contract enrolled"],
          },
          runId: null,
          freshness: { state: "never-run", reasons: ["No structural or visual contract enrolled"] },
          outcome: "blocked",
          review: { state: "unreviewed" },
          error: null,
          inputScope: "active",
          stageId: null,
          stageHash: null,
        })
  }
  if (selection && !families.length) throw Error("Selected family has no enrolled contract")
  return { families }
}
