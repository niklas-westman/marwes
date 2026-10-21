figma.showUI(__html__, {
  width: 280,
  height: 128,
  themeColors: true,
  visible: true,
})

let variablesRequest = null

function post(message) {
  figma.ui.postMessage(message)
}

function errorMessage(error) {
  // Figma's plugin parser can reject optional chaining in development plugins.
  // biome-ignore lint/complexity/useOptionalChain: Keep this compatible with Figma's plugin parser.
  return error && error.message ? error.message : String(error)
}

function serializeVariable(variable) {
  return {
    id: variable.id,
    name: variable.name,
    key: variable.key,
    resolvedType: variable.resolvedType,
    valuesByMode: variable.valuesByMode,
    variableCollectionId: variable.variableCollectionId,
    scopes: variable.scopes,
    description: variable.description,
    hiddenFromPublishing: variable.hiddenFromPublishing,
  }
}

function serializeCollection(collection) {
  return {
    id: collection.id,
    name: collection.name,
    key: collection.key,
    modes: collection.modes,
    defaultModeId: collection.defaultModeId,
    variableIds: collection.variableIds,
  }
}

function collectVariableIds(value, output) {
  const stack = [value]

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) continue

    if (Array.isArray(current)) {
      for (let arrayIndex = 0; arrayIndex < current.length; arrayIndex += 1) {
        stack.push(current[arrayIndex])
      }
      continue
    }

    if (typeof current === "object") {
      if (typeof current.id === "string" && current.id.indexOf("VariableID:") === 0) {
        output.add(current.id)
      }

      const values = Object.values(current)
      for (let valueIndex = 0; valueIndex < values.length; valueIndex += 1) {
        stack.push(values[valueIndex])
      }
    }
  }
}

function collectDocumentBoundVariableIds() {
  const output = new Set()
  const nodes = [figma.root]

  while (nodes.length > 0) {
    const node = nodes.pop()
    if (!node) continue

    if (node.boundVariables) {
      collectVariableIds(node.boundVariables, output)
    }

    if ("children" in node && node.children) {
      for (let index = 0; index < node.children.length; index += 1) {
        nodes.push(node.children[index])
      }
    }
  }

  return Array.from(output)
}

async function resolveVariableById(variableId) {
  if (typeof figma.variables.getVariableByIdAsync === "function") {
    return await figma.variables.getVariableByIdAsync(variableId)
  }

  if (typeof figma.variables.getVariableById === "function") {
    return figma.variables.getVariableById(variableId)
  }

  return null
}

async function resolveCollectionById(collectionId) {
  if (!collectionId) return null

  if (typeof figma.variables.getVariableCollectionByIdAsync === "function") {
    return await figma.variables.getVariableCollectionByIdAsync(collectionId)
  }

  if (typeof figma.variables.getVariableCollectionById === "function") {
    return figma.variables.getVariableCollectionById(collectionId)
  }

  return null
}

function fileInfo() {
  return {
    fileName: figma.root.name,
    fileKey: figma.fileKey || null,
    currentPage: figma.currentPage.name,
    currentPageId: figma.currentPage.id,
  }
}

function sendFileInfo(requestId) {
  post({
    type: "FILE_INFO",
    requestId: requestId,
    data: fileInfo(),
  })
}

async function readVariables() {
  if (variablesRequest) return variablesRequest

  variablesRequest = (async () => {
    post({ type: "STATUS", message: "Loading document pages..." })

    if (typeof figma.loadAllPagesAsync === "function") {
      await figma.loadAllPagesAsync()
    }

    post({ type: "STATUS", message: "Fetching local variables..." })

    const variables = await figma.variables.getLocalVariablesAsync()
    const collections = await figma.variables.getLocalVariableCollectionsAsync()
    const variableById = new Map()
    const collectionById = new Map()
    const unresolvedBoundVariableIds = []
    const resolutionErrors = []

    for (const variable of variables) {
      variableById.set(variable.id, variable)
    }

    for (const collection of collections) {
      collectionById.set(collection.id, collection)
    }

    post({ type: "STATUS", message: "Scanning bound variable IDs..." })

    const boundVariableIds = collectDocumentBoundVariableIds()

    for (const variableId of boundVariableIds) {
      if (variableById.has(variableId)) continue

      try {
        const variable = await resolveVariableById(variableId)
        if (variable) {
          variableById.set(variable.id, variable)

          if (!collectionById.has(variable.variableCollectionId)) {
            const collection = await resolveCollectionById(variable.variableCollectionId)
            if (collection) collectionById.set(collection.id, collection)
          }
        } else {
          unresolvedBoundVariableIds.push(variableId)
        }
      } catch (error) {
        unresolvedBoundVariableIds.push(variableId)
        resolutionErrors.push({
          variableId: variableId,
          error: errorMessage(error),
        })
      }
    }

    const resolvedVariables = Array.from(variableById.values())
    const resolvedCollections = Array.from(collectionById.values())

    return {
      success: true,
      timestamp: Date.now(),
      fileKey: figma.fileKey || null,
      variables: resolvedVariables.map(serializeVariable),
      variableCollections: resolvedCollections.map(serializeCollection),
      localVariableCount: variables.length,
      boundVariableIds: boundVariableIds,
      unresolvedBoundVariableIds: unresolvedBoundVariableIds,
      resolutionErrors: resolutionErrors,
    }
  })()

  try {
    return await variablesRequest
  } finally {
    variablesRequest = null
  }
}

async function sendVariables(requestId) {
  try {
    const data = await readVariables()

    post({
      type: "VARIABLES_DATA",
      requestId: requestId,
      data: data,
    })

    if (requestId) {
      post({
        type: "REFRESH_VARIABLES_RESULT",
        requestId: requestId,
        success: true,
        data: data,
      })
    }

    post({
      type: "STATUS",
      message: `Ready: ${data.variables.length} variables`,
    })
  } catch (error) {
    const message = errorMessage(error)

    post({
      type: "ERROR",
      requestId: requestId,
      error: message,
    })

    if (requestId) {
      post({
        type: "REFRESH_VARIABLES_RESULT",
        requestId: requestId,
        success: false,
        error: message,
      })
    }
  }
}

async function resolveNodeById(nodeId) {
  if (typeof figma.getNodeByIdAsync === "function") {
    return await figma.getNodeByIdAsync(nodeId)
  }

  if (typeof figma.getNodeById === "function") {
    return figma.getNodeById(nodeId)
  }

  return null
}

function readRenameEntries(params) {
  if (!params || !Array.isArray(params.renames)) return []
  return params.renames.filter((entry) => {
    return entry && typeof entry.nodeId === "string" && typeof entry.name === "string"
  })
}

async function renameReflectionFrames(params) {
  const renames = readRenameEntries(params)
  const dryRun = !params || params.dryRun !== false
  // biome-ignore lint/complexity/useOptionalChain: Keep this compatible with Figma's plugin parser.
  const force = Boolean(params && params.force)
  // biome-ignore lint/complexity/useOptionalChain: Keep this compatible with Figma's plugin parser.
  const expectedFileKey = params && params.fileKey ? params.fileKey : null

  if (expectedFileKey && figma.fileKey && figma.fileKey !== expectedFileKey) {
    throw new Error(`Connected file key ${figma.fileKey} does not match ${expectedFileKey}`)
  }

  if (typeof figma.loadAllPagesAsync === "function") {
    await figma.loadAllPagesAsync()
  }

  const result = {
    success: true,
    dryRun: dryRun,
    fileKey: figma.fileKey || null,
    total: renames.length,
    renamed: [],
    alreadyNamed: [],
    missing: [],
    conflicts: [],
    errors: [],
  }

  for (let index = 0; index < renames.length; index += 1) {
    const entry = renames[index]

    try {
      const node = await resolveNodeById(entry.nodeId)
      if (!node) {
        result.missing.push({
          nodeId: entry.nodeId,
          requiredName: entry.name,
        })
        continue
      }

      const previousName = node.name
      if (previousName === entry.name) {
        result.alreadyNamed.push({
          nodeId: entry.nodeId,
          name: entry.name,
        })
        continue
      }

      if (
        !force &&
        entry.currentName &&
        previousName.indexOf("reflection/") === 0 &&
        previousName !== entry.name
      ) {
        result.conflicts.push({
          nodeId: entry.nodeId,
          currentName: previousName,
          requiredName: entry.name,
        })
        continue
      }

      if (!dryRun) {
        node.name = entry.name
      }

      result.renamed.push({
        nodeId: entry.nodeId,
        previousName: previousName,
        name: entry.name,
      })
    } catch (error) {
      result.errors.push({
        nodeId: entry.nodeId,
        requiredName: entry.name,
        error: errorMessage(error),
      })
    }
  }

  if (result.missing.length > 0 || result.conflicts.length > 0 || result.errors.length > 0) {
    result.success = false
  }

  return result
}

async function sendRenameReflectionFrames(requestId, params) {
  try {
    post({ type: "STATUS", message: "Renaming Reflection frames..." })
    const result = await renameReflectionFrames(params || {})

    post({
      type: "RENAME_REFLECTION_FRAMES_RESULT",
      requestId: requestId,
      success: result.success,
      data: result,
    })

    const changed = result.dryRun ? result.renamed.length : result.renamed.length
    post({
      type: "STATUS",
      message: result.success
        ? `${result.dryRun ? "Previewed" : "Renamed"} ${changed} Reflection frames`
        : "Reflection frame rename needs attention",
    })
  } catch (error) {
    const message = errorMessage(error)

    post({
      type: "RENAME_REFLECTION_FRAMES_RESULT",
      requestId: requestId,
      success: false,
      error: message,
    })

    post({
      type: "ERROR",
      requestId: requestId,
      error: message,
    })
  }
}

// Source exports are read-only observations, never reference promotion or approval.
const SOURCE_SVG_MAX_NODES = 16
const SOURCE_SVG_MAX_BYTES = 2 * 1024 * 1024
const SOURCE_SVG_MAX_TOTAL_BYTES = 8 * 1024 * 1024
let sourceSvgRequestInProgress = false

function sourceJsonValue(value) {
  return JSON.parse(
    JSON.stringify(value, (_key, entry) => (typeof entry === "symbol" ? { mixed: true } : entry)),
  )
}

function sourceNodeMetadata(node) {
  const texts = []
  const stack = [node]
  let visited = 0
  while (stack.length > 0) {
    const current = stack.pop()
    visited += 1
    if (visited > 512) throw new Error("Source subtree exceeds 512 nodes")
    if (current.type === "TEXT") {
      const text = { nodeId: current.id, name: current.name }
      const properties = [
        "characters",
        "fontName",
        "fontSize",
        "fontWeight",
        "lineHeight",
        "letterSpacing",
        "textAlignHorizontal",
        "textAlignVertical",
        "textCase",
        "textDecoration",
        "textAutoResize",
        "paragraphSpacing",
        "paragraphIndent",
        "fills",
        "boundVariables",
        "absoluteBoundingBox",
        "absoluteTransform",
      ]
      for (let index = 0; index < properties.length; index += 1) {
        const property = properties[index]
        if (typeof current[property] !== "undefined") text[property] = current[property]
      }
      if (typeof current.getStyledTextSegments === "function") {
        text.styledSegments = current.getStyledTextSegments([
          "fontName",
          "fontSize",
          "fontWeight",
          "lineHeight",
          "letterSpacing",
          "textCase",
          "textDecoration",
          "fills",
        ])
      }
      texts.push(sourceJsonValue(text))
    }
    if ("children" in current && current.children) {
      for (let index = current.children.length - 1; index >= 0; index -= 1) {
        stack.push(current.children[index])
      }
    }
  }
  return sourceJsonValue({
    nodeId: node.id,
    name: node.name,
    type: node.type,
    absoluteBoundingBox: node.absoluteBoundingBox || null,
    absoluteRenderBounds: node.absoluteRenderBounds || null,
    absoluteTransform: node.absoluteTransform || null,
    width: typeof node.width === "number" ? node.width : null,
    height: typeof node.height === "number" ? node.height : null,
    explicitVariableModes: node.explicitVariableModes || null,
    resolvedVariableModes: node.resolvedVariableModes || null,
    textNodes: texts,
  })
}

function decodeSourceSvg(bytes) {
  // TextDecoder is unavailable in some Figma plugin runtimes. URI decoding
  // handles UTF-8 (including supplementary characters) and rejects invalid bytes.
  const encoded = []
  for (let index = 0; index < bytes.length; index += 1) {
    encoded.push(`%${bytes[index].toString(16).padStart(2, "0")}`)
  }
  return decodeURIComponent(encoded.join(""))
}

function validateSourceSvgRequest(requestId, params) {
  if (typeof requestId !== "string" || !/^[A-Za-z0-9_.:-]{1,128}$/.test(requestId)) {
    throw new Error("EXPORT_SOURCE_SVG requires a bounded nonempty requestId")
  }
  if (
    !params ||
    !Array.isArray(params.nodeIds) ||
    params.nodeIds.length < 1 ||
    params.nodeIds.length > SOURCE_SVG_MAX_NODES
  ) {
    throw new Error("EXPORT_SOURCE_SVG requires 1..16 explicit nodeIds")
  }
  const allowed = ["nodeIds", "expectedFileKey", "expectedFileName", "verifiedFileIdentity"]
  if (Object.keys(params).some((key) => allowed.indexOf(key) === -1)) {
    throw new Error("Unknown source SVG request parameter")
  }
  if (
    typeof params.verifiedFileIdentity !== "undefined" &&
    typeof params.verifiedFileIdentity !== "boolean"
  ) {
    throw new Error("verifiedFileIdentity must be boolean")
  }
  const unique = new Set()
  for (let index = 0; index < params.nodeIds.length; index += 1) {
    const nodeId = params.nodeIds[index]
    if (
      typeof nodeId !== "string" ||
      nodeId.length > 256 ||
      !/^I?\d+:\d+(?:;\d+:\d+)*$/.test(nodeId) ||
      unique.has(nodeId)
    ) {
      throw new Error("Invalid or duplicate source nodeId")
    }
    unique.add(nodeId)
  }
  if (
    typeof params.expectedFileKey !== "string" ||
    !/^[A-Za-z0-9]{1,128}$/.test(params.expectedFileKey) ||
    typeof params.expectedFileName !== "string" ||
    params.expectedFileName.length < 1 ||
    params.expectedFileName.length > 512
  ) {
    throw new Error("Expected file key and name are required")
  }
  if (figma.root.name !== params.expectedFileName) {
    throw new Error("Connected file name does not match expectedFileName")
  }
  if (figma.fileKey && figma.fileKey !== params.expectedFileKey) {
    throw new Error("Connected file key does not match expectedFileKey")
  }
  if (!figma.fileKey && params.verifiedFileIdentity !== true) {
    throw new Error(
      "File key unavailable; independently verify the open file and set verifiedFileIdentity",
    )
  }
}

async function sendSourceSvg(requestId, params) {
  let ownsRequest = false
  try {
    validateSourceSvgRequest(requestId, params)
    if (sourceSvgRequestInProgress) throw new Error("A source SVG export is already running")
    sourceSvgRequestInProgress = true
    ownsRequest = true
    const result = {
      success: true,
      requestedFile: { fileKey: params.expectedFileKey, fileName: params.expectedFileName },
      reportedFile: fileInfo(),
      identityVerification: figma.fileKey ? "reported-key" : "caller-verified-file-name",
      exportedAt: new Date().toISOString(),
      exportSettings: {
        format: "SVG",
        svgOutlineText: true,
        svgSimplifyStroke: false,
        svgIdAttribute: true,
      },
      nodes: [],
      errors: [],
    }
    let totalBytes = 0
    for (let index = 0; index < params.nodeIds.length; index += 1) {
      const nodeId = params.nodeIds[index]
      try {
        const node = await resolveNodeById(nodeId)
        if (!node) throw new Error("Source node not found")
        if (typeof node.exportAsync !== "function") throw new Error("Source node cannot export SVG")
        const metadata = sourceNodeMetadata(node)
        if (JSON.stringify(metadata).length > 512 * 1024)
          throw new Error("Source metadata exceeds limit")
        const bytes = await node.exportAsync(result.exportSettings)
        if (!bytes || !bytes.length || bytes.length > SOURCE_SVG_MAX_BYTES) {
          throw new Error("Source SVG is empty or exceeds 2 MiB limit")
        }
        if (totalBytes + bytes.length > SOURCE_SVG_MAX_TOTAL_BYTES) {
          throw new Error("Source SVG batch exceeds 8 MiB limit")
        }
        const svg = decodeSourceSvg(bytes)
        if (!/^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/.test(svg))
          throw new Error("Export did not return SVG")
        totalBytes += bytes.length
        result.nodes.push({
          requestedNodeId: nodeId,
          metadata: metadata,
          svg: svg,
          byteLength: bytes.length,
        })
      } catch (error) {
        result.errors.push({ nodeId: nodeId, error: errorMessage(error) })
      }
    }
    result.success = result.errors.length === 0
    post({
      type: "EXPORT_SOURCE_SVG_RESULT",
      requestId: requestId,
      success: result.success,
      data: result,
    })
  } catch (error) {
    post({
      type: "EXPORT_SOURCE_SVG_RESULT",
      requestId: requestId,
      success: false,
      error: errorMessage(error),
    })
  } finally {
    if (ownsRequest) sourceSvgRequestInProgress = false
  }
}

figma.ui.onmessage = (message) => {
  if (!message || !message.type) return

  if (message.type === "EXPORT_SOURCE_SVG") {
    sendSourceSvg(message.requestId, message.params)
    return
  }

  if (message.type === "GET_FILE_INFO") {
    sendFileInfo(message.requestId)
    return
  }

  if (message.type === "REFRESH_VARIABLES") {
    sendVariables(message.requestId)
    return
  }

  if (message.type === "RENAME_REFLECTION_FRAMES") {
    sendRenameReflectionFrames(message.requestId, message.params)
  }
}

sendFileInfo()
sendVariables()
