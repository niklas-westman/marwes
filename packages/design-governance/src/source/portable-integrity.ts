import { existsSync } from "node:fs"
import { join } from "node:path"
import { resolveBaselinePath, validateBaselineReceipt } from "../baseline-receipts.mjs"
import { validateGeneratedFrameProvenance } from "../generated-frame-provenance.mjs"
import { configuredSourceIdentity, familyRoot, loadSnapshot, readJson } from "./snapshot.ts"
import type { LegacyContract } from "./types.ts"

export type PortableIntegrity = {
  status: "passed" | "failed"
  details: string[]
  warnings?: string[]
}
export function validatePortableIntegrity(
  repoRoot: string,
  family: string,
  options: { strict?: boolean } = {},
): PortableIntegrity {
  try {
    const snapshot = loadSnapshot(repoRoot, family)
    const contract = readJson<LegacyContract>(
      join(repoRoot, familyRoot, family, "reflection-contract.json"),
    )
    const details = snapshot.missingDependencies.map((id) => `Missing source dependency ${id}`)
    if (options.strict)
      details.push(
        ...snapshot.missingOptionalFrames.map((id) => `Missing required generated frame ${id}`),
      )
    const context = {
      rawSource: {
        document: {
          id: "portable-root",
          type: "DOCUMENT",
          children: Object.values(snapshot.nodes),
        },
      },
      variableSource: { variables: snapshot.variables, collections: snapshot.collections },
    }
    for (const caseEntry of contract.cases) {
      const result = validateBaselineReceipt({
        repoRoot,
        contract,
        caseEntry,
        context,
        pngPath: resolveBaselinePath(repoRoot, contract, caseEntry),
        requireReceipt: true,
      })
      if (options.strict) {
        const provenance = validateGeneratedFrameProvenance({
          repoRoot,
          contract,
          caseEntry,
          context,
          requireProvenance: true,
        })
        if (provenance.status !== "pass")
          details.push(
            `${caseEntry.caseId}/${caseEntry.mode} provenance: ${provenance.details.join("; ")}`,
          )
      }
      if (result.status !== "pass")
        details.push(`${caseEntry.caseId}/${caseEntry.mode}: ${result.details.join("; ")}`)
    }
    const identity = configuredSourceIdentity(repoRoot)
    const offlineWarnings =
      !existsSync(identity.manifestPath) || !existsSync(identity.variablesPath)
        ? [
            "Verified committed pinned capture; current local Figma exports unavailable, live Figma freshness is not established",
          ]
        : []
    return {
      status: details.length ? "failed" : "passed",
      details,
      warnings: [
        ...offlineWarnings,
        ...snapshot.missingOptionalFrames.map(
          (id) =>
            `Generated frame ${id} absent from pinned capture; strict generated-frame provenance remains pending`,
        ),
      ],
    }
  } catch (error) {
    return { status: "failed", details: [(error as Error).message] }
  }
}

export const validatePortableFamily = validatePortableIntegrity
