figma.showUI(__html__, {
  width: 300,
  height: 128,
  themeColors: true,
  visible: true,
})

const prepVersion = 4
const pluginDataMarker = "marwes-reflection-frame-prep"
const pluginDataKey = "reflectionFramePrep"
const pluginDataPayloadKey = "reflectionFramePrepData"
const placementOffset = 800
const rowGap = 96
const columnGap = 80
const sourceInfoFrameWidth = 520
const sourceInfoFrameHeight = 220
const sourceInfoToFrameGap = 32

function post(message) {
  figma.ui.postMessage(message)
}

function errorMessage(error) {
  // Figma's plugin parser can reject optional chaining in development plugins.
  // biome-ignore lint/complexity/useOptionalChain: Keep this compatible with Figma's plugin parser.
  return error && error.message ? error.message : String(error)
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

async function resolveNodeById(nodeId) {
  if (typeof figma.getNodeByIdAsync === "function") {
    return await figma.getNodeByIdAsync(nodeId)
  }

  if (typeof figma.getNodeById === "function") {
    return figma.getNodeById(nodeId)
  }

  return null
}

function isChildrenMixin(node) {
  return Boolean(node && "children" in node && node.children)
}

function findPageByName(name) {
  for (let index = 0; index < figma.root.children.length; index += 1) {
    const page = figma.root.children[index]
    if (page.name === name) return page
  }
  return null
}

function findPageAncestor(node) {
  let current = node
  while (current) {
    if (current.type === "PAGE") return current
    current = current.parent
  }
  return null
}

function getOrCreateNamedPage(name, dryRun) {
  const existing = findPageByName(name)
  if (existing || dryRun) return existing

  const page = figma.createPage()
  page.name = name
  return page
}

function findChildrenByName(parent, name) {
  const matches = []
  if (!isChildrenMixin(parent)) return matches

  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index]
    if (child.name === name) matches.push(child)
  }

  return matches
}

function selectByOccurrence(nodes, occurrence) {
  const index = Number.isInteger(occurrence) ? occurrence : 0
  return nodes[index] || null
}

function readViewportSize(entry) {
  const size = entry.viewportSize
  if (
    !size ||
    !Number.isInteger(size.width) ||
    !Number.isInteger(size.height) ||
    size.width <= 0 ||
    size.height <= 0
  ) {
    throw new Error(`${entry.family}:${entry.caseId}:${entry.mode} has invalid viewportSize`)
  }
  return size
}

function solidPaint(hex) {
  const value = typeof hex === "string" ? hex.trim() : "#ffffff"
  const normalized = value.charAt(0) === "#" ? value.slice(1) : value

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error(`Unsupported frame background: ${value}`)
  }

  return {
    type: "SOLID",
    color: {
      r: Number.parseInt(normalized.slice(0, 2), 16) / 255,
      g: Number.parseInt(normalized.slice(2, 4), 16) / 255,
      b: Number.parseInt(normalized.slice(4, 6), 16) / 255,
    },
  }
}

function resizeNode(node, width, height) {
  if (typeof node.resizeWithoutConstraints === "function") {
    node.resizeWithoutConstraints(width, height)
    return
  }

  node.resize(width, height)
}

function safeBounds(node) {
  if (
    !node ||
    typeof node.x !== "number" ||
    typeof node.y !== "number" ||
    typeof node.width !== "number" ||
    typeof node.height !== "number"
  ) {
    const nodeName = node ? node.name : undefined
    throw new Error(`Node ${nodeName || "unknown"} does not have bounds`)
  }

  return {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    right: node.x + node.width,
    bottom: node.y + node.height,
  }
}

function unionBounds(nodes) {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (let index = 0; index < nodes.length; index += 1) {
    const bounds = safeBounds(nodes[index])
    minX = Math.min(minX, bounds.x)
    minY = Math.min(minY, bounds.y)
    maxX = Math.max(maxX, bounds.right)
    maxY = Math.max(maxY, bounds.bottom)
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    right: maxX,
    bottom: maxY,
  }
}

function colorToHex(color) {
  if (!color) return undefined

  function toHex(value) {
    const number = Math.round(value * 255)
    return number.toString(16).padStart(2, "0")
  }

  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

function summarizePaints(value) {
  if (!Array.isArray(value)) return []

  return value.map((paint) => {
    const output = {
      type: paint.type,
      visible: paint.visible !== false,
    }

    if (paint.color) output.color = colorToHex(paint.color)
    if (typeof paint.opacity === "number") output.opacity = paint.opacity
    if (paint.boundVariables) output.boundVariables = summarizeBoundVariables(paint.boundVariables)

    return output
  })
}

function collectVariableIds(value, output) {
  const stack = [value]

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) continue

    if (Array.isArray(current)) {
      for (let index = 0; index < current.length; index += 1) stack.push(current[index])
      continue
    }

    if (typeof current === "object") {
      if (typeof current.id === "string") output.add(current.id)

      const values = Object.values(current)
      for (let index = 0; index < values.length; index += 1) stack.push(values[index])
    }
  }
}

function summarizeBoundVariables(value) {
  if (!value) return []
  const ids = new Set()
  collectVariableIds(value, ids)
  return Array.from(ids).sort()
}

function readExplicitVariableModes(node) {
  if (!node || !node.explicitVariableModes) return {}
  const output = {}
  const collectionIds = Object.keys(node.explicitVariableModes)
  for (let index = 0; index < collectionIds.length; index += 1) {
    const collectionId = collectionIds[index]
    output[collectionId] = node.explicitVariableModes[collectionId]
  }
  return output
}

async function resolveVariableCollection(collectionId) {
  if (!figma.variables) return collectionId

  if (typeof figma.variables.getVariableCollectionByIdAsync === "function") {
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
    return collection || collectionId
  }

  if (typeof figma.variables.getVariableCollectionById === "function") {
    const collection = figma.variables.getVariableCollectionById(collectionId)
    return collection || collectionId
  }

  return collectionId
}

async function copyExplicitVariableModes(sourceNode, targetNode) {
  if (!sourceNode || !targetNode) return
  if (typeof targetNode.setExplicitVariableModeForCollection !== "function") return

  const modes = readExplicitVariableModes(sourceNode)
  const collectionIds = Object.keys(modes)
  for (let index = 0; index < collectionIds.length; index += 1) {
    const collectionId = collectionIds[index]
    const collection = await resolveVariableCollection(collectionId)
    targetNode.setExplicitVariableModeForCollection(collection, modes[collectionId])
  }
}

function summarizeNode(node, includeChildren) {
  const bounds = safeBounds(node)
  const explicitVariableModes = readExplicitVariableModes(node)
  const output = {
    id: node.id,
    name: node.name,
    type: node.type,
    bounds: {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
    },
  }

  if ("fills" in node) output.fills = summarizePaints(node.fills)
  if ("strokes" in node) output.strokes = summarizePaints(node.strokes)
  if ("strokeWeight" in node && typeof node.strokeWeight === "number") {
    output.strokeWeight = node.strokeWeight
  }
  if (node.boundVariables) output.boundVariables = summarizeBoundVariables(node.boundVariables)
  if (Object.keys(explicitVariableModes).length > 0) {
    output.explicitVariableModes = explicitVariableModes
  }

  if (includeChildren && isChildrenMixin(node)) {
    output.children = node.children.map((child) => summarizeNode(child, false))
  }

  return output
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`

  const keys = Object.keys(value).sort()
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`
}

function hashString(value) {
  let hash = 5381
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index)
  }
  return `h${(hash >>> 0).toString(16)}`
}

async function selectSource(entry) {
  const selector = entry.selector || {}

  if (selector.strategy === "directNode") {
    const sourceNodeId = selector.sourceNodeId || entry.sourceNodeId
    if (!sourceNodeId) throw new Error("directNode selector requires sourceNodeId")

    const sourceNode = await resolveNodeById(sourceNodeId)
    if (!sourceNode) throw new Error(`Missing source node ${sourceNodeId}`)

    const sourceFrame = entry.sourceFrameId ? await resolveNodeById(entry.sourceFrameId) : null
    return {
      strategy: selector.strategy,
      nodes: [sourceNode],
      sourceNodeId: sourceNode.id,
      sourceNodeIds: [sourceNode.id],
      sourceFrameId: sourceFrame ? sourceFrame.id : null,
      sourceFrame: sourceFrame || sourceNode,
    }
  }

  const sourceFrameId = entry.sourceFrameId
  if (!sourceFrameId) throw new Error(`${selector.strategy} selector requires sourceFrameId`)

  const sourceFrame = await resolveNodeById(sourceFrameId)
  if (!sourceFrame) throw new Error(`Missing source frame ${sourceFrameId}`)
  if (!isChildrenMixin(sourceFrame)) {
    throw new Error(`Source frame ${sourceFrameId} has no children`)
  }

  const rowName = selector.rowName
  if (!rowName) throw new Error(`${selector.strategy} selector requires rowName`)

  const row = selectByOccurrence(findChildrenByName(sourceFrame, rowName), selector.rowOccurrence)
  if (!row) {
    throw new Error(`Could not find ${rowName} in ${sourceFrame.name}`)
  }

  if (selector.strategy === "rowChild") {
    const childName = selector.childName
    if (!childName) throw new Error("rowChild selector requires childName")

    const child = selectByOccurrence(findChildrenByName(row, childName), selector.childOccurrence)
    if (!child) throw new Error(`Could not find ${childName} in ${row.name}`)

    return {
      strategy: selector.strategy,
      nodes: [child],
      sourceNodeId: child.id,
      sourceNodeIds: [child.id],
      sourceFrameId: sourceFrame.id,
      sourceFrame: sourceFrame,
      rowId: row.id,
    }
  }

  if (selector.strategy === "rowContent") {
    const childName = selector.childName
    if (!childName) throw new Error("rowContent selector requires childName")

    const children = findChildrenByName(row, childName)
    if (children.length === 0)
      throw new Error(`Could not find ${childName} children in ${row.name}`)

    return {
      strategy: selector.strategy,
      nodes: children,
      sourceNodeId: row.id,
      sourceNodeIds: children.map((child) => child.id),
      sourceFrameId: sourceFrame.id,
      sourceFrame: sourceFrame,
      rowId: row.id,
    }
  }

  throw new Error(`Unsupported selector strategy: ${selector.strategy}`)
}

function resolveDestinationPage(entry, sourceSelection, params, dryRun) {
  const destination = params.destination || "source-page"

  if (destination === "current") return figma.currentPage

  if (destination === "named") {
    const outputPageName = params.outputPage || entry.outputPage || "Reflection Baselines"
    return getOrCreateNamedPage(outputPageName, dryRun)
  }

  const page = findPageAncestor(sourceSelection.sourceFrame || sourceSelection.nodes[0])
  if (!page) throw new Error(`Could not resolve source page for ${entry.outputFrameName}`)
  return page
}

function isReflectionGeneratedNode(node) {
  if (!node || typeof node.name !== "string") return false
  if (node.name.indexOf("reflection/") === 0) return true
  if (node.name.indexOf("reflection-info/") === 0) return true
  if (
    typeof node.getPluginData === "function" &&
    node.getPluginData(pluginDataKey) === pluginDataMarker
  ) {
    return true
  }
  return false
}

function safeNodeName(node) {
  try {
    return node && typeof node.name === "string" ? node.name : ""
  } catch (_error) {
    return ""
  }
}

function safePluginData(node, key) {
  try {
    if (!node || typeof node.getPluginData !== "function") return ""
    return node.getPluginData(key)
  } catch (_error) {
    return ""
  }
}

function pageContentBounds(page) {
  const nodes = []
  if (!isChildrenMixin(page)) return null

  for (let index = 0; index < page.children.length; index += 1) {
    const child = page.children[index]
    if (!isReflectionGeneratedNode(child)) nodes.push(child)
  }

  if (nodes.length === 0) return null
  return unionBounds(nodes)
}

function sourceInfoOutputFrameName(family, mode) {
  return `reflection-info/${family}/${mode}`
}

function findSourceInfoFrame(page, family, mode) {
  if (!isChildrenMixin(page)) return null

  const name = sourceInfoOutputFrameName(family, mode)
  let fallback = null

  for (let index = 0; index < page.children.length; index += 1) {
    const child = page.children[index]
    if (safeNodeName(child) !== name) continue
    if (!fallback) fallback = child
    if (safePluginData(child, pluginDataKey) === pluginDataMarker) return child
  }

  return fallback
}

function buildExistingReflectionFrameIndex(outputFrameNames, pages) {
  const outputIndex = Object.create(null)

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const page = pages[pageIndex]
    if (!isChildrenMixin(page)) continue

    for (let childIndex = 0; childIndex < page.children.length; childIndex += 1) {
      const node = page.children[childIndex]
      const nodeName = safeNodeName(node)
      if (!Object.prototype.hasOwnProperty.call(outputFrameNames, nodeName)) continue
      if (!outputIndex[nodeName]) outputIndex[nodeName] = []

      outputIndex[nodeName].push({
        node: node,
        page: page,
        pluginManaged: safePluginData(node, pluginDataKey) === pluginDataMarker,
      })
    }
  }

  return outputIndex
}

function uniquePages(records) {
  const pages = []
  const seen = Object.create(null)

  function add(page) {
    if (!page || seen[page.id]) return
    seen[page.id] = true
    pages.push(page)
  }

  add(figma.currentPage)
  for (let index = 0; index < records.length; index += 1) {
    add(records[index].destinationPage)
  }

  return pages
}

function parseStoredPayload(node) {
  if (!node || typeof node.getPluginData !== "function") return null

  try {
    const raw = node.getPluginData(pluginDataPayloadKey)
    return raw ? JSON.parse(raw) : null
  } catch (_error) {
    return null
  }
}

function createCaseRoot(sourceNodes) {
  const sourceBounds = unionBounds(sourceNodes)
  const caseRoot = figma.createFrame()
  caseRoot.name = "reflection-case-root"
  caseRoot.fills = []
  caseRoot.strokes = []
  caseRoot.clipsContent = false
  resizeNode(caseRoot, Math.round(sourceBounds.width), Math.round(sourceBounds.height))

  for (let index = 0; index < sourceNodes.length; index += 1) {
    const sourceNode = sourceNodes[index]
    const sourceNodeBounds = safeBounds(sourceNode)
    const clone = sourceNode.clone()
    caseRoot.appendChild(clone)
    clone.x = Math.round(sourceNodeBounds.x - sourceBounds.x)
    clone.y = Math.round(sourceNodeBounds.y - sourceBounds.y)
  }

  return caseRoot
}

function placeCaseRoot(frame, caseRoot, framing) {
  const padding = framing && Number.isInteger(framing.padding) ? framing.padding : 0
  const frameAlign = framing ? framing.align : undefined
  const align = frameAlign || "center"

  if (align === "start") {
    caseRoot.x = padding
    caseRoot.y = padding
    return
  }

  caseRoot.x = Math.round((frame.width - caseRoot.width) / 2)
  caseRoot.y = Math.round((frame.height - caseRoot.height) / 2)
}

function buildPayload(record, frameId) {
  return {
    prepVersion: prepVersion,
    family: record.entry.family,
    caseId: record.entry.caseId,
    mode: record.entry.mode,
    outputFrameName: record.entry.outputFrameName,
    sourceFrameId: record.sourceSelection.sourceFrameId || null,
    sourceNodeId: record.sourceSelection.sourceNodeId,
    sourceNodeIds: record.sourceSelection.sourceNodeIds,
    viewportSize: record.entry.viewportSize,
    framing: record.entry.framing || {},
    selector: record.entry.selector,
    destinationPageId: record.destinationPage ? record.destinationPage.id : null,
    destinationPageName: record.destinationPage ? record.destinationPage.name : null,
    position: record.position,
    placementAnchor: record.placementAnchor || null,
    requestHash: record.requestHash,
    sourceFingerprint: record.sourceFingerprint,
    figmaNodeId: frameId,
  }
}

async function createOutputFrame(record) {
  const entry = record.entry
  const viewportSize = readViewportSize(entry)
  const framing = entry.framing || {}
  const variableModeSource = record.sourceSelection.sourceFrame || record.sourceSelection.nodes[0]
  const frame = figma.createFrame()

  frame.name = entry.outputFrameName
  frame.setPluginData(pluginDataKey, pluginDataMarker)
  resizeNode(frame, viewportSize.width, viewportSize.height)
  await copyExplicitVariableModes(variableModeSource, frame)
  frame.fills = [solidPaint(framing.background || "#ffffff")]
  frame.strokes = []
  frame.clipsContent = false
  frame.exportSettings = [
    {
      format: "PNG",
      constraint: { type: "SCALE", value: 1 },
    },
  ]

  const caseRoot = createCaseRoot(record.sourceSelection.nodes)
  await copyExplicitVariableModes(variableModeSource, caseRoot)
  frame.appendChild(caseRoot)
  placeCaseRoot(frame, caseRoot, framing)

  frame.x = record.position.x
  frame.y = record.position.y

  frame.setPluginData(pluginDataKey, pluginDataMarker)
  frame.setPluginData(pluginDataPayloadKey, JSON.stringify(buildPayload(record, frame.id)))

  record.destinationPage.appendChild(frame)
  return frame
}

function readFrameEntries(params) {
  if (!params || !Array.isArray(params.frames)) return []
  return params.frames.filter((entry) => {
    return (
      entry &&
      typeof entry.family === "string" &&
      typeof entry.caseId === "string" &&
      typeof entry.mode === "string" &&
      typeof entry.outputFrameName === "string"
    )
  })
}

function readExportEntries(params) {
  if (!params || !Array.isArray(params.frames)) return []
  return params.frames.filter((entry) => {
    return (
      entry &&
      typeof entry.caseId === "string" &&
      typeof entry.family === "string" &&
      typeof entry.mode === "string" &&
      typeof entry.figmaNodeId === "string" &&
      typeof entry.baseline === "string"
    )
  })
}

function readSourceRegistryEntries(params) {
  if (!params || !Array.isArray(params.entries)) return []
  return params.entries.filter((entry) => {
    return (
      entry &&
      typeof entry.family === "string" &&
      typeof entry.mode === "string" &&
      typeof entry.sourceFrameId === "string"
    )
  })
}

function buildSourceDiagnostics(sourceSelection) {
  return {
    sourceNodeId: sourceSelection.sourceNodeId,
    sourceNodeIds: sourceSelection.sourceNodeIds,
    nodes: sourceSelection.nodes.map((node) => summarizeNode(node, true)),
  }
}

function buildSourceFrameInfo(entry, sourceFrame) {
  const page = findPageAncestor(sourceFrame)
  const summary = summarizeSourceFrame(sourceFrame)

  return {
    family: entry.family,
    mode: entry.mode,
    sourceFrameId: entry.sourceFrameId,
    sourceFrameUrl: entry.sourceFrameUrl || null,
    pageId: page ? page.id : null,
    pageName: page ? page.name : null,
    sourceFingerprint: hashString(stableStringify(summary)),
    sourceFrame: summary,
  }
}

function summarizeSourceFrame(node) {
  const bounds = safeBounds(node)
  const children = []

  if (isChildrenMixin(node)) {
    for (let index = 0; index < node.children.length; index += 1) {
      children.push(summarizeSourceFrameChild(node.children[index]))
    }
  }

  return {
    id: node.id,
    name: node.name,
    type: node.type,
    bounds: {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
    },
    fills: "fills" in node ? summarizePaints(node.fills) : [],
    strokes: "strokes" in node ? summarizePaints(node.strokes) : [],
    boundVariables: node.boundVariables ? summarizeBoundVariables(node.boundVariables) : [],
    childCount: children.length,
    children: children,
  }
}

function summarizeSourceFrameChild(node) {
  const bounds = safeBounds(node)
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    bounds: {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
    },
  }
}

function sourceInfoFrameName(entry) {
  return sourceInfoOutputFrameName(entry.family, entry.mode)
}

function findExistingSourceInfoFrames(name, pages) {
  const matches = []

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const page = pages[pageIndex]
    if (!isChildrenMixin(page)) continue

    for (let childIndex = 0; childIndex < page.children.length; childIndex += 1) {
      const node = page.children[childIndex]
      if (safeNodeName(node) !== name) continue

      matches.push({
        node: node,
        page: page,
        pluginManaged: safePluginData(node, pluginDataKey) === pluginDataMarker,
      })
    }
  }

  return matches
}

async function loadInfoFonts() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" })
  await figma.loadFontAsync({ family: "Inter", style: "Medium" })
}

function createInfoText(parent, text, x, y, width, fontSize, style, color) {
  const node = figma.createText()
  node.fontName = { family: "Inter", style: style || "Regular" }
  node.fontSize = fontSize
  node.fills = [solidPaint(color || "#141414")]
  node.characters = text
  node.textAutoResize = "HEIGHT"
  node.resize(width, node.height)
  node.x = x
  node.y = y
  parent.appendChild(node)
  return node
}

function sourceInfoPayload(record, frameId) {
  return {
    kind: "source-info",
    prepVersion: prepVersion,
    family: record.info.family,
    mode: record.info.mode,
    sourceFrameId: record.info.sourceFrameId,
    sourceFrameUrl: record.info.sourceFrameUrl,
    pageId: record.info.pageId,
    pageName: record.info.pageName,
    sourceFingerprint: record.info.sourceFingerprint,
    requestHash: record.requestHash,
    position: record.position,
    figmaNodeId: frameId,
  }
}

function createSourceInfoFrame(record) {
  const frame = figma.createFrame()
  const info = record.info
  const sourceFrame = info.sourceFrame
  const childNames = sourceFrame.children
    .slice(0, 8)
    .map((child) => child.name)
    .join(", ")
  const overflow = sourceFrame.childCount > 8 ? `, +${sourceFrame.childCount - 8} more` : ""

  frame.name = record.outputFrameName
  resizeNode(frame, sourceInfoFrameWidth, sourceInfoFrameHeight)
  frame.x = record.position.x
  frame.y = record.position.y
  frame.fills = [solidPaint("#f7f7f7")]
  frame.strokes = [solidPaint("#d9d9d9")]
  frame.cornerRadius = 8
  frame.clipsContent = true

  createInfoText(frame, `${info.family} / ${info.mode}`, 20, 18, 480, 18, "Medium", "#141414")
  createInfoText(frame, `source: ${info.sourceFrameId}`, 20, 48, 480, 12, "Regular", "#4d4d4d")
  createInfoText(
    frame,
    `page: ${info.pageName || "unknown"}`,
    20,
    68,
    480,
    12,
    "Regular",
    "#4d4d4d",
  )
  createInfoText(
    frame,
    `size: ${sourceFrame.bounds.width}x${sourceFrame.bounds.height}  children: ${sourceFrame.childCount}`,
    20,
    88,
    480,
    12,
    "Regular",
    "#4d4d4d",
  )
  createInfoText(
    frame,
    `fingerprint: ${info.sourceFingerprint}`,
    20,
    108,
    480,
    12,
    "Regular",
    "#4d4d4d",
  )
  createInfoText(
    frame,
    `children: ${childNames}${overflow}`,
    20,
    136,
    480,
    12,
    "Regular",
    "#4d4d4d",
  )
  createInfoText(frame, record.outputFrameName, 20, 184, 480, 11, "Regular", "#7a7a7a")

  frame.setPluginData(pluginDataKey, pluginDataMarker)
  frame.setPluginData(pluginDataPayloadKey, JSON.stringify(sourceInfoPayload(record, frame.id)))
  record.destinationPage.appendChild(frame)
  return frame
}

function assignSourceInfoPositions(records) {
  const groups = {}

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index]
    if (!record.destinationPage) continue
    const pageId = record.destinationPage.id
    if (!groups[pageId]) groups[pageId] = []
    groups[pageId].push(record)
  }

  const groupValues = Object.values(groups)
  for (let groupIndex = 0; groupIndex < groupValues.length; groupIndex += 1) {
    const group = groupValues[groupIndex]
    const page = group[0].destinationPage
    const bounds = pageContentBounds(page)
    const baseX = bounds ? Math.ceil(bounds.right + placementOffset) : 0
    const baseY = bounds ? Math.round(bounds.y) : 0
    const modes = []
    const rows = []

    for (let index = 0; index < group.length; index += 1) {
      const record = group[index]
      if (modes.indexOf(record.info.mode) === -1) modes.push(record.info.mode)
      if (rows.indexOf(record.info.family) === -1) rows.push(record.info.family)
    }

    for (let index = 0; index < group.length; index += 1) {
      const record = group[index]
      const row = rows.indexOf(record.info.family)
      const column = modes.indexOf(record.info.mode)

      record.position = {
        x: baseX + column * (sourceInfoFrameWidth + columnGap),
        y: baseY + row * (sourceInfoFrameHeight + rowGap),
      }
    }
  }
}

function assignPositions(records) {
  const groups = {}

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index]
    if (!record.destinationPage) continue
    const pageId = record.destinationPage.id
    if (!groups[pageId]) groups[pageId] = []
    groups[pageId].push(record)
  }

  const groupValues = Object.values(groups)
  for (let groupIndex = 0; groupIndex < groupValues.length; groupIndex += 1) {
    const group = groupValues[groupIndex]
    const page = group[0].destinationPage
    const bounds = pageContentBounds(page)
    const baseX = bounds ? Math.ceil(bounds.right + placementOffset) : 0
    const baseY = bounds ? Math.round(bounds.y) : 0
    const maxWidth = Math.max.apply(
      null,
      group.map((record) => record.entry.viewportSize.width),
    )
    const maxHeight = Math.max.apply(
      null,
      group.map((record) => record.entry.viewportSize.height),
    )
    const modes = []
    const rows = []

    for (let index = 0; index < group.length; index += 1) {
      const record = group[index]
      if (modes.indexOf(record.entry.mode) === -1) modes.push(record.entry.mode)
      const rowKey = `${record.entry.family}:${record.entry.caseId}`
      if (rows.indexOf(rowKey) === -1) rows.push(rowKey)
    }

    const infoStackCounts = Object.create(null)
    for (let index = 0; index < group.length; index += 1) {
      const record = group[index]
      const infoFrame = findSourceInfoFrame(page, record.entry.family, record.entry.mode)

      if (infoFrame) {
        const infoBounds = safeBounds(infoFrame)
        const stackKey = `${record.entry.family}:${record.entry.mode}`
        const stackIndex = infoStackCounts[stackKey] || 0
        infoStackCounts[stackKey] = stackIndex + 1

        record.position = {
          x: Math.round(infoBounds.x),
          y: Math.round(
            infoBounds.bottom +
              sourceInfoToFrameGap +
              stackIndex * (record.entry.viewportSize.height + rowGap),
          ),
        }
        record.placementAnchor = {
          type: "sourceInfo",
          outputFrameName: sourceInfoOutputFrameName(record.entry.family, record.entry.mode),
          figmaNodeId: infoFrame.id,
        }
        continue
      }

      const rowKey = `${record.entry.family}:${record.entry.caseId}`
      const row = rows.indexOf(rowKey)
      const column = modes.indexOf(record.entry.mode)

      record.position = {
        x: baseX + column * (maxWidth + columnGap),
        y: baseY + row * (maxHeight + rowGap),
      }
      record.placementAnchor = {
        type: "pageBounds",
      }
    }
  }
}

function finalizeRecordRevision(record, existingIndex) {
  const diagnostics = buildSourceDiagnostics(record.sourceSelection)
  const sourceFingerprint = hashString(stableStringify(diagnostics))
  const requestHash = hashString(
    stableStringify({
      prepVersion: prepVersion,
      family: record.entry.family,
      caseId: record.entry.caseId,
      mode: record.entry.mode,
      outputFrameName: record.entry.outputFrameName,
      viewportSize: record.entry.viewportSize,
      framing: record.entry.framing || {},
      selector: record.entry.selector,
      sourceFrameId: record.sourceSelection.sourceFrameId || null,
      sourceNodeIds: record.sourceSelection.sourceNodeIds,
      destinationPageId: record.destinationPage ? record.destinationPage.id : null,
      position: record.position,
      placementAnchor: record.placementAnchor || null,
    }),
  )

  const existing = existingIndex[record.entry.outputFrameName] || []
  const unmanaged = existing.filter((item) => !item.pluginManaged)
  const recoverableUnmanaged =
    record.replaceUnmanagedReflection && record.entry.outputFrameName.indexOf("reflection/") === 0
      ? unmanaged
      : []
  const blockingUnmanaged = unmanaged.filter((item) => {
    return recoverableUnmanaged.indexOf(item) === -1
  })
  const managed = existing.filter((item) => item.pluginManaged)
  const managedOnDestination = managed.filter((item) => {
    return record.destinationPage && item.page.id === record.destinationPage.id
  })
  const managedOnWrongPage = managed.filter((item) => {
    return !record.destinationPage || item.page.id !== record.destinationPage.id
  })
  const selectedExisting = managedOnDestination[0] || null
  const stored = selectedExisting ? parseStoredPayload(selectedExisting.node) : null

  let status = "missing"
  let reason = "no generated frame exists"

  if (blockingUnmanaged.length > 0) {
    status = "unmanagedConflict"
    reason = "a same-name frame exists without Reflection frame-prep metadata"
  } else if (recoverableUnmanaged.length > 0) {
    status = "stale"
    reason = "same-name unmanaged reflection frame will be replaced"
  } else if (managedOnWrongPage.length > 0 && managedOnDestination.length === 0) {
    status = "wrongPage"
    reason = "generated frame exists on another page"
  } else if (managedOnWrongPage.length > 0) {
    status = "wrongPage"
    reason = "duplicate generated frame exists on another page"
  } else if (selectedExisting) {
    const bounds = safeBounds(selectedExisting.node)
    const sameRevision =
      stored &&
      stored.requestHash === requestHash &&
      stored.sourceFingerprint === sourceFingerprint &&
      Math.round(bounds.x) === record.position.x &&
      Math.round(bounds.y) === record.position.y

    status = sameRevision ? "upToDate" : "stale"
    reason = sameRevision
      ? "generated frame matches current request"
      : "generated frame metadata is stale"
  }

  record.diagnostics = diagnostics
  record.sourceFingerprint = sourceFingerprint
  record.requestHash = requestHash
  record.existing = {
    unmanaged: unmanaged,
    recoverableUnmanaged: recoverableUnmanaged,
    blockingUnmanaged: blockingUnmanaged,
    managed: managed,
    managedOnDestination: managedOnDestination,
    managedOnWrongPage: managedOnWrongPage,
    selected: selectedExisting,
    stored: stored,
  }
  record.status = status
  record.reason = reason
}

function resultPayload(record, frameId) {
  return {
    family: record.entry.family,
    caseId: record.entry.caseId,
    mode: record.entry.mode,
    outputFrameName: record.entry.outputFrameName,
    figmaNodeId: frameId || null,
    status: record.status,
    reason: record.reason,
    destinationPageId: record.destinationPage ? record.destinationPage.id : null,
    destinationPageName: record.destinationPage ? record.destinationPage.name : null,
    position: record.position,
    placementAnchor: record.placementAnchor || null,
    sourceNodeId: record.sourceSelection.sourceNodeId,
    sourceNodeIds: record.sourceSelection.sourceNodeIds,
    viewportSize: record.entry.viewportSize,
    requestHash: record.requestHash,
    sourceFingerprint: record.sourceFingerprint,
    diagnostics: record.diagnostics,
  }
}

async function prepareReflectionFrames(params) {
  const frames = readFrameEntries(params)
  const safeParams = params || {}
  const dryRun = safeParams.dryRun !== false
  const replace = Boolean(safeParams.replace)
  const expectedFileKey = safeParams.fileKey ? safeParams.fileKey : null

  if (expectedFileKey && figma.fileKey && figma.fileKey !== expectedFileKey) {
    throw new Error(`Connected file key ${figma.fileKey} does not match ${expectedFileKey}`)
  }

  if (typeof figma.loadAllPagesAsync === "function") {
    post({ type: "STATUS", message: "Loading Figma pages..." })
    await figma.loadAllPagesAsync()
  }

  const result = {
    success: true,
    dryRun: dryRun,
    replace: replace,
    destination: safeParams.destination || "source-page",
    fileKey: figma.fileKey || null,
    outputPage: safeParams.outputPage || null,
    total: frames.length,
    planned: [],
    created: [],
    replaced: [],
    movedFromPage: [],
    upToDate: [],
    conflicts: [],
    missing: [],
    errors: [],
  }
  const records = []
  for (let index = 0; index < frames.length; index += 1) {
    const entry = frames[index]

    try {
      post({
        type: "STATUS",
        message: `Resolving ${entry.outputFrameName}...`,
      })
      const sourceSelection = await selectSource(entry)
      const destinationPage = resolveDestinationPage(entry, sourceSelection, safeParams, dryRun)

      records.push({
        entry: entry,
        sourceSelection: sourceSelection,
        destinationPage: destinationPage,
        replaceUnmanagedReflection: Boolean(safeParams.replaceUnmanagedReflection),
      })
    } catch (error) {
      const issue = {
        family: entry.family,
        caseId: entry.caseId,
        mode: entry.mode,
        outputFrameName: entry.outputFrameName,
        error: errorMessage(error),
      }

      if (/missing|could not find/i.test(issue.error)) result.missing.push(issue)
      else result.errors.push(issue)
    }
  }

  assignPositions(records)

  const outputFrameNames = Object.create(null)
  for (let index = 0; index < records.length; index += 1) {
    outputFrameNames[records[index].entry.outputFrameName] = true
  }

  post({ type: "STATUS", message: "Indexing existing Reflection frames..." })
  const existingIndex = buildExistingReflectionFrameIndex(outputFrameNames, uniquePages(records))

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index]

    try {
      finalizeRecordRevision(record, existingIndex)

      if (record.status === "unmanagedConflict") {
        result.conflicts.push(resultPayload(record, null))
        continue
      }

      if (dryRun) {
        const payload = resultPayload(
          record,
          record.existing.selected ? record.existing.selected.node.id : null,
        )
        payload.action = dryRunAction(record, replace)
        result.planned.push(payload)

        if ((record.status === "stale" || record.status === "wrongPage") && !replace) {
          result.conflicts.push(payload)
        }
        continue
      }

      if (record.status === "upToDate") {
        result.upToDate.push(resultPayload(record, record.existing.selected.node.id))
        continue
      }

      if ((record.status === "stale" || record.status === "wrongPage") && !replace) {
        result.conflicts.push(resultPayload(record, null))
        continue
      }

      const removedWrongPages = []
      const replacedUnmanaged = []
      const removableExisting = record.existing.managed.concat(
        record.existing.recoverableUnmanaged || [],
      )
      for (let managedIndex = 0; managedIndex < removableExisting.length; managedIndex += 1) {
        const existing = removableExisting[managedIndex]
        if (!existing.pluginManaged) {
          replacedUnmanaged.push({
            figmaNodeId: existing.node.id,
            pageId: existing.page.id,
            pageName: existing.page.name,
          })
        }
        if (record.destinationPage && existing.page.id !== record.destinationPage.id) {
          removedWrongPages.push({
            figmaNodeId: existing.node.id,
            pageId: existing.page.id,
            pageName: existing.page.name,
          })
        }
        existing.node.remove()
      }

      const created = await createOutputFrame(record)
      const payload = resultPayload(record, created.id)
      payload.movedFromPage = removedWrongPages
      payload.replacedUnmanaged = replacedUnmanaged

      if (removedWrongPages.length > 0) result.movedFromPage.push(payload)
      if (record.status === "missing") result.created.push(payload)
      else result.replaced.push(payload)
    } catch (error) {
      result.errors.push({
        family: record.entry.family,
        caseId: record.entry.caseId,
        mode: record.entry.mode,
        outputFrameName: record.entry.outputFrameName,
        error: errorMessage(error),
      })
    }
  }

  if (result.conflicts.length > 0 || result.missing.length > 0 || result.errors.length > 0) {
    result.success = false
  }

  return result
}

async function inspectSourceFrameRegistry(params) {
  const entries = readSourceRegistryEntries(params)
  const safeParams = params || {}
  const expectedFileKey = safeParams.fileKey ? safeParams.fileKey : null
  const writeInfoFrames = Boolean(safeParams.writeInfoFrames)
  const dryRun = safeParams.dryRun !== false
  const replace = Boolean(safeParams.replace)

  if (expectedFileKey && figma.fileKey && figma.fileKey !== expectedFileKey) {
    throw new Error(`Connected file key ${figma.fileKey} does not match ${expectedFileKey}`)
  }

  if (typeof figma.loadAllPagesAsync === "function") {
    post({ type: "STATUS", message: "Loading Figma pages..." })
    await figma.loadAllPagesAsync()
  }

  const result = {
    success: true,
    dryRun: dryRun,
    writeInfoFrames: writeInfoFrames,
    replace: replace,
    fileKey: figma.fileKey || null,
    total: entries.length,
    found: [],
    planned: [],
    created: [],
    replaced: [],
    upToDate: [],
    conflicts: [],
    missing: [],
    errors: [],
  }
  const records = []

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]

    try {
      post({
        type: "STATUS",
        message: `Inspecting ${entry.family}/${entry.mode}...`,
      })

      const sourceFrame = await resolveNodeById(entry.sourceFrameId)
      if (!sourceFrame) {
        result.missing.push({
          family: entry.family,
          mode: entry.mode,
          sourceFrameId: entry.sourceFrameId,
          sourceFrameUrl: entry.sourceFrameUrl || null,
          error: `Missing source frame ${entry.sourceFrameId}`,
        })
        continue
      }

      const info = buildSourceFrameInfo(entry, sourceFrame)
      const destinationPage = findPageAncestor(sourceFrame)
      const outputFrameName = sourceInfoFrameName(entry)
      const requestHash = hashString(
        stableStringify({
          kind: "source-info",
          prepVersion: prepVersion,
          family: info.family,
          mode: info.mode,
          sourceFrameId: info.sourceFrameId,
          sourceFingerprint: info.sourceFingerprint,
          outputFrameName: outputFrameName,
        }),
      )

      result.found.push(info)
      records.push({
        entry: entry,
        info: info,
        destinationPage: destinationPage,
        outputFrameName: outputFrameName,
        requestHash: requestHash,
      })
    } catch (error) {
      result.errors.push({
        family: entry.family,
        mode: entry.mode,
        sourceFrameId: entry.sourceFrameId,
        sourceFrameUrl: entry.sourceFrameUrl || null,
        error: errorMessage(error),
      })
    }
  }

  assignSourceInfoPositions(records)

  if (writeInfoFrames) {
    await loadInfoFonts()
  }

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index]

    try {
      const existing = findExistingSourceInfoFrames(record.outputFrameName, [
        figma.currentPage,
        record.destinationPage,
      ])
      const unmanaged = existing.filter((item) => !item.pluginManaged)
      const managed = existing.filter((item) => item.pluginManaged)
      const selected = managed[0] || null
      const stored = selected ? parseStoredPayload(selected.node) : null
      const upToDate =
        selected &&
        stored &&
        stored.kind === "source-info" &&
        stored.requestHash === record.requestHash

      const payload = {
        family: record.info.family,
        mode: record.info.mode,
        outputFrameName: record.outputFrameName,
        sourceFrameId: record.info.sourceFrameId,
        pageId: record.info.pageId,
        pageName: record.info.pageName,
        position: record.position,
        sourceFingerprint: record.info.sourceFingerprint,
        requestHash: record.requestHash,
        figmaNodeId: selected ? selected.node.id : null,
        status: unmanaged.length > 0 ? "unmanagedConflict" : upToDate ? "upToDate" : "stale",
      }

      if (unmanaged.length > 0) {
        result.conflicts.push(payload)
        continue
      }

      if (dryRun || !writeInfoFrames) {
        payload.action = selected
          ? upToDate
            ? "none"
            : replace
              ? "wouldReplace"
              : "replaceRequired"
          : "wouldCreate"
        result.planned.push(payload)
        if (selected && !upToDate && !replace) result.conflicts.push(payload)
        continue
      }

      if (upToDate) {
        result.upToDate.push(payload)
        continue
      }

      if (selected && !replace) {
        result.conflicts.push(payload)
        continue
      }

      for (let managedIndex = 0; managedIndex < managed.length; managedIndex += 1) {
        managed[managedIndex].node.remove()
      }

      const created = createSourceInfoFrame(record)
      payload.figmaNodeId = created.id
      if (selected) result.replaced.push(payload)
      else result.created.push(payload)
    } catch (error) {
      result.errors.push({
        family: record.info.family,
        mode: record.info.mode,
        sourceFrameId: record.info.sourceFrameId,
        error: errorMessage(error),
      })
    }
  }

  if (result.missing.length > 0 || result.errors.length > 0 || result.conflicts.length > 0) {
    result.success = false
  }
  return result
}

function dryRunAction(record, replace) {
  if (record.status === "upToDate") return "none"
  if (record.status === "missing") return "wouldCreate"
  if (record.status === "wrongPage") return replace ? "wouldMove" : "replaceRequired"
  if (record.status === "stale") return replace ? "wouldReplace" : "replaceRequired"
  return "blocked"
}

function bytesToBase64(bytes) {
  if (typeof figma.base64Encode === "function") return figma.base64Encode(bytes)

  let binary = ""
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.slice(index, index + chunkSize)
    binary += String.fromCharCode.apply(null, Array.prototype.slice.call(chunk))
  }
  return btoa(binary)
}

async function exportReflectionFrames(params) {
  const frames = readExportEntries(params)
  const result = {
    success: true,
    total: frames.length,
    exported: [],
    missing: [],
    errors: [],
  }

  for (let index = 0; index < frames.length; index += 1) {
    const entry = frames[index]

    try {
      const node = await resolveNodeById(entry.figmaNodeId)
      if (!node) {
        result.missing.push({
          caseId: entry.caseId,
          family: entry.family,
          mode: entry.mode,
          figmaNodeId: entry.figmaNodeId,
          baseline: entry.baseline,
          error: `Missing frame ${entry.figmaNodeId}`,
        })
        continue
      }

      if (typeof node.exportAsync !== "function") {
        result.errors.push({
          caseId: entry.caseId,
          family: entry.family,
          mode: entry.mode,
          figmaNodeId: entry.figmaNodeId,
          baseline: entry.baseline,
          error: `Node ${entry.figmaNodeId} cannot be exported`,
        })
        continue
      }

      const bytes = await node.exportAsync({
        format: "PNG",
        constraint: {
          type: "SCALE",
          value: entry.exportScale || 1,
        },
      })

      result.exported.push({
        caseId: entry.caseId,
        family: entry.family,
        mode: entry.mode,
        outputFrameName: entry.figmaFrameName || null,
        figmaNodeId: entry.figmaNodeId,
        baseline: entry.baseline,
        viewportSize: entry.viewportSize || null,
        byteLength: bytes.length,
        pngBase64: bytesToBase64(bytes),
      })
    } catch (error) {
      result.errors.push({
        caseId: entry.caseId,
        family: entry.family,
        mode: entry.mode,
        figmaNodeId: entry.figmaNodeId,
        baseline: entry.baseline,
        error: errorMessage(error),
      })
    }
  }

  if (result.missing.length > 0 || result.errors.length > 0) result.success = false
  return result
}

async function sendExportReflectionFrames(requestId, params) {
  try {
    post({ type: "STATUS", message: "Exporting Reflection frames..." })
    const result = await exportReflectionFrames(params || {})

    post({
      type: "EXPORT_REFLECTION_FRAMES_RESULT",
      requestId: requestId,
      success: result.success,
      data: result,
    })

    post({
      type: "STATUS",
      message: result.success
        ? `Exported ${result.exported.length}/${result.total} Reflection frame PNG(s)`
        : "Reflection frame export needs attention",
    })
  } catch (error) {
    const message = errorMessage(error)

    post({
      type: "EXPORT_REFLECTION_FRAMES_RESULT",
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

async function sendInspectSourceFrameRegistry(requestId, params) {
  try {
    post({ type: "STATUS", message: "Inspecting source frame registry..." })
    const result = await inspectSourceFrameRegistry(params || {})

    post({
      type: "INSPECT_SOURCE_FRAME_REGISTRY_RESULT",
      requestId: requestId,
      success: result.success,
      data: result,
    })

    post({
      type: "STATUS",
      message: `Inspected ${result.found.length}/${result.total} source frames`,
    })
  } catch (error) {
    const message = errorMessage(error)

    post({
      type: "INSPECT_SOURCE_FRAME_REGISTRY_RESULT",
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

async function sendPrepareReflectionFrames(requestId, params) {
  try {
    post({ type: "STATUS", message: "Preparing Reflection frames..." })
    const result = await prepareReflectionFrames(params || {})

    post({
      type: "PREPARE_REFLECTION_FRAMES_RESULT",
      requestId: requestId,
      success: result.success,
      data: result,
    })

    const changed = result.created.length + result.replaced.length + result.movedFromPage.length
    const planned = result.planned.length
    post({
      type: "STATUS",
      message: result.success
        ? `${result.dryRun ? "Previewed" : "Prepared"} ${result.dryRun ? planned : changed} Reflection frames`
        : "Reflection frame prep needs attention",
    })
  } catch (error) {
    const message = errorMessage(error)

    post({
      type: "PREPARE_REFLECTION_FRAMES_RESULT",
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

figma.ui.onmessage = (message) => {
  if (!message || !message.type) return

  if (message.type === "GET_FILE_INFO") {
    sendFileInfo(message.requestId)
    return
  }

  if (message.type === "PREPARE_REFLECTION_FRAMES") {
    sendPrepareReflectionFrames(message.requestId, message.params)
    return
  }

  if (message.type === "INSPECT_SOURCE_FRAME_REGISTRY") {
    sendInspectSourceFrameRegistry(message.requestId, message.params)
    return
  }

  if (message.type === "EXPORT_REFLECTION_FRAMES") {
    sendExportReflectionFrames(message.requestId, message.params)
  }
}

sendFileInfo()
