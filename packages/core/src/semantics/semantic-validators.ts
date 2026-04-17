import { familySemanticsRegistry } from "./family-semantics"
import { purposeSemanticsRegistry } from "./purpose-semantics"
import { canonicalSemanticAttributes } from "./semantic-attributes"

export function validateSemanticRegistry(): void {
  for (const familySemantics of Object.values(familySemanticsRegistry)) {
    for (const canonicalAttributeName of familySemantics.canonicalAttributes) {
      if (!canonicalSemanticAttributes[canonicalAttributeName]) {
        throw new Error(
          `Family ${familySemantics.family} references unknown canonical attribute ${canonicalAttributeName}`,
        )
      }
    }
  }

  for (const purposeSemantics of Object.values(purposeSemanticsRegistry)) {
    const familySemantics = familySemanticsRegistry[purposeSemantics.family]

    if (!familySemantics) {
      throw new Error(`Purpose ${purposeSemantics.purpose} references unknown family`)
    }

    const familyAllowsPurpose = familySemantics.allowedPurposes.some(
      (allowedPurpose) => allowedPurpose === purposeSemantics.purpose,
    )

    if (!familyAllowsPurpose) {
      throw new Error(
        `Purpose ${purposeSemantics.purpose} is missing from family ${purposeSemantics.family} allowedPurposes`,
      )
    }

    for (const attributeName of Object.keys(purposeSemantics.attributes)) {
      if (!(attributeName in canonicalSemanticAttributes)) {
        throw new Error(
          `Purpose ${purposeSemantics.purpose} references unknown canonical attribute ${attributeName}`,
        )
      }
    }
  }
}
