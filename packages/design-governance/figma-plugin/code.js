figma.showUI(__html__, {
  width: 280,
  height: 112,
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

figma.ui.onmessage = (message) => {
  if (!message || !message.type) return

  if (message.type === "GET_FILE_INFO") {
    sendFileInfo(message.requestId)
    return
  }

  if (message.type === "REFRESH_VARIABLES") {
    sendVariables(message.requestId)
  }
}

sendFileInfo()
sendVariables()
