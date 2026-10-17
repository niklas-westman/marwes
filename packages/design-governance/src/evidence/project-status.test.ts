import { cpSync, mkdirSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import type { CoverageAssessment } from "../contracts/coverage.js"
import {
  type ProjectInventory,
  projectInventory,
  projectProofs,
} from "../contracts/project-inventory.js"
import type { GovernanceReport } from "../contracts/report.js"
import { adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { createOfflineProofFixture } from "../source/offline-test-fixture.js"
import {
  assertProjectCompletion,
  assertProjectEnrollment,
  assessProjectGroupEvidence,
  projectStatus,
} from "./project-status.js"

it("surfaces a missing latest report in project evidence errors", () => {
  const root = createOfflineProofFixture()
  enrollmentRoots.push(root)
  mkdirSync(join(root, ".reflection/governance/button-1792080000000-incomplete"), {
    recursive: true,
  })
  const status = projectStatus(root)
  expect(status.evidenceErrors.button).toContain("report.json")
  expect(status.complete).toBe(false)
})

function evidence() {
  const coverage: CoverageAssessment = {
    complete: true,
    gaps: [],
    requiredItems: 1,
    coveredItems: 1,
    items: [
      {
        itemId: "button.basic.light",
        label: "Basic",
        caseId: "button.basic",
        mode: "light",
        requiredProofs: ["structural", "visual"],
        gaps: [],
      },
    ],
  }
  const report: GovernanceReport = {
    schemaVersion: 1,
    runId: "button-run",
    family: "button",
    startedAt: "2026-10-14T15:00:00Z",
    finishedAt: "2026-10-14T15:00:01Z",
    fingerprint: "a".repeat(64),
    environment: { evidenceScope: "active" },
    freshness: { state: "current", reasons: [] },
    review: { state: "accepted" },
    outcome: "passed",
    cases: adapters.map((adapter) => ({
      caseId: "button.basic",
      adapter,
      mode: "light",
      sourceUrl: "https://figma.com",
      measurements: [],
      unsupported: [],
      artifacts: (["reference", "actual", "diff"] as const).map((role) => ({
        role,
        path: `${adapter}/${role}.webp`,
        sha256: "b".repeat(64),
        mimeType: "image/webp",
      })),
      outcomes: {
        integrity: "passed",
        structural: "passed",
        visual: "passed",
        behavior: "not-run",
        coverage: "passed",
      },
    })),
  }
  return {
    report,
    coverage,
    integrity: "passed" as const,
    behavior: {
      schemaVersion: 1 as const,
      family: "button",
      applicability: {
        kind: "noninteractive" as const,
        reason: "Test-only passive control",
        authority: "Fixture contract",
      },
      scenarios: [],
    },
  }
}

describe("project certification scope", () => {
  it("cannot pass the project when all 18 enrolled visual groups claim green but 18 required groups remain unenrolled", () => {
    const project = projectInventory(
      resolve(import.meta.dirname, "../../../.."),
      () => Object.fromEntries(projectProofs.map((key) => [key, "passed"])),
      { uiIntegrationAccepted: true },
    )
    expect(project.requiredFamilies).toBe(32)
    expect(project.requiredValidationGroups).toBe(36)
    expect(project.enrolledVisualGroups).toBe(18)
    expect(project.complete).toBe(false)
    expect(() => assertProjectEnrollment(project)).toThrow("avatar/avatar")
    expect(() => assertProjectCompletion(project)).toThrow("certification incomplete")
  })
  it("accepts complete exact-run adapter scope with independent noninteractive authority", () => {
    expect(Object.values(assessProjectGroupEvidence(evidence()))).toEqual(
      projectProofs.map(() => "passed"),
    )
  })
  it("does not elevate accepted subset review to family acceptance", () => {
    const input = evidence()
    input.report.cases = input.report.cases.filter((item) => item.adapter === "react")
    const result = assessProjectGroupEvidence(input)
    expect(result.fixture).toBe("missing")
    expect(result.review).toBe("unverified")
  })
  it("keeps missing required selections blocking despite a fully accepted enrolled subset", () => {
    const input = evidence()
    input.coverage.items.push({
      itemId: "missing.dark",
      label: "Missing",
      mode: "dark",
      requiredProofs: ["visual"],
      gaps: ["Fixture missing"],
    })
    input.coverage.complete = false
    const result = assessProjectGroupEvidence(input)
    expect(result.inventory).toBe("missing")
    expect(result.review).toBe("unverified")
  })
  it("does not promote staged or stale reports into active certification", () => {
    for (const kind of ["staged", "stale"] as const) {
      const input = evidence()
      if (kind === "staged") input.report.environment.evidenceScope = "staged"
      else input.report.freshness.state = "stale"
      expect(Object.values(assessProjectGroupEvidence(input))).toEqual(
        projectProofs.map(() => "unverified"),
      )
    }
  })
  it("requires hash-validated visual artifact roles rather than visual status alone", () => {
    const input = evidence()
    requireValue(input.report.cases[0]).artifacts = []
    expect(assessProjectGroupEvidence(input).visual).toBe("unverified")
  })
  it("does not pass behavior without declared applicability or independent scenarios", () => {
    const input = evidence()
    expect(assessProjectGroupEvidence({ ...input, behavior: undefined }).behavior).toBe(
      "unverified",
    )
  })
  it("does not let an invalid active source pass promotion", () => {
    const input = evidence()
    const result = assessProjectGroupEvidence({
      ...input,
      integrity: "failed",
    })
    expect(result.source).toBe("failed")
    expect(result.promotion).toBe("failed")
  })
})

it("requires explicit active scope rather than treating an unknown scope as active", () => {
  const input = evidence()
  Reflect.deleteProperty(input.report.environment, "evidenceScope")
  expect(assessProjectGroupEvidence(input).promotion).toBe("unverified")
})

const enrollmentRoots: string[] = []
afterEach(() => {
  for (const root of enrollmentRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

/** Isolate the enrollment gate from unrelated existing rollout blockers. */
function enrolledProject(
  status = projectInventory(resolve(import.meta.dirname, "../../../..")),
): ProjectInventory {
  for (const family of status.families)
    for (const group of family.validationGroups) {
      group.enrolled = true
      group.registeredCases = 1
      group.requiredItems = 1
      for (const key of projectProofs) group.states[key] = "unverified"
    }
  return status
}

it("allows fully enrolled unverified proof without requiring UI or human acceptance", () => {
  const status = enrolledProject()
  status.enrollmentGaps = []
  expect(status.rollout.uiIntegration).toBe("unavailable")
  expect(() => assertProjectEnrollment(status)).not.toThrow()
})

it.each(["source", "inventory", "structural", "fixture"] as const)(
  "rejects failed %s enrollment even when files are present",
  (proof) => {
    const status = enrolledProject()
    status.enrollmentGaps = []
    requireValue(
      requireValue(status.families.find((family) => family.family === "button"))
        .validationGroups[0],
    ).states[proof] = "failed"
    expect(() => assertProjectEnrollment(status)).toThrow("button/button")
  },
)

it("rejects an internally bound old compact capture even if runtime marks source passed", () => {
  // Button is on the Oct 14 capture; Badge still carries the old one this test must reject.
  const root = createOfflineProofFixture()
  enrollmentRoots.push(root)
  const result = projectInventory(root, () => ({ source: "passed" }))
  const sourceState = requireValue(
    requireValue(result.families.find((family) => family.family === "badge")).validationGroups[0],
  ).states.source
  expect(sourceState).toBe("failed")
  const status = enrolledProject(result)
  status.enrollmentGaps = []
  requireValue(
    requireValue(status.families.find((family) => family.family === "badge")).validationGroups[0],
  ).states.source = sourceState
  expect(() => assertProjectEnrollment(status)).toThrow("badge/badge")
})

it("rejects registry reconciliation gaps even when every validation group appears enrolled", () => {
  const root = mkdtempSync(join(tmpdir(), "marwes-registry-reconciliation-"))
  enrollmentRoots.push(root)
  const registry = "docs/registry/families"
  mkdirSync(join(root, "docs/registry"), { recursive: true })
  cpSync(join(resolve(import.meta.dirname, "../../../.."), registry), join(root, registry), {
    recursive: true,
  })
  rmSync(join(root, registry, "button/registry.meta.json"))
  const status = enrolledProject(projectInventory(root))
  expect(status.enrollmentGaps).toContain("Project family absent from public registry: button")
  expect(() => assertProjectEnrollment(status)).toThrow(
    "Project family absent from public registry: button",
  )
})
