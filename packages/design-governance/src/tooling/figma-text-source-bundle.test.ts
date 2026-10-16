import { createHash } from "node:crypto"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import { createFigmaTextSourceBundle } from "./figma-text-source-bundle.mjs"

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex")
const transform = (x: number, y: number): [[number, number, number], [number, number, number]] => [
  [1, 0, x],
  [0, 1, y],
]
function fixture() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "marwes-text-bundle-")))
  roots.push(root)
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4nGP8z8jEwMLM/B8ACTsCDQhl4SkAAAAASUVORK5CYII=",
    "base64",
  )
  writeFileSync(join(root, "reference.png"), png)
  const text = {
    nodeId: "I1:2;3:4",
    name: "Cancel",
    characters: "Refresh",
    absoluteBoundingBox: { x: -19.75, y: 10.125, width: 1, height: 0.75 },
    absoluteTransform: transform(-19.75, 10.125),
    fontName: {
      family: "Instrument Sans",
      style: "Medium",
      variationSettings: { wght: 500, wdth: 100 },
    },
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: { unit: "PERCENT", value: -3 },
    lineHeight: { unit: "PIXELS", value: 16 },
    fills: [{ type: "SOLID", visible: true, opacity: 1, color: { r: 0, g: 0, b: 0 } }] satisfies [
      {
        type: string
        visible: boolean
        opacity: number
        color: { r: number; g: number; b: number }
      },
    ],
  }
  type TextSource = Omit<typeof text, "fontName" | "fontWeight"> & {
    fontName: typeof text.fontName | string
    fontWeight?: number
    styledSegments?: Array<{ characters: string; fontWeight: number }>
  }
  type CaptureMetadata = {
    nodeId: string
    type: string
    absoluteBoundingBox: typeof text.absoluteBoundingBox
    absoluteTransform: ReturnType<typeof transform>
    absoluteRenderBounds?: typeof text.absoluteBoundingBox
    textNodes: [TextSource]
    resolvedVariableModes: Record<string, string>
  }
  type CaptureValue = {
    value: ReturnType<typeof createCaptureValue>
    path: string
    save: () => void
    svg: Buffer
  }
  const captures: CaptureValue[] = []
  function createCaptureValue(nodeId: string, metadata: CaptureMetadata, svg: Buffer) {
    const fileIdentity: {
      expectedFileKey: string
      expectedFileName: string
      reportedFileKey: string | null
      reportedFileName: string
      verification: string
    } = {
      expectedFileKey: "file-key",
      expectedFileName: "Marwes",
      reportedFileKey: null,
      reportedFileName: "Marwes",
      verification: "caller-verified-file-name",
    }
    return {
      schema: "marwes.figma-outlined-source/v1",
      sourceScope: "live-diagnostic-observation",
      capturedAt: "2026-10-15T19:57:18.075Z",
      success: true,
      errors: [],
      fileIdentity,
      callerVerifiedFileUrl: "https://www.figma.com/design/file-key/Marwes",
      nodeIds: [nodeId],
      exportSettings: {
        format: "SVG",
        svgOutlineText: true,
        svgSimplifyStroke: false,
        svgIdAttribute: true,
      },
      artifacts: [
        {
          nodeId,
          metadata,
          path: "source.svg",
          mimeType: "image/svg+xml",
          bytes: svg.length,
          byteLength: svg.length,
          sha256: digest(svg),
        },
      ] satisfies [
        {
          nodeId: string
          metadata: CaptureMetadata
          path: string
          mimeType: string
          bytes: number
          byteLength: number
          sha256: string
        },
      ],
    }
  }
  function capture(
    folder: string,
    nodeId: string,
    metadata: CaptureMetadata,
    width: number,
    height: number,
  ) {
    const directory = join(root, folder)
    mkdirSync(directory)
    const svg = Buffer.from(
      `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><path d="M0 0Z"/></svg>`,
    )
    const value = createCaptureValue(nodeId, metadata, svg)
    const path = join(directory, "capture.json")
    const save = () => writeFileSync(path, JSON.stringify(value))
    save()
    writeFileSync(join(directory, "source.svg"), svg)
    captures.push({ value, path, save, svg })
    return { capturePath: path, nodeId }
  }
  const frame = capture(
    "frame",
    "1:2",
    {
      nodeId: "1:2",
      type: "FRAME",
      absoluteBoundingBox: { x: -20, y: 10, width: 2, height: 1 },
      absoluteTransform: transform(-20, 10),
      textNodes: [text],
      resolvedVariableModes: { theme: "light" },
    },
    2,
    1,
  )
  const label = capture(
    "label",
    "3:4",
    {
      nodeId: "3:4",
      type: "TEXT",
      absoluteBoundingBox: { x: 100, y: 200, width: 1, height: 0.75 },
      absoluteRenderBounds: { x: 100.015625, y: 200.03125, width: 0.8, height: 0.5 },
      absoluteTransform: transform(100, 200),
      textNodes: [{ ...structuredClone(text), nodeId: "3:4" }],
      resolvedVariableModes: { theme: "light" },
    },
    1,
    1,
  )
  return {
    root,
    captures: [
      requireValue(captures[0], "Frame capture"),
      requireValue(captures[1], "Label capture"),
    ] as const,
    options: {
      frame,
      parts: [{ id: "label", nodeId: text.nodeId, outline: label }],
      expectedFile: { key: "file-key", name: "Marwes" },
      context: { adapter: "react", theme: "light" },
      reference: {
        path: join(root, "reference.png"),
        nodeId: "1:2",
        mediaType: "image/png",
        bytes: png.length,
        sha256: digest(png),
      },
      outputDirectory: join(root, "output"),
    },
  }
}

describe("Figma text source bundle conversion", () => {
  it("preserves original bytes, actual text, precise coordinates and live caller-attested identity", async () => {
    const { options, captures } = fixture()
    const result = await createFigmaTextSourceBundle(options)
    expect(result.bundle.schema).toBe("reflection.text-source/v1")
    expect(result.bundle.source).toMatchObject({
      scope: "live-diagnostic",
      sourceVersion: null,
      document: { id: null },
      fileIdentity: { reportedId: null, attestedId: "file-key", verification: "caller-attested" },
    })
    expect(result.bundle.parts[0]).toMatchObject({
      expectedText: "Refresh",
      layerName: "Cancel",
      baseline: null,
      transform: null,
      box: { x: 0.25, y: 0.125, width: 1, height: 0.75, basis: "observed" },
      typography: { weight: 500, tracking: { unit: "percent", value: -3 } },
      fontAsset: { sha256: null },
    })
    expect(
      requireValue(result.bundle.parts[0], "Required figma-text-source-bundle.test value")
        .typography,
    ).not.toHaveProperty("direction")
    expect(
      requireValue(result.bundle.outlines[1], "Required figma-text-source-bundle.test value")
        .bounds,
    ).toEqual({
      x: 0.265625,
      y: 0.15625,
      width: 1,
      height: 1,
    })
    expect(readFileSync(join(result.directory, "part-0.svg"))).toEqual(captures[1].svg)
    expect(readFileSync(join(result.directory, "provenance/capture-0/capture.json"))).toEqual(
      readFileSync(captures[0].path),
    )
    expect(result.receipt).toMatchObject({ approval: "none", referencePromotion: "none" })
  })

  it("fails before creating output on tampered SVG/reference bytes", async () => {
    for (const kind of ["svg", "reference"]) {
      const { options, captures } = fixture()
      writeFileSync(
        kind === "svg" ? join(captures[1].path, "../source.svg") : options.reference.path,
        "tampered",
      )
      await expect(createFigmaTextSourceBundle(options)).rejects.toThrow("bytes/hash")
      expect(existsSync(options.outputDirectory)).toBe(false)
    }
  })

  it.each([
    "identity",
    "scope",
    "characters",
    "paint",
    "modes",
    "geometry",
    "mixed",
    "transform",
    "traversal",
    "segments",
    "unknown-mode",
    "reference-identity",
  ])("rejects inconsistent %s source facts", async (kind) => {
    const { options, captures } = fixture()
    const frame = captures[0].value
    const label = captures[1].value
    if (kind === "identity") label.fileIdentity.reportedFileKey = "other"
    if (kind === "scope") frame.sourceScope = "pinned"
    if (kind === "characters") label.artifacts[0].metadata.textNodes[0].characters = "Cancel"
    if (kind === "paint") label.artifacts[0].metadata.textNodes[0].fills[0].color.r = 1
    if (kind === "modes") label.artifacts[0].metadata.resolvedVariableModes.theme = "dark"
    if (kind === "geometry") frame.artifacts[0].metadata.absoluteBoundingBox.width = 3
    if (kind === "mixed") frame.artifacts[0].metadata.textNodes[0].fontName = "mixed"
    if (kind === "transform") frame.artifacts[0].metadata.absoluteTransform[0][0] = 2
    if (kind === "traversal") label.artifacts[0].path = "../source.svg"
    if (kind === "segments")
      frame.artifacts[0].metadata.textNodes[0].styledSegments = [
        { characters: "Refresh", fontWeight: 600 },
      ]
    if (kind === "unknown-mode")
      label.artifacts[0].metadata.resolvedVariableModes.other = "unverified"
    if (kind === "reference-identity") options.reference.nodeId = "other:frame"
    for (const capture of captures) capture.save()
    await expect(createFigmaTextSourceBundle(options)).rejects.toThrow()
    expect(existsSync(options.outputDirectory)).toBe(false)
  })

  it("rejects symlinked inputs and destination parents and never overwrites an existing output", async () => {
    const { root, options, captures } = fixture()
    const linked = join(dirnameOf(captures[1].path), "linked.svg")
    symlinkSync(join(dirnameOf(captures[1].path), "source.svg"), linked)
    captures[1].value.artifacts[0].path = "linked.svg"
    captures[1].save()
    await expect(createFigmaTextSourceBundle(options)).rejects.toThrow()
    captures[1].value.artifacts[0].path = "source.svg"
    captures[1].save()
    symlinkSync(root, join(root, "alias"))
    await expect(
      createFigmaTextSourceBundle({ ...options, outputDirectory: join(root, "alias", "output") }),
    ).rejects.toThrow("Symlink")
    await createFigmaTextSourceBundle(options)
    const original = readFileSync(join(options.outputDirectory, "bundle.json"))
    await expect(createFigmaTextSourceBundle(options)).rejects.toThrow("EEXIST")
    expect(readFileSync(join(options.outputDirectory, "bundle.json"))).toEqual(original)
  })

  it("distinguishes plugin-reported identity from caller-attested identity without inventing a source version", async () => {
    const { options, captures } = fixture()
    for (const capture of captures) {
      capture.value.fileIdentity.reportedFileKey = "file-key"
      capture.value.fileIdentity.verification = "reported-key"
      const { callerVerifiedFileUrl: _attestation, ...withoutAttestation } = capture.value
      writeFileSync(capture.path, JSON.stringify(withoutAttestation))
    }
    const result = await createFigmaTextSourceBundle(options)
    expect(result.bundle.source.fileIdentity).toEqual({
      reportedId: "file-key",
      attestedId: null,
      verification: "reported",
    })
    expect(result.bundle.source.sourceVersion).toBeNull()
    expect(result.bundle.source.scope).toBe("live-diagnostic")
  })

  it("keeps missing weight unknown and can omit optional individual outlines", async () => {
    const { options, captures } = fixture()
    const frameMetadata = captures[0].value.artifacts[0].metadata
    const { fontWeight: _weight, ...withoutWeight } = frameMetadata.textNodes[0]
    frameMetadata.textNodes[0] = withoutWeight
    captures[0].save()
    const result = await createFigmaTextSourceBundle({
      ...options,
      parts: [
        {
          id: "label",
          nodeId: requireValue(options.parts[0], "Required figma-text-source-bundle.test value")
            .nodeId,
        },
      ],
    })
    expect(
      requireValue(result.bundle.parts[0], "Required figma-text-source-bundle.test value")
        .typography,
    ).not.toHaveProperty("weight")
    expect(result.bundle.outlines).toHaveLength(1)
  })
})
function dirnameOf(path: string) {
  return join(path, "..")
}
