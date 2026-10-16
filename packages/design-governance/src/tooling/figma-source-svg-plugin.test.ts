import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { runInNewContext } from "node:vm"
import { describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { requireValue } from "../contracts/require-value.js"

const plugin = readFileSync(
  fileURLToPath(new URL("../../figma-plugin/code.js", import.meta.url)),
  "utf8",
)
const ui = requireValue(
  requireValue(
    readFileSync(
      fileURLToPath(new URL("../../figma-plugin/ui.html", import.meta.url)),
      "utf8",
    ).match(/<script>([\s\S]*?)<\/script>/),
    "Required figma-source-svg-plugin.test value",
  )[1],
  "Required figma-source-svg-plugin.test value",
)
const params = {
  nodeIds: ["I1:2;3:4"],
  expectedFileKey: "correctKey",
  expectedFileName: "Pinned file",
}
const responseSchema = z.object({
  type: z.literal("EXPORT_SOURCE_SVG_RESULT"),
  requestId: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
  data: z
    .object({
      identityVerification: z.string(),
      reportedFile: z.object({ fileKey: z.string().nullable() }),
      requestedFile: z.object({ fileKey: z.string() }),
      nodes: z.array(
        z.object({
          requestedNodeId: z.string(),
          svg: z.string(),
          metadata: z.object({ textNodes: z.array(z.unknown()).optional() }),
        }),
      ),
      errors: z.array(z.object({ nodeId: z.string(), error: z.string() })),
    })
    .optional(),
})
function harness(
  nodes: Record<string, unknown> = {},
  identity: { fileKey: string | null; name: string } = {
    fileKey: "correctKey",
    name: "Pinned file",
  },
) {
  const messages: unknown[] = []
  const figma = {
    showUI: vi.fn(),
    fileKey: identity.fileKey,
    root: { name: identity.name, children: [] },
    currentPage: { name: "Components", id: "0:1" },
    ui: {
      postMessage: (message: unknown) => messages.push(message),
      onmessage: (_message: unknown) => {},
    },
    variables: {
      getLocalVariablesAsync: async () => [],
      getLocalVariableCollectionsAsync: async () => [],
    },
    getNodeByIdAsync: vi.fn(async (id: string) => nodes[id] || null),
  }
  const context = { figma, __html__: "", Uint8Array }
  runInNewContext(plugin, context)
  return {
    figma,
    messages,
    async request(input: unknown = params, requestId = "request-1") {
      await runInNewContext("sendSourceSvg(requestId, params)", {
        ...context,
        requestId,
        params: input,
        sendSourceSvg: runInNewContext("sendSourceSvg", context),
      })
      const response = responseSchema.parse(
        messages
          .filter(
            (message) =>
              typeof message === "object" &&
              message !== null &&
              "type" in message &&
              message.type === "EXPORT_SOURCE_SVG_RESULT",
          )
          .at(-1),
      )
      return {
        ...response,
        get data() {
          return requireValue(response.data, "Expected export result data")
        },
      }
    },
  }
}
function exportNode(
  id = "I1:2;3:4",
  svg = '<svg xmlns="http://www.w3.org/2000/svg"><title>Å 😀</title></svg>',
) {
  const children: Record<string, unknown>[] = []
  return {
    id,
    name: "Button",
    type: "INSTANCE",
    width: 80,
    height: 40,
    children,
    exportAsync: vi.fn(async () => new Uint8Array(Buffer.from(svg))),
  }
}

describe("Marwes bridge read-only outlined SVG export", () => {
  it("exports exact UTF-8 SVG with independent source metadata and native outline settings", async () => {
    const node = exportNode()
    const mixed = Symbol("mixed")
    node.children.push({
      id: "3:4",
      name: "Label",
      type: "TEXT",
      characters: "Å 😀",
      fontSize: mixed,
      fontName: { family: "Instrument Sans", style: "Medium" },
    })
    const h = harness({ [node.id]: node })
    const result = await h.request()
    expect(result.success).toBe(true)
    expect(result.requestId).toBe("request-1")
    expect(result.data.identityVerification).toBe("reported-key")
    expect(requireValue(result.data.nodes[0], "Exported SVG node").svg).toContain("Å 😀")
    expect(
      requireValue(
        requireValue(result.data.nodes[0], "Exported SVG node").metadata.textNodes,
        "Exported text metadata",
      )[0],
    ).toMatchObject({
      characters: "Å 😀",
      fontSize: { mixed: true },
    })
    expect(node.exportAsync).toHaveBeenCalledWith({
      format: "SVG",
      svgOutlineText: true,
      svgSimplifyStroke: false,
      svgIdAttribute: true,
    })
    expect(node.name).toBe("Button")
    expect(node.children).toHaveLength(1)
  })

  it.each([
    { fileKey: "wrongKey", name: "Pinned file" },
    { fileKey: "correctKey", name: "Wrong file" },
    { fileKey: null, name: "Pinned file" },
  ])(
    "rejects unverified or mismatching identity before resolving/exporting nodes: %j",
    async (identity) => {
      const h = harness({}, identity)
      expect((await h.request()).success).toBe(false)
      expect(h.figma.getNodeByIdAsync).not.toHaveBeenCalled()
    },
  )

  it("reports explicit caller attestation without inventing a reported file key", async () => {
    const node = exportNode()
    const h = harness({ [node.id]: node }, { fileKey: null, name: "Pinned file" })
    const result = await h.request({ ...params, verifiedFileIdentity: true })
    expect(result.success).toBe(true)
    expect(result.data.identityVerification).toBe("caller-verified-file-name")
    expect(result.data.reportedFile.fileKey).toBeNull()
    expect(result.data.requestedFile.fileKey).toBe("correctKey")
  })

  it.each([
    { ...params, nodeIds: [] },
    { ...params, nodeIds: Array(17).fill("1:2") },
    { ...params, nodeIds: ["1:2", "1:2"] },
    { ...params, nodeIds: ["arbitrary"] },
    { ...params, nodeIds: ["1:2;bad"] },
    { ...params, expectedFileKey: "" },
    { ...params, unknown: true },
    { ...params, verifiedFileIdentity: "true" },
  ])("rejects malformed/oversized requests before accessing nodes", async (input) => {
    const h = harness()
    expect((await h.request(input)).success).toBe(false)
    expect(h.figma.getNodeByIdAsync).not.toHaveBeenCalled()
  })

  it("requires an explicit bounded correlation identity", async () => {
    const h = harness()
    expect((await h.request(params, "")).success).toBe(false)
    expect((await h.request(params, "x".repeat(129))).success).toBe(false)
    expect(h.figma.getNodeByIdAsync).not.toHaveBeenCalled()
  })

  it("isolates missing, unsupported and failed nodes while retaining successful exports", async () => {
    const good = exportNode("1:1")
    const bad = exportNode("1:3")
    bad.exportAsync.mockRejectedValue(new Error("Cannot export"))
    const h = harness({ "1:1": good, "1:3": bad, "1:4": { id: "1:4" } })
    const result = await h.request({ ...params, nodeIds: ["1:1", "1:2", "1:3", "1:4"] })
    expect(result.success).toBe(false)
    expect(
      result.data.nodes.map((node: { requestedNodeId: string }) => node.requestedNodeId),
    ).toEqual(["1:1"])
    expect(result.data.errors.map((error: { nodeId: string }) => error.nodeId)).toEqual([
      "1:2",
      "1:3",
      "1:4",
    ])
  })

  it.each([
    new Uint8Array([0xff]),
    new Uint8Array(2 * 1024 * 1024 + 1),
    new Uint8Array(Buffer.from("not SVG")),
  ])("rejects invalid UTF-8, oversized and non-SVG output", async (bytes) => {
    const node = exportNode()
    node.exportAsync.mockResolvedValue(bytes)
    const result = await harness({ [node.id]: node }).request()
    expect(result.success).toBe(false)
    expect(result.data.nodes).toHaveLength(0)
  })

  it("bounds the entire batch and rejects oversized subtrees before export", async () => {
    const ids = ["1:1", "1:2", "1:3", "1:4", "1:5"]
    const largeSvg = `<svg>${" ".repeat(2 * 1024 * 1024 - 11)}</svg>`
    const nodes = Object.fromEntries(ids.map((id) => [id, exportNode(id, largeSvg)]))
    const result = await harness(nodes).request({ ...params, nodeIds: ids })
    expect(result.data.nodes).toHaveLength(4)
    expect(requireValue(result.data.errors[0], "SVG export error").error).toContain("8 MiB")
    const subtree = exportNode()
    subtree.children = Array.from({ length: 512 }, () => ({ type: "RECTANGLE" }))
    const rejected = await harness({ [subtree.id]: subtree }).request()
    expect(requireValue(rejected.data.errors[0], "Rejected SVG error").error).toContain("512 nodes")
    expect(subtree.exportAsync).not.toHaveBeenCalled()
  })

  it("rejects concurrent exports and releases the request guard after failure", async () => {
    let release: (() => void) | undefined
    const blocked = new Promise<void>((resolve) => {
      release = resolve
    })
    const node = exportNode()
    node.exportAsync.mockImplementationOnce(async () => {
      await blocked
      throw new Error("Export failed")
    })
    const h = harness({ [node.id]: node })
    const first = h.request(params, "first")
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect((await h.request(params, "second")).error).toContain("already running")
    requireValue(release, "Pending SVG export release")()
    await first
    expect((await h.request(params, "third")).success).toBe(true)
  })

  it("routes explicit commands and correlated results only to the requesting socket", () => {
    const postMessage = vi.fn()
    const window: { onmessage?: (event: { data: { pluginMessage: unknown } }) => void } = {}
    const socket = { readyState: 1, send: vi.fn() }
    const other = { readyState: 1, send: vi.fn() }
    const context = {
      socket,
      message: { data: JSON.stringify({ id: "export-1", method: "EXPORT_SOURCE_SVG", params }) },
      parent: { postMessage },
      window,
      document: { getElementById: () => ({ textContent: "" }) },
      WebSocket: vi.fn(
        class MockWebSocket {
          readyState = 0
          close = vi.fn()
        },
      ),
      setTimeout: vi.fn(),
      setInterval: vi.fn(),
      clearTimeout: vi.fn(),
    }
    runInNewContext(ui, context)
    runInNewContext("handleSocketMessage(socket, message)", context)
    expect(postMessage).toHaveBeenLastCalledWith(
      { pluginMessage: { type: "EXPORT_SOURCE_SVG", requestId: "export-1", params } },
      "*",
    )
    context.socket = other
    runInNewContext("handleSocketMessage(socket, message)", context)
    expect(
      JSON.parse(
        requireValue(other.send.mock.calls[0], "Required figma-source-svg-plugin.test value")[0],
      ).error,
    ).toContain("Duplicate")
    const data = { success: false, nodes: [], errors: [{ nodeId: "1:2" }] }
    requireValue(
      window.onmessage,
      "Plugin UI message handler",
    )({
      data: {
        pluginMessage: {
          type: "EXPORT_SOURCE_SVG_RESULT",
          requestId: "export-1",
          success: false,
          data,
        },
      },
    })
    expect(
      JSON.parse(
        requireValue(socket.send.mock.calls[0], "Required figma-source-svg-plugin.test value")[0],
      ),
    ).toMatchObject({
      id: "export-1",
      result: data,
    })
    requireValue(
      window.onmessage,
      "Plugin UI message handler",
    )({
      data: {
        pluginMessage: {
          type: "EXPORT_SOURCE_SVG_RESULT",
          requestId: "unknown",
          success: true,
          data: {},
        },
      },
    })
    expect(socket.send).toHaveBeenCalledTimes(1)
  })
})
