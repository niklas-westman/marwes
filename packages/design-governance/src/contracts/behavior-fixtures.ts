import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { z } from "zod"
import type { CaseIdentity } from "./enrollment.js"

const fixtureSchema = z
  .object({
    caseId: z.string().regex(/^[a-z0-9.-]+$/),
    mode: z.enum(["light", "dark"]),
    portalPath: z.string().regex(/^\/reflection\/[a-z0-9/-]+$/),
    viewportSize: z
      .object({
        width: z.number().int().min(1).max(10000),
        height: z.number().int().min(1).max(10000),
      })
      .strict(),
  })
  .strict()
const schema = z
  .object({
    schemaVersion: z.literal(1),
    family: z.string().regex(/^[a-z0-9-]+$/),
    cases: z.array(fixtureSchema).min(1),
  })
  .strict()
  .superRefine((contract, context) => {
    const identities = new Set<string>()
    const paths = new Set<string>()
    for (const entry of contract.cases) {
      const identity = JSON.stringify([entry.caseId, entry.mode])
      if (identities.has(identity))
        context.addIssue({ code: "custom", message: "Duplicate behavior fixture identity" })
      if (paths.has(entry.portalPath))
        context.addIssue({ code: "custom", message: "Duplicate behavior fixture path" })
      if (
        !entry.portalPath.startsWith(`/reflection/${contract.family}/`) ||
        !entry.portalPath.endsWith(`/${entry.mode}`)
      )
        context.addIssue({
          code: "custom",
          message: "Behavior fixture path must select its family and mode",
        })
      identities.add(identity)
      paths.add(entry.portalPath)
    }
  })

export type BehaviorFixtureContract = z.infer<typeof schema>
export type BehaviorFixture = BehaviorFixtureContract["cases"][number]
export const parseBehaviorFixtures = (value: unknown): BehaviorFixtureContract =>
  schema.parse(value)

/** No source-node, baseline or structural-expectation fields belong to behavior-only fixtures. */
export function loadBehaviorFixtures(
  repoRoot: string,
  family: string,
): BehaviorFixtureContract | undefined {
  if (!/^[a-z0-9-]+$/.test(family)) throw Error("Invalid behavior fixture family")
  const file = join(
    repoRoot,
    "packages/design-governance/reflection-families",
    family,
    "behavior-fixtures.json",
  )
  if (!existsSync(file)) return undefined
  const contract = parseBehaviorFixtures(JSON.parse(readFileSync(file, "utf8")))
  if (contract.family !== family) throw Error("Behavior fixture family mismatch")
  return contract
}

export type BehaviorFixtureEnrollment = {
  visualCases: (CaseIdentity & { portalPath?: string })[]
  requirements: { caseId?: string; mode: string; requiredProofs: readonly string[] }[]
  scenarios: CaseIdentity[]
}

/** Enrollment is explicit; a behavior sidecar cannot downgrade an existing visual obligation. */
export function validateBehaviorFixtureEnrollment(
  contract: BehaviorFixtureContract,
  enrollment: BehaviorFixtureEnrollment,
): void {
  const same = (left: CaseIdentity, right: { caseId?: string; mode: string }) =>
    left.caseId === right.caseId && left.mode === right.mode
  for (const entry of contract.cases) {
    if (
      enrollment.visualCases.some(
        (visual) => same(entry, visual) || visual.portalPath === entry.portalPath,
      )
    )
      throw Error(
        `Behavior-only fixture overlaps a visual selection: ${entry.caseId}/${entry.mode}`,
      )
    const requirements = enrollment.requirements.filter((requirement) => same(entry, requirement))
    if (!requirements.length)
      throw Error(`Behavior fixture absent from required inventory: ${entry.caseId}/${entry.mode}`)
    if (
      requirements.some(
        (requirement) =>
          requirement.requiredProofs.length !== 1 || requirement.requiredProofs[0] !== "behavior",
      )
    )
      throw Error(
        `Behavior-only fixture cannot satisfy structural or visual requirements: ${entry.caseId}/${entry.mode}`,
      )
    if (!enrollment.scenarios.some((scenario) => same(entry, scenario)))
      throw Error(`Behavior fixture lacks executable scenario: ${entry.caseId}/${entry.mode}`)
  }
}
