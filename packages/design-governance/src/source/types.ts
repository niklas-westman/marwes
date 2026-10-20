export type FigmaColor = { r: number; g: number; b: number; a?: number }
export type FigmaAlias = { type: "VARIABLE_ALIAS"; id: string }
export type VariableValue = string | number | boolean | FigmaColor | FigmaAlias
export type FigmaVariable = {
  id: string
  name?: string
  collectionId?: string
  variableCollectionId?: string
  rawValuesByMode?: Record<string, VariableValue>
  valuesByModeId?: Record<string, VariableValue>
  [key: string]: unknown
}
export type FigmaCollection = {
  id: string
  name?: string
  defaultModeId: string
  modes: { id?: string; modeId?: string; name: string }[]
  [key: string]: unknown
}
export type FigmaPaint = {
  type: string
  color?: FigmaColor
  visible?: boolean
  opacity?: number
  [key: string]: unknown
}
export type FigmaNode = {
  id: string
  type: string
  name: string
  children?: FigmaNode[]
  explicitVariableModes?: Record<string, string>
  componentId?: string
  styles?: Record<string, string>
  boundVariables?: Record<string, FigmaAlias | FigmaAlias[] | Record<string, FigmaAlias>>
  fills?: FigmaPaint[]
  effects?: { visible?: boolean; [key: string]: unknown }[]
  cornerSmoothing?: number
  [key: string]: unknown
}
export type RawFigmaSource = {
  document: FigmaNode
  version: string
  lastModified: string
  components?: Record<string, unknown>
  styles?: Record<string, unknown>
}
export type BrowserState = {
  kind: "hover" | "focus" | "pressed"
  selector: string
  animationStabilization: { disableAnimations?: boolean; waitMs?: number }
}
export type CaptureStabilization = {
  animations: "none" | "settle"
  settleMs?: number
  verify?: boolean
  verifyDelayMs?: number
}
export type LegacyCase = {
  browserState?: BrowserState
  stabilization?: CaptureStabilization
  captureRequirement?: string
  baseline?: string
  caseId: string
  mode: string
  figmaNodeId: string
  source: {
    componentNodeId: string
    instanceNodeId?: string
    componentNodeIds?: string[]
    requiredBoundTokens?: string[]
  }
  portalPath: string
  framing: { rootSelector: string; background: string; align: "center" | "start"; padding: number }
  viewportSize: { width: number; height: number }
}
export type LegacyContract = {
  baselineRoot?: string
  figmaFileKey: string
  structuralContract?: "structural-contract.json"
  cases: LegacyCase[]
}
export type SourceIdentity = {
  fileKey: string
  live: string
  manifest: { fileKey: string; version: string; lastModified: string }
  variables: { fileKey: string; variables: FigmaVariable[]; collections: FigmaCollection[] }
  manifestPath: string
  variablesPath: string
  rawPath: string
}
