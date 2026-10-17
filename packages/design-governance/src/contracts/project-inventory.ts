import { createHash } from "node:crypto"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { familyRoot, readJson } from "../source/snapshot.js"
import type { LegacyContract } from "../source/types.js"
import type { CoverageContract } from "./coverage.js"
import { validateCoverageContract } from "./coverage.js"

export type ProjectInventoryDefinition = {
  schemaVersion: 1
  source: {
    fileKey: string
    captureDate: string
    version: string
    lastModified: string
    hashes: { raw: string; manifest: string; variables: string }
    authority: string
  }
  families: { family: string; validationGroups: string[] }[]
}
export type ProjectProofState = "missing" | "unverified" | "passed" | "failed"
export const projectProofs = [
  "source",
  "inventory",
  "fixture",
  "structural",
  "visual",
  "behavior",
  "review",
  "promotion",
] as const
export type ProjectProof = (typeof projectProofs)[number]
export type ProjectValidationGroup = {
  group: string
  enrolled: boolean
  requiredItems: number | null
  registeredCases: number
  states: Record<ProjectProof, ProjectProofState>
  gaps: string[]
  complete: boolean
}
export type ProjectFamily = {
  family: string
  displayName: string
  validationGroups: ProjectValidationGroup[]
  registry: {
    preferredStates: string[]
    allowedPurposes: string[]
    sourceOfTruthPaths: string[]
    nodeReferences: Record<string, string>
    figmaStates: Record<string, unknown>
    manualReviewRequired: string[]
  }
  gaps: string[]
  complete: boolean
}
export type ProjectInventory = {
  schemaVersion: 1
  source: ProjectInventoryDefinition["source"]
  families: ProjectFamily[]
  requiredFamilies: number
  enrolledVisualGroups: number
  requiredValidationGroups: number
  enrollmentGaps: string[]
  complete: boolean
  gaps: string[]
  rollout: {
    uiIntegration: "unavailable" | "accepted"
    activeWave: "button"
    remainingWaves: "blocked" | "available"
  }
}

/** Supply only outcomes derived from validated, current, exact-run evidence. */
export type AssessProjectGroup = (group: string) => Partial<Record<ProjectProof, ProjectProofState>>
const definitionPath = fileURLToPath(new URL("./project-inventory.json", import.meta.url))
const identifier = /^[a-z0-9-]+$/

/** Compare independently to the registry so deleting a tracked family cannot reduce scope. */
export function validateProjectInventory(
  definition: ProjectInventoryDefinition,
  publicFamilies: string[],
  enrolledGroups: string[],
): string[] {
  if (
    definition.schemaVersion !== 1 ||
    !definition.source?.fileKey ||
    !/^\d{4}-\d{2}-\d{2}$/.test(definition.source.captureDate) ||
    !definition.source.version ||
    !Number.isFinite(Date.parse(definition.source.lastModified)) ||
    !definition.source.authority ||
    !definition.source.hashes ||
    ["raw", "manifest", "variables"].some(
      (key) =>
        !/^[a-f0-9]{64}$/.test(
          definition.source.hashes[key as keyof typeof definition.source.hashes],
        ),
    ) ||
    !Array.isArray(definition.families)
  )
    throw Error("Invalid project inventory identity")
  const names = new Set<string>()
  const groups = new Set<string>()
  for (const entry of definition.families) {
    if (
      !identifier.test(entry.family) ||
      names.has(entry.family) ||
      !Array.isArray(entry.validationGroups) ||
      !entry.validationGroups.length
    )
      throw Error("Invalid or duplicate project family")
    names.add(entry.family)
    for (const group of entry.validationGroups) {
      if (!identifier.test(group) || groups.has(group))
        throw Error("Invalid or duplicate validation group")
      groups.add(group)
    }
  }
  return [
    ...publicFamilies
      .filter((f) => !names.has(f))
      .map((f) => `Public family absent from project inventory: ${f}`),
    ...[...names]
      .filter((f) => !publicFamilies.includes(f))
      .map((f) => `Project family absent from public registry: ${f}`),
    ...enrolledGroups
      .filter((g) => !groups.has(g))
      .map((g) => `Enrolled validation group absent from project inventory: ${g}`),
  ]
}

/** File presence is enrollment, never certification. No reports are trusted implicitly. */
export function projectInventory(
  repoRoot: string,
  assessGroup?: AssessProjectGroup,
  options: { uiIntegrationAccepted?: boolean } = {},
): ProjectInventory {
  const definition = readJson<ProjectInventoryDefinition>(definitionPath)
  const registryRoot = join(repoRoot, "docs/registry/families")
  const publicFamilies = existsSync(registryRoot)
    ? readdirSync(registryRoot)
        .filter((f) => existsSync(join(registryRoot, f, "registry.meta.json")))
        .sort()
    : []
  const reflectionRoot = join(repoRoot, familyRoot)
  const enrolledGroups = existsSync(reflectionRoot)
    ? readdirSync(reflectionRoot)
        .filter((g) => existsSync(join(reflectionRoot, g, "reflection-contract.json")))
        .sort()
    : []
  const enrollmentGaps = validateProjectInventory(definition, publicFamilies, enrolledGroups)
  if (!publicFamilies.length) enrollmentGaps.push("Public registry is unavailable")
  const gaps = [...enrollmentGaps]
  // Retain newly discovered families even before the explicit mapping is maintained.
  const entries = [
    ...definition.families,
    ...publicFamilies
      .filter((f) => !definition.families.some((entry) => entry.family === f))
      .map((family) => ({ family, validationGroups: [family] })),
  ]
  const families: ProjectFamily[] = entries.map((entry) => {
    type Meta = {
      displayName?: string
      visuals?: { preferredStates?: string[] }
      axe?: { manualReviewRequired?: string[] }
    }
    type Generated = {
      semantics?: { allowedPurposes?: string[]; sourceOfTruthPaths?: string[] }
      design?: {
        nodeReferences?: Record<string, string>
        figmaStates?: Record<string, unknown>
      }
    }
    const familyGaps: string[] = []
    function optional<T>(name: string): T | undefined {
      const path = join(registryRoot, entry.family, name)
      if (!existsSync(path)) {
        familyGaps.push(`Registry document missing: ${name}`)
        return
      }
      try {
        return readJson<T>(path)
      } catch {
        familyGaps.push(`Registry document invalid: ${name}`)
        return
      }
    }
    const meta = optional<Meta>("registry.meta.json")
    const generated = optional<Generated>("registry.generated.json")
    enrollmentGaps.push(...familyGaps.map((gap) => `${entry.family}: ${gap}`))
    const validationGroups = entry.validationGroups.map((group): ProjectValidationGroup => {
      const directory = join(reflectionRoot, group)
      const groupGaps: string[] = []
      const states = Object.fromEntries(projectProofs.map((key) => [key, "missing"])) as Record<
        ProjectProof,
        ProjectProofState
      >
      let registeredCases = 0
      let requiredItems: number | null = null
      const enrolled = enrolledGroups.includes(group)
      if (enrolled) {
        try {
          const contract = readJson<LegacyContract>(join(directory, "reflection-contract.json"))
          registeredCases = contract.cases.length
          if (contract.figmaFileKey !== definition.source.fileKey)
            groupGaps.push("Family selects a different Figma file")
          if (registeredCases) states.fixture = "unverified"
          if (
            existsSync(join(directory, "source/snapshot.json")) &&
            existsSync(join(directory, "source/manifest.json"))
          ) {
            const snapshotBytes = readFileSync(join(directory, "source/snapshot.json"))
            type CompactSource = {
              fileKey: string
              capture: { version: string; lastModified: string }
              hashes: { raw: string; manifest: string; variables: string }
              snapshotSha256?: string
              missingDependencies?: string[]
            }
            const snapshot = JSON.parse(snapshotBytes.toString("utf8")) as CompactSource
            const manifest = readJson<CompactSource>(join(directory, "source/manifest.json"))
            const pinned = [snapshot, manifest].every(
              (source) =>
                source.fileKey === definition.source.fileKey &&
                source.capture.version === definition.source.version &&
                source.capture.lastModified === definition.source.lastModified &&
                (["raw", "manifest", "variables"] as const).every(
                  (key) => source.hashes[key] === definition.source.hashes[key],
                ),
            )
            states.source =
              pinned &&
              !snapshot.missingDependencies?.length &&
              manifest.snapshotSha256 === createHash("sha256").update(snapshotBytes).digest("hex")
                ? "unverified"
                : "failed"
            if (states.source === "failed")
              groupGaps.push(
                "Active compact source does not match pinned capture or its integrity binding",
              )
          }
          if (existsSync(join(directory, "structural-contract.json")))
            states.structural = "unverified"
          if (existsSync(join(directory, "coverage-contract.json"))) {
            const coverage = readJson<CoverageContract>(join(directory, "coverage-contract.json"))
            validateCoverageContract(coverage)
            if (coverage.family !== group || coverage.figmaFileKey !== definition.source.fileKey)
              groupGaps.push("Coverage source identity differs from pinned project")
            requiredItems = coverage.items.length
            states.inventory = "unverified"
          }
        } catch (error) {
          groupGaps.push(`Enrollment invalid: ${String(error)}`)
        }
      }
      enrollmentGaps.push(...groupGaps.map((gap) => `${entry.family}/${group}: ${gap}`))
      const proof = assessGroup?.(group) ?? {}
      for (const key of projectProofs) {
        const result = proof[key]
        if (result && !["missing", "unverified", "passed", "failed"].includes(result))
          throw Error(`Invalid ${key} project proof state`)
        // Runtime evidence cannot manufacture missing contracts or source enrollment.
        if (
          result &&
          states[key] !== "failed" &&
          !(
            states[key] === "missing" &&
            ["source", "inventory", "fixture", "structural"].includes(key)
          )
        )
          states[key] = result
      }
      for (const key of projectProofs)
        if (states[key] !== "passed") groupGaps.push(`${key}: ${states[key]}`)
      return {
        group,
        enrolled,
        requiredItems,
        registeredCases,
        states,
        gaps: groupGaps,
        complete: !groupGaps.length,
      }
    })
    familyGaps.push(...validationGroups.flatMap((g) => g.gaps.map((gap) => `${g.group}: ${gap}`)))
    return {
      family: entry.family,
      displayName: meta?.displayName ?? entry.family,
      validationGroups,
      registry: {
        preferredStates: meta?.visuals?.preferredStates ?? [],
        allowedPurposes: generated?.semantics?.allowedPurposes ?? [],
        sourceOfTruthPaths: generated?.semantics?.sourceOfTruthPaths ?? [],
        nodeReferences: generated?.design?.nodeReferences ?? {},
        figmaStates: generated?.design?.figmaStates ?? {},
        manualReviewRequired: meta?.axe?.manualReviewRequired ?? [],
      },
      gaps: familyGaps,
      complete: !familyGaps.length,
    }
  })
  const uiAccepted = options.uiIntegrationAccepted === true
  const buttonComplete = families.find((family) => family.family === "button")?.complete === true
  if (!uiAccepted)
    gaps.push("Reflection UI integration acceptance required before remaining family waves")
  gaps.push(...families.flatMap((family) => family.gaps.map((gap) => `${family.family}: ${gap}`)))
  return {
    schemaVersion: 1,
    source: definition.source,
    families,
    requiredFamilies: families.length,
    enrolledVisualGroups: enrolledGroups.length,
    requiredValidationGroups: families.reduce(
      (count, family) => count + family.validationGroups.length,
      0,
    ),
    complete: !gaps.length,
    gaps,
    enrollmentGaps,
    rollout: {
      uiIntegration: uiAccepted ? "accepted" : "unavailable",
      activeWave: "button",
      remainingWaves: uiAccepted && buttonComplete ? "available" : "blocked",
    },
  }
}
