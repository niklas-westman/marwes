/**
 * Tests the semantic attribute registry — validates the Wave 1 registry,
 * family-level data-component attributes, purpose-level metadata, and
 * the canonical attribute schema used for documentation generation.
 */
import { describe, expect, it } from "vitest"
import {
  canonicalSemanticAttributes,
  createFamilySemanticAttributes,
  createPurposeSemanticAttributes,
  validateSemanticRegistry,
} from "../../src/semantics"

describe("semantic registry", () => {
  it("validates the Wave 1 semantic registry", () => {
    expect(() => validateSemanticRegistry()).not.toThrow()
  })

  it("creates family semantic attributes for covered families", () => {
    expect(createFamilySemanticAttributes("button", { "data-variant": "primary" })).toEqual({
      "data-component": "button",
      "data-variant": "primary",
    })

    expect(createFamilySemanticAttributes("toast", { "data-variant": "outline" })).toEqual({
      "data-component": "toast",
      "data-variant": "outline",
    })
  })

  it("creates purpose semantic attributes for Wave 1 purpose wrappers", () => {
    expect(createPurposeSemanticAttributes("confirm-dialog")).toEqual({
      "data-purpose": "confirm-dialog",
      "data-intent": "confirm",
    })

    expect(createPurposeSemanticAttributes("status")).toEqual({
      "data-purpose": "status",
    })
  })

  it("exposes the canonical semantic attribute registry", () => {
    expect(canonicalSemanticAttributes["data-component"]).toBeTruthy()
    expect(canonicalSemanticAttributes["data-intent"]?.allowedValues).toContain("success")
  })
})
