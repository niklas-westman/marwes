import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { expect, it } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import { type FigmaReflectionContract, defineMarwesReflection } from "./reflection-config.js"

const buttonContract = () =>
  JSON.parse(
    readFileSync(
      new URL("../../reflection-families/button/reflection-contract.json", import.meta.url),
      "utf8",
    ),
  ) as FigmaReflectionContract

it("enrolls native Pressed capture and verified stateless loading stabilization", () => {
  const config = defineMarwesReflection({ adapter: "react", port: 59999 })
  const cases = requireValue(requireValue(requireValue(config.contracts).component).cases)
  expect(
    cases.some(
      (c) => c.id === "react.button.basic-hover.light" && c.browserState?.kind === "hover",
    ),
  ).toBe(true)
  expect(cases.filter((c) => c.browserState?.kind === "pressed")).toHaveLength(26)
  expect(cases.find((c) => c.id === "react.button.basic-pressed.light")).toMatchObject({
    browserState: { kind: "pressed", selector: ".mw-btn" },
    stabilization: { animations: "settle", verify: true },
  })
  expect(cases.find((c) => c.id === "react.button.secondary-loading.light")).toMatchObject({
    stabilization: { animations: "settle", verify: true },
  })
  expect(
    cases.find((c) => c.id === "react.button.secondary-loading.light")?.browserState,
  ).toBeUndefined()
  expect(cases.some((c) => c.id === "react.button.basic-disabled.light")).toBe(true)
})

it("enrolls only an explicitly eligible staged Pressed pilot and preserves its exact state and reference", () => {
  const familyContract = buttonContract()
  for (const entry of familyContract.cases)
    if (entry.browserState?.kind === "pressed")
      entry.captureRequirement = "Pending explicit enrollment"
  const pilot = requireValue(
    familyContract.cases.find((c) => c.caseId === "button.basic-pressed" && c.mode === "light"),
  )
  expect(pilot.captureRequirement).toBeTruthy()
  const { captureRequirement: _pendingRequirement, ...eligiblePilot } = pilot
  familyContract.cases = familyContract.cases.map((entry) =>
    entry === pilot ? eligiblePilot : entry,
  )
  eligiblePilot.browserState = {
    kind: "pressed",
    selector: "[data-pilot-button]",
    animationStabilization: { disableAnimations: true },
  }
  eligiblePilot.stabilization = { animations: "none", verify: true, verifyDelayMs: 120 }
  eligiblePilot.baseline = "pilot/pressed.webp"
  familyContract.baselineRoot = "/staged/button/baselines"

  const original = requireValue(
    requireValue(
      requireValue(defineMarwesReflection({ adapter: "vue", port: 59999 }).contracts).component,
    ).cases,
  )
  const cases = requireValue(
    requireValue(
      requireValue(
        defineMarwesReflection({ adapter: "vue", port: 59999, familyContract }).contracts,
      ).component,
    ).cases,
  )
  const actual = requireValue(cases.find((c) => c.id === "vue.button.basic-pressed.light"))
  expect(actual.browserState).toEqual(eligiblePilot.browserState)
  expect(actual.stabilization).toEqual(eligiblePilot.stabilization)
  expect(actual.baseline).toBe("pilot/pressed.webp")
  expect(actual.baselineRoot).toBe("/staged/button/baselines")
  expect(cases.filter((c) => c.browserState?.kind === "pressed")).toHaveLength(1)
  expect(cases.filter((c) => !c.id.startsWith("vue.button."))).toEqual(
    original.filter((c) => !c.id.startsWith("vue.button.")),
  )
  expect(
    requireValue(
      requireValue(
        requireValue(defineMarwesReflection({ adapter: "vue", port: 59999 }).contracts).component,
      ).cases,
    ),
  ).toEqual(original)
})

it("forwards stateless stabilization without inventing an interaction", () => {
  const familyContract = buttonContract()
  const loading = requireValue(
    familyContract.cases.find((c) => c.caseId === "button.secondary-loading" && c.mode === "light"),
  )
  expect(loading).toBeDefined()
  loading.stabilization = { animations: "settle", settleMs: 50, verify: true }
  const { browserState: _browserState, ...statelessLoading } = loading
  familyContract.cases = familyContract.cases.map((entry) =>
    entry === loading ? statelessLoading : entry,
  )
  const cases = requireValue(
    requireValue(
      requireValue(
        defineMarwesReflection({ adapter: "svelte", port: 59999, familyContract }).contracts,
      ).component,
    ).cases,
  )
  const actual = requireValue(cases.find((c) => c.id === "svelte.button.secondary-loading.light"))
  expect(actual.stabilization).toEqual(loading.stabilization)
  expect(actual.browserState).toBeUndefined()
})

it("rejects an unknown family override", () => {
  expect(() =>
    defineMarwesReflection({
      adapter: "react",
      port: 59999,
      familyContract: { ...buttonContract(), family: "unknown" },
    }),
  ).toThrow("Unknown Reflection family override: unknown")
})

it("lets the installed Reflection CLI reject an invalid stabilization policy before capture", () => {
  const familyContract = buttonContract()
  const loading = requireValue(
    familyContract.cases.find((c) => c.caseId === "button.secondary-loading" && c.mode === "light"),
  )
  loading.stabilization = { animations: "none", settleMs: -1 }
  const config = defineMarwesReflection({ adapter: "react", port: 59999, familyContract })
  const root = mkdtempSync(join(tmpdir(), "marwes-reflection-invalid-policy-"))
  const configPath = join(root, "invalid.config.mjs")
  writeFileSync(configPath, `export default ${JSON.stringify(config)}`)
  try {
    // defineReflection is an identity helper; validation belongs to Reflection's CLI loader.
    const cli = fileURLToPath(new URL("./cli.js", import.meta.resolve("reflection-check")))
    const result = spawnSync(process.execPath, [cli, "doctor", "--config", configPath], {
      encoding: "utf8",
      timeout: 10_000,
    })
    expect(result.error).toBeUndefined()
    expect(result.status).not.toBe(0)
    expect(`${result.stdout}\n${result.stderr}`).toContain("settleMs")
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
