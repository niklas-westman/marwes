import { familySemanticsRegistry } from "./family-semantics"
import { purposeSemanticsRegistry } from "./purpose-semantics"
import { emptySemanticAttributes } from "./semantic-constants"
import type { SemanticAttributes, SemanticFamily, SemanticPurpose } from "./semantic-types"

export function filterUndefinedSemanticAttributes(
  semanticAttributes: SemanticAttributes,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(semanticAttributes).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  )
}

export function mergeSemanticAttributes(
  baseSemanticAttributes: SemanticAttributes,
  overrideSemanticAttributes: SemanticAttributes = emptySemanticAttributes,
): Record<string, string> {
  return filterUndefinedSemanticAttributes({
    ...baseSemanticAttributes,
    ...overrideSemanticAttributes,
  })
}

export function createFamilySemanticAttributes(
  family: SemanticFamily,
  overrideSemanticAttributes: SemanticAttributes = emptySemanticAttributes,
): Record<string, string> {
  const familySemantics = familySemanticsRegistry[family]

  return mergeSemanticAttributes(familySemantics.baseAttributes, overrideSemanticAttributes)
}

export function createPurposeSemanticAttributes(
  purpose: SemanticPurpose,
  overrideSemanticAttributes: SemanticAttributes = emptySemanticAttributes,
): Record<string, string> {
  const purposeSemantics = Object.values(purposeSemanticsRegistry).find(
    (definition) => definition.purpose === purpose,
  )

  if (!purposeSemantics) {
    throw new Error(`Unknown Marwes semantic purpose: ${purpose}`)
  }

  return mergeSemanticAttributes(purposeSemantics.attributes, overrideSemanticAttributes)
}
