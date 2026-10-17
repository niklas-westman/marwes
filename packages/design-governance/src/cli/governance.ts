import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { compileFamily } from "../compile/compile-family.js"
import { familyCoverage } from "../contracts/coverage.js"
import { missingRequiredCases, structuralEnrollmentRequired } from "../contracts/enrollment.js"
import { type Adapter, adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { getCatalog, hash } from "../evidence/store.js"
import { verifyFamily } from "../runtime/verify.js"
import { validatePortableIntegrity } from "../source/portable-integrity.js"
import { importCompactSources, sourceIdentity } from "../source/snapshot.js"

export async function main(args = process.argv.slice(2)) {
  const command = args.shift() ?? "status"
  const options = new Map<string, string>()
  for (let index = 0; index < args.length; index++) {
    const arg = args[index] ?? ""
    if (arg === "--") continue
    if (["--json", "--all", "--strict", "--skip-browser-install", "--html"].includes(arg)) {
      options.set(arg, "true")
      continue
    }
    if (
      ![
        "--family",
        "--adapter",
        "--port",
        "--run",
        "--stage",
        "--approval",
        "--capture",
        "--transaction",
        "--output",
      ].includes(arg) ||
      !args[index + 1] ||
      args[index + 1]?.startsWith("--")
    )
      throw Error(`Unknown or incomplete option ${arg}`)
    options.set(arg, args[++index] ?? "")
  }
  const repoRoot = resolve(fileURLToPath(new URL("../../../../", import.meta.url)))
  if (!existsSync(resolve(repoRoot, "pnpm-workspace.yaml")))
    throw Error("Cannot identify workspace root")
  if (command === "inventory") {
    const { projectStatus } = await import("../evidence/project-status.js")
    console.log(JSON.stringify(projectStatus(repoRoot), null, 2))
    return
  }
  if (command === "provider") {
    const { createUIProvider } = await import("../evidence/ui-provider.js")
    console.log(JSON.stringify(await createUIProvider(repoRoot), null, 2))
    return
  }
  const family = options.get("--family")
  const selected = options.get("--adapter") ?? "all"
  const selectedAdapters = selected === "all" ? adapters : [selected as Adapter]
  if (selectedAdapters.some((adapter) => !adapters.includes(adapter)))
    throw Error(`Unknown adapter ${selected}`)
  if (options.has("--html") && command !== "verify") throw Error("--html requires verify")
  if (options.has("--output") && command !== "report") throw Error("--output requires report")
  if (command === "report") {
    const runId = options.get("--run")
    if (!family || !runId) throw Error("report requires explicit --family and --run")
    const { writePortableReport } = await import("./portable-report.js")
    console.log(
      JSON.stringify(
        await writePortableReport(repoRoot, {
          family,
          runId,
          ...(options.has("--output") ? { output: requireValue(options.get("--output")) } : {}),
        }),
        null,
        2,
      ),
    )
    return
  }
  const catalog = getCatalog(repoRoot)
  if (family && !catalog.families.some((item) => item.family === family))
    throw Error(`Unknown family ${family}`)
  if (command === "ui") {
    const { serveGovernanceUI } = await import("../../figma-governance-one/server/server.js")
    const server = await serveGovernanceUI(repoRoot, {
      port: Number(options.get("--port") ?? 6174),
    })
    console.log(server.url)
    return
  }
  if (["status", "review"].includes(command)) {
    console.log(
      JSON.stringify(
        family ? catalog.families.find((item) => item.family === family) : catalog,
        null,
        2,
      ),
    )
    return
  }
  if (["verify", "ci"].includes(command)) {
    if (options.has("--stage") && (command === "ci" || !family))
      throw Error("Staged verification requires an explicit family and is unavailable in CI")
    if (command === "verify" && !family && !options.has("--all"))
      throw Error("verify requires --family or --all")
    if (family && !catalog.families.find((item) => item.family === family)?.cases.length)
      throw Error(
        `Family ${family} has no registered validation cases; verification cannot pass an empty scope`,
      )
    if (command === "ci") {
      const { projectInventory } = await import("../contracts/project-inventory.js")
      const { assertProjectEnrollment } = await import("../evidence/project-status.js")
      // Enrollment comes from current contracts/source, never a previous execution's outcome.
      assertProjectEnrollment(projectInventory(repoRoot))
    }
    if (command === "ci" && !options.has("--skip-browser-install")) {
      const install = spawnSync(
        "pnpm",
        [
          "reflection:install-browsers",
          "--",
          ...(process.platform === "linux" ? ["--with-deps"] : []),
          "chromium",
        ],
        { cwd: repoRoot, stdio: "inherit" },
      )
      if (install.status !== 0)
        throw Error(
          `Required Chromium installation failed (${install.status}): ${install.error ?? ""}`,
        )
    }
    let failed = false
    for (const entry of catalog.families.filter((item) => !family || item.family === family)) {
      if (!entry.cases.length) {
        console.log(
          JSON.stringify({
            family: entry.family,
            outcome: "not-enrolled",
            scope: "outside registered verification contracts",
          }),
        )
        continue
      }
      const report = await verifyFamily(repoRoot, {
        family: entry.family,
        adapters: selectedAdapters,
        strict: options.has("--strict"),
        ...(options.has("--stage") ? { stageId: requireValue(options.get("--stage")) } : {}),
      })
      console.log(JSON.stringify(report, null, 2))
      if (options.has("--html")) {
        const { writePortableReport } = await import("./portable-report.js")
        console.log(
          JSON.stringify(
            await writePortableReport(repoRoot, { family: entry.family, runId: report.runId }),
            null,
            2,
          ),
        )
      }
      failed ||= report.outcome !== "passed"
    }
    if (failed) process.exitCode = 1
    return
  }
  if (
    ["source-stage", "source-stage-preview", "source-apply", "source-recover"].includes(command)
  ) {
    const { runSourcePromotionCommand } = await import("../source-promotion/cli.js")
    console.log(
      JSON.stringify(await runSourcePromotionCommand(repoRoot, command, options), null, 2),
    )
    return
  }
  if (command === "source-import") {
    if (process.env.CI) throw Error("CI cannot import or promote source")
    const identity = sourceIdentity(repoRoot)
    const captureHash = hash(readFileSync(identity.rawPath))
    for (const entry of catalog.families) {
      const manifestPath = resolve(
        repoRoot,
        "packages/design-governance/reflection-families",
        entry.family,
        "source/manifest.json",
      )
      if (
        existsSync(manifestPath) &&
        JSON.parse(readFileSync(manifestPath, "utf8")).hashes.raw !== captureHash
      )
        throw Error("New source captures require source-stage and exact human approval")
    }
    console.log(JSON.stringify({ families: importCompactSources(repoRoot) }, null, 2))
    return
  }
  if (command === "check") {
    const selectedFamilies = catalog.families.filter((item) => !family || item.family === family)
    const results = selectedFamilies
      .filter((item) => item.cases.length)
      .map((item) => {
        try {
          const integrity = validatePortableIntegrity(repoRoot, item.family, {
            strict: options.has("--strict"),
          })
          const compilation = compileFamily(repoRoot, item.family)
          const registered = JSON.parse(
            readFileSync(
              resolve(
                repoRoot,
                "packages/design-governance/reflection-families",
                item.family,
                "reflection-contract.json",
              ),
              "utf8",
            ),
          ) as { cases: { caseId: string; mode: string }[] }
          const coverage = familyCoverage(repoRoot, item.family, compilation)
          const missing = missingRequiredCases(
            structuralEnrollmentRequired(repoRoot, item.family),
            registered.cases,
            compilation.cases,
          )
          return {
            family: item.family,
            integrity,
            missingRequiredCases: missing,
            coverage,
            unsupported: compilation.cases.flatMap((entry) => entry.unsupported),
            uncovered: compilation.uncovered,
            outcome:
              integrity.status !== "passed" ||
              missing.length > 0 ||
              !coverage.complete ||
              compilation.cases.some((entry) => entry.unsupported.length)
                ? "failed"
                : "passed",
          }
        } catch (error) {
          return { family: item.family, outcome: "failed", error: String(error) }
        }
      })
    console.log(JSON.stringify({ families: results }, null, 2))
    if (!results.length || results.some((item) => item.outcome !== "passed")) process.exitCode = 1
    return
  }
  throw Error(`Unknown governance command ${command}`)
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch((error) => {
    console.error(String(error))
    process.exitCode = 1
  })
