import { spawn } from "node:child_process"
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import type { CaseIdentity } from "../contracts/enrollment.js"
import type { Adapter, ProofOutcome } from "../contracts/report.js"
import { allocateLoopbackPort } from "./port.js"
import type { FigmaReflectionContract } from "./reflection-config.js"
export function reflectionOutcome(status: unknown): ProofOutcome {
  return status === "pass"
    ? "passed"
    : status === "fail"
      ? "failed"
      : status === "error"
        ? "error"
        : "not-run"
}
export function reflectionCaseIds(adapter: Adapter, cases: CaseIdentity[]): string[] {
  return cases.map((item) => `${adapter}.${item.caseId}.${item.mode}`)
}
export async function runVisual(
  repoRoot: string,
  runRoot: string,
  family: string,
  adapter: Adapter,
  proofRoot = repoRoot,
): Promise<{ outcomes: Map<string, ProofOutcome>; directory: string; error?: string }> {
  const config = join(runRoot, `reflection-${adapter}.config.ts`)
  const directory = join(runRoot, `reflection-${adapter}`)
  const contract = JSON.parse(
    readFileSync(
      join(
        proofRoot,
        "packages/design-governance/reflection-families",
        family,
        "reflection-contract.json",
      ),
      "utf8",
    ),
  ) as FigmaReflectionContract
  if (contract.family !== family) {
    throw new Error(
      `Reflection contract family mismatch: requested ${family}, received ${contract.family}`,
    )
  }
  const allowedIds = reflectionCaseIds(adapter, contract.cases)
  const stagedBaselineRoot = join(
    proofRoot,
    "packages/design-governance/reflection-families",
    family,
    "baselines",
  )
  const shared = pathToFileURL(join(repoRoot, "reflection.shared.ts")).href
  const familyContract = {
    ...contract,
    ...(proofRoot !== repoRoot ? { baselineRoot: stagedBaselineRoot } : {}),
  }
  writeFileSync(
    config,
    `import {defineMarwesReflection} from ${JSON.stringify(shared)};\nconst config=defineMarwesReflection({adapter:${JSON.stringify(adapter)},port:${await allocateLoopbackPort()},familyContract:${JSON.stringify(familyContract)}});\nconfig.contracts.component.cases=config.contracts.component.cases.filter(c=>${JSON.stringify(allowedIds)}.includes(c.id));\nconfig.contracts.component.portal.reuseExisting=false;\nexport default config;\n`,
  )
  const result = await new Promise<{ code: number | null; log: string }>((done, reject) => {
    const child = spawn(
      "pnpm",
      [
        "exec",
        "reflection",
        "run",
        "--config",
        config,
        "--mode",
        "visual",
        "--report-dir",
        directory,
        "--workers",
        "1",
      ],
      { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] },
    )
    let log = ""
    child.stdout.on("data", (chunk) => {
      log += String(chunk)
    })
    child.stderr.on("data", (chunk) => {
      log += String(chunk)
    })
    child.on("error", reject)
    child.on("close", (code) => done({ code, log }))
  })
  writeFileSync(join(runRoot, `reflection-${adapter}.log`), result.log)
  const runs = join(directory, "runs")
  const outcomes = new Map<string, ProofOutcome>()
  if (!existsSync(runs))
    return { outcomes, directory, error: `Reflection produced no report (exit ${result.code})` }
  const entries = readdirSync(runs)
    .filter((name) => statSync(join(runs, name)).isDirectory())
    .sort()
  const latest = entries[entries.length - 1]
  if (!latest) return { outcomes, directory, error: "Reflection produced no run" }
  const report = JSON.parse(readFileSync(join(runs, latest, "report.json"), "utf8")) as {
    checks?: { id: string; status: string }[]
  }
  for (const check of report.checks ?? []) outcomes.set(check.id, reflectionOutcome(check.status))
  return {
    outcomes,
    directory: join(runs, latest),
    ...(result.code !== 0
      ? { error: `Reflection exited ${result.code}; required checks retain their reported failure` }
      : {}),
  }
}
