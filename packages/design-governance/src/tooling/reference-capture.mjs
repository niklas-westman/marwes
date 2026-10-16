import { createHash, randomUUID } from "node:crypto"
import { lstat, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

// Capture is deliberately separate from active baselines and owner approval.
export async function captureReferenceExports(repoRoot, entries, exported, identity) {
  const byPath = new Map(entries.map((entry) => [entry.baseline, entry]))
  if (byPath.size !== entries.length || exported.length !== entries.length) {
    throw new Error("Reference capture requires one export per requested case")
  }
  const files = exported.map((item) => {
    const entry = byPath.get(item.baseline)
    if (!entry || item.figmaNodeId !== entry.figmaNodeId) {
      throw new Error("Unexpected Figma reference export")
    }
    byPath.delete(item.baseline)
    if (
      !/^[a-z0-9-]+$/.test(entry.family) ||
      !/^[a-z0-9-]+\/baselines\/[a-z0-9.-]+\.(png|webp)$/.test(entry.baseline) ||
      !entry.baseline.startsWith(`${entry.family}/baselines/`)
    ) {
      throw new Error("Invalid reference capture path")
    }
    const bytes = Buffer.from(item.pngBase64, "base64")
    if (bytes.length < 24 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
      throw new Error("Reference export is not a PNG")
    }
    if (
      bytes.readUInt32BE(16) !== entry.viewportSize.width ||
      bytes.readUInt32BE(20) !== entry.viewportSize.height
    ) {
      throw new Error(`Reference dimensions differ for ${entry.caseId}`)
    }
    return { entry, bytes, sha256: createHash("sha256").update(bytes).digest("hex") }
  })
  let parent = repoRoot
  for (const part of [".reflection", "governance", "captures"]) {
    parent = join(parent, part)
    try {
      if ((await lstat(parent)).isSymbolicLink())
        throw new Error("Symlinked reference capture directory")
    } catch (error) {
      if (error.code !== "ENOENT") throw error
    }
  }
  const directory = join(parent, randomUUID())
  await mkdir(directory, { recursive: true })
  const references = []
  for (const { entry, bytes, sha256 } of files) {
    const path = join(directory, entry.baseline)
    await mkdir(join(directory, entry.family, "baselines"), { recursive: true })
    if (entry.baseline.endsWith(".webp")) {
      // Figma exports PNG; use Reflection's own lossless encoder and decoder.
      const reflectionEntry = fileURLToPath(import.meta.resolve("reflection-check"))
      const codec = await import(
        pathToFileURL(join(dirname(reflectionEntry), "contracts/visual/image-io.js")).href
      )
      const exportPath = join(directory, "exports", entry.baseline.replace(/\.webp$/, ".png"))
      await mkdir(dirname(exportPath), { recursive: true })
      await writeFile(exportPath, bytes, { flag: "wx" })
      await codec.promoteBaselineImage(exportPath, path)
      const original = await codec.readImage(exportPath)
      const converted = await codec.readImage(path)
      if (
        converted.format !== "webp-lossless" ||
        original.image.width !== converted.image.width ||
        original.image.height !== converted.image.height ||
        !original.image.data.equals(converted.image.data)
      )
        throw new Error("Figma WebP conversion changed decoded RGBA pixels")
      const convertedBytes = await readFile(path)
      references.push({
        ...entry,
        sourcePath: entry.baseline,
        sha256: createHash("sha256").update(convertedBytes).digest("hex"),
        byteLength: convertedBytes.length,
        originalExport: {
          sourcePath: `exports/${entry.baseline.replace(/\.webp$/, ".png")}`,
          sha256,
          byteLength: bytes.length,
        },
        decodedRgbaSha256: createHash("sha256").update(original.image.data).digest("hex"),
      })
    } else {
      await writeFile(path, bytes, { flag: "wx" })
      references.push({ ...entry, sourcePath: entry.baseline, sha256, byteLength: bytes.length })
    }
  }
  const manifest = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    origin: "figma-bridge-export",
    identity,
    references,
  }
  await writeFile(join(directory, "references.json"), `${JSON.stringify(manifest, null, 2)}\n`, {
    flag: "wx",
  })
  return { directory, manifestPath: join(directory, "references.json"), references }
}
