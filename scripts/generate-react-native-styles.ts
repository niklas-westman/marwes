import { execFileSync } from "node:child_process"
/**
 * CSS-to-RN style compiler for Marwes.
 *
 * Reads firstEdition CSS files + native style manifests, produces typed
 * React Native style objects that resolve theme tokens at runtime.
 *
 * Supports:
 * - Theme token resolution: var(--mw-*)
 * - var() with fallback values: var(--mw-token, #hex)
 * - Component-local CSS variables: --mw-badge-surface etc.
 * - color-mix(in srgb, ...) → alpha blend
 * - box-shadow: inset 0 0 0 Npx <color> → borderWidth + borderColor
 * - Logical properties: inline-size, block-size, padding-block, padding-inline
 * - Simple calc() evaluation with static operands
 * - Padding/border/margin shorthands
 * - Slot splitting: ViewStyle vs TextStyle
 *
 * Usage:
 *   pnpm native-styles:generate
 *   pnpm native-styles:check
 */
import * as fs from "node:fs"
import * as path from "node:path"
import postcss, { type Declaration, type Rule } from "postcss"

// ─── Types ────────────────────────────────────────────────────────────────────

type SlotType = "view" | "text"

interface NativeManifest {
  version: number
  preset: string
  family: string
  sourceCss: string
  slots: Record<string, { type: SlotType; selectors: string[] }>
  variants?: Record<string, string[]>
  sizes?: Record<string, string[]>
  states?: Record<string, { selectors: string[]; sourceState: string }>
  ignoredDeclarations?: Record<string, string>
}

interface NativeRuleIR {
  id: string
  slot: string
  layer: "base" | "size" | "variant" | "state" | "mode" | "mode+variant" | "mode+state"
  mode?: "light" | "dark"
  variant?: string
  size?: string
  state?: string
  selectorConditions?: string[]
  declarations: NativeDeclarationIR[]
  source: { selector: string }
}

type NativeDeclarationIR =
  | { kind: "static"; prop: string; value: string | number }
  | { kind: "token"; prop: string; token: string }
  | { kind: "tokenWithFallback"; prop: string; token: string; fallback: string | number }
  | { kind: "colorMix"; prop: string; baseToken: string; amount: number }

interface NativeDesignIR {
  version: 1
  preset: string
  families: Record<
    string,
    {
      sourceCss: string
      slots: Record<string, { type: SlotType }>
      rules: NativeRuleIR[]
      diagnostics: DiagnosticEntry[]
    }
  >
}

interface DiagnosticEntry {
  code: string
  severity: "error" | "warning" | "info"
  message: string
  selector?: string
  declaration?: string
}

// ─── CSS prop → RN prop mapping ───────────────────────────────────────────────

const CSS_TO_RN_PROP: Record<string, string> = {
  background: "backgroundColor",
  "background-color": "backgroundColor",
  "background-clip": "_ignore",
  color: "color",
  "border-color": "borderColor",
  "border-radius": "borderRadius",
  "border-width": "borderWidth",
  "border-style": "borderStyle",
  border: "_border_shorthand",
  "box-shadow": "_box_shadow",
  "box-sizing": "_ignore",
  opacity: "opacity",
  height: "height",
  width: "width",
  "min-height": "minHeight",
  "min-width": "minWidth",
  "max-height": "maxHeight",
  "max-width": "maxWidth",
  padding: "_padding_shorthand",
  "padding-top": "paddingTop",
  "padding-right": "paddingRight",
  "padding-bottom": "paddingBottom",
  "padding-left": "paddingLeft",
  "padding-block": "_padding_block",
  "padding-inline": "_padding_inline",
  "padding-block-start": "paddingTop",
  "padding-block-end": "paddingBottom",
  "padding-inline-start": "paddingLeft",
  "padding-inline-end": "paddingRight",
  margin: "_margin_shorthand",
  "margin-top": "marginTop",
  "margin-right": "marginRight",
  "margin-bottom": "marginBottom",
  "margin-left": "marginLeft",
  gap: "gap",
  display: "_display",
  "align-items": "alignItems",
  "justify-content": "justifyContent",
  "flex-direction": "flexDirection",
  flex: "_flex",
  "flex-shrink": "flexShrink",
  "flex-grow": "flexGrow",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "text-align": "textAlign",
  "text-decoration-line": "textDecorationLine",
  "z-index": "zIndex",
  position: "position",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  overflow: "overflow",
  // Logical properties
  "inline-size": "width",
  "block-size": "height",
  "min-inline-size": "minWidth",
  "min-block-size": "minHeight",
}

// Props that belong exclusively to TextStyle (not valid in ViewStyle)
const TEXT_ONLY_PROPS = new Set([
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "letterSpacing",
  "textAlign",
  "textDecorationLine",
])

// Props that should NOT be emitted into a text slot when splitting.
// These are layout/box-model/visual props that belong on the container View,
// not on a child Text element.
const VIEW_ONLY_PROPS = new Set([
  "alignItems",
  "justifyContent",
  "flexDirection",
  "gap",
  "overflow",
  "backgroundColor",
  "borderColor",
  "borderWidth",
  "borderStyle",
  "borderRadius",
  "height",
  "width",
  "minHeight",
  "minWidth",
  "maxHeight",
  "maxWidth",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "opacity",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "zIndex",
  "flex",
  "flexGrow",
  "flexShrink",
])

// ─── Component-local CSS variable resolution ─────────────────────────────────

type CssVarScope = Map<string, string>

/**
 * First pass: collect all CSS variable declarations per selector group.
 * Returns a map of: selector → { varName → rawValue }
 */
function collectLocalCssVars(root: postcss.Root): Map<string, CssVarScope> {
  const scopes = new Map<string, CssVarScope>()

  root.walkRules((rule: Rule) => {
    for (const selector of rule.selectors || [rule.selector]) {
      rule.walkDecls((decl: Declaration) => {
        if (decl.prop.startsWith("--")) {
          let scope = scopes.get(selector)
          if (!scope) {
            scope = new Map()
            scopes.set(selector, scope)
          }
          scope.set(decl.prop, decl.value)
        }
      })
    }
  })

  return scopes
}

/**
 * Resolve a CSS value that may reference local variables.
 * Recursively resolves var(--local-var) references using the given scopes.
 */
function resolveLocalVars(
  value: string,
  currentSelector: string,
  varScopes: Map<string, CssVarScope>,
  manifest: NativeManifest,
  depth = 0,
): string {
  if (depth > 10) return value // prevent infinite recursion

  // Replace all var(--name) and var(--name, fallback) references
  return value.replace(/var\((--[^,)]+?)(?:\s*,\s*([^)]*))?\)/g, (match, varName, fallback) => {
    // Check if it's a theme token (--mw- prefix but NOT a component-local one)
    const isThemeToken =
      varName.startsWith("--mw-") && !isComponentLocalVar(varName, manifest.family)
    if (isThemeToken) {
      // Keep theme token references as-is for runtime resolution
      return match
    }

    // Try to resolve from current selector scope, then base scope
    let resolved: string | undefined

    // Check current selector scope
    const currentScope = varScopes.get(currentSelector)
    if (currentScope?.has(varName)) {
      resolved = currentScope.get(varName)
    }

    // Check parent variant selectors (for inherited local vars)
    if (!resolved) {
      for (const [sel, scope] of varScopes) {
        if (scope.has(varName) && selectorMatches(currentSelector, sel)) {
          resolved = scope.get(varName)
        }
      }
    }

    // Check base selector scope
    if (!resolved) {
      for (const [sel, scope] of varScopes) {
        if (scope.has(varName) && isBaseSelector(sel, manifest)) {
          resolved = scope.get(varName)
        }
      }
    }

    if (resolved) {
      return resolveLocalVars(resolved, currentSelector, varScopes, manifest, depth + 1)
    }

    // Use fallback if available
    if (fallback !== undefined) {
      return resolveLocalVars(fallback.trim(), currentSelector, varScopes, manifest, depth + 1)
    }

    return match
  })
}

function isComponentLocalVar(varName: string, family: string): boolean {
  // Component-local vars follow patterns like --mw-badge-*, --mw-divider-*
  const familyPrefix = `--mw-${family}-`
  return varName.startsWith(familyPrefix)
}

function selectorMatches(child: string, parent: string): boolean {
  // Simple check: child selector contains parent selector classes
  const parentClasses = parent.match(/\.[a-zA-Z0-9_-]+/g) || []
  return parentClasses.every((cls) => child.includes(cls))
}

function isBaseSelector(selector: string, manifest: NativeManifest): boolean {
  // Base selector = the root slot selector without variant/state modifiers
  for (const slotConfig of Object.values(manifest.slots)) {
    for (const sel of slotConfig.selectors) {
      if (selector.trim() === sel) return true
    }
  }
  return false
}

// ─── Value parsing ────────────────────────────────────────────────────────────

function parseValue(raw: string): Omit<NativeDeclarationIR, "prop"> | null {
  const trimmed = raw.trim()

  // RN does not support 'inherit', 'initial', 'unset'
  if (trimmed === "inherit" || trimmed === "initial" || trimmed === "unset") {
    return null
  }

  // Token reference with fallback: var(--mw-something, #hex)
  const varFallbackMatch = trimmed.match(/^var\((--mw-[^,)]+?)\s*,\s*([^)]+)\)$/)
  if (varFallbackMatch) {
    const token = varFallbackMatch[1]
    const fallbackRaw = varFallbackMatch[2]?.trim()
    if (!token || !fallbackRaw) return null
    // If fallback is inherit/initial/unset, treat as plain token
    if (fallbackRaw === "inherit" || fallbackRaw === "initial" || fallbackRaw === "unset") {
      return { kind: "token", token }
    }
    const fallbackParsed = parseValue(fallbackRaw)
    if (fallbackParsed && fallbackParsed.kind === "static") {
      return {
        kind: "tokenWithFallback",
        token,
        fallback: fallbackParsed.value,
      }
    }
    return { kind: "token", token }
  }

  // Token reference: var(--mw-something)
  const varMatch = trimmed.match(/^var\((--mw-[^,)]+?)\)$/)
  if (varMatch) {
    const token = varMatch[1]
    if (!token) return null
    return { kind: "token", token }
  }

  // color-mix(in srgb, var(--mw-color-*) N%, transparent)
  const colorMixMatch = trimmed.match(
    /^color-mix\(\s*in\s+srgb\s*,\s*var\((--mw-[^)]+)\)\s+(\d+)%\s*,\s*transparent\s*\)$/,
  )
  if (colorMixMatch) {
    const baseToken = colorMixMatch[1]
    const amount = colorMixMatch[2]
    if (!baseToken || !amount) return null
    return {
      kind: "colorMix",
      baseToken,
      amount: Number.parseInt(amount, 10),
    }
  }

  // calc() with static values
  const calcMatch = trimmed.match(/^calc\((.+)\)$/)
  if (calcMatch) {
    const expression = calcMatch[1]
    if (!expression) return null
    const result = evaluateCalc(expression)
    if (result !== null) {
      return { kind: "static", value: result }
    }
    // Can't evaluate — return as string (will likely be a diagnostic)
    return { kind: "static", value: trimmed }
  }

  // px value
  const pxMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)px$/)
  if (pxMatch) {
    const value = pxMatch[1]
    if (!value) return null
    return { kind: "static", value: Number.parseFloat(value) }
  }

  // rem value → convert to px (base 16)
  const remMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)rem$/)
  if (remMatch) {
    const value = remMatch[1]
    if (!value) return null
    return { kind: "static", value: Number.parseFloat(value) * 16 }
  }

  // percentage (keep as string for RN where supported)
  if (/^-?\d+(?:\.\d+)?%$/.test(trimmed)) {
    return { kind: "static", value: trimmed }
  }

  // plain number
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    return { kind: "static", value: Number.parseFloat(trimmed) }
  }

  // keyword/color literal
  return { kind: "static", value: trimmed }
}

/**
 * Evaluate simple calc() expressions with static numeric values.
 * Supports: +, -, *, /  and nested parens with px/rem values.
 */
function evaluateCalc(expr: string): number | null {
  // Replace px/rem units with plain numbers
  const normalized = expr
    .replace(/(-?\d+(?:\.\d+)?)px/g, "$1")
    .replace(/(-?\d+(?:\.\d+)?)rem/g, (_, n) => String(Number.parseFloat(n) * 16))
    .trim()

  // Only allow digits, operators, parens, dots, spaces, minus
  if (!/^[\d\s+\-*/().]+$/.test(normalized)) {
    return null
  }

  try {
    const result = new Function(`return (${normalized})`)() as number
    if (typeof result === "number" && Number.isFinite(result)) {
      return Math.round(result * 100) / 100 // round to 2 decimal places
    }
  } catch {
    // can't evaluate
  }
  return null
}

// ─── Selector analysis ────────────────────────────────────────────────────────

interface SelectorAnalysis {
  layer: NativeRuleIR["layer"]
  slot: string
  mode?: "light" | "dark"
  variant?: string
  size?: string
  state?: string
  selectorConditions?: string[]
}

function analyzeSelector(selector: string, manifest: NativeManifest): SelectorAnalysis | null {
  const isDarkMode = selector.includes(".mw-theme--dark")
  const cleanSelector = selector.replace(/\.mw-theme--dark\s+/g, "").trim()

  // Check for state pseudo-classes
  let detectedState: string | undefined
  let selectorWithoutState = cleanSelector
  if (manifest.states) {
    for (const [stateName, stateConfig] of Object.entries(manifest.states)) {
      for (const pseudo of stateConfig.selectors) {
        if (cleanSelector.includes(pseudo)) {
          detectedState = stateName
          selectorWithoutState = cleanSelector
            .replace(new RegExp(pseudo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "")
            .trim()
          break
        }
      }
      if (detectedState) break
    }
  }

  // Remove :not(:disabled) — guard, not a state
  selectorWithoutState = selectorWithoutState.replace(/:not\(:disabled\)/g, "").trim()

  // Determine slot (default to root)
  let slot = "root"
  for (const [slotName, slotConfig] of Object.entries(manifest.slots)) {
    if (slotName === "root") continue
    for (const sel of slotConfig.selectors) {
      if (selectorWithoutState.includes(sel)) {
        slot = slotName
      }
    }
  }

  // Check for variant match
  let detectedVariant: string | undefined
  if (manifest.variants) {
    for (const [variantName, variantSelectors] of Object.entries(manifest.variants)) {
      for (const vs of variantSelectors) {
        if (selectorWithoutState.includes(vs)) {
          detectedVariant = variantName
        }
      }
    }
  }

  // Check for size match
  let detectedSize: string | undefined
  if (manifest.sizes) {
    for (const [sizeName, sizeSelectors] of Object.entries(manifest.sizes)) {
      for (const ss of sizeSelectors) {
        if (selectorWithoutState.includes(ss)) {
          detectedSize = sizeName
        }
      }
    }
  }

  // Check for data-attribute conditions
  const dataAttrMatches = selectorWithoutState.match(/\[data-([a-z-]+)="([^"]+)"\]/g)
  const selectorConditions = dataAttrMatches ? dataAttrMatches.map((m) => m) : undefined

  // data-action="navigate" specific selector — skip for RN
  if (selectorWithoutState.includes('[data-action="navigate"]')) {
    return null
  }

  // Determine layer
  let layer: NativeRuleIR["layer"] = "base"
  if (isDarkMode && detectedVariant) layer = "mode+variant"
  else if (isDarkMode && detectedState) layer = "mode+state"
  else if (isDarkMode) layer = "mode"
  else if (detectedState) layer = "state"
  else if (detectedVariant) layer = "variant"
  else if (detectedSize) layer = "size"

  return {
    layer,
    slot,
    mode: isDarkMode ? "dark" : undefined,
    variant: detectedVariant,
    size: detectedSize,
    state: detectedState,
    selectorConditions,
  }
}

// ─── Shorthand parsers ────────────────────────────────────────────────────────

function parseBorderShorthand(value: string): NativeDeclarationIR[] | null {
  // "none" or "0"
  if (value === "none" || value === "0") {
    return [
      { kind: "static", prop: "borderWidth", value: 0 },
      { kind: "static", prop: "borderColor", value: "transparent" },
    ]
  }

  // "1px solid transparent"
  const match = value.match(/^(\d+)px\s+(solid|dashed|dotted)\s+(.+)$/)
  if (!match) return null

  const colorParsed = parseValue(match[3])
  return [
    { kind: "static", prop: "borderWidth", value: Number.parseInt(match[1], 10) },
    { kind: "static", prop: "borderStyle", value: match[2] },
    { ...colorParsed, prop: "borderColor" } as NativeDeclarationIR,
  ]
}

function parseBoxShadowInset(value: string): NativeDeclarationIR[] | null {
  // "inset 0 0 0 1px var(--mw-badge-border)" or "inset 0 0 0 1px #color"
  const match = value.match(/^inset\s+0\s+0\s+0\s+(\d+)px\s+(.+)$/)
  if (!match) return null

  const width = Number.parseInt(match[1], 10)
  const colorParsed = parseValue(match[2])
  return [
    { kind: "static", prop: "borderWidth", value: width },
    { ...colorParsed, prop: "borderColor" } as NativeDeclarationIR,
  ]
}

function parsePaddingShorthand(value: string): NativeDeclarationIR[] {
  const parts = value.split(/\s+/).map((p) => parseValue(p))

  if (parts.length === 1) {
    const v = parts[0]
    return [
      { ...v, prop: "paddingTop" } as NativeDeclarationIR,
      { ...v, prop: "paddingRight" } as NativeDeclarationIR,
      { ...v, prop: "paddingBottom" } as NativeDeclarationIR,
      { ...v, prop: "paddingLeft" } as NativeDeclarationIR,
    ]
  }
  if (parts.length === 2) {
    const [vert, horiz] = parts
    return [
      { ...vert, prop: "paddingTop" } as NativeDeclarationIR,
      { ...horiz, prop: "paddingRight" } as NativeDeclarationIR,
      { ...vert, prop: "paddingBottom" } as NativeDeclarationIR,
      { ...horiz, prop: "paddingLeft" } as NativeDeclarationIR,
    ]
  }
  if (parts.length === 4) {
    const [t, r, b, l] = parts
    return [
      { ...t, prop: "paddingTop" } as NativeDeclarationIR,
      { ...r, prop: "paddingRight" } as NativeDeclarationIR,
      { ...b, prop: "paddingBottom" } as NativeDeclarationIR,
      { ...l, prop: "paddingLeft" } as NativeDeclarationIR,
    ]
  }
  return []
}

function parsePaddingBlock(value: string): NativeDeclarationIR[] {
  const parts = value.split(/\s+/).map((p) => parseValue(p))
  if (parts.length === 1) {
    return [
      { ...parts[0], prop: "paddingTop" } as NativeDeclarationIR,
      { ...parts[0], prop: "paddingBottom" } as NativeDeclarationIR,
    ]
  }
  if (parts.length === 2) {
    return [
      { ...parts[0], prop: "paddingTop" } as NativeDeclarationIR,
      { ...parts[1], prop: "paddingBottom" } as NativeDeclarationIR,
    ]
  }
  return []
}

function parsePaddingInline(value: string): NativeDeclarationIR[] {
  const parts = value.split(/\s+/).map((p) => parseValue(p))
  if (parts.length === 1) {
    return [
      { ...parts[0], prop: "paddingLeft" } as NativeDeclarationIR,
      { ...parts[0], prop: "paddingRight" } as NativeDeclarationIR,
    ]
  }
  if (parts.length === 2) {
    return [
      { ...parts[0], prop: "paddingLeft" } as NativeDeclarationIR,
      { ...parts[1], prop: "paddingRight" } as NativeDeclarationIR,
    ]
  }
  return []
}

// ─── Main compiler ────────────────────────────────────────────────────────────

function compileFamily(
  cssSource: string,
  manifest: NativeManifest,
): NativeDesignIR["families"][string] {
  const root = postcss.parse(cssSource)
  const rules: NativeRuleIR[] = []
  const diagnostics: DiagnosticEntry[] = []
  let ruleIndex = 0

  // Collect component-local CSS variables
  const varScopes = collectLocalCssVars(root)

  root.walkRules((rule: Rule) => {
    const selectors = rule.selectors || [rule.selector]

    for (const selector of selectors) {
      const analysis = analyzeSelector(selector, manifest)

      if (!analysis) {
        diagnostics.push({
          code: "RN001_SKIPPED_SELECTOR",
          severity: "info",
          message: `Skipped selector: ${selector}`,
          selector,
        })
        continue
      }

      const declarations: NativeDeclarationIR[] = []

      rule.walkDecls((decl: Declaration) => {
        const cssProp = decl.prop
        let cssValue = decl.value

        // Skip component-local CSS variable declarations (they're collected separately)
        if (cssProp.startsWith("--")) {
          return
        }

        // Check ignored declarations
        if (manifest.ignoredDeclarations?.[cssProp]) {
          diagnostics.push({
            code: "RN_IGNORED",
            severity: "info",
            message: `Ignored ${cssProp}: ${manifest.ignoredDeclarations[cssProp]}`,
            selector,
            declaration: `${cssProp}: ${cssValue}`,
          })
          return
        }

        // Resolve component-local variables in the value
        cssValue = resolveLocalVars(cssValue, selector, varScopes, manifest)

        const rnProp = CSS_TO_RN_PROP[cssProp]

        if (!rnProp) {
          diagnostics.push({
            code: "RN003_UNSUPPORTED_DECLARATION",
            severity: "warning",
            message: `Unsupported CSS property: ${cssProp}`,
            selector,
            declaration: `${cssProp}: ${cssValue}`,
          })
          return
        }

        // Skip explicitly ignored props
        if (rnProp === "_ignore") return

        // Handle shorthands
        if (rnProp === "_border_shorthand") {
          const parsed = parseBorderShorthand(cssValue)
          if (parsed) declarations.push(...parsed)
          return
        }

        if (rnProp === "_box_shadow") {
          const parsed = parseBoxShadowInset(cssValue)
          if (parsed) {
            declarations.push(...parsed)
          } else {
            diagnostics.push({
              code: "RN003_UNSUPPORTED_DECLARATION",
              severity: "warning",
              message: `Unsupported box-shadow value (only inset borders supported): ${cssValue}`,
              selector,
              declaration: `${cssProp}: ${cssValue}`,
            })
          }
          return
        }

        if (rnProp === "_padding_shorthand") {
          declarations.push(...parsePaddingShorthand(cssValue))
          return
        }

        if (rnProp === "_padding_block") {
          declarations.push(...parsePaddingBlock(cssValue))
          return
        }

        if (rnProp === "_padding_inline") {
          declarations.push(...parsePaddingInline(cssValue))
          return
        }

        if (rnProp === "_margin_shorthand") {
          // Reuse padding shorthand logic but with margin props
          const parts = cssValue.split(/\s+/).map((p) => parseValue(p))
          if (parts.length === 1) {
            declarations.push(
              { ...parts[0], prop: "marginTop" } as NativeDeclarationIR,
              { ...parts[0], prop: "marginRight" } as NativeDeclarationIR,
              { ...parts[0], prop: "marginBottom" } as NativeDeclarationIR,
              { ...parts[0], prop: "marginLeft" } as NativeDeclarationIR,
            )
          }
          return
        }

        if (rnProp === "_display") {
          if (cssValue === "inline-flex" || cssValue === "flex") {
            // CSS flex/inline-flex defaults to row; RN defaults to column.
            // Emit flexDirection: row to match web behavior.
            declarations.push({ kind: "static", prop: "flexDirection", value: "row" })
          } else if (cssValue === "block" || cssValue === "inline-block") {
            // block/inline-block: column layout (RN default), no-op
          } else {
            diagnostics.push({
              code: "RN003_UNSUPPORTED_DECLARATION",
              severity: "warning",
              message: `Unsupported display value: ${cssValue}`,
              selector,
              declaration: `${cssProp}: ${cssValue}`,
            })
          }
          return
        }

        if (rnProp === "_flex") {
          if (cssValue === "none") {
            declarations.push({ kind: "static", prop: "flexGrow", value: 0 })
            declarations.push({ kind: "static", prop: "flexShrink", value: 0 })
          } else {
            const parsed = parseValue(cssValue)
            declarations.push({ ...parsed, prop: "flex" } as NativeDeclarationIR)
          }
          return
        }

        const parsed = parseValue(cssValue)
        if (parsed) {
          declarations.push({ ...parsed, prop: rnProp } as NativeDeclarationIR)
        }
      })

      if (declarations.length > 0) {
        emitRules(declarations, selector, analysis, manifest, rules, ruleIndex)
        ruleIndex += 2 // reserve IDs for potential slot split
      }
    }
  })

  // ── Second pass: CSS-variable-only selectors ─────────────────────────────
  // Some selectors (like Badge variants) only set local CSS variables.
  // We need to re-resolve base declarations using each variant's variable scope
  // and emit override rules.

  // Collect base declarations (raw CSS, pre-resolution) for re-resolution
  const baseDeclarations: Array<{ cssProp: string; rawValue: string }> = []
  root.walkRules((rule: Rule) => {
    const selectors = rule.selectors || [rule.selector]
    for (const selector of selectors) {
      // Only process base selectors
      if (!isBaseSelector(selector.trim(), manifest)) continue
      rule.walkDecls((decl: Declaration) => {
        if (!decl.prop.startsWith("--") && !manifest.ignoredDeclarations?.[decl.prop]) {
          baseDeclarations.push({ cssProp: decl.prop, rawValue: decl.value })
        }
      })
    }
  })

  // For each variant/mode selector that ONLY contains CSS var declarations,
  // re-resolve base declarations with that scope's variables
  root.walkRules((rule: Rule) => {
    const selectors = rule.selectors || [rule.selector]

    for (const selector of selectors) {
      const analysis = analyzeSelector(selector, manifest)
      if (!analysis) continue
      if (analysis.layer === "base") continue // skip base selectors

      // Check if this rule only contains CSS variable declarations
      let hasOnlyVarDecls = true
      let hasAnyVarDecls = false
      rule.walkDecls((decl: Declaration) => {
        if (decl.prop.startsWith("--")) {
          hasAnyVarDecls = true
        } else {
          hasOnlyVarDecls = false
        }
      })

      if (!hasAnyVarDecls || !hasOnlyVarDecls) continue

      // This selector only sets CSS variables — re-resolve base declarations
      const overrideDecls: NativeDeclarationIR[] = []

      for (const base of baseDeclarations) {
        const resolvedValue = resolveLocalVars(base.rawValue, selector, varScopes, manifest)

        // Only emit if the resolved value differs from base resolution
        const baseResolvedValue = resolveLocalVars(
          base.rawValue,
          // Use a base selector for comparison
          Object.values(manifest.slots)[0]?.selectors[0] ?? selector,
          varScopes,
          manifest,
        )

        if (resolvedValue === baseResolvedValue) continue

        const rnProp = CSS_TO_RN_PROP[base.cssProp]
        if (!rnProp || rnProp.startsWith("_")) {
          // Handle box-shadow specially
          if (rnProp === "_box_shadow") {
            const parsed = parseBoxShadowInset(resolvedValue)
            if (parsed) overrideDecls.push(...parsed)
          } else if (rnProp === "_border_shorthand") {
            const parsed = parseBorderShorthand(resolvedValue)
            if (parsed) overrideDecls.push(...parsed)
          }
          continue
        }

        const parsed = parseValue(resolvedValue)
        if (parsed) {
          overrideDecls.push({ ...parsed, prop: rnProp } as NativeDeclarationIR)
        }
      }

      if (overrideDecls.length > 0) {
        emitRules(overrideDecls, selector, analysis, manifest, rules, ruleIndex)
        ruleIndex += 2
      }
    }
  })

  return {
    sourceCss: manifest.sourceCss,
    slots: Object.fromEntries(
      Object.entries(manifest.slots).map(([k, v]) => [k, { type: v.type }]),
    ),
    rules,
    diagnostics,
  }
}

function emitRules(
  declarations: NativeDeclarationIR[],
  selector: string,
  analysis: SelectorAnalysis,
  manifest: NativeManifest,
  rules: NativeRuleIR[],
  ruleIndex: number,
): void {
  // Find all slots matching this selector
  const matchingSlots: { name: string; type: SlotType }[] = []
  const selectorBase = selector
    .replace(/\.mw-theme--dark\s+/g, "")
    .replace(/:(?:disabled|active|focus-visible|hover)/g, "")
    .replace(/:not\(:disabled\)/g, "")
    .trim()

  for (const [slotName, slotConfig] of Object.entries(manifest.slots)) {
    for (const sel of slotConfig.selectors) {
      if (selectorBase.includes(sel)) {
        matchingSlots.push({ name: slotName, type: slotConfig.type })
      }
    }
  }

  const hasViewSlot = matchingSlots.some((s) => s.type === "view")
  const hasTextSlot = matchingSlots.some((s) => s.type === "text")

  const makeRule = (
    slot: string,
    decls: NativeDeclarationIR[],
    idSuffix: number,
  ): NativeRuleIR => ({
    id: `rule.${manifest.family}.${ruleIndex + idSuffix}`,
    slot,
    layer: analysis.layer,
    mode: analysis.mode,
    variant: analysis.variant,
    size: analysis.size,
    state: analysis.state,
    selectorConditions: analysis.selectorConditions,
    declarations: decls,
    source: { selector },
  })

  if (hasViewSlot && hasTextSlot) {
    const viewDecls = declarations.filter((d) => !TEXT_ONLY_PROPS.has(d.prop))
    const textDecls = declarations.filter((d) => !VIEW_ONLY_PROPS.has(d.prop))
    const viewSlot = matchingSlots.find((s) => s.type === "view")?.name
    const textSlot = matchingSlots.find((s) => s.type === "text")?.name
    if (!viewSlot || !textSlot) return

    if (viewDecls.length > 0) rules.push(makeRule(viewSlot, viewDecls, 0))
    if (textDecls.length > 0) rules.push(makeRule(textSlot, textDecls, 1))
  } else {
    rules.push(makeRule(analysis.slot, declarations, 0))
  }
}

// ─── Code generation ──────────────────────────────────────────────────────────

function generateTypeScript(ir: NativeDesignIR): string {
  const lines: string[] = []

  lines.push("/**")
  lines.push(" * AUTO-GENERATED — do not edit manually.")
  lines.push(" * Generated by scripts/generate-react-native-styles.ts")
  lines.push(" * Source: firstEdition preset CSS + native style manifests")
  lines.push(" */")
  lines.push("")
  lines.push(`import type { ResolvedTheme } from "@marwes-ui/core"`)
  lines.push(`import { DENSITY_SCALES } from "@marwes-ui/core"`)
  lines.push(`import type { ViewStyle, TextStyle } from "react-native"`)
  lines.push("")
  lines.push("// ─── Token resolver ───────────────────────────────────────────────────────────")
  lines.push("")
  lines.push("function resolveToken(token: string, theme: ResolvedTheme): string | number {")
  lines.push("  const t = theme")
  lines.push("  const density = DENSITY_SCALES[t.ui.density]")
  lines.push("  const tokenMap: Record<string, string | number> = {")
  lines.push(`    "--mw-color-primary-base": t.color.primary.base,`)
  lines.push(`    "--mw-color-primary-hover": t.color.primary.hover,`)
  lines.push(`    "--mw-color-primary-pressed": t.color.primary.pressed,`)
  lines.push(`    "--mw-color-primary-disabled": t.color.primary.disabled,`)
  lines.push(`    "--mw-color-primary-label": t.color.primary.label,`)
  lines.push(`    "--mw-color-primary-label-disabled": t.color.primary.labelDisabled,`)
  lines.push(`    "--mw-color-secondary-hover": t.color.secondary.hover,`)
  lines.push(`    "--mw-color-secondary-pressed": t.color.secondary.pressed,`)
  lines.push(`    "--mw-color-secondary-label": t.color.secondary.label,`)
  lines.push(`    "--mw-color-secondary-border": t.color.secondary.border,`)
  lines.push(`    "--mw-color-danger-base": t.color.danger.base,`)
  lines.push(`    "--mw-color-danger-label": t.color.danger.label,`)
  lines.push(`    "--mw-color-success-base": t.color.success.base,`)
  lines.push(`    "--mw-color-success-label": t.color.success.label,`)
  lines.push(`    "--mw-color-text": t.color.text,`)
  lines.push(`    "--mw-color-text-muted": t.color.textMuted,`)
  lines.push(`    "--mw-color-text-subtle": t.color.textSubtle,`)
  lines.push(`    "--mw-color-text-disabled": t.color.textDisabled,`)
  lines.push(`    "--mw-color-focus": t.color.focus,`)
  lines.push(`    "--mw-color-background": t.color.background,`)
  lines.push(`    "--mw-color-surface": t.color.surface,`)
  lines.push(`    "--mw-color-surface-subtle": t.color.surfaceSubtle,`)
  lines.push(`    "--mw-color-surface-elevated": t.color.surfaceElevated,`)
  lines.push(`    "--mw-color-border": t.color.border,`)
  lines.push(`    "--mw-color-border-subtle": t.color.borderSubtle,`)
  lines.push(`    "--mw-color-border-strong": t.color.borderStrong,`)
  lines.push(`    "--mw-ui-radius": t.ui.radius,`)
  lines.push(`    "--mw-font-primary": t.font.primary,`)
  lines.push(`    "--mw-density-height": density.height,`)
  lines.push(`    "--mw-density-padding-x": density.paddingX,`)
  lines.push(`    "--mw-density-padding-y": density.paddingY,`)
  lines.push(`    "--mw-density-gap": density.gap,`)
  lines.push(`    "--mw-density-font-size": density.fontSize,`)
  lines.push(`    "--mw-density-icon-size": density.iconSize,`)
  lines.push(`    "--mw-spacing-sp-0": 0,`)
  lines.push(`    "--mw-spacing-sp-2": 2,`)
  lines.push(`    "--mw-spacing-sp-4": 4,`)
  lines.push(`    "--mw-spacing-sp-8": 8,`)
  lines.push(`    "--mw-spacing-sp-16": 16,`)
  lines.push(`    "--mw-spacing-sp-24": 24,`)
  lines.push(`    "--mw-spacing-sp-32": 32,`)
  // Status tokens
  lines.push(`    "--mw-color-status-info-background": t.color.status.info.background,`)
  lines.push(`    "--mw-color-status-info-text": t.color.status.info.text,`)
  lines.push(`    "--mw-color-status-info-icon": t.color.status.info.icon,`)
  lines.push(`    "--mw-color-status-info-border": t.color.status.info.border,`)
  lines.push(`    "--mw-color-status-success-background": t.color.status.success.background,`)
  lines.push(`    "--mw-color-status-success-text": t.color.status.success.text,`)
  lines.push(`    "--mw-color-status-success-icon": t.color.status.success.icon,`)
  lines.push(`    "--mw-color-status-success-border": t.color.status.success.border,`)
  lines.push(`    "--mw-color-status-warning-background": t.color.status.warning.background,`)
  lines.push(`    "--mw-color-status-warning-text": t.color.status.warning.text,`)
  lines.push(`    "--mw-color-status-warning-icon": t.color.status.warning.icon,`)
  lines.push(`    "--mw-color-status-warning-border": t.color.status.warning.border,`)
  lines.push(`    "--mw-color-status-error-background": t.color.status.error.background,`)
  lines.push(`    "--mw-color-status-error-text": t.color.status.error.text,`)
  lines.push(`    "--mw-color-status-error-icon": t.color.status.error.icon,`)
  lines.push(`    "--mw-color-status-error-border": t.color.status.error.border,`)
  lines.push("  }")
  lines.push("  const resolved = tokenMap[token]")
  lines.push("  if (resolved !== undefined) return resolved")
  lines.push("  console.warn(`[marwes-rn] Unknown theme token: ${token}`)")
  lines.push(`  return "transparent"`)
  lines.push("}")
  lines.push("")
  lines.push(
    "function resolveColorMix(baseToken: string, amount: number, theme: ResolvedTheme): string {",
  )
  lines.push("  const base = String(resolveToken(baseToken, theme))")
  lines.push(`  const alpha = Math.round((amount / 100) * 255).toString(16).padStart(2, "0")`)
  lines.push(`  if (base.startsWith("#") && base.length === 7) return base + alpha`)
  lines.push("  return base")
  lines.push("}")
  lines.push("")
  lines.push("// ─── Declaration resolver ──────────────────────────────────────────────────────")
  lines.push("")
  lines.push("type Declaration =")
  lines.push(`  | { kind: "static"; prop: string; value: string | number }`)
  lines.push(`  | { kind: "token"; prop: string; token: string }`)
  lines.push(
    `  | { kind: "tokenWithFallback"; prop: string; token: string; fallback: string | number }`,
  )
  lines.push(`  | { kind: "colorMix"; prop: string; baseToken: string; amount: number }`)
  lines.push("")
  lines.push("type StyleRule = {")
  lines.push("  id: string")
  lines.push("  slot: string")
  lines.push("  layer: string")
  lines.push(`  mode?: "light" | "dark"`)
  lines.push("  variant?: string")
  lines.push("  size?: string")
  lines.push("  state?: string")
  lines.push("  selectorConditions?: readonly string[]")
  lines.push("  declarations: readonly Declaration[]")
  lines.push("  source?: { selector: string }")
  lines.push("}")
  lines.push("")
  lines.push(
    "function resolveDeclaration(decl: Declaration, theme: ResolvedTheme): [string, string | number] {",
  )
  lines.push("  switch (decl.kind) {")
  lines.push(`    case "static":`)
  lines.push("      return [decl.prop, decl.value]")
  lines.push(`    case "token": {`)
  lines.push("      const v = resolveToken(decl.token, theme)")
  lines.push("      return [decl.prop, v]")
  lines.push("    }")
  lines.push(`    case "tokenWithFallback": {`)
  lines.push("      const v = resolveToken(decl.token, theme)")
  lines.push(`      return [decl.prop, v === "transparent" ? decl.fallback : v]`)
  lines.push("    }")
  lines.push(`    case "colorMix":`)
  lines.push("      return [decl.prop, resolveColorMix(decl.baseToken, decl.amount, theme)]")
  lines.push("  }")
  lines.push("}")
  lines.push("")

  // Generate per-family
  for (const [family, data] of Object.entries(ir.families)) {
    const familyUpper = family.charAt(0).toUpperCase() + family.slice(1)

    lines.push(`// ─── ${familyUpper} ${"─".repeat(Math.max(0, 60 - familyUpper.length))}`)
    lines.push("")
    lines.push(
      `const ${family}Rules: readonly StyleRule[] = ${JSON.stringify(data.rules, null, 2)}`,
    )
    lines.push("")
    lines.push(`export type ${familyUpper}NativeSlots = {`)
    for (const [slotName, slotInfo] of Object.entries(data.slots)) {
      const styleType = slotInfo.type === "text" ? "TextStyle" : "ViewStyle"
      lines.push(`  ${slotName}: ${styleType}`)
    }
    lines.push("}")
    lines.push("")
    lines.push(`export interface ${familyUpper}StyleInput {`)
    lines.push("  variant?: string")
    lines.push("  size?: string")
    lines.push(`  mode?: "light" | "dark"`)
    lines.push("  state?: {")
    lines.push("    pressed?: boolean")
    lines.push("    focused?: boolean")
    lines.push("    disabled?: boolean")
    lines.push("    hovered?: boolean")
    lines.push("  }")
    lines.push("  dataAttributes?: Record<string, string | undefined>")
    lines.push("}")
    lines.push("")
    lines.push(`export function resolve${familyUpper}Styles(`)
    lines.push(`  input: ${familyUpper}StyleInput,`)
    lines.push("  theme: ResolvedTheme,")
    lines.push(`): ${familyUpper}NativeSlots {`)
    lines.push("  const slots: Record<string, Record<string, string | number>> = {}")
    lines.push(`  for (const slotName of ${JSON.stringify(Object.keys(data.slots))}) {`)
    lines.push("    slots[slotName] = {}")
    lines.push("  }")
    lines.push("")
    lines.push(`  for (const rule of ${family}Rules) {`)
    lines.push(`    if (rule.mode && rule.mode !== (input.mode ?? "light")) continue`)
    lines.push("    if (rule.variant && rule.variant !== input.variant) continue")
    lines.push("    if (rule.size && rule.size !== input.size) continue")
    lines.push("    if (rule.state) {")
    lines.push("      const stateActive = input.state?.[rule.state as keyof typeof input.state]")
    lines.push("      if (!stateActive) continue")
    lines.push("    }")
    lines.push("    if (rule.selectorConditions) {")
    lines.push("      const allMatch = rule.selectorConditions.every((cond: string) => {")
    lines.push(`        const m = cond.match(/\\[data-([a-z-]+)="([^"]+)"\\]/)`)
    lines.push("        if (!m) return false")
    lines.push("        const key = m[1]")
    lines.push("        const expected = m[2]")
    lines.push("        if (!key || expected === undefined) return false")
    lines.push("        return input.dataAttributes?.[key] === expected")
    lines.push("      })")
    lines.push("      if (!allMatch) continue")
    lines.push("    }")
    lines.push("    const targetSlot = slots[rule.slot]")
    lines.push("    if (!targetSlot) continue")
    lines.push("    for (const decl of rule.declarations) {")
    lines.push("      const [prop, value] = resolveDeclaration(decl as Declaration, theme)")
    lines.push("      targetSlot[prop] = value")
    lines.push("    }")
    lines.push("  }")
    lines.push("")
    lines.push(`  return slots as unknown as ${familyUpper}NativeSlots`)
    lines.push("}")
    lines.push("")
  }

  return lines.join("\n")
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(import.meta.dirname, "..")
const MANIFESTS_DIR = path.join(ROOT, "packages/react-native/src/styles/manifests/first-edition")
const GENERATED_DIR = path.join(ROOT, "packages/react-native/src/styles/generated")

const isCheck = process.argv.includes("--check")

function formatGeneratedOutput(contents: string, filePath: string): string {
  const biomeBin = path.join(ROOT, "node_modules", ".bin", "biome")
  if (!fs.existsSync(biomeBin)) return contents

  try {
    return execFileSync(biomeBin, ["check", "--write", "--unsafe", "--stdin-file-path", filePath], {
      input: contents,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    })
  } catch {
    return contents
  }
}

const manifestFiles = fs.readdirSync(MANIFESTS_DIR).filter((f) => f.endsWith(".native-style.json"))

const ir: NativeDesignIR = {
  version: 1,
  preset: "firstEdition",
  families: {},
}

for (const mf of manifestFiles) {
  const manifest: NativeManifest = JSON.parse(
    fs.readFileSync(path.join(MANIFESTS_DIR, mf), "utf-8"),
  )
  const cssPath = path.join(ROOT, manifest.sourceCss)
  const cssSource = fs.readFileSync(cssPath, "utf-8")
  const familyIR = compileFamily(cssSource, manifest)
  ir.families[manifest.family] = familyIR

  const errors = familyIR.diagnostics.filter((d) => d.severity === "error")
  const warnings = familyIR.diagnostics.filter((d) => d.severity === "warning")
  const infos = familyIR.diagnostics.filter((d) => d.severity === "info")

  console.log(`\n── ${manifest.family} ──`)
  console.log(`  Rules generated: ${familyIR.rules.length}`)
  console.log(`  Errors: ${errors.length}`)
  console.log(`  Warnings: ${warnings.length}`)
  console.log(`  Info: ${infos.length}`)

  for (const d of errors) console.log(`  ❌ ${d.code}: ${d.message}`)
  for (const d of warnings) console.log(`  ⚠️  ${d.code}: ${d.message}`)
}

const irPath = path.join(GENERATED_DIR, "first-edition.ir.json")
const tsPath = path.join(GENERATED_DIR, "first-edition.ts")
const irJson = formatGeneratedOutput(`${JSON.stringify(ir, null, 2)}\n`, irPath)
const tsOutput = formatGeneratedOutput(`${generateTypeScript(ir)}\n`, tsPath)

if (isCheck) {
  const existingIr = fs.existsSync(irPath) ? fs.readFileSync(irPath, "utf-8") : ""
  const existingTs = fs.existsSync(tsPath) ? fs.readFileSync(tsPath, "utf-8") : ""

  if (existingIr !== irJson || existingTs !== tsOutput) {
    console.error("\n❌ Generated native styles are out of date. Run: pnpm native-styles:generate")
    process.exit(1)
  }
  console.log("\n✅ Generated native styles are up to date.")
  process.exit(0)
}

fs.mkdirSync(GENERATED_DIR, { recursive: true })
fs.writeFileSync(irPath, irJson)
fs.writeFileSync(tsPath, tsOutput)

console.log(`\n✅ Generated to ${path.relative(ROOT, GENERATED_DIR)}/`)
console.log(`   first-edition.ir.json (${(irJson.length / 1024).toFixed(1)} KB)`)
console.log(`   first-edition.ts (${(tsOutput.length / 1024).toFixed(1)} KB)`)
