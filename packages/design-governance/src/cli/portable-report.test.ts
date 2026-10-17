import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect, it } from "vitest"
import { writeReportFile } from "./portable-report.js"

it("writes a complete portable file, refuses overwrite, and leaves no temporary artifact", () => {
  const root = mkdtempSync(join(tmpdir(), "marwes-report-write-"))
  try {
    const path = writeReportFile(root, "reports/exact.html", "<!doctype html><p>Exact evidence</p>")
    expect(readFileSync(path, "utf8")).toContain("Exact evidence")
    expect(() => writeReportFile(root, "reports/exact.html", "replacement")).toThrow()
    expect(readFileSync(path, "utf8")).toContain("Exact evidence")
    expect(readdirSync(join(root, "reports"))).toEqual(["exact.html"])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

it("rejects writing through direct or symlinked canonical evidence paths", () => {
  const root = mkdtempSync(join(tmpdir(), "marwes-report-write-"))
  const priorCI = process.env.CI
  Reflect.deleteProperty(process.env, "CI")
  try {
    const evidence = join(root, ".reflection/governance")
    mkdirSync(evidence, { recursive: true })
    symlinkSync(evidence, join(root, "alias"))
    expect(() => writeReportFile(root, ".reflection/governance/new.html", "bad")).toThrow(
      "canonical evidence",
    )
    expect(() => writeReportFile(root, "alias/new.html", "bad")).toThrow("canonical evidence")
    expect(readdirSync(evidence)).toEqual([])
    expect(() => writeReportFile(root, "report.js", "bad")).toThrow(".html")
  } finally {
    if (priorCI === undefined) Reflect.deleteProperty(process.env, "CI")
    else process.env.CI = priorCI
    rmSync(root, { recursive: true, force: true })
  }
})
