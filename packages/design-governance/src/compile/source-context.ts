import type { FigmaNode, SourceSnapshot } from "../source/snapshot.js"

/** Each independently selected source tree retains its own captured and requested modes. */
export function sourceContext(
  snapshot: SourceSnapshot,
  root: FigmaNode,
  selectedModes: Record<string, string>,
) {
  const index = new Map<string, FigmaNode>()
  const capturedModes = new Map<string, Record<string, string>>()
  const effectiveModes = new Map<string, Record<string, string>>()
  const unsupported: string[] = []
  const defaults = Object.fromEntries(
    snapshot.collections.map((collection) => [collection.id, collection.defaultModeId]),
  )
  function visit(
    node: FigmaNode,
    captured: Record<string, string>,
    requested: Record<string, string>,
  ) {
    if (index.has(node.id)) throw Error(`Duplicate source node ${node.id}`)
    index.set(node.id, node)
    const actual = { ...captured, ...node.explicitVariableModes }
    const effective = { ...requested, ...node.explicitVariableModes }
    capturedModes.set(node.id, actual)
    effectiveModes.set(node.id, effective)
    for (const child of node.children ?? []) visit(child, actual, effective)
  }
  for (const [collection, mode] of Object.entries(root.explicitVariableModes ?? {}))
    if (selectedModes[collection] && selectedModes[collection] !== mode)
      unsupported.push(
        `Conflicting selected mode for ${collection}: contract ${selectedModes[collection]} versus source explicit ${mode}`,
      )
  visit(
    root,
    { ...defaults, ...snapshot.inheritedModes[root.id] },
    { ...snapshot.inheritedModes[root.id], ...selectedModes },
  )
  return { root, index, capturedModes, effectiveModes, unsupported }
}
