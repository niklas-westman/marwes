import { existsSync } from "node:fs"
import { join } from "node:path"
import type { CompiledFamily } from "../compile/compile-family.js"
import { behaviorEnrollmentGap, loadBehaviorContract } from "../runtime/behavior.js"
import { familyRoot, loadSnapshot, readJson } from "../source/snapshot.js"
import type { LegacyContract } from "../source/types.js"
import { loadBehaviorFixtures, validateBehaviorFixtureEnrollment } from "./behavior-fixtures.js"

export type CoverageRequirement = {
  itemId: string
  label: string
  mode: string
  caseId?: string
  dimensions?: Record<string, string>
  source?: {
    nodeId?: string
    reason?: string
    /** Explicit source triage, not a proof waiver or an inferred missing screenshot. */
    availability?: "needs-design" | "needs-mapping" | "rule-defined"
  }
  requiredProofs: ("structural" | "visual" | "behavior")[]
}
export type CoverageContract = {
  schemaVersion: 1
  family: string
  figmaFileKey: string
  sourceCaptureVersion?: string
  items: CoverageRequirement[]
}
export type CoverageItem = CoverageRequirement & { sourceUrl?: string; gaps: string[] }
export type CoverageAssessment = {
  items: CoverageItem[]
  requiredItems: number
  coveredItems: number
  complete: boolean
  gaps: string[]
}

export function validateCoverageContract(value: unknown): asserts value is CoverageContract {
  if (!value || typeof value !== "object") throw Error("Coverage contract must be an object")
  const c = value as CoverageContract
  if (
    Object.keys(c).some(
      (k) =>
        !["schemaVersion", "family", "figmaFileKey", "sourceCaptureVersion", "items"].includes(k),
    ) ||
    c.schemaVersion !== 1 ||
    !/^[a-z0-9-]+$/.test(c.family) ||
    typeof c.figmaFileKey !== "string" ||
    !c.figmaFileKey ||
    !Array.isArray(c.items) ||
    !c.items.length
  )
    throw Error("Invalid coverage contract identity")
  const ids = new Set<string>()
  for (const item of c.items) {
    if (
      !item ||
      typeof item !== "object" ||
      Object.keys(item).some(
        (k) =>
          !["itemId", "label", "mode", "caseId", "dimensions", "source", "requiredProofs"].includes(
            k,
          ),
      ) ||
      !/^[a-z0-9.-]+$/.test(item.itemId) ||
      ids.has(item.itemId) ||
      typeof item.label !== "string" ||
      !item.label ||
      !["light", "dark"].includes(item.mode) ||
      (item.caseId !== undefined && !/^[a-z0-9.-]+$/.test(item.caseId)) ||
      !Array.isArray(item.requiredProofs) ||
      !item.requiredProofs.length ||
      item.requiredProofs.some((p) => !["structural", "visual", "behavior"].includes(p))
    )
      throw Error("Invalid or duplicate coverage requirement")
    if (
      item.dimensions &&
      (Array.isArray(item.dimensions) ||
        typeof item.dimensions !== "object" ||
        Object.values(item.dimensions).some((v) => typeof v !== "string"))
    )
      throw Error("Invalid coverage dimensions")
    if (
      item.source &&
      (Array.isArray(item.source) ||
        typeof item.source !== "object" ||
        Object.keys(item.source).some((k) => !["nodeId", "reason", "availability"].includes(k)) ||
        (item.source.nodeId !== undefined && !/^\d+:\d+$/.test(item.source.nodeId)) ||
        (item.source.reason !== undefined && typeof item.source.reason !== "string") ||
        (item.source.availability !== undefined &&
          !["needs-design", "needs-mapping", "rule-defined"].includes(item.source.availability)) ||
        (["needs-design", "rule-defined"].includes(item.source.availability ?? "") &&
          !item.source.reason?.trim()) ||
        (item.source.availability === "needs-design" && item.source.nodeId !== undefined))
    )
      throw Error("Invalid coverage source")
    ids.add(item.itemId)
  }
}

/** Required inventory is independent of registered fixtures; omitted rows cannot disappear. */
export function familyCoverage(
  repoRoot: string,
  family: string,
  compiled?: CompiledFamily,
): CoverageAssessment {
  const directory = join(repoRoot, familyRoot, family)
  const path = join(directory, "coverage-contract.json")
  const contract = readJson<LegacyContract>(join(directory, "reflection-contract.json"))
  if (!existsSync(path)) {
    const gaps = ["Required family coverage inventory not enrolled", ...(compiled?.uncovered ?? [])]
    return {
      items: [],
      requiredItems: contract.cases.length,
      coveredItems: compiled?.cases.length ?? 0,
      complete: gaps.length === 0,
      gaps,
    }
  }
  const coverage = readJson<CoverageContract>(path)
  validateCoverageContract(coverage)
  if (coverage.family !== family || coverage.figmaFileKey !== contract.figmaFileKey)
    throw Error("Coverage source identity differs from family contract")
  let nodes: Record<string, unknown> = {}
  let sourceError: string | undefined
  try {
    nodes = loadSnapshot(repoRoot, family).nodes
  } catch (error) {
    sourceError = String(error)
  }
  const behavior = loadBehaviorContract(repoRoot, family)
  const behaviorFixtures = loadBehaviorFixtures(repoRoot, family)
  if (behaviorFixtures)
    validateBehaviorFixtureEnrollment(behaviorFixtures, {
      visualCases: contract.cases,
      requirements: coverage.items,
      scenarios: behavior?.scenarios ?? [],
    })
  const items: CoverageItem[] = coverage.items.map((requirement) => {
    const gaps: string[] = []
    const entry = contract.cases.find(
      (c) => c.caseId === requirement.caseId && c.mode === requirement.mode,
    )
    const behaviorFixture = behaviorFixtures?.cases.find(
      (entry) => entry.caseId === requirement.caseId && entry.mode === requirement.mode,
    )
    if (!entry && !behaviorFixture) gaps.push("Runtime fixture not enrolled")
    if (requirement.source?.nodeId) {
      if (!(requirement.source.nodeId in nodes))
        gaps.push(
          sourceError
            ? `Pinned Figma source unavailable: ${sourceError}`
            : "Source node absent from pinned capture",
        )
      if (
        entry &&
        (entry.source.instanceNodeId ?? entry.source.componentNodeId) !== requirement.source.nodeId
      )
        gaps.push("Fixture selects a different Figma source node")
    } else if (
      requirement.requiredProofs.includes("visual") ||
      requirement.requiredProofs.includes("structural")
    )
      gaps.push(
        requirement.source?.availability === "needs-design"
          ? `Design needed: ${requirement.source.reason}`
          : requirement.source?.reason || "Figma design selection not mapped",
      )
    const mapping = compiled?.cases.find(
      (c) => c.caseId === requirement.caseId && c.mode === requirement.mode,
    )
    if (requirement.requiredProofs.includes("structural") && !mapping?.expectations?.length)
      gaps.push("Structural mapping not enrolled")
    if (
      mapping?.unsupported.length &&
      requirement.requiredProofs.some((proof) => proof === "structural" || proof === "visual")
    )
      gaps.push(...mapping.unsupported)
    if (requirement.requiredProofs.includes("visual") && entry) {
      const baselineRoot = contract.baselineRoot ?? join(familyRoot, family, "baselines")
      if (!entry.baseline || !existsSync(join(repoRoot, baselineRoot, entry.baseline)))
        gaps.push("Figma reference image missing")
      if (
        !entry.baseline ||
        !existsSync(
          join(repoRoot, baselineRoot, entry.baseline.replace(/\.(png|webp)$/, ".meta.json")),
        )
      )
        gaps.push("Figma reference receipt missing")
    }
    if (requirement.requiredProofs.includes("behavior")) {
      const gap = behaviorEnrollmentGap(behavior, requirement.caseId, requirement.mode)
      if (gap) gaps.push(gap)
    }
    return {
      ...requirement,
      ...(requirement.source?.nodeId
        ? {
            sourceUrl: `https://www.figma.com/design/${coverage.figmaFileKey}?node-id=${requirement.source.nodeId.replace(":", "-")}`,
          }
        : {}),
      gaps,
    }
  })
  // Newly registered cases must also enter the denominator rather than becoming hidden proof.
  for (const entry of contract.cases)
    if (!items.some((i) => i.caseId === entry.caseId && i.mode === entry.mode))
      items.push({
        itemId: `unlisted.${entry.caseId}.${entry.mode}`,
        label: entry.caseId,
        mode: entry.mode,
        caseId: entry.caseId,
        requiredProofs: ["structural", "visual"],
        gaps: ["Registered case absent from required coverage inventory"],
      })
  for (const variant of compiled?.uncoveredVariants ?? []) {
    const [role, state, mode] = variant.id.split("/")
    const represented =
      variant.source === "figma"
        ? items.some((i) => i.source?.nodeId === variant.id)
        : items.some((i) =>
            role === "purpose"
              ? i.dimensions?.purpose === state
              : i.dimensions?.variant === role && i.dimensions?.state === state && i.mode === mode,
          )
    if (!represented)
      items.push({
        itemId: `inventory.${variant.source}.${variant.id.replace(/[^a-z0-9.-]/gi, ".").toLowerCase()}`,
        label: variant.name,
        mode: mode === "dark" ? "dark" : "light",
        requiredProofs: ["structural", "visual"],
        gaps: [variant.reason, "Known source/public variant absent from required inventory"],
      })
  }
  const gaps = items.flatMap((item) => item.gaps.map((gap) => `${item.itemId}: ${gap}`))
  return {
    items,
    requiredItems: items.length,
    coveredItems: items.filter((i) => !i.gaps.length).length,
    complete: !gaps.length,
    gaps,
  }
}
