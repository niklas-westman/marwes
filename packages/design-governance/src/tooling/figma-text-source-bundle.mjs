import { createHash } from "node:crypto"
import { constants } from "node:fs"
import { lstat, mkdir, open, writeFile } from "node:fs/promises"
import { dirname, isAbsolute, join, parse, relative, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex")
const fail = (message) => {
  throw new Error(message)
}
const finite = (value) => typeof value === "number" && Number.isFinite(value)
const idPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/
const artifact = (id, role, path, mediaType, bytes) => ({
  id,
  role,
  path,
  mediaType,
  bytes: bytes.length,
  sha256: hash(bytes),
})

async function noSymlinks(path) {
  const absolute = resolve(path)
  let current = parse(absolute).root
  for (const part of relative(current, absolute).split("/").filter(Boolean)) {
    current = join(current, part)
    if ((await lstat(current)).isSymbolicLink()) fail(`Symlinked input or destination: ${current}`)
  }
  return absolute
}

async function readSafe(path, limit) {
  await noSymlinks(path)
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const stat = await handle.stat()
    if (!stat.isFile() || stat.size <= 0 || stat.size > limit)
      fail(`Invalid or oversized input: ${path}`)
    return await handle.readFile()
  } finally {
    await handle.close()
  }
}

function safeRelative(path) {
  if (
    typeof path !== "string" ||
    !path ||
    isAbsolute(path) ||
    path.includes("\\") ||
    path.includes("\0") ||
    /^[A-Za-z]:/.test(path) ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  )
    fail("Unsafe capture artifact path")
  return path
}

function verifyBytes(bytes, record) {
  if (
    record.bytes !== bytes.length ||
    record.sha256 !== hash(bytes) ||
    (record.byteLength !== undefined && record.byteLength !== bytes.length)
  )
    fail("Input artifact bytes/hash mismatch")
}

function verifyIdentity(capture, expected) {
  const identity = capture.fileIdentity
  if (
    !expected?.key ||
    !expected.name ||
    identity?.expectedFileKey !== expected.key ||
    identity.expectedFileName !== expected.name ||
    identity.reportedFileName !== expected.name
  )
    fail("Capture file identity mismatch")
  if (identity.reportedFileKey !== null) {
    if (identity.reportedFileKey !== expected.key || identity.verification !== "reported-key")
      fail("Capture reported file identity mismatch")
    return { reportedId: identity.reportedFileKey, attestedId: null, verification: "reported" }
  }
  let url
  try {
    url = new URL(capture.callerVerifiedFileUrl)
  } catch {
    fail("Missing caller-attested file URL")
  }
  if (
    identity.verification !== "caller-verified-file-name" ||
    url.protocol !== "https:" ||
    !["figma.com", "www.figma.com"].includes(url.hostname) ||
    url.pathname.split("/")[2] !== expected.key ||
    !["design", "file"].includes(url.pathname.split("/")[1])
  )
    fail("Invalid caller-attested file identity")
  return { reportedId: null, attestedId: expected.key, verification: "caller-attested" }
}

async function loadCapture(selection, expected) {
  const capturePath = resolve(selection.capturePath)
  const bytes = await readSafe(capturePath, 1024 * 1024)
  const capture = JSON.parse(bytes.toString("utf8"))
  if (
    capture.schema !== "marwes.figma-outlined-source/v1" ||
    capture.sourceScope !== "live-diagnostic-observation" ||
    !capture.success ||
    capture.errors?.length ||
    capture.exportSettings?.format !== "SVG" ||
    capture.exportSettings.svgOutlineText !== true ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      capture.capturedAt,
    ) ||
    !Number.isFinite(Date.parse(capture.capturedAt))
  )
    fail("Unsupported or incomplete outlined-source capture")
  const identity = verifyIdentity(capture, expected)
  if (
    !Array.isArray(capture.artifacts) ||
    capture.artifacts.length > 16 ||
    !Array.isArray(capture.nodeIds)
  )
    fail("Invalid capture artifact inventory")
  const files = []
  const nodes = new Set()
  const paths = new Set()
  for (const entry of capture.artifacts) {
    if (
      nodes.has(entry.nodeId) ||
      paths.has(entry.path) ||
      entry.metadata?.nodeId !== entry.nodeId ||
      !capture.nodeIds.includes(entry.nodeId) ||
      entry.mimeType !== "image/svg+xml"
    )
      fail("Capture artifact identity mismatch")
    nodes.add(entry.nodeId)
    paths.add(entry.path)
    const svg = await readSafe(
      join(dirname(capturePath), safeRelative(entry.path)),
      2 * 1024 * 1024,
    )
    verifyBytes(svg, entry)
    files.push({ entry, bytes: svg })
  }
  if (nodes.size !== capture.nodeIds.length || new Set(capture.nodeIds).size !== nodes.size)
    fail("Capture inventory mismatch")
  const selected = files.find(({ entry }) => entry.nodeId === selection.nodeId)
  if (!selected) fail("Selected source node is missing")
  if (files.reduce((total, file) => total + file.bytes.length, bytes.length) > 8 * 1024 * 1024)
    fail("Capture exceeds size limit")
  return { capturePath, capture, bytes, files, selected, identity }
}

function box(value) {
  if (
    !value ||
    ![value.x, value.y, value.width, value.height].every(finite) ||
    value.width <= 0 ||
    value.height <= 0
  )
    fail("Source bounding box is unavailable")
  return { x: value.x, y: value.y, width: value.width, height: value.height }
}
function translationOnly(metadata) {
  const matrix = metadata.absoluteTransform
  if (
    !Array.isArray(matrix) ||
    matrix.length !== 2 ||
    matrix.some((row) => !Array.isArray(row) || row.length !== 3 || !row.every(finite)) ||
    matrix[0][0] !== 1 ||
    matrix[0][1] !== 0 ||
    matrix[1][0] !== 0 ||
    matrix[1][1] !== 1
  )
    fail("Rotated, scaled or unknown source transform is unsupported")
}
function svgSize(bytes) {
  const svg = bytes.toString("utf8")
  const root = svg.match(/^\s*<svg\b([^>]*)>/)
  if (!root || /<(?:text|script|foreignObject)\b/i.test(svg)) fail("Expected passive outlined SVG")
  const attr = (name) => root[1].match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]
  const width = Number(attr("width"))
  const height = Number(attr("height"))
  const viewBox = attr("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number)
  if (
    ![width, height].every((n) => finite(n) && n > 0 && n <= 16384) ||
    !viewBox ||
    viewBox.length !== 4 ||
    viewBox[0] !== 0 ||
    viewBox[1] !== 0 ||
    viewBox[2] !== width ||
    viewBox[3] !== height
  )
    fail("SVG dimensions require an unscaled origin-zero viewBox")
  return { width, height }
}
function typography(text) {
  if (
    typeof text.characters !== "string" ||
    !text.characters ||
    !text.fontName?.family ||
    !finite(text.fontSize) ||
    text.fontSize <= 0
  )
    fail("Source has mixed or unavailable text typography")
  if (text.styledSegments) {
    const segments = text.styledSegments
    if (
      !Array.isArray(segments) ||
      segments.length !== 1 ||
      segments[0].characters !== text.characters
    )
      fail("Mixed text styles are unsupported")
    for (const key of [
      "fontName",
      "fontSize",
      "fontWeight",
      "letterSpacing",
      "lineHeight",
      "fills",
    ])
      if (
        segments[0][key] !== undefined &&
        JSON.stringify(segments[0][key]) !== JSON.stringify(text[key])
      )
        fail("Styled segment contradicts source typography")
  }
  const result = { family: text.fontName.family, size: text.fontSize }
  if (typeof text.fontName.style === "string") result.style = text.fontName.style
  if (
    text.fontWeight !== undefined &&
    (!finite(text.fontWeight) || text.fontWeight < 1 || text.fontWeight > 1000)
  )
    fail("Source font weight is invalid")
  if (finite(text.fontWeight)) result.weight = text.fontWeight
  const axes = text.fontName.variationSettings
  if (axes && Object.values(axes).every(finite)) result.axes = axes
  for (const [input, output] of [
    ["letterSpacing", "tracking"],
    ["lineHeight", "lineHeight"],
  ]) {
    const value = text[input]
    if (value?.unit === "AUTO" && output === "lineHeight") result[output] = { unit: "normal" }
    else if (["PIXELS", "PERCENT"].includes(value?.unit) && finite(value.value))
      result[output] = { unit: value.unit === "PIXELS" ? "px" : "percent", value: value.value }
  }
  if (["ltr", "rtl"].includes(text.direction)) result.direction = text.direction
  const fills = text.fills?.filter((paint) => paint.visible !== false)
  if (
    fills?.length === 1 &&
    fills[0].type === "SOLID" &&
    (fills[0].opacity ?? 1) === 1 &&
    [fills[0].color?.r, fills[0].color?.g, fills[0].color?.b].every(
      (n) => finite(n) && n >= 0 && n <= 1,
    )
  )
    result.color = `#${["r", "g", "b"]
      .map((channel) =>
        Math.round(fills[0].color[channel] * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`
  return result
}

/** Convert explicit independent Figma captures to a fresh, offline diagnostics bundle.
 * reference is a caller-selected staged asset with {path,nodeId,sha256,bytes,mediaType}.
 * No acceptance, active configuration, source version or promotion is inferred.
 */
export async function createFigmaTextSourceBundle(options) {
  const { frame, parts, expectedFile, reference, context = {}, outputDirectory } = options
  if (
    !Array.isArray(parts) ||
    parts.length < 1 ||
    parts.length > 32 ||
    new Set(parts.map((part) => part.id)).size !== parts.length ||
    parts.some((part) => !idPattern.test(part.id))
  )
    fail("Unique explicit text part selections are required")
  if (Object.entries(context).some(([key, value]) => !key || typeof value !== "string"))
    fail("Context must contain string values")
  const source = await loadCapture(frame, expectedFile)
  const metadata = source.selected.entry.metadata
  if (metadata.type !== "FRAME" || reference.nodeId !== frame.nodeId)
    fail("Reference must identify the selected source frame")
  translationOnly(metadata)
  const frameBox = box(metadata.absoluteBoundingBox)
  const frameSize = svgSize(source.selected.bytes)
  if (
    frameBox.width !== frameSize.width ||
    frameBox.height !== frameSize.height ||
    frameSize.width > 16384 ||
    frameSize.height > 16384
  )
    fail("Frame SVG and source viewport dimensions differ")
  if (
    metadata.absoluteRenderBounds &&
    JSON.stringify(box(metadata.absoluteRenderBounds)) !== JSON.stringify(frameBox)
  )
    fail("Frame export has expanded render bounds")
  const referenceBytes = await readSafe(resolve(reference.path), 16 * 1024 * 1024)
  verifyBytes(referenceBytes, reference)
  const reflectionEntry = fileURLToPath(import.meta.resolve("reflection-check"))
  const codec = await import(
    pathToFileURL(join(dirname(reflectionEntry), "contracts/visual/image-io.js")).href
  )
  const decoded = await codec.decodeImageBytes(referenceBytes, reference.path)
  const extension =
    reference.mediaType === "image/png"
      ? "png"
      : reference.mediaType === "image/webp"
        ? "webp"
        : fail("Reference must be PNG or WebP")
  if (
    (extension === "png" && decoded.format !== "png") ||
    (extension === "webp" && decoded.format !== "webp-lossless") ||
    decoded.image.width !== frameSize.width ||
    decoded.image.height !== frameSize.height
  )
    fail("Reference format or viewport does not match source frame")
  const outlines = [
    {
      ...artifact("frame", "outlined-source", "frame.svg", "image/svg+xml", source.selected.bytes),
      kind: "frame",
      nodeId: frame.nodeId,
      bounds: { x: 0, y: 0, ...frameSize },
    },
  ]
  const outputParts = []
  const provenance = []
  const copies = new Map([
    ["frame.svg", source.selected.bytes],
    [`reference.${extension}`, referenceBytes],
  ])
  const captures = new Map([[source.capturePath, source]])
  for (const [index, part] of parts.entries()) {
    const matches = metadata.textNodes?.filter((text) => text.nodeId === part.nodeId) ?? []
    if (matches.length !== 1)
      fail("Text selection must resolve exactly once inside the source frame")
    const text = matches[0]
    translationOnly(text)
    const absoluteBox = box(text.absoluteBoundingBox)
    const type = typography(text)
    const relativeBox = {
      x: absoluteBox.x - frameBox.x,
      y: absoluteBox.y - frameBox.y,
      width: absoluteBox.width,
      height: absoluteBox.height,
    }
    if (
      relativeBox.x < 0 ||
      relativeBox.y < 0 ||
      relativeBox.x + relativeBox.width > frameSize.width ||
      relativeBox.y + relativeBox.height > frameSize.height
    )
      fail("Text box falls outside the reference viewport")
    outputParts.push({
      id: part.id,
      expectedText: text.characters,
      nodeId: text.nodeId,
      ...(text.name ? { layerName: text.name } : {}),
      box: { ...relativeBox, basis: "observed" },
      baseline: null,
      transform: null,
      typography: type,
      fontAsset: { sha256: null, note: "Authoring-font binary is not independently known." },
    })
    if (part.outline) {
      const label = await loadCapture(part.outline, expectedFile)
      captures.set(label.capturePath, label)
      const labelMetadata = label.selected.entry.metadata
      const labelTexts =
        labelMetadata.textNodes?.filter((value) => value.nodeId === part.outline.nodeId) ?? []
      if (
        labelMetadata.type !== "TEXT" ||
        labelTexts.length !== 1 ||
        labelTexts[0].characters !== text.characters ||
        JSON.stringify(typography(labelTexts[0])) !== JSON.stringify(type) ||
        JSON.stringify(labelTexts[0].fills) !== JSON.stringify(text.fills)
      )
        fail("Separate outline text/typography/paint does not match frame text")
      translationOnly(labelMetadata)
      const labelBox = box(labelMetadata.absoluteBoundingBox)
      if (labelBox.width !== absoluteBox.width || labelBox.height !== absoluteBox.height)
        fail("Separate outline text box does not match frame text")
      const frameModes = metadata.resolvedVariableModes ?? {}
      const labelModes = labelMetadata.resolvedVariableModes ?? {}
      if (Object.entries(labelModes).some(([collection, mode]) => frameModes[collection] !== mode))
        fail("Separate outline variable modes differ from frame")
      const render = box(labelMetadata.absoluteRenderBounds)
      const bounds = {
        x: relativeBox.x + render.x - labelBox.x,
        y: relativeBox.y + render.y - labelBox.y,
        ...svgSize(label.selected.bytes),
      }
      const path = `part-${index}.svg`
      outlines.push({
        ...artifact(
          `outline-${part.id}`,
          "outlined-source",
          path,
          "image/svg+xml",
          label.selected.bytes,
        ),
        kind: "text-outline",
        nodeId: part.outline.nodeId,
        partIds: [part.id],
        bounds,
      })
      copies.set(path, label.selected.bytes)
      provenance.push({
        partId: part.id,
        frameTextNodeId: text.nodeId,
        outlinedTextNodeId: part.outline.nodeId,
        sourceRenderBounds: render,
        sourceTextBox: labelBox,
        coordinateConversion:
          "frame-relative text box plus outline render-bounds offset; intrinsic SVG extent preserved without rescaling",
      })
    }
  }
  const receipt = {
    schema: "marwes.figma-text-bundle-receipt/v1",
    scope: "live-diagnostic",
    approval: "none",
    referencePromotion: "none",
    referenceSelection: reference,
    captures: [],
    parts: provenance,
  }
  for (const [index, capture] of [...captures.values()].entries()) {
    const prefix = `provenance/capture-${index}`
    copies.set(`${prefix}/capture.json`, capture.bytes)
    for (const file of capture.files) copies.set(`${prefix}/${file.entry.path}`, file.bytes)
    receipt.captures.push({
      path: `${prefix}/capture.json`,
      sha256: hash(capture.bytes),
      bytes: capture.bytes.length,
      fileIdentity: capture.identity,
    })
  }
  const receiptBytes = Buffer.from(`${JSON.stringify(receipt, null, 2)}\n`)
  copies.set("receipt.json", receiptBytes)
  const bundle = {
    schema: "reflection.text-source/v1",
    source: {
      id: `figma:${expectedFile.key}:${hash(Buffer.from(frame.nodeId))}`,
      provider: "figma",
      scope: "live-diagnostic",
      capturedAt: source.capture.capturedAt,
      sourceVersion: null,
      document: {
        id: source.identity.reportedId,
        name: source.capture.fileIdentity.reportedFileName,
      },
      fileIdentity: source.identity,
      receipt: { id: `sha256:${hash(receiptBytes)}`, kind: "marwes-figma-capture-conversion" },
      exportSettings: source.capture.exportSettings,
    },
    context,
    viewport: { ...frameSize, deviceScaleFactor: 1 },
    reference: artifact(
      "reference",
      "reference",
      `reference.${extension}`,
      reference.mediaType,
      referenceBytes,
    ),
    outlines,
    parts: outputParts,
  }
  const bundleBytes = Buffer.from(`${JSON.stringify(bundle, null, 2)}\n`)
  if (
    bundleBytes.length > 1024 * 1024 ||
    outlines.reduce((size, outline) => size + outline.bytes, 0) > 8 * 1024 * 1024
  )
    fail("Reflection source bundle exceeds input limits")
  copies.set("bundle.json", bundleBytes)
  if ([...copies.values()].reduce((size, bytes) => size + bytes.length, 0) > 32 * 1024 * 1024)
    fail("Self-contained bundle exceeds size limit")
  const directory = resolve(outputDirectory)
  await noSymlinks(dirname(directory))
  // Non-recursive creation is deliberate: an existing destination is never reused.
  await mkdir(directory)
  for (const [path, bytes] of copies) {
    await mkdir(dirname(join(directory, path)), { recursive: true })
    await writeFile(join(directory, path), bytes, { flag: "wx" })
  }
  return { directory, bundlePath: join(directory, "bundle.json"), bundle, receipt }
}
