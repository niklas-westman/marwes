import { requireValue } from "../contracts/require-value.js"
import type { FigmaNode } from "../source/snapshot.js"
import { type FocusFact, type ReadFocusValue, validateStandardFocus } from "./focus-outline.js"

const mappings: Record<string, string> = {
  borderWidth: "strokeWeight",
  borderColor: "strokes.0.color",
  borderStyle: "strokes.0.type",
  borderRadius: "cornerRadius",
  width: "absoluteBoundingBox.width",
  height: "absoluteBoundingBox.height",
  left: "absoluteBoundingBox.x",
  top: "absoluteBoundingBox.y",
  boxSizing: "strokeAlign",
}
type ProjectedFact = { value: unknown; propertyPath: string }
const near = (left: number, right: number) => Math.abs(left - right) < 0.0001
function finite(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new Error("Focus ring paint requires finite source geometry")
  return value
}
function radius(node: FigmaNode, read: ReadFocusValue): number {
  const value = finite(read(node, "cornerRadius"))
  const width = finite(read(node, "absoluteBoundingBox.width"))
  const height = finite(read(node, "absoluteBoundingBox.height"))
  if (value < 0 || value > Math.min(width, height) / 2)
    throw new Error("Focus ring paint requires unclamped nonnegative source radius")
  if (
    node.rectangleCornerRadii !== undefined &&
    (!Array.isArray(node.rectangleCornerRadii) ||
      node.rectangleCornerRadii.length !== 4 ||
      !node.rectangleCornerRadii.every((corner) => near(finite(corner), finite(node.cornerRadius))))
  )
    throw new Error("Focus ring paint does not support mixed source radii")
  const binding = node.boundVariables?.rectangleCornerRadii
  if (binding && !("id" in binding)) {
    const corners = [
      "RECTANGLE_TOP_LEFT_CORNER_RADIUS",
      "RECTANGLE_TOP_RIGHT_CORNER_RADIUS",
      "RECTANGLE_BOTTOM_LEFT_CORNER_RADIUS",
      "RECTANGLE_BOTTOM_RIGHT_CORNER_RADIUS",
    ]
    if (
      Array.isArray(binding) ||
      Object.keys(binding).length !== corners.length ||
      !corners.every((corner) => corner in binding)
    )
      throw new Error("Focus ring paint requires complete uniform radius bindings")
    const aliases = corners.map((corner) => requireValue(binding[corner]))
    if (aliases.some((alias) => alias.type !== "VARIABLE_ALIAS" || alias.id !== aliases[0]?.id))
      throw new Error("Focus ring paint does not support mixed radius bindings")
  }
  return value
}

/**
 * Paint the actual Standard INSIDE stroke as a border box. Offsets are the Standard
 * root's coordinates minus its uniquely validated nested control's coordinates.
 * Both operands live inside the same hashed source root. These are fixed, named
 * projections, never a contract-supplied expression language or runtime CSS oracle.
 */
export function projectFocusRingPaint(
  root: FigmaNode,
  node: FigmaNode,
  facts: FocusFact[],
  read: ReadFocusValue,
): Map<string, ProjectedFact> {
  if (
    root !== node ||
    facts.length !== 9 ||
    new Set(facts.map((fact) => fact.property)).size !== 9 ||
    facts.some((fact) => mappings[fact.property] !== fact.sourceProperty || fact.tolerance !== 0)
  )
    throw new Error(
      "Focus ring paint requires the Standard root and complete exact nine-property mapping",
    )
  const ring = requireValue(root.children?.[0], "Focus ring paint requires the Standard Ring")
  const control = validateStandardFocus(root, ring, read)
  const outerRadius = radius(root, read)
  const innerRadius = radius(ring, read)
  const strokeWidth = finite(read(ring, "strokeWeight"))
  if (!near(outerRadius, innerRadius + strokeWidth))
    throw new Error("Focus ring paint source corners do not coincide")
  const projected = new Map<string, ProjectedFact>()
  for (const fact of facts) {
    let value = read(root, fact.sourceProperty)
    let propertyPath = fact.sourceProperty
    if (fact.property === "left" || fact.property === "top") {
      value = finite(value) - finite(read(control, fact.sourceProperty))
      propertyPath = `${fact.sourceProperty} - children.0.children.0.${fact.sourceProperty}`
    } else if (fact.property === "borderStyle") value = "solid"
    else if (fact.property === "boxSizing") value = "border-box"
    projected.set(fact.property, { value, propertyPath })
  }
  return projected
}
