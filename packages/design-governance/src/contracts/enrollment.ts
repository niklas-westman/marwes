import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
export type CaseIdentity = { caseId: string; mode: string }
export function structuralEnrollmentRequired(repoRoot: string, family: string): boolean {
  const directory = join(repoRoot, "packages/design-governance/reflection-families", family)
  const contract = JSON.parse(
    readFileSync(join(directory, "reflection-contract.json"), "utf8"),
  ) as { structuralContract?: unknown }
  if (
    contract.structuralContract !== undefined &&
    contract.structuralContract !== "structural-contract.json"
  )
    throw Error("Unknown structural contract reference")
  return (
    contract.structuralContract !== undefined ||
    existsSync(join(directory, "structural-contract.json"))
  )
}
export function missingRequiredCases(
  required: boolean,
  registered: CaseIdentity[],
  compiled: CaseIdentity[],
): string[] {
  return required
    ? registered
        .filter(
          (item) =>
            !compiled.some((entry) => entry.caseId === item.caseId && entry.mode === item.mode),
        )
        .map((item) => `${item.caseId}/${item.mode}: required structural mapping missing`)
    : []
}
