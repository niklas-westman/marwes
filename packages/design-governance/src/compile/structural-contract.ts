export type StructuralContract = {
  schemaVersion: 1 | 2
  family: string
  toleranceReason: string
  cases: {
    caseId: string
    publicPurpose?: string
    publicVariant?: string
    state?: string
    mode: string
    collectionModes: Record<string, string>
    unsupported: string[]
    limitations?: string[]
    parts: {
      nodeId: string
      sourceRootNodeId?: string
      sourceProjection?: "focus-outline/v1" | "focus-ring-paint/v1"
      part: string
      selector: string
      properties: { property: string; sourceProperty: string; tolerance: number }[]
    }[]
  }[]
}
function object(value: unknown, allowed: string[], label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`Malformed ${label}`)
  const record = value as Record<string, unknown>
  for (const key of Object.keys(record))
    if (!allowed.includes(key)) throw new Error(`Unknown ${label} key ${key}`)
  return record
}
export function validateStructuralContract(input: unknown): asserts input is StructuralContract {
  const value = object(
    input,
    ["schemaVersion", "family", "toleranceReason", "cases"],
    "structural contract",
  )
  if (
    ![1, 2].includes(value.schemaVersion as number) ||
    typeof value.family !== "string" ||
    !Array.isArray(value.cases) ||
    typeof value.toleranceReason !== "string" ||
    !value.toleranceReason
  )
    throw new Error("Malformed structural contract identity")
  const identities = new Set<string>()
  for (const rawCase of value.cases) {
    const item = object(
      rawCase,
      [
        "caseId",
        "mode",
        "collectionModes",
        "parts",
        "unsupported",
        "limitations",
        "publicPurpose",
        "publicVariant",
        "state",
      ],
      "case",
    )
    if (
      typeof item.caseId !== "string" ||
      typeof item.mode !== "string" ||
      !Array.isArray(item.parts) ||
      !Array.isArray(item.unsupported) ||
      item.unsupported.some((s: unknown) => typeof s !== "string")
    )
      throw new Error("Malformed structural case")
    if (
      item.limitations !== undefined &&
      (!Array.isArray(item.limitations) ||
        item.limitations.some((s: unknown) => typeof s !== "string"))
    )
      throw new Error("Malformed limitations")
    if (
      (item.publicPurpose !== undefined && typeof item.publicPurpose !== "string") ||
      (item.publicVariant !== undefined && typeof item.publicVariant !== "string") ||
      (item.state !== undefined && typeof item.state !== "string")
    )
      throw new Error("Malformed public variant/state mapping")
    const identity = `${item.caseId}/${item.mode}`
    if (identities.has(identity)) throw new Error(`Duplicate structural case ${identity}`)
    identities.add(identity)
    if (
      !item.collectionModes ||
      typeof item.collectionModes !== "object" ||
      Array.isArray(item.collectionModes) ||
      Object.values(item.collectionModes).some((mode) => typeof mode !== "string")
    )
      throw new Error("Malformed collection modes")
    for (const rawPart of item.parts) {
      const part = object(
        rawPart,
        [
          "nodeId",
          "part",
          "selector",
          "properties",
          ...(value.schemaVersion === 2 ? ["sourceRootNodeId", "sourceProjection"] : []),
        ],
        "semantic part",
      )
      if (
        part.sourceRootNodeId !== undefined &&
        (typeof part.sourceRootNodeId !== "string" || !part.sourceRootNodeId)
      )
        throw new Error("Malformed source root")
      if (
        part.sourceProjection !== undefined &&
        !["focus-outline/v1", "focus-ring-paint/v1"].includes(String(part.sourceProjection))
      )
        throw new Error("Unsupported source projection")
      if (
        ![part.nodeId, part.part, part.selector].every(
          (v) => typeof v === "string" && v.length > 0,
        ) ||
        !Array.isArray(part.properties)
      )
        throw new Error("Malformed semantic part")
      for (const rawFact of part.properties) {
        const fact = object(rawFact, ["property", "sourceProperty", "tolerance"], "property")
        if (
          ![fact.property, fact.sourceProperty].every(
            (v) => typeof v === "string" && /^[\w.]+$/.test(v),
          ) ||
          typeof fact.tolerance !== "number" ||
          !Number.isFinite(fact.tolerance) ||
          fact.tolerance < 0
        )
          throw new Error("Malformed property mapping")
      }
    }
  }
}
