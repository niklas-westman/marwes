import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { describe, expect, it } from "vitest"
import {
  type SourceSnapshot,
  extractSnapshot,
  sourceIdentity,
  validateSnapshotManifest,
} from "./snapshot.ts"
import type { RawFigmaSource, SourceIdentity } from "./types.ts"
describe("configured portable Figma source", () => {
  it("validates exact compact manifest identity original hashes provenance and payload", () => {
    const source = resolve(import.meta.dirname, "../../reflection-families/button/source")
    const bytes = readFileSync(join(source, "snapshot.json"))
    const snapshot = JSON.parse(bytes.toString()) as SourceSnapshot
    const manifest = JSON.parse(readFileSync(join(source, "manifest.json"), "utf8")) as Record<
      string,
      unknown
    >
    expect(() => validateSnapshotManifest(manifest, snapshot, bytes)).not.toThrow()
    expect(() =>
      validateSnapshotManifest({ ...manifest, unexpected: true }, snapshot, bytes),
    ).toThrow("Unknown or missing")
    expect(() =>
      validateSnapshotManifest({ ...manifest, fileKey: "wrong" }, snapshot, bytes),
    ).toThrow("identity")
    expect(() =>
      validateSnapshotManifest({ ...manifest, snapshotSha256: "0".repeat(64) }, snapshot, bytes),
    ).toThrow("snapshot hash")
    const changed = structuredClone(snapshot)
    changed.capture.provenance = "altered"
    expect(() => validateSnapshotManifest(manifest, changed, bytes)).toThrow("capture")
    const missing = structuredClone(snapshot) as SourceSnapshot & {
      capture: Partial<SourceSnapshot["capture"]>
    }
    Reflect.deleteProperty(missing.capture, "lastModified")
    expect(() => validateSnapshotManifest(manifest, missing, bytes)).toThrow("provenance")
    const payload = structuredClone(snapshot)
    payload.missingDependencies.push("changed")
    expect(() => validateSnapshotManifest(manifest, payload, bytes)).toThrow("payload")
  })
  it("selects exactly the configured raw filename and refuses identity mismatch", () => {
    const root = mkdtempSync(join(tmpdir(), "marwes-source-"))
    try {
      mkdirSync(join(root, ".pi"))
      mkdirSync(join(root, "design/tokens"), { recursive: true })
      writeFileSync(
        join(root, ".pi/figma-sync.json"),
        JSON.stringify({
          defaultTarget: "test",
          targets: {
            test: { figmaFile: "https://www.figma.com/design/exact/File", liveDir: "design" },
          },
        }),
      )
      writeFileSync(join(root, "design/manifest.json"), JSON.stringify({ fileKey: "exact" }))
      writeFileSync(
        join(root, "design/tokens/variables.json"),
        JSON.stringify({ fileKey: "exact", variables: [], collections: [] }),
      )
      expect(sourceIdentity(root).rawPath).toBe(join(root, "design/_raw/exact_full.json"))
      writeFileSync(
        join(root, "design/tokens/variables.json"),
        JSON.stringify({ fileKey: "wrong" }),
      )
      expect(() => sourceIdentity(root)).toThrow("mismatch")
    } finally {
      rmSync(root, { recursive: true })
    }
  })
  it("retains detailed nodes inherited modes component dependencies and all alias modes", () => {
    const identity = {
      fileKey: "exact",
      manifest: { version: "v", lastModified: "date" },
      variables: {
        collections: [{ id: "c", modes: [{ id: "m" }] }],
        variables: [
          {
            id: "a",
            collectionId: "c",
            rawValuesByMode: { m: { type: "VARIABLE_ALIAS", id: "b" } },
          },
          { id: "b", collectionId: "c", rawValuesByMode: { m: 16 } },
        ],
      },
    } as unknown as SourceIdentity
    const node = {
      id: "detailed",
      name: "Button",
      type: "INSTANCE",
      componentId: "component",
      paddingLeft: 16,
      boundVariables: { paddingLeft: { type: "VARIABLE_ALIAS" as const, id: "a" } },
    }
    const raw: RawFigmaSource = {
      version: "v",
      lastModified: "date",
      document: {
        id: "0",
        name: "Document",
        type: "DOCUMENT",
        explicitVariableModes: { c: "m" },
        children: [node, { id: "component", name: "Master", type: "COMPONENT" }],
      },
      components: { component: { key: "key" } },
    }
    const result = extractSnapshot(raw, identity, "button", ["detailed", "missing"], {
      raw: "raw",
      manifest: "manifest",
      variables: "vars",
    })
    expect(result.nodes.detailed?.paddingLeft).toBe(16)
    expect(result.inheritedModes.detailed).toEqual({ c: "m" })
    expect(result.nodes.component).toBeDefined()
    expect(result.variables.map((v) => v.id)).toEqual(["a", "b"])
    expect(result.missingDependencies).toContain("node:missing")
  })
})
