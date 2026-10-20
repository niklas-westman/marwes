import type { SourceSnapshot } from "./snapshot.ts"
import type { VariableValue } from "./types.ts"

export type ResolvedVariable = {
  value: VariableValue
  aliasChain: string[]
  collectionId: string
  modeId: string
}
export function resolveVariable(
  snapshot: Pick<SourceSnapshot, "variables" | "collections">,
  id: string,
  modes: Record<string, string>,
  chain: string[] = [],
): ResolvedVariable {
  if (chain.includes(id)) throw new Error(`Variable alias cycle: ${[...chain, id].join(" -> ")}`)
  const variable = snapshot.variables.find((item) => item.id === id)
  if (!variable) throw new Error(`Missing variable dependency ${id}`)
  const collectionId = variable.variableCollectionId ?? variable.collectionId
  if (!collectionId) throw new Error(`Missing collection identity for ${id}`)
  const collection = snapshot.collections.find((item) => item.id === collectionId)
  if (!collection) throw new Error(`Missing collection ${collectionId} for ${id}`)
  const modeId =
    modes[collectionId] ??
    (collection.modes.length === 1
      ? (collection.modes[0]?.modeId ?? collection.modes[0]?.id)
      : undefined)
  if (!modeId)
    throw new Error(`Ambiguous mode for collection ${collectionId}; select a mode explicitly`)
  if (!collection.modes.some((mode) => (mode.modeId ?? mode.id) === modeId))
    throw new Error(`Unknown mode ${modeId} in ${collectionId}`)
  const values = variable.rawValuesByMode ?? variable.valuesByModeId
  if (!values || !(modeId in values)) throw new Error(`Missing value for ${id} mode ${modeId}`)
  const value = values[modeId]
  const aliasChain = [...chain, id]
  if (value && typeof value === "object" && "type" in value && value.type === "VARIABLE_ALIAS")
    return resolveVariable(snapshot, value.id, modes, aliasChain)
  if (value === undefined) throw new Error(`Missing value for ${id} mode ${modeId}`)
  return { value, aliasChain, collectionId, modeId }
}
