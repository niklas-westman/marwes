import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import {
  parseSourceSvgArgs,
  saveSourceSvgCapture,
  selectSourceClient,
  waitForSourceClient,
} from "./export-figma-source-svg.mjs"
import { BridgeServer } from "./figma-bridge-server.mjs"

const key = "nybMu3iJUnnOvWtuxjMG8b"
const name = "Marwes governance — 2026-10-14"
const args = ["--file-key", key, "--file-name", name, "--node", "I3978:38909;3873:42870"]
const options = () => parseSourceSvgArgs(args)
const settings = {
  format: "SVG",
  svgOutlineText: true,
  svgSimplifyStroke: false,
  svgIdAttribute: true,
}
function result() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path id="Å" d="M0 0Z"/></svg>'
  const reportedFile: { fileKey: string | null; fileName: string } = {
    fileKey: key,
    fileName: name,
  }
  const errors: Array<{ nodeId: string | undefined; error: string }> = []
  return {
    success: true,
    requestedFile: { fileKey: key, fileName: name },
    reportedFile,
    identityVerification: "reported-key",
    exportedAt: "2026-10-15T12:00:00.000Z",
    exportSettings: settings,
    nodes: [
      {
        requestedNodeId: options().nodeIds[0],
        metadata: { nodeId: options().nodeIds[0], type: "TEXT" },
        svg,
        byteLength: Buffer.byteLength(svg),
      },
    ],
    errors,
  }
}
const temporary: string[] = []
afterEach(async () => {
  for (const path of temporary.splice(0)) await rm(path, { recursive: true, force: true })
})
async function root() {
  const path = await mkdtemp(join(tmpdir(), "marwes-svg-cli-"))
  temporary.push(path)
  return path
}

describe("outlined source SVG capture", () => {
  it("requires explicit bounded node selection, exact identity and local bridge ports", () => {
    expect(options().nodeIds).toEqual(["I3978:38909;3873:42870"])
    expect(() => parseSourceSvgArgs([])).toThrow("file-key")
    for (const extra of [
      ["--node", "../escape"],
      ["--node", requireValue(options().nodeIds[0], "Required figma-source-svg.test value")],
      ["--port", "9233"],
      ["--timeout", "0"],
      ["--verified-file-url", "https://figma.com/design/WRONG/name"],
      ["--write", "yes"],
    ])
      expect(() => parseSourceSvgArgs([...args, ...extra])).toThrow()
  })
  it("never selects wrong-file or ambiguous clients, and makes a missing key explicit", () => {
    const matching = { fileInfo: { fileKey: key, fileName: name } }
    const nullKey = { fileInfo: { fileKey: null, fileName: name } }
    expect(selectSourceClient({ clients: new Set([nullKey]) }, options())).toBeUndefined()
    expect(selectSourceClient({ clients: new Set([matching]) }, options())).toBe(matching)
    expect(
      selectSourceClient(
        { clients: new Set([{ fileInfo: { fileKey: "other", fileName: name } }]) },
        options(),
      ),
    ).toBeUndefined()
    expect(() =>
      selectSourceClient({ clients: new Set([matching, { ...matching }]) }, options()),
    ).toThrow("Ambiguous")
    expect(
      selectSourceClient(
        { clients: new Set([nullKey]) },
        { ...options(), verifiedFileUrl: `https://figma.com/design/${key}/Marwes` },
      ),
    ).toBe(nullKey)
  })
  it("writes fresh hash-bound UTF-8 source artifacts without touching active references", async () => {
    const target = await root()
    const saved = await saveSourceSvgCapture(target, options(), result(), { bridgePort: 9223 })
    expect(saved.sourceScope).toBe("live-diagnostic-observation")
    expect(saved.approval).toBe("none")
    expect(saved.referencePromotion).toBe("none")
    const artifact = requireValue(saved.artifacts[0], "Required figma-source-svg.test value")
    expect(artifact.mimeType).toBe("image/svg+xml")
    expect(artifact.sha256).toMatch(/^[a-f0-9]{64}$/)
    expect(await readFile(join(saved.directory, artifact.path), "utf8")).toBe(
      requireValue(result().nodes[0], "Required figma-source-svg.test value").svg,
    )
    const again = await saveSourceSvgCapture(target, options(), result(), {})
    expect(again.directory).not.toBe(saved.directory)
  })
  it("retains isolated failures but rejects omitted, foreign or duplicate node identities", async () => {
    const target = await root()
    const partial = result()
    partial.success = false
    partial.nodes = []
    partial.errors = [{ nodeId: options().nodeIds[0], error: "Missing source" }]
    const saved = await saveSourceSvgCapture(target, options(), partial, {})
    expect(saved.success).toBe(false)
    expect(saved.errors).toHaveLength(1)
    expect(saved.artifacts).toHaveLength(0)
    for (const mutation of [
      (r: ReturnType<typeof result>) => r.nodes.pop(),
      (r: ReturnType<typeof result>) => r.nodes.push(requireValue(r.nodes[0], "Source SVG node")),
      (r: ReturnType<typeof result>) => {
        requireValue(r.nodes[0]).requestedNodeId = "9:9"
      },
      (r: ReturnType<typeof result>) => {
        requireValue(r.nodes[0]).metadata.nodeId = "9:9"
      },
    ]) {
      const invalid = result()
      mutation(invalid)
      await expect(saveSourceSvgCapture(target, options(), invalid, {})).rejects.toThrow()
    }
  })
  it("rejects wrong file, unverified null keys, non-outlined exports and tampered lengths", async () => {
    const target = await root()
    for (const mutation of [
      (r: ReturnType<typeof result>) => {
        r.reportedFile.fileKey = "wrong"
      },
      (r: ReturnType<typeof result>) => {
        r.reportedFile.fileName = "other"
      },
      (r: ReturnType<typeof result>) => {
        r.reportedFile.fileKey = null
      },
      (r: ReturnType<typeof result>) => {
        r.exportSettings = { ...settings, svgOutlineText: false }
      },
      (r: ReturnType<typeof result>) => requireValue(r.nodes[0]).byteLength++,
      (r: ReturnType<typeof result>) => {
        requireValue(r.nodes[0]).svg = "<svg><text>Label</text></svg>"
        requireValue(r.nodes[0]).byteLength = Buffer.byteLength(requireValue(r.nodes[0]).svg)
      },
    ]) {
      const invalid = result()
      mutation(invalid)
      await expect(saveSourceSvgCapture(target, options(), invalid, {})).rejects.toThrow()
    }
    const attested = result()
    attested.reportedFile.fileKey = null
    attested.identityVerification = "caller-verified-file-name"
    const saved = await saveSourceSvgCapture(
      target,
      { ...options(), verifiedFileUrl: `https://figma.com/design/${key}/Marwes` },
      attested,
      {},
    )
    expect(saved.fileIdentity.reportedFileKey).toBeNull()
    expect(saved.fileIdentity.verification).toBe("caller-verified-file-name")
  })
})

async function connect(server: InstanceType<typeof BridgeServer>, fileName: string) {
  const ws = new WebSocket(`ws://localhost:${server.port}`)
  await new Promise<void>((resolve, reject) => {
    ws.addEventListener("open", () => resolve(), { once: true })
    ws.addEventListener("error", reject, { once: true })
  })
  ws.send(JSON.stringify({ type: "FILE_INFO", data: { fileName, fileKey: key } }))
  const client = await server.waitFor(
    () => [...server.clients].find((c) => c.fileInfo?.fileName === fileName),
    1000,
    fileName,
  )
  return { ws, client }
}
it("shared transport binds command responses to their originating client and preserves partial results", async () => {
  const server = new BridgeServer({ host: "localhost", port: 0 })
  await server.start()
  const a = await connect(server, "a")
  const b = await connect(server, "b")
  try {
    const command = new Promise<{ id: string }>((resolve, reject) =>
      a.ws.addEventListener(
        "message",
        (event) => {
          const message: unknown = JSON.parse(String(event.data))
          if (
            typeof message !== "object" ||
            message === null ||
            !("id" in message) ||
            typeof message.id !== "string"
          ) {
            reject(Error("Missing bridge command identity"))
            return
          }
          resolve({ id: message.id })
        },
        {
          once: true,
        },
      ),
    )
    const pending = server.sendCommand(a.client, "EXPORT_SOURCE_SVG", { nodeIds: ["1:2"] }, 1000)
    const message = await command
    b.ws.send(JSON.stringify({ id: message.id, result: { forged: true } }))
    a.ws.send(
      JSON.stringify({
        id: message.id,
        error: "One node failed",
        result: { success: false, errors: ["missing"] },
      }),
    )
    await expect(pending).resolves.toEqual({ success: false, errors: ["missing"] })
    await expect(server.sendCommand(a.client, "UNANSWERED", {}, 10)).rejects.toThrow("timed out")
  } finally {
    a.ws.close()
    b.ws.close()
    await server.close()
  }
})

it("rejects asynchronously announced duplicate files without closing either candidate", async () => {
  const server = new BridgeServer({ host: "localhost", port: 0 })
  await server.start()
  const a = await connect(server, name)
  let b: Awaited<ReturnType<typeof connect>> | undefined
  try {
    const ambiguity = expect(
      waitForSourceClient(server, { ...options(), timeoutMs: 1000 }),
    ).rejects.toThrow("Ambiguous")
    const predicateError = expect(
      server.waitFor(
        () => {
          if (server.clients.size < 2 || [...server.clients].some((c) => !c.fileInfo))
            return undefined
          return selectSourceClient(server, options())
        },
        1000,
        "ambiguous clients",
      ),
    ).rejects.toThrow("Ambiguous")
    await new Promise((resolve) => setTimeout(resolve, 20))
    b = await connect(server, name)
    await ambiguity
    await predicateError
    expect(server.clients.size).toBe(2)
    expect([...server.clients].every((c) => !c.closed)).toBe(true)
  } finally {
    a.ws.close()
    b?.ws.close()
    await server.close()
  }
})
