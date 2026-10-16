import { randomUUID } from "node:crypto"
import {
  closeSync,
  existsSync,
  fsyncSync,
  linkSync,
  mkdirSync,
  openSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { dirname, extname, join, resolve, sep } from "node:path"
import { evidenceRoot } from "../evidence/store.js"

/** Publish a complete new file atomically; never overwrite an earlier evidence snapshot. */
export function writeReportFile(repoRoot: string, output: string, html: string) {
  const target = resolve(repoRoot, output)
  if (extname(target).toLowerCase() !== ".html") throw Error("Report output must end in .html")
  const evidence = resolve(evidenceRoot(repoRoot))
  const inside = (root: string, path: string) => path === root || path.startsWith(root + sep)
  if (inside(evidence, target))
    throw Error("Portable reports cannot be written inside canonical evidence")
  mkdirSync(dirname(target), { recursive: true })
  const parent = realpathSync(dirname(target))
  if (existsSync(evidence) && inside(realpathSync(evidence), parent))
    throw Error("Portable reports cannot be written inside canonical evidence")
  const temporary = join(parent, `.governance-report-${randomUUID()}.tmp`)
  let descriptor: number | undefined
  try {
    descriptor = openSync(temporary, "wx", 0o600)
    writeFileSync(descriptor, html)
    fsyncSync(descriptor)
    closeSync(descriptor)
    descriptor = undefined
    // Linking makes the complete file visible and fails if the destination already exists.
    linkSync(temporary, target)
  } finally {
    if (descriptor !== undefined) closeSync(descriptor)
    if (existsSync(temporary)) unlinkSync(temporary)
  }
  return target
}

export async function writePortableReport(
  repoRoot: string,
  selection: { family: string; runId: string; output?: string },
) {
  const { createHtmlReport } = await import("../evidence/html-report.js")
  const report = await createHtmlReport(repoRoot, selection)
  const output =
    selection.output ??
    join(
      process.env.CI ? "artifacts/reflection" : ".reflection",
      "reports",
      `${selection.runId}-${randomUUID()}.html`,
    )
  const path = writeReportFile(repoRoot, output, report.html)
  return { ...report.summary, path }
}
