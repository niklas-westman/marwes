import {
  type SemanticAttributeDefinition,
  canonicalSemanticAttributeNames,
  semanticFamilies,
  semanticIntents,
  semanticLayers,
  semanticOrientations,
  semanticOutcomes,
} from "./semantic-types"

export const canonicalSemanticAttributes: Record<string, SemanticAttributeDefinition> = {
  "data-component": {
    name: "data-component",
    description: "Stable family identity for the rendered UI surface.",
    applicableFamilies: semanticFamilies,
    applicableLayers: semanticLayers,
    requiredWhenApplicable: true,
  },
  "data-layer": {
    name: "data-layer",
    description: "Architectural UI layer for the rendered API surface.",
    allowedValues: semanticLayers,
    applicableFamilies: semanticFamilies,
    applicableLayers: semanticLayers,
  },
  "data-variant": {
    name: "data-variant",
    description: "Visual or structural variant for a component family.",
    applicableFamilies: semanticFamilies,
    applicableLayers: semanticLayers,
  },
  "data-state": {
    name: "data-state",
    description: "Stable UI state abstraction such as open, closed, or loading.",
    applicableFamilies: semanticFamilies,
    applicableLayers: semanticLayers,
  },
  "data-action": {
    name: "data-action",
    description: "Canonical user-action intent for actionable controls.",
    applicableFamilies: ["button"],
    applicableLayers: semanticLayers,
  },
  "data-purpose": {
    name: "data-purpose",
    description: "Semantic usage intent above raw family and variant.",
    applicableFamilies: semanticFamilies,
    applicableLayers: ["purpose"],
    requiredWhenApplicable: true,
  },
  "data-context": {
    name: "data-context",
    description: "Narrow contextual qualifier for a semantic purpose.",
    applicableFamilies: semanticFamilies,
    applicableLayers: semanticLayers,
  },
  "data-intent": {
    name: "data-intent",
    description: "Message or workflow intent such as success, error, or destructive.",
    allowedValues: semanticIntents,
    applicableFamilies: ["toast", "dialog"],
    applicableLayers: semanticLayers,
  },
  "data-outcome": {
    name: "data-outcome",
    description: "Expected result polarity for a purpose surface.",
    allowedValues: semanticOutcomes,
    applicableFamilies: ["button"],
    applicableLayers: semanticLayers,
  },
  "data-destructive": {
    name: "data-destructive",
    description: "Boolean marker for destructive actions or flows.",
    allowedValues: ["true", "false"],
    applicableFamilies: ["button", "dialog", "context-menu"],
    applicableLayers: semanticLayers,
  },
  "data-confirmation-required": {
    name: "data-confirmation-required",
    description: "Boolean marker for actions that require explicit confirmation.",
    allowedValues: ["true", "false"],
    applicableFamilies: ["button", "dialog"],
    applicableLayers: semanticLayers,
  },
  "data-size": {
    name: "data-size",
    description: "Stable size token for a component family.",
    applicableFamilies: semanticFamilies,
    applicableLayers: semanticLayers,
  },
  "data-orientation": {
    name: "data-orientation",
    description: "Stable orientation token for directional families.",
    allowedValues: semanticOrientations,
    applicableFamilies: semanticFamilies,
    applicableLayers: semanticLayers,
  },
}

export const canonicalSemanticAttributeRegistry = canonicalSemanticAttributeNames.map(
  (attributeName) => canonicalSemanticAttributes[attributeName],
)
