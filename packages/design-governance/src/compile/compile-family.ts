import { existsSync } from "node:fs"
import { join } from "node:path"
import {
  type FigmaNode,
  type SourceSnapshot,
  familyRoot,
  loadSnapshot,
  readJson,
} from "../source/snapshot.ts"
import type { BrowserState, FigmaAlias, FigmaColor, LegacyContract } from "../source/types.ts"
import { resolveVariable } from "../source/variables.ts"
import { validateFocusOutline } from "./focus-outline.js"
import { projectFocusRingPaint } from "./focus-ring-paint.js"
import { sourceContext } from "./source-context.js"
import { type StructuralContract, validateStructuralContract } from "./structural-contract.ts"

export type Expectation = {
  part: string
  selector: string
  property: string
  expected: string | number | boolean
  tolerance: number
  comparison: "numeric" | "exact"
  source: {
    fileKey: string
    nodeId: string
    propertyPath: string
    aliasChain?: string[]
    modeId?: string
    collectionId?: string
  }
}
export type CompiledCase = {
  browserState?: BrowserState
  captureRequirement?: string
  caseId: string
  mode: string
  portalPath: string
  framing: { rootSelector: string; background: string; align: "center" | "start"; padding: number }
  viewportSize: { width: number; height: number }
  expectations: Expectation[]
  unsupported: string[]
  limitations?: string[]
}
export type UncoveredVariant = {
  source: "figma" | "registry"
  id: string
  name: string
  reason: string
}
export type CompiledFamily = {
  family: string
  cases: CompiledCase[]
  uncovered: string[]
  uncoveredVariants?: UncoveredVariant[]
}
export function flattenNodes(node: FigmaNode): FigmaNode[] {
  return [node, ...(node.children ?? []).flatMap(flattenNodes)]
}
export function color(value: unknown, opacity = 1): string {
  if (!value || typeof value !== "object" || !("r" in value) || !("g" in value) || !("b" in value))
    throw new Error("Unsupported color value")
  const paint = value as FigmaColor
  return `rgba(${Math.round(paint.r * 255)}, ${Math.round(paint.g * 255)}, ${Math.round(paint.b * 255)}, ${Number(((paint.a ?? 1) * opacity).toFixed(5))})`
}

export function compileFamily(repoRoot: string, family: string): CompiledFamily {
  const contract = readJson<LegacyContract>(
    join(repoRoot, familyRoot, family, "reflection-contract.json"),
  )
  const mappingPath = join(repoRoot, familyRoot, family, "structural-contract.json")
  if (contract.structuralContract && contract.structuralContract !== "structural-contract.json")
    throw new Error("Invalid structural contract reference")
  if (contract.structuralContract && !existsSync(mappingPath))
    throw new Error(`Required structural contract missing for ${family}`)
  if (!existsSync(mappingPath))
    return {
      family,
      cases: [],
      uncovered: contract.cases.map(
        (c) => `${c.caseId}/${c.mode}: structural mapping not enrolled`,
      ),
    }
  const mapping = readJson<StructuralContract>(mappingPath)
  validateStructuralContract(mapping)
  if (mapping.family !== family) throw new Error("Structural contract family mismatch")
  const snapshot = loadSnapshot(repoRoot, family)
  const cases: CompiledCase[] = []
  const uncovered: string[] = []
  for (const item of contract.cases) {
    const caseMapping = mapping.cases.find((c) => c.caseId === item.caseId && c.mode === item.mode)
    if (!caseMapping) {
      uncovered.push(`${item.caseId}/${item.mode}: structural mapping not enrolled`)
      continue
    }
    const expectations: Expectation[] = []
    const unsupported: string[] = [
      ...caseMapping.unsupported,
      ...snapshot.missingDependencies.map((id) => `Source dependency missing: ${id}`),
    ]
    const limitations: string[] = [...(caseMapping.limitations ?? [])]
    const selectedNodeId = item.source.instanceNodeId ?? item.source.componentNodeId
    const root = snapshot.nodes[selectedNodeId]
    if (!root) {
      cases.push({
        ...item,
        expectations,
        unsupported: [`Missing selected source node ${selectedNodeId}`],
      })
      continue
    }
    const contexts = new Map<string, ReturnType<typeof sourceContext>>()
    const contextFor = (sourceRoot: FigmaNode) => {
      let context = contexts.get(sourceRoot.id)
      if (!context) {
        context = sourceContext(snapshot, sourceRoot, caseMapping.collectionModes)
        contexts.set(sourceRoot.id, context)
        unsupported.push(...context.unsupported)
      }
      return context
    }
    contextFor(root)
    for (const part of caseMapping.parts) {
      const sourceRootId = part.sourceRootNodeId ?? selectedNodeId
      if (part.sourceRootNodeId && !item.source.componentNodeIds?.includes(sourceRootId)) {
        unsupported.push(
          `Unmapped part ${part.part}: source root ${sourceRootId} is not explicitly allowed`,
        )
        continue
      }
      const sourceRoot = snapshot.nodes[sourceRootId]
      if (!sourceRoot) {
        unsupported.push(`Unmapped part ${part.part}: source root ${sourceRootId} missing`)
        continue
      }
      const context = contextFor(sourceRoot)
      const node = context.index.get(part.nodeId)
      if (!node) {
        unsupported.push(`Unmapped part ${part.part}: source node ${part.nodeId} missing`)
        continue
      }
      const modes = context.effectiveModes.get(node.id) ?? caseMapping.collectionModes
      const readSource = (sourceNode: FigmaNode, path: string) =>
        propertyValue(
          snapshot,
          sourceNode,
          path,
          context.effectiveModes.get(sourceNode.id) ?? caseMapping.collectionModes,
          context.capturedModes.get(sourceNode.id) ?? {},
        )
      if (part.sourceProjection === "focus-outline/v1") {
        try {
          validateFocusOutline(
            sourceRoot,
            node,
            part.properties,
            (sourceNode, path) => readSource(sourceNode, path).value,
          )
        } catch (error) {
          unsupported.push(`${part.part}: ${(error as Error).message}`)
          continue
        }
      }
      let projectedPaint: ReturnType<typeof projectFocusRingPaint> | undefined
      if (part.sourceProjection === "focus-ring-paint/v1") {
        try {
          projectedPaint = projectFocusRingPaint(
            sourceRoot,
            node,
            part.properties,
            (sourceNode, path) => readSource(sourceNode, path).value,
          )
        } catch (error) {
          unsupported.push(`${part.part}: ${(error as Error).message}`)
          continue
        }
      }
      for (const fact of part.properties) {
        try {
          const value = propertyValue(
            snapshot,
            node,
            fact.sourceProperty,
            modes,
            context.capturedModes.get(node.id) ?? {},
          )
          if (value.value === undefined) throw new Error("Source property missing")
          const projected = projectedPaint?.get(fact.property)
          const sourceValue = projected ? projected.value : value.value
          const expected = [
            "backgroundColor",
            "color",
            "stroke",
            "fill",
            "borderColor",
            "insetStrokeColor",
            "outlineColor",
          ].includes(fact.property)
            ? color(sourceValue, value.opacity)
            : part.sourceProjection === "focus-outline/v1" && fact.property === "outlineStyle"
              ? "solid"
              : sourceValue
          if (!["string", "number", "boolean"].includes(typeof expected))
            throw new Error("Unsupported compound source property")
          expectations.push({
            part: part.part,
            selector: part.selector,
            property: fact.property,
            expected: expected as string | number | boolean,
            tolerance: fact.tolerance,
            comparison: typeof expected === "number" ? "numeric" : "exact",
            source: {
              fileKey: snapshot.fileKey,
              nodeId: node.id,
              propertyPath: projected?.propertyPath ?? fact.sourceProperty,
              ...value.provenance,
            },
          })
        } catch (error) {
          unsupported.push(`${part.part}.${fact.property}: ${(error as Error).message}`)
        }
      }
      for (const paint of node.fills ?? [])
        if (paint.visible !== false && paint.type !== "SOLID")
          unsupported.push(`${part.part}: unsupported ${paint.type} paint`)
      if ((node.effects ?? []).some((effect) => effect.visible !== false))
        unsupported.push(`${part.part}: effects require visual proof`)
      if (node.cornerSmoothing)
        unsupported.push(`${part.part}: corner smoothing requires visual proof`)
    }
    cases.push({
      caseId: item.caseId,
      mode: item.mode,
      portalPath: item.portalPath,
      ...(item.browserState ? { browserState: item.browserState } : {}),
      ...(item.captureRequirement ? { captureRequirement: item.captureRequirement } : {}),
      framing: item.framing,
      viewportSize: item.viewportSize,
      expectations,
      unsupported,
      limitations,
    })
  }
  const uncoveredVariants: UncoveredVariant[] = snapshot.variantInventory
    .filter(
      (variant) =>
        !contract.cases.some(
          (item) =>
            item.source.componentNodeId === variant.id ||
            snapshot.nodes[item.source.componentNodeId]?.componentId === variant.id,
        ),
    )
    .map((variant) => ({
      source: "figma",
      id: variant.id,
      name: variant.name,
      reason: "No registered fixture maps this captured source variant",
    }))
  const registryPath = join(repoRoot, "docs/registry/families", family, "registry.generated.json")
  if (existsSync(registryPath)) {
    const registry = readJson<{
      design?: {
        figmaStates?: { baseVariants?: string[]; interactionStates?: string[] }
        nodeReferences?: Record<string, string>
      }
      semantics?: { allowedPurposes?: string[] }
    }>(registryPath)
    const modes = registry.design?.nodeReferences?.baseDarkFrame
      ? ["light", "dark"]
      : [...new Set(contract.cases.map((item) => item.mode))]
    for (const variant of registry.design?.figmaStates?.baseVariants ?? []) {
      for (const state of registry.design?.figmaStates?.interactionStates ?? ["default"]) {
        for (const mode of modes) {
          if (
            !mapping.cases.some(
              (item) =>
                item.publicVariant === variant &&
                (item.state ?? "default") === state &&
                item.mode === mode,
            )
          )
            uncoveredVariants.push({
              source: "registry",
              id: `${variant}/${state}/${mode}`,
              name: `${variant}, ${state}, ${mode}`,
              reason: "Public registry variant/state has no structural case",
            })
        }
      }
    }
    for (const purpose of registry.semantics?.allowedPurposes ?? []) {
      for (const mode of modes) {
        if (
          !contract.cases.some(
            (item) =>
              item.mode === mode &&
              (item.caseId.endsWith(`.${purpose}`) ||
                mapping.cases.some(
                  (entry) =>
                    entry.caseId === item.caseId &&
                    entry.mode === mode &&
                    entry.publicPurpose === purpose,
                )),
          )
        )
          uncoveredVariants.push({
            source: "registry",
            id: `purpose/${purpose}/${mode}`,
            name: `Purpose: ${purpose}, ${mode}`,
            reason: "Public semantic purpose has no registered validation fixture in this mode",
          })
      }
    }
  }
  uncovered.push(...uncoveredVariants.map((item) => `${item.name}: ${item.reason}`))
  return { family, cases, uncovered, uncoveredVariants }
}

function propertyValue(
  snapshot: SourceSnapshot,
  node: FigmaNode,
  path: string,
  modes: Record<string, string>,
  capturedModes: Record<string, string>,
): {
  value: unknown
  opacity?: number | undefined
  provenance?: Pick<Expectation["source"], "aliasChain" | "modeId" | "collectionId">
} {
  if (path === "fills") {
    if (!Array.isArray(node.fills) || node.fills.length !== 0 || node.boundVariables?.fills)
      throw new Error(
        "Transparent surface projection requires an explicitly empty, unbound fill collection",
      )
    return { value: { r: 0, g: 0, b: 0, a: 0 }, opacity: 1 }
  }
  const literal = path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined,
      node,
    )
  // Figma omits the default node opacity (1); preserve that independent paint fact.
  if (path === "opacity" && literal === undefined) return { value: 1 }
  const paintOpacity =
    path === "fills.0.color"
      ? (node.fills?.[0]?.opacity ?? 1)
      : path === "strokes.0.color"
        ? ((node.strokes as { opacity?: number }[] | undefined)?.[0]?.opacity ?? 1)
        : 1
  const bindingName =
    (
      {
        "style.fontSize": "fontSize",
        "style.fontFamily": "fontFamily",
        "style.lineHeightPx": "lineHeight",
        "fills.0.color": "fills",
        "strokes.0.color": "strokes",
        cornerRadius: "rectangleCornerRadii",
      } as Record<string, string>
    )[path] ?? path
  const bindingValue = node.boundVariables?.[bindingName]
  const binding = (
    Array.isArray(bindingValue)
      ? bindingValue[0]
      : bindingValue && typeof bindingValue.id !== "string"
        ? Object.values(bindingValue)[0]
        : bindingValue
  ) as FigmaAlias | undefined
  if (binding?.id) {
    const resolved = resolveVariable(snapshot, binding.id, modes)
    const captured = resolveVariable(snapshot, binding.id, capturedModes)
    const equal = (left: unknown, right: unknown): boolean =>
      typeof left === "number" && typeof right === "number"
        ? Math.abs(left - right) < 0.0001
        : left &&
            right &&
            typeof left === "object" &&
            typeof right === "object" &&
            "r" in left &&
            "r" in right
          ? color(left, paintOpacity) === color(right)
          : left === right
    if (literal !== undefined && !equal(literal, captured.value))
      throw new Error(
        `Captured literal disagrees with captured-mode variable ${binding.id}: ${JSON.stringify(literal)} versus ${JSON.stringify(captured.value)}`,
      )
    // A different selected collection mode (e.g. dark) legitimately differs from captured literal.
    return {
      value: resolved.value,
      opacity: 1,
      provenance: {
        aliasChain: resolved.aliasChain,
        modeId: resolved.modeId,
        collectionId: resolved.collectionId,
      },
    }
  }
  return {
    value: literal,
    opacity: paintOpacity,
  }
}
