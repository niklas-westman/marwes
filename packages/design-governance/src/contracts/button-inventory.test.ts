import { readFileSync } from "node:fs"
import { expect, it } from "vitest"
import { validateCoverageContract } from "./coverage.js"
import { requireValue } from "./require-value.js"

const coveragePath = new URL(
  "../../reflection-families/button/coverage-contract.json",
  import.meta.url,
)
const reflectionPath = new URL(
  "../../reflection-families/button/reflection-contract.json",
  import.meta.url,
)
const coverage = JSON.parse(readFileSync(coveragePath, "utf8"))
const reflection: {
  cases: {
    caseId: string
    mode: string
    source: { instanceNodeId?: string; componentNodeIds?: string[] }
    prep?: { sourceNodeId?: string }
  }[]
} = JSON.parse(readFileSync(reflectionPath, "utf8"))
validateCoverageContract(coverage)
const requiredProofs = ["structural", "visual", "behavior"]
const purposes = [
  "destructive",
  "create",
  "submit",
  "cancel",
  "navigation",
  "save",
  "confirm",
  "verify",
  "edit",
  "close",
  "refresh",
  "upload",
  "download",
  "copy",
  "search",
  "filter",
  "sort",
  "dropdown",
  "success",
]
const variants = ["primary", "secondary", "neutral", "text", "success", "danger"]
const modes = ["light", "dark"]

it("retains the expanded Button inventory independently of missing fixture enrollment", () => {
  expect(coverage.figmaFileKey).toBe("nybMu3iJUnnOvWtuxjMG8b")
  expect(coverage.sourceCaptureVersion).toBe("2410234809276115335")
  expect(coverage.items).toHaveLength(273)
  expect(coverage.items.filter((item) => item.caseId)).toHaveLength(203)
  expect(coverage.items.filter((item) => !item.caseId)).toHaveLength(70)
  expect(new Set(coverage.items.map((item) => item.itemId)).size).toBe(273)
})

it("retains every approved generic, purpose and IconButton focus obligation without borrowing default proof", () => {
  const ids = modes.flatMap((mode) => [
    ...variants.map((variant) => `public.${variant}.focus.${mode}`),
    ...purposes.map((purpose) => `purpose.${purpose}.focus.${mode}`),
    `public.icon-only.focus.${mode}`,
  ])
  expect(ids).toHaveLength(52)
  for (const itemId of ids) {
    const item = coverage.items.find((candidate) => candidate.itemId === itemId)
    expect(item, itemId).toBeDefined()
    expect(requireValue(item).requiredProofs, itemId).toEqual(requiredProofs)
    expect(requireValue(item).source?.availability, itemId).toBe("rule-defined")
    expect(requireValue(item).source?.reason, itemId).toContain("DC-009")
    const requirement = requireValue(item)
    if (/^public\.primary\.focus\.(light|dark)$/.test(itemId)) {
      expect(requirement.caseId, itemId).toBe("button.standard-focus-example")
      expect(requirement.source?.nodeId, itemId).toBe(
        requirement.mode === "light" ? "1461:11495" : "1461:11639",
      )
      expect(requirement.source?.reason, itemId).toContain("staged proof")
      const entry = requireValue(
        reflection.cases.find(
          (candidate) =>
            candidate.caseId === requirement.caseId && candidate.mode === requirement.mode,
        ),
      )
      expect(entry.source.instanceNodeId, itemId).toBe(requirement.source?.nodeId)
      expect(entry.source.componentNodeIds, itemId).toContain("1364:11348")
      expect(entry.prep?.sourceNodeId, itemId).toBe("3977:38660")
    } else expect(requirement.caseId, itemId).toBeUndefined()
  }
  expect(
    coverage.items.filter((item) => item.source?.availability === "rule-defined"),
  ).toHaveLength(52)
  expect(
    coverage.items.filter((item) => item.source?.availability === "rule-defined" && !item.caseId),
  ).toHaveLength(50)
})

it("separates scoped design absence from available Primary loading and fullWidth design authority", () => {
  const expectedDesignIds = modes.flatMap((mode) => [
    ...["neutral", "text", "success", "danger"].map(
      (variant) => `public.${variant}.loading.${mode}`,
    ),
    ...["xs-size", "both-icons", "toggle"].map((feature) => `public.${feature}.${mode}`),
  ])
  const designItems = coverage.items.filter((item) => item.source?.availability === "needs-design")
  expect(designItems.map((item) => item.itemId).sort()).toEqual(expectedDesignIds.sort())
  for (const item of designItems) {
    expect(item.source?.reason).toContain("2410234809276115335")
    expect(item.source?.nodeId).toBeUndefined()
    expect(item.requiredProofs).toEqual(requiredProofs)
    expect(item.caseId).toBeUndefined()
  }
  for (const mode of modes) {
    const loading = requireValue(
      coverage.items.find((item) => item.itemId === `public.primary.loading.${mode}`),
    )
    expect(loading.source?.availability).toBe("needs-mapping")
    expect(loading.source?.nodeId).toBe(mode === "light" ? "1780:2692" : "1780:2744")
    expect(loading.caseId).toBeUndefined()
    const fullWidth = requireValue(
      coverage.items.find((item) => item.itemId === `public.full-width.${mode}`),
    )
    expect(fullWidth.source?.availability).toBe("needs-mapping")
    expect(fullWidth.source?.reason).toContain("1594:7408")
    expect(fullWidth.caseId).toBeUndefined()
  }
})

it("binds generic icon-only coverage to the exact enrolled neutral/md case and same-theme source", () => {
  for (const mode of modes) {
    const item = requireValue(
      coverage.items.find((candidate) => candidate.itemId === `public.icon-only.${mode}`),
    )
    const entry = reflection.cases.find(
      (candidate) => candidate.caseId === item.caseId && candidate.mode === mode,
    )
    expect(item.caseId).toBe("button.icon-only-neutral-default")
    expect(item.dimensions).toMatchObject({
      component: "IconButton",
      variant: "neutral",
      size: "md",
      state: "default",
      iconArrangement: "icon-only",
    })
    expect(item.source?.nodeId).toBe(mode === "light" ? "3875:60969" : "3875:61055")
    expect(entry?.source.instanceNodeId).toBe(item.source?.nodeId)
    expect(item.requiredProofs).toEqual(requiredProofs)
    expect(item.source?.availability).toBeUndefined()
    expect(
      coverage.items.some(
        (candidate) => candidate.itemId === `design.icon-only-neutral-default.${mode}`,
      ),
    ).toBe(true)
  }
})

it("keeps the known Border=False IconButton master inside both theme denominators pending public mapping", () => {
  const rows = coverage.items.filter((item) => item.source?.nodeId === "3017:36466")
  expect(rows).toHaveLength(2)
  expect(rows.map((item) => item.mode).sort()).toEqual(["dark", "light"])
  for (const mode of modes) {
    const item = requireValue(rows.find((candidate) => candidate.mode === mode))
    expect(item.itemId).toBe(`design.icon-only-borderless-default.${mode}`)
    expect(item.dimensions).toMatchObject({
      component: "IconButton",
      state: "default",
      size: "md",
      iconArrangement: "icon-only",
      border: "false",
      sourceVariant: "Border=False",
    })
    expect(item.dimensions?.variant).toBeUndefined()
    expect(item.source?.availability).toBe("needs-mapping")
    expect(item.source?.reason).toContain("2410234809276115335")
    expect(item.source?.reason).toContain("public-variant mapping remain unresolved")
    expect(item.requiredProofs).toEqual(requiredProofs)
    expect(item.caseId).toBeUndefined()
  }
  expect(
    coverage.items.filter((item) => item.source?.availability === "needs-mapping"),
  ).toHaveLength(6)
})
