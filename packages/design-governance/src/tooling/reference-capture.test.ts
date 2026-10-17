import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"
import { captureReferenceExports } from "./reference-capture.mjs"

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
const png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII="
const entry = {
  caseId: "button.basic",
  family: "button",
  figmaNodeId: "1:2",
  baseline: "button/baselines/basic.light.png",
  viewportSize: { width: 1, height: 1 },
}
const exported = { ...entry, pngBase64: png }
function root() {
  const path = mkdtempSync(join(tmpdir(), "reference-capture-"))
  roots.push(path)
  return path
}

it("captures exact Figma bytes with provenance and never creates active references", async () => {
  const directory = root()
  const result = await captureReferenceExports(directory, [entry], [exported], {
    configuredFileKey: "new-file",
  })
  expect(readFileSync(join(result.directory, entry.baseline))).toEqual(Buffer.from(png, "base64"))
  expect(result.references[0].sha256).toMatch(/^[a-f0-9]{64}$/)
  expect(JSON.parse(readFileSync(result.manifestPath, "utf8")).identity.configuredFileKey).toBe(
    "new-file",
  )
  expect(existsSync(join(directory, "packages"))).toBe(false)
})

it.each([
  { items: [{ ...exported, figmaNodeId: "wrong" }] },
  { items: [] },
  { items: [exported, exported] },
  { items: [{ ...exported, pngBase64: Buffer.from("invalid").toString("base64") }] },
])("rejects incomplete or substituted exports before writing", async ({ items }) => {
  const directory = root()
  await expect(captureReferenceExports(directory, [entry], items, {})).rejects.toThrow()
  expect(existsSync(join(directory, ".reflection"))).toBe(false)
})

it("rejects paths escaping staging and wrong dimensions", async () => {
  const directory = root()
  await expect(
    captureReferenceExports(
      directory,
      [{ ...entry, baseline: "../active.png" }],
      [{ ...exported, baseline: "../active.png" }],
      {},
    ),
  ).rejects.toThrow("path")
  await expect(
    captureReferenceExports(
      directory,
      [{ ...entry, viewportSize: { width: 2, height: 1 } }],
      [exported],
      {},
    ),
  ).rejects.toThrow("dimensions")
})

it("rejects a symlink that redirects staging elsewhere", async () => {
  const directory = root()
  const target = root()
  symlinkSync(target, join(directory, ".reflection"))
  await expect(captureReferenceExports(directory, [entry], [exported], {})).rejects.toThrow(
    "Symlink",
  )
  expect(existsSync(join(target, "governance"))).toBe(false)
})

it("captures Figma PNG exports as exact lossless WebP while retaining original provenance", async () => {
  const directory = root()
  const webpEntry = {
    ...entry,
    baseline: "button/baselines/basic.light.webp",
    viewportSize: { width: 2, height: 1 },
  }
  const pngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4nGP8z8jEwMLM/B8ACTsCDQhl4SkAAAAASUVORK5CYII="
  const result = await captureReferenceExports(
    directory,
    [webpEntry],
    [{ ...webpEntry, pngBase64 }],
    { configuredFileKey: "new-file" },
  )
  const { reflectionImageIO } = await import("../source-promotion/webp-conversion.js")
  const codec = await reflectionImageIO()
  const output = await codec.readImage(join(result.directory, webpEntry.baseline))
  expect(output.format).toBe("webp-lossless")
  expect([...output.image.data]).toEqual([255, 1, 2, 0, 3, 4, 5, 255])
  const manifest = JSON.parse(readFileSync(result.manifestPath, "utf8"))
  expect(manifest.references[0].originalExport.sha256).toMatch(/^[a-f0-9]{64}$/)
  expect(
    readFileSync(join(result.directory, manifest.references[0].originalExport.sourcePath)),
  ).toEqual(Buffer.from(pngBase64, "base64"))
  expect(existsSync(join(directory, "packages"))).toBe(false)
})
