import { spawn } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { expect, it, vi } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import type { LegacyContract } from "../source/types.js"
import { defineMarwesReflection } from "./reflection-config.js"
import { reflectionCaseIds, runVisual } from "./visual.js"

vi.mock("node:child_process", () => ({ spawn: vi.fn() }))

it("rejects a staged contract for a different known family before writing config or spawning", async () => {
  const repoRoot = resolve(import.meta.dirname, "../../../..")
  const root = mkdtempSync(join(tmpdir(), "marwes-reflection-mismatch-"))
  const stagedFamily = join(root, "packages/design-governance/reflection-families/button")
  const runRoot = join(root, "run")
  mkdirSync(stagedFamily, { recursive: true })
  mkdirSync(runRoot)
  const contract = JSON.parse(
    readFileSync(
      join(
        repoRoot,
        "packages/design-governance/reflection-families/radio/reflection-contract.json",
      ),
      "utf8",
    ),
  )
  writeFileSync(join(stagedFamily, "reflection-contract.json"), JSON.stringify(contract))
  vi.mocked(spawn).mockClear()
  try {
    await expect(runVisual(repoRoot, runRoot, "button", "react", root)).rejects.toThrow(
      "Reflection contract family mismatch: requested button, received radio",
    )
    expect(spawn).not.toHaveBeenCalled()
    expect(existsSync(join(runRoot, "reflection-react.config.ts"))).toBe(false)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
it("selects exact registered case identities across nested family prefixes and modes", () => {
  const registered = [
    { caseId: "radio.checked", mode: "light" },
    { caseId: "radio-group.basic", mode: "dark" },
  ]
  const allowed = reflectionCaseIds("react", registered)
  const available = [
    "react.radio.checked.light",
    "react.radio-group.basic.dark",
    "react.radio-group.basic.light",
    "react.radio.unregistered.light",
    "vue.radio.checked.light",
  ]
  expect(available.filter((id) => allowed.includes(id))).toEqual([
    "react.radio.checked.light",
    "react.radio-group.basic.dark",
  ])
})
it("keeps every actual Radio and RadioGroup comparison registered under the radio family", () => {
  const repoRoot = resolve(import.meta.dirname, "../../../..")
  const contract: LegacyContract = JSON.parse(
    readFileSync(
      join(
        repoRoot,
        "packages/design-governance/reflection-families/radio/reflection-contract.json",
      ),
      "utf8",
    ),
  )
  for (const adapter of ["react", "vue", "svelte"] as const) {
    const ids = reflectionCaseIds(adapter, contract.cases)
    expect(ids).toHaveLength(contract.cases.length)
    expect(ids.some((id) => id.startsWith(`${adapter}.radio-group.`))).toBe(true)
    expect(ids.some((id) => id.startsWith(`${adapter}.radio.`))).toBe(true)
  }
})

it("builds the isolated run from staged eligibility, interaction, stabilization and references", async () => {
  const repoRoot = resolve(import.meta.dirname, "../../../..")
  const root = mkdtempSync(join(tmpdir(), "marwes-reflection-config-"))
  const stagedFamily = join(root, "packages/design-governance/reflection-families/button")
  const runRoot = join(root, "run")
  mkdirSync(stagedFamily, { recursive: true })
  mkdirSync(runRoot)
  const contract: LegacyContract = JSON.parse(
    readFileSync(
      join(
        repoRoot,
        "packages/design-governance/reflection-families/button/reflection-contract.json",
      ),
      "utf8",
    ),
  )
  for (const entry of contract.cases)
    if (entry.browserState?.kind === "pressed")
      entry.captureRequirement = "Pending explicit enrollment"
  const pilot = requireValue(
    contract.cases.find(
      (c: { caseId: string; mode: string }) =>
        c.caseId === "button.basic-pressed" && c.mode === "light",
    ),
  )
  const { captureRequirement: _pendingRequirement, ...eligiblePilot } = pilot
  contract.cases = contract.cases.map((entry) => (entry === pilot ? eligiblePilot : entry))
  eligiblePilot.browserState = {
    kind: "pressed",
    selector: "[data-stage-pilot]",
    animationStabilization: { disableAnimations: true },
  }
  eligiblePilot.stabilization = { animations: "none", verify: true }
  eligiblePilot.baseline = "staged-pressed.webp"
  writeFileSync(join(stagedFamily, "reflection-contract.json"), JSON.stringify(contract))
  vi.mocked(spawn).mockImplementationOnce((() => {
    const child = {
      stdout: { on: vi.fn() },
      stderr: { on: vi.fn() },
      on: (event: string, callback: (code: number) => void) => {
        if (event === "close") queueMicrotask(() => callback(0))
        return child
      },
    }
    return child
  }) as unknown as typeof spawn)
  try {
    const result = await runVisual(repoRoot, runRoot, "button", "react", root)
    expect(result.error).toContain("Reflection produced no report")
    const source = readFileSync(join(runRoot, "reflection-react.config.ts"), "utf8")
    const config = new Function(
      "defineMarwesReflection",
      source.replace(/^import[^\n]+\n/, "").replace("export default config;", "return config;"),
    )(defineMarwesReflection)
    expect(config.contracts.component.portal.reuseExisting).toBe(false)
    const cases = config.contracts.component.cases
    expect(cases.every((c: { id: string }) => c.id.startsWith("react.button."))).toBe(true)
    expect(
      cases.filter((c: { browserState?: { kind: string } }) => c.browserState?.kind === "pressed"),
    ).toHaveLength(1)
    expect(
      requireValue(cases.find((c: { id: string }) => c.id === "react.button.basic-pressed.light")),
    ).toMatchObject({
      browserState: eligiblePilot.browserState,
      stabilization: eligiblePilot.stabilization,
      baseline: eligiblePilot.baseline,
      baselineRoot: join(stagedFamily, "baselines"),
    })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
