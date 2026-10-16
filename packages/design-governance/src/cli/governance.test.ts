import { beforeEach, expect, it, vi } from "vitest"
vi.mock("../evidence/store.js", () => ({
  getCatalog: vi.fn(() => ({ families: [{ family: "unenrolled", cases: [] }] })),
  hash: () => "unused",
}))
vi.mock("../runtime/verify.js", () => ({ verifyFamily: vi.fn() }))
vi.mock("./portable-report.js", () => ({
  writePortableReport: vi.fn(async () => ({ path: "/tmp/exact.html" })),
}))
vi.mock("../contracts/project-inventory.js", () => ({
  projectInventory: vi.fn(() => ({ complete: false })),
}))
vi.mock("../evidence/project-status.js", () => ({
  projectStatus: vi.fn(() => ({ complete: false })),
  assertProjectEnrollment: vi.fn(() => {
    throw Error("Project enrollment incomplete: missing public family")
  }),
}))
vi.mock("../source/portable-integrity.js", () => ({
  validatePortableIntegrity: () => ({ status: "passed", details: [] }),
}))
vi.mock("../compile/compile-family.js", () => ({
  compileFamily: () => ({
    cases: [{ caseId: "button.basic", mode: "light", unsupported: [] }],
    uncovered: [],
  }),
}))
import { projectInventory } from "../contracts/project-inventory.js"
import { assertProjectEnrollment, projectStatus } from "../evidence/project-status.js"
import { getCatalog } from "../evidence/store.js"
import { verifyFamily } from "../runtime/verify.js"
import { main } from "./governance.js"
import { writePortableReport } from "./portable-report.js"
beforeEach(() => vi.clearAllMocks())
it("requires an explicit report identity and passes the output without validating components", async () => {
  await expect(main(["report", "--family", "button"])).rejects.toThrow("--family and --run")
  await expect(main(["status", "--html"])).rejects.toThrow("--html requires verify")
  const log = vi.spyOn(console, "log").mockImplementation(() => undefined)
  try {
    await main(["report", "--family", "button", "--run", "exact-run", "--output", "report.html"])
    expect(writePortableReport).toHaveBeenCalledWith(expect.any(String), {
      family: "button",
      runId: "exact-run",
      output: "report.html",
    })
  } finally {
    log.mockRestore()
  }
})
it("exports a failed verification run for inspection without suppressing its failed exit status", async () => {
  const oldExit = process.exitCode
  const log = vi.spyOn(console, "log").mockImplementation(() => undefined)
  vi.mocked(getCatalog).mockReturnValueOnce({
    families: [{ family: "button", cases: [{ caseId: "button.basic", mode: "light" }] }],
  } as ReturnType<typeof getCatalog>)
  vi.mocked(verifyFamily).mockResolvedValueOnce({
    family: "button",
    runId: "new-failed-run",
    outcome: "failed",
  } as Awaited<ReturnType<typeof verifyFamily>>)
  try {
    process.exitCode = 0
    await main(["verify", "--family", "button", "--html"])
    expect(writePortableReport).toHaveBeenCalledWith(expect.any(String), {
      family: "button",
      runId: "new-failed-run",
    })
    expect(process.exitCode).toBe(1)
  } finally {
    process.exitCode = oldExit
    log.mockRestore()
  }
})
it.each(["verify", "ci"])("%s rejects an explicitly selected empty family", async (command) => {
  await expect(main([command, "--family", "unenrolled", "--skip-browser-install"])).rejects.toThrow(
    "empty scope",
  )
})
it("CI rejects incomplete project enrollment before running its enrolled subset", async () => {
  vi.mocked(getCatalog).mockReturnValueOnce({
    families: [{ family: "button", cases: [{ caseId: "button.basic", mode: "light" }] }],
  } as ReturnType<typeof getCatalog>)
  await expect(main(["ci", "--skip-browser-install"])).rejects.toThrow(
    "Project enrollment incomplete",
  )
  expect(verifyFamily).not.toHaveBeenCalled()
})
it("CI can rerun enrolled families after a failed subset execution", async () => {
  const priorExit = process.exitCode
  const log = vi.spyOn(console, "log").mockImplementation(() => undefined)
  const enrollment = { complete: false, enrollmentGaps: [] } as unknown as ReturnType<
    typeof projectInventory
  >
  vi.mocked(projectInventory).mockReturnValueOnce(enrollment)
  vi.mocked(assertProjectEnrollment).mockImplementationOnce(() => undefined)
  vi.mocked(getCatalog).mockReturnValueOnce({
    families: [
      {
        family: "button",
        cases: [{ caseId: "button.basic", mode: "light", adapter: "react" }],
        outcome: "failed",
      },
    ],
  } as ReturnType<typeof getCatalog>)
  vi.mocked(verifyFamily).mockResolvedValueOnce({ outcome: "passed" } as Awaited<
    ReturnType<typeof verifyFamily>
  >)
  vi.mocked(projectStatus).mockClear()
  try {
    process.exitCode = 0
    await main(["ci", "--skip-browser-install"])
    expect(assertProjectEnrollment).toHaveBeenLastCalledWith(enrollment)
    expect(projectStatus).not.toHaveBeenCalled()
    expect(verifyFamily).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ family: "button", adapters: ["react", "vue", "svelte"] }),
    )
    expect(process.exitCode).toBe(0)
  } finally {
    process.exitCode = priorExit
    log.mockRestore()
  }
})
it("offline check fails when an enrolled family loses a registered mapping", async () => {
  const previousExit = process.exitCode
  const log = vi.spyOn(console, "log").mockImplementation(() => undefined)
  vi.mocked(getCatalog).mockReturnValueOnce({
    families: [{ family: "button", cases: [{ caseId: "button.basic" }] }],
  } as ReturnType<typeof getCatalog>)
  try {
    await main(["check", "--family", "button"])
    expect(process.exitCode).toBe(1)
    expect(log).toHaveBeenCalledWith(expect.stringContaining("required structural mapping missing"))
  } finally {
    process.exitCode = previousExit
    log.mockRestore()
  }
})
