import { appendFileSync, existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import process from "node:process"

// Writes the latest governance report per family into the job summary. Never fails the job.
const root = "artifacts/reflection/governance"
const lines = ["### Governance (report-only)", ""]

const runs = existsSync(root)
  ? readdirSync(root).filter((name) => existsSync(join(root, name, "report.json")))
  : []
const latestByFamily = new Map()
for (const name of runs.sort()) {
  const report = JSON.parse(readFileSync(join(root, name, "report.json"), "utf8"))
  latestByFamily.set(report.family, report)
}

if (latestByFamily.size === 0) lines.push("No governance report was produced.")
for (const report of latestByFamily.values()) {
  const proofs = {}
  const failing = []
  for (const row of report.cases) {
    for (const [layer, outcome] of Object.entries(row.outcomes)) {
      proofs[layer] ??= {}
      proofs[layer][outcome] = (proofs[layer][outcome] ?? 0) + 1
      if (layer !== "coverage" && (outcome === "failed" || outcome === "error"))
        failing.push(`${row.caseId} · ${row.mode} · ${row.adapter} · ${layer}`)
    }
  }
  lines.push(
    `**${report.family}** — outcome \`${report.outcome}\`, freshness \`${report.freshness.state}\`, ${report.cases.length} rows, run \`${report.runId}\``,
    "",
    "| Proof | Outcomes |",
    "| --- | --- |",
    ...Object.entries(proofs).map(
      ([layer, counts]) =>
        `| ${layer} | ${Object.entries(counts)
          .map(([outcome, count]) => `${outcome} ${count}`)
          .join(", ")} |`,
    ),
    "",
    failing.length
      ? `Failing (${failing.length}):\n\n${failing
          .slice(0, 60)
          .map((row) => `- ${row}`)
          .join("\n")}`
      : "No failing proof rows.",
    "",
  )
}

const text = lines.join("\n")
console.log(text)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`)
