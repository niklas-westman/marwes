import { requireValue } from "../contracts/require-value.js"
import type { FigmaNode } from "../source/snapshot.js"
export type FocusFact = {
  property: string
  sourceProperty: string
  tolerance: number
}
export type ReadFocusValue = (node: FigmaNode, property: string) => unknown
const mappings: Record<string, string> = {
  outlineWidth: "strokeWeight",
  outlineOffset: "paddingLeft",
  outlineColor: "strokes.0.color",
  outlineStyle: "strokes.0.type",
}
const near = (left: number, right: number) => Math.abs(left - right) < 0.0001
function number(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    throw Error("Focus outline requires finite nonnegative source geometry")
  return value
}
function bounds(node: FigmaNode) {
  const rect = node.absoluteBoundingBox as Record<string, unknown> | undefined
  if (
    !rect ||
    ![rect.x, rect.y].every((value) => typeof value === "number" && Number.isFinite(value))
  )
    throw Error("Focus outline requires source bounds")
  const width = number(rect.width)
  const height = number(rect.height)
  if (!width || !height) throw Error("Focus outline requires nonempty source bounds")
  return { x: rect.x as number, y: rect.y as number, width, height }
}
function supportedNode(node: FigmaNode) {
  if (
    node.visible === false ||
    (node.opacity !== undefined && node.opacity !== 1) ||
    (node.effects ?? []).some((effect) => effect.visible !== false) ||
    node.cornerSmoothing ||
    (node.dashPattern !== undefined &&
      (!Array.isArray(node.dashPattern) || node.dashPattern.length !== 0)) ||
    (node.blendMode !== undefined &&
      !["NORMAL", "PASS_THROUGH"].includes(String(node.blendMode))) ||
    (node.rotation !== undefined && (typeof node.rotation !== "number" || !near(node.rotation, 0)))
  )
    throw Error("Unsupported focus outline visibility, effects, opacity, dashes or rotation")
  const matrix = node.relativeTransform
  if (
    !Array.isArray(matrix) ||
    matrix.length !== 2 ||
    !matrix.every((row) => Array.isArray(row) && row.length === 3) ||
    !matrix.flat().every((value) => typeof value === "number" && Number.isFinite(value)) ||
    !near(matrix[0][0], 1) ||
    !near(matrix[0][1], 0) ||
    !near(matrix[1][0], 0) ||
    !near(matrix[1][1], 1)
  )
    throw Error("Focus outline requires unscaled axis-aligned source transforms")
}
function stroke(node: FigmaNode, align: string, read: ReadFocusValue) {
  const paints = node.strokes
  if (
    !Array.isArray(paints) ||
    paints.length !== 1 ||
    paints[0]?.visible === false ||
    paints[0]?.type !== "SOLID" ||
    (paints[0]?.blendMode !== undefined && paints[0].blendMode !== "NORMAL") ||
    (paints[0]?.opacity !== undefined && paints[0].opacity !== 1) ||
    node.strokeAlign !== align
  )
    throw Error(`Focus outline requires one opaque SOLID ${align} stroke`)
  const color = read(node, "strokes.0.color") as Record<string, unknown> | undefined
  if (
    !color ||
    ![color.r, color.g, color.b].every(
      (value) => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1,
    ) ||
    (color.a !== undefined && color.a !== 1)
  )
    throw Error("Focus outline requires opaque supported source color")
  const complex = node.complexStrokeProperties as Record<string, unknown> | undefined
  if (complex && complex.strokeType !== "BASIC")
    throw Error("Focus outline requires a basic source stroke")
  const width = number(read(node, "strokeWeight"))
  for (const property of [
    "strokeTopWeight",
    "strokeRightWeight",
    "strokeBottomWeight",
    "strokeLeftWeight",
  ])
    if (node[property] !== undefined && node[property] !== width)
      throw Error("Focus outline requires uniform source stroke weights")
  if (!width) throw Error("Focus outline requires a visible source stroke")
  return { width, color }
}
function padding(node: FigmaNode, read: ReadFocusValue) {
  const values = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"].map((path) =>
    number(read(node, path)),
  )
  if (!values.every((value) => near(value, requireValue(values[0]))))
    throw Error("Focus outline requires symmetric source padding")
  return requireValue(values[0])
}
function within(parent: FigmaNode, child: FigmaNode, gap: number) {
  const outer = bounds(parent)
  const inner = bounds(child)
  const transform = child.relativeTransform as number[][]
  if (
    !near(inner.x - outer.x, gap) ||
    !near(inner.y - outer.y, gap) ||
    !near(outer.width - inner.width, 2 * gap) ||
    !near(outer.height - inner.height, 2 * gap) ||
    !near(requireValue(requireValue(transform[0])[2]), gap) ||
    !near(requireValue(requireValue(transform[1])[2]), gap)
  )
    throw Error("Focus outline source bounds disagree with symmetric padding")
}
/** A deliberately bounded projection of the documented Standard rule, not arbitrary Figma strokes. */
export function validateFocusOutline(
  root: FigmaNode,
  ring: FigmaNode,
  facts: FocusFact[],
  read: ReadFocusValue,
): void {
  if (
    facts.length !== 4 ||
    new Set(facts.map((fact) => fact.property)).size !== 4 ||
    facts.some((fact) => mappings[fact.property] !== fact.sourceProperty || fact.tolerance !== 0)
  )
    throw Error("Focus outline requires the complete exact outline property mapping")
  validateStandardFocus(root, ring, read)
}

/** Shared source validation; the outline projection remains backward compatible. */
export function validateStandardFocus(
  root: FigmaNode,
  ring: FigmaNode,
  read: ReadFocusValue,
): FigmaNode {
  if (
    root === ring ||
    root.children?.length !== 1 ||
    root.children[0]?.id !== ring.id ||
    ring.children?.length !== 1
  )
    throw Error("Focus outline requires Standard root, Ring and one nested control")
  const control = requireValue(ring.children[0])
  for (const node of [root, ring, control]) supportedNode(node)
  for (const node of [root, ring])
    if ((node.fills ?? []).some((paint) => paint.visible !== false))
      throw Error("Focus outline rule frames cannot paint a background")
  const outside = stroke(ring, "OUTSIDE", read)
  const inside = stroke(root, "INSIDE", read)
  if (
    !near(outside.width, inside.width) ||
    ["r", "g", "b"].some((channel) => outside.color[channel] !== inside.color[channel])
  )
    throw Error("Focus outline Standard and Ring strokes disagree")
  const borderPadding = padding(root, read)
  const gap = padding(ring, read)
  if (!near(borderPadding, outside.width))
    throw Error("Focus outline Standard padding must contain its source stroke")
  within(root, ring, borderPadding)
  within(ring, control, gap)
  return control
}
