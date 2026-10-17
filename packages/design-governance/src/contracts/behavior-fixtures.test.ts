import { describe, expect, it } from "vitest"
import {
  type BehaviorFixtureEnrollment,
  parseBehaviorFixtures,
  validateBehaviorFixtureEnrollment,
} from "./behavior-fixtures.js"

function fixture() {
  const entry = {
    caseId: "button.form-reset",
    mode: "light" as const,
    portalPath: "/reflection/button/form-reset/light",
    viewportSize: { width: 390, height: 220 },
  }
  const contract = { schemaVersion: 1 as const, family: "button", cases: [entry] }
  const enrollment: BehaviorFixtureEnrollment = {
    visualCases: [],
    requirements: [{ caseId: entry.caseId, mode: entry.mode, requiredProofs: ["behavior"] }],
    scenarios: [{ caseId: entry.caseId, mode: entry.mode }],
  }
  return { entry, contract, enrollment }
}

describe("independent behavior-only fixture enrollment", () => {
  it("supports reset behavior without inventing a Figma selection or image", () => {
    const { contract, enrollment } = fixture()
    expect(parseBehaviorFixtures(contract)).toEqual(contract)
    expect(() => validateBehaviorFixtureEnrollment(contract, enrollment)).not.toThrow()
  })
  it.each(["baseline", "source", "expectations", "requiredProofs"])(
    "rejects undeclared %s fields",
    (field) => {
      const { contract, entry } = fixture()
      expect(() =>
        parseBehaviorFixtures({ ...contract, cases: [{ ...entry, [field]: "fake" }] }),
      ).toThrow()
    },
  )
  it("rejects duplicate identities and duplicate route paths", () => {
    const { contract, entry } = fixture()
    expect(() => parseBehaviorFixtures({ ...contract, cases: [entry, entry] })).toThrow("Duplicate")
    expect(() =>
      parseBehaviorFixtures({ ...contract, cases: [entry, { ...entry, caseId: "button.other" }] }),
    ).toThrow("path")
  })
  it.each([
    "/reflection/button/reset/dark",
    "/reflection/dialog/reset/light",
    "/reflection/button/../reset/light",
    "https://example.test/reset",
    "/reflection/button/reset/light?run=old",
  ])("rejects unsafe or mismatched route %s", (portalPath) => {
    const { contract, entry } = fixture()
    expect(() =>
      parseBehaviorFixtures({ ...contract, cases: [{ ...entry, portalPath }] }),
    ).toThrow()
  })
  it("rejects collisions with existing visual selections or routes", () => {
    const { contract, enrollment, entry } = fixture()
    expect(() =>
      validateBehaviorFixtureEnrollment(contract, { ...enrollment, visualCases: [entry] }),
    ).toThrow("overlaps")
    expect(() =>
      validateBehaviorFixtureEnrollment(contract, {
        ...enrollment,
        visualCases: [{ ...entry, caseId: "button.other" }],
      }),
    ).toThrow("overlaps")
  })
  it("rejects orphan fixtures and borrowing a scenario from another mode", () => {
    const { contract, enrollment, entry } = fixture()
    expect(() =>
      validateBehaviorFixtureEnrollment(contract, { ...enrollment, requirements: [] }),
    ).toThrow("inventory")
    expect(() =>
      validateBehaviorFixtureEnrollment(contract, {
        ...enrollment,
        scenarios: [{ ...entry, mode: "dark" }],
      }),
    ).toThrow("scenario")
  })
  it.each([["visual"], ["structural"], ["behavior", "visual"], ["behavior", "structural"]])(
    "cannot downgrade proof requirements %j",
    (...proofs) => {
      const { contract, enrollment, entry } = fixture()
      expect(() =>
        validateBehaviorFixtureEnrollment(contract, {
          ...enrollment,
          requirements: [{ ...entry, requiredProofs: proofs }],
        }),
      ).toThrow("structural or visual")
    },
  )
  it("checks every shared coverage obligation instead of accepting the first match", () => {
    const { contract, enrollment, entry } = fixture()
    expect(() =>
      validateBehaviorFixtureEnrollment(contract, {
        ...enrollment,
        requirements: [...enrollment.requirements, { ...entry, requiredProofs: ["visual"] }],
      }),
    ).toThrow("structural or visual")
  })
})
