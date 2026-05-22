export const canonicalSemanticAttributeNames = [
  "data-component",
  "data-layer",
  "data-variant",
  "data-state",
  "data-action",
  "data-purpose",
  "data-context",
  "data-intent",
  "data-outcome",
  "data-destructive",
  "data-confirmation-required",
  "data-size",
  "data-orientation",
] as const

export type SemanticAttributeName = (typeof canonicalSemanticAttributeNames)[number]

export const semanticLayers = ["atom", "molecule", "purpose"] as const
export type SemanticLayer = (typeof semanticLayers)[number]

export const semanticFamilies = [
  "button",
  "badge",
  "banner",
  "avatar",
  "toast",
  "dialog",
  "drawer",
  "context-menu",
  "breadcrumb",
] as const
export type SemanticFamily = (typeof semanticFamilies)[number]

export const semanticIntents = [
  "success",
  "error",
  "warning",
  "info",
  "confirm",
  "destructive",
] as const
export type SemanticIntent = (typeof semanticIntents)[number]

export const semanticOutcomes = ["positive", "negative", "neutral"] as const
export type SemanticOutcome = (typeof semanticOutcomes)[number]

export const semanticOrientations = ["horizontal", "vertical"] as const
export type SemanticOrientation = (typeof semanticOrientations)[number]

export const buttonPurposes = [
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
] as const

export const badgePurposes = ["status", "priority", "notification"] as const

export const avatarPurposes = ["profile", "presence", "team"] as const

export const toastPurposes = [
  "success-toast",
  "error-toast",
  "warning-toast",
  "info-toast",
] as const

export const bannerPurposes = [
  "info-banner",
  "success-banner",
  "warning-banner",
  "error-banner",
] as const

export const dialogPurposes = ["confirm-dialog", "destructive-dialog", "info-dialog"] as const

export const semanticPurposes = [
  ...buttonPurposes,
  ...badgePurposes,
  ...avatarPurposes,
  ...toastPurposes,
  ...bannerPurposes,
  ...dialogPurposes,
] as const
export type SemanticPurpose = (typeof semanticPurposes)[number]

export type SemanticAttributeValue = string

export interface SemanticAttributeDefinition {
  name: SemanticAttributeName
  description: string
  allowedValues?: readonly string[]
  applicableLayers?: readonly SemanticLayer[]
  applicableFamilies?: readonly SemanticFamily[]
  requiredWhenApplicable?: boolean
}

export interface FamilySemanticDefinition {
  family: SemanticFamily
  defaultLayer: Exclude<SemanticLayer, "purpose">
  baseAttributes: Partial<Record<SemanticAttributeName, SemanticAttributeValue>>
  canonicalAttributes: readonly SemanticAttributeName[]
  allowedPurposes: readonly SemanticPurpose[]
  notes?: string
}

export interface PurposeSemanticDefinition {
  purpose: SemanticPurpose
  family: SemanticFamily
  layer: "purpose"
  attributes: Partial<Record<SemanticAttributeName, SemanticAttributeValue>>
  supportedFrameworks: readonly ["react", "vue"]
  notes?: string
}

export type SemanticAttributes = Partial<Record<SemanticAttributeName, SemanticAttributeValue>>
