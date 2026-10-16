import { createHash } from "node:crypto"
import { lstatSync, readFileSync, realpathSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { Artifact } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { reflectionImageIO } from "../source-promotion/webp-conversion.js"
import { evidenceRoot, getCatalog, hash, inputFingerprint, readReport } from "./store.js"
import { projectUIEvidence } from "./ui-provider.js"

type Threshold = { maxDiffPixels?: number; maxDiffPixelRatio?: number }
type VisualMetric = {
  diffPixels: number
  diffRatio: number
  classification: string
  threshold?: Threshold
  strict?: boolean
  thresholdAvailability: "exact-run-policy" | "unavailable"
  provenance: "recomputed-from-verified-images"
  referenceSha256: string
  actualSha256: string
}
type Contract = {
  cases: {
    caseId: string
    mode: string
    comparison?: { threshold?: Threshold; strict?: boolean }
  }[]
}
const maxArtifactBytes = 32 * 1024 * 1024
const maxDecodedPixels = 16_000_000
const maxHtmlBytes = 128 * 1024 * 1024

function exactRunRoot(repoRoot: string, runId: string) {
  if (!/^[a-z0-9-]+$/.test(runId)) throw Error("Invalid run ID")
  const parent = realpathSync(evidenceRoot(repoRoot))
  const candidate = join(parent, runId)
  if (lstatSync(candidate).isSymbolicLink()) throw Error("Portable run must not be a symlink")
  const root = realpathSync(candidate)
  if (!root.startsWith(`${parent}/`)) throw Error("Portable run escaped evidence root")
  return root
}

/** Escape data, not just HTML delimiters: report strings never become executable markup. */
export function serializeReportData(value: unknown): string {
  return JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  )
}

async function imageComparator() {
  // reflectionImageIO checks the installed package version before resolving internals.
  await reflectionImageIO()
  const entry = fileURLToPath(import.meta.resolve("reflection-check"))
  return (await import(
    pathToFileURL(join(dirname(entry), "contracts/visual/image-diff.js")).href
  )) as {
    comparePngImages(input: {
      expectedPath: string
      actualPath: string
      threshold?: Threshold
      strict?: boolean
    }): Promise<{ diffPixels: number; diffRatio: number; classification: string }>
  }
}

/** Verify a canonical artifact before embedding; reject MIME confusion and symlink escapes. */
export async function verifiedPortableArtifact(
  repoRoot: string,
  runId: string,
  artifact: Artifact,
) {
  const root = exactRunRoot(repoRoot, runId)
  const path = realpathSync(resolve(root, artifact.path))
  if (!path.startsWith(`${root}/`) || artifact.path.split(/[\\/]/).includes(".."))
    throw Error("Portable artifact escaped exact run")
  if (statSync(path).size > maxArtifactBytes) throw Error("Portable artifact exceeds 32 MiB limit")
  const bytes = readFileSync(path)
  if (hash(bytes) !== artifact.sha256)
    throw Error(`Portable artifact hash differs: ${artifact.path}`)
  if (artifact.mimeType === "image/png" || artifact.mimeType === "image/webp") {
    const codec = await reflectionImageIO()
    const decoded = await codec.readImage(path)
    if (decoded.image.width * decoded.image.height > maxDecodedPixels)
      throw Error("Portable image exceeds 16 million decoded pixels")
    const formatMatches =
      artifact.mimeType === "image/png"
        ? decoded.format === "png"
        : decoded.format.startsWith("webp")
    if (!formatMatches) throw Error(`Portable artifact MIME differs: ${artifact.path}`)
  } else if (artifact.mimeType === "application/json") {
    JSON.parse(bytes.toString("utf8"))
  } else throw Error(`Unsupported portable artifact MIME: ${artifact.mimeType}`)
  if (hash(readFileSync(path)) !== artifact.sha256)
    throw Error("Portable artifact changed while decoding")
  return { path, href: `data:${artifact.mimeType};base64,${bytes.toString("base64")}` }
}

/** Offline snapshot of one exact immutable run and today's full required inventory.
 * No acceptance, validation or promotion operations are exposed by this document. */
export async function createHtmlReport(
  repoRoot: string,
  selection: { family: string; runId: string },
) {
  const fingerprint = inputFingerprint(repoRoot)
  if (!/^[a-z0-9-]+$/.test(selection.family)) throw Error("Invalid family identifier")
  const reportPath = join(exactRunRoot(repoRoot, selection.runId), "report.json")
  const originalReportSha256 = hash(readFileSync(reportPath))
  // getCatalog validates explicit identities and fails closed instead of falling back.
  const catalog = getCatalog(repoRoot, selection)
  const report = readReport(repoRoot, selection.runId, fingerprint)
  const projected = projectUIEvidence({
    project: { id: "marwes", label: "Marwes" },
    catalog,
    reports: new Map([[selection.runId, report]]),
  })
  const { capabilities: _capabilities, ...projection } = projected
  const provider = {
    ...projection,
    capabilities: {
      readArtifacts: true,
      readOnly: true,
      startValidation: false,
      acceptReview: false,
      promoteReferences: false,
    },
  }
  const artifactWarnings: string[] = []
  const visualMetrics: Record<string, VisualMetric> = {}
  const artifacts = new Map<string, Artifact>()
  for (const item of report.cases)
    for (const artifact of item.artifacts) {
      const previous = artifacts.get(artifact.path)
      if (
        previous &&
        (previous.sha256 !== artifact.sha256 || previous.mimeType !== artifact.mimeType)
      )
        throw Error("Conflicting canonical artifact identity")
      artifacts.set(artifact.path, artifact)
    }
  const embedded = new Map<string, Awaited<ReturnType<typeof verifiedPortableArtifact>>>()
  const getArtifact = async (artifact: Artifact) => {
    let value = embedded.get(artifact.path)
    if (!value) {
      value = await verifiedPortableArtifact(repoRoot, selection.runId, artifact)
      embedded.set(artifact.path, value)
    }
    return value
  }
  // Only staged policies are archived with historical runs. Current active policies
  // are usable while their complete input fingerprint still matches.
  const policyRoot =
    report.environment.evidenceScope === "staged"
      ? join(evidenceRoot(repoRoot), report.runId, "inputs")
      : report.fingerprint === fingerprint
        ? repoRoot
        : undefined
  const contract: Contract | undefined = policyRoot
    ? JSON.parse(
        readFileSync(
          join(
            policyRoot,
            "packages/design-governance/reflection-families",
            selection.family,
            "reflection-contract.json",
          ),
          "utf8",
        ),
      )
    : undefined
  if (!contract)
    artifactWarnings.push(
      "Exact-run visual thresholds are unavailable for this historical active run; metrics do not imply acceptance.",
    )
  const comparator = await imageComparator()
  const computed = new Map<string, VisualMetric>()
  for (const family of provider.families)
    for (const item of family.items)
      for (const comparison of item.comparisons) {
        comparison.artifacts = comparison.artifacts.filter((artifact) => {
          const imageRole = ["reference", "actual", "diff", "capture"].includes(artifact.role)
          if (imageRole && !["image/png", "image/webp"].includes(artifact.mimeType))
            throw Error("Canonical image role has an unsupported MIME type")
          if (["image/png", "image/webp", "application/json"].includes(artifact.mimeType))
            return true
          artifactWarnings.push(
            `Artifact ${artifact.id} omitted: unsupported portable MIME ${artifact.mimeType}`,
          )
          return false
        })
        for (const artifact of comparison.artifacts) {
          const [runId, path] = JSON.parse(artifact.id) as [string, string]
          const original = artifacts.get(path)
          if (
            runId !== report.runId ||
            !original ||
            original.sha256 !== artifact.sha256 ||
            original.mimeType !== artifact.mimeType
          )
            throw Error("Portable artifact differs from selected canonical run")
          artifact.href = (await getArtifact(original)).href
        }
        const reference = comparison.artifacts.filter((artifact) => artifact.role === "reference")
        const actual = comparison.artifacts.filter((artifact) => artifact.role === "actual")
        if (reference.length > 1 || actual.length > 1)
          throw Error("Ambiguous exact-run comparison image roles")
        if (!reference.length || !actual.length) continue
        const originalReference = requireValue(
          artifacts.get(requireValue((JSON.parse(requireValue(reference[0]).id) as string[])[1])),
        )
        const originalActual = requireValue(
          artifacts.get(requireValue((JSON.parse(requireValue(actual[0]).id) as string[])[1])),
        )
        const policy = contract?.cases.find(
          (entry) => entry.caseId === item.caseId && entry.mode === item.dimensions.mode,
        )?.comparison
        const key = JSON.stringify([originalReference.path, originalActual.path, policy ?? null])
        let metric = computed.get(key)
        if (!metric) {
          const result = await comparator.comparePngImages({
            expectedPath: (await getArtifact(originalReference)).path,
            actualPath: (await getArtifact(originalActual)).path,
            ...policy,
          })
          metric = {
            diffPixels: result.diffPixels,
            diffRatio: result.diffRatio,
            classification: result.classification,
            ...(policy?.threshold ? { threshold: policy.threshold } : {}),
            ...(policy?.strict !== undefined ? { strict: policy.strict } : {}),
            thresholdAvailability: policy ? "exact-run-policy" : "unavailable",
            provenance: "recomputed-from-verified-images",
            referenceSha256: originalReference.sha256,
            actualSha256: originalActual.sha256,
          }
          computed.set(key, metric)
        }
        visualMetrics[comparison.id] = metric
      }
  const exportedAt = new Date().toISOString()
  const payload = {
    schema: "marwes.governance-html/v1" as const,
    exportedAt,
    inventoryScope: "current-required-inventory" as const,
    provider,
    artifactWarnings,
    visualMetrics,
    manifest: {
      runId: report.runId,
      family: report.family,
      reportSha256: originalReportSha256,
      inputFingerprintAtExport: fingerprint,
      runFingerprint: report.fingerprint,
      freshnessAtExport: report.freshness,
      reviewAtExport: report.review,
      scope: requireValue(provider.families[0]).scope,
      artifacts: [...artifacts.values()].map((artifact) => ({ ...artifact })),
    },
  }
  const templateRoot = fileURLToPath(new URL("../../figma-governance-one/report/", import.meta.url))
  const style = readFileSync(join(templateRoot, "report.css"), "utf8")
  const script = readFileSync(join(templateRoot, "report.js"), "utf8")
  const cspHash = (value: string) =>
    `'sha256-${createHash("sha256").update(value).digest("base64")}'`
  const csp = `default-src 'none'; img-src data:; script-src ${cspHash(script)}; style-src ${cspHash(style)}; style-src-attr 'unsafe-inline'; base-uri 'none'; form-action 'none'; connect-src 'none'`
  const html = readFileSync(join(templateRoot, "shell.html"), "utf8")
    .replace(
      "<!--REPORT_DATA-->",
      () =>
        `<script type="application/json" id="report-data">${serializeReportData(payload)}</script>`,
    )
    .replace(
      "<!--REPORT_STYLE-->",
      () => `<meta http-equiv="Content-Security-Policy" content="${csp}"><style>${style}</style>`,
    )
    .replace("<!--REPORT_SCRIPT-->", () => `<script>${script}</script>`)
  if (Buffer.byteLength(html) > maxHtmlBytes) throw Error("Portable HTML exceeds 128 MiB limit")
  // Guard asynchronous decoding/comparison against source, artifact and report races.
  const finalReport = readReport(repoRoot, selection.runId, fingerprint)
  if (
    inputFingerprint(repoRoot) !== fingerprint ||
    hash(readFileSync(reportPath)) !== originalReportSha256 ||
    JSON.stringify(finalReport.review) !== JSON.stringify(report.review)
  )
    throw Error("Governance inputs changed during HTML export; retry with stable inputs")
  const family = requireValue(provider.families[0])
  return {
    html,
    payload,
    summary: {
      family: selection.family,
      runId: selection.runId,
      requiredItems: family.inventory.requiredItems,
      comparisonCount: family.items.reduce((count, item) => count + item.comparisons.length, 0),
      artifactCount: embedded.size,
      bytes: Buffer.byteLength(html),
    },
  }
}
