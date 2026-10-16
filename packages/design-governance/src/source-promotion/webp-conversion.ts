import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import {
  computeCaseFingerprint,
  formatReceiptJson,
  readBaselineInfo,
  receiptPathForBaselinePath,
  resolveBaselinePath,
  validateBaselineReceipt,
} from "../baseline-receipts.mjs"
import { requireValue } from "../contracts/require-value.js"
import { familyRoot, loadSnapshot, readJson } from "../source/snapshot.js"
import type { LegacyContract } from "../source/types.js"
import { hashBytes } from "./safe-files.js"

/** Reflection owns encoding and decoding. Resolve its pinned package implementation,
 * rather than a second codec or a dependency from a different workspace. */
export async function reflectionImageIO() {
  const entry = fileURLToPath(import.meta.resolve("reflection-check"))
  const metadata = JSON.parse(await readFile(join(dirname(entry), "../package.json"), "utf8"))
  if (metadata.version !== "0.6.0")
    throw Error("WebP migration requires the pinned reflection-check 0.6.0")
  return (await import(
    pathToFileURL(join(dirname(entry), "contracts/visual/image-io.js")).href
  )) as {
    readImage: (
      file: string,
    ) => Promise<{ image: { width: number; height: number; data: Buffer }; format: string }>
    promoteBaselineImage: (source: string, destination: string) => Promise<void>
  }
}

/** Prepare capture inputs only. This never applies a promotion or changes active files.
 * outputRoot must be a new directory; it may be passed to source-stage afterwards. */
export async function prepareWebpConversion(
  repoRoot: string,
  family: string,
  outputRoot: string,
  options: { caseKeys?: ReadonlyArray<{ caseId: string; mode: string }> } = {},
) {
  if (process.env.CI) throw Error("Reference conversion is disabled in CI")
  if (!/^[a-z0-9-]+$/.test(family)) throw Error("Invalid family identifier")
  const contract = readJson<LegacyContract>(
    join(repoRoot, familyRoot, family, "reflection-contract.json"),
  )
  const snapshot = loadSnapshot(repoRoot, family)
  const context = {
    rawSource: {
      document: { id: "portable-root", type: "DOCUMENT", children: Object.values(snapshot.nodes) },
    },
    variableSource: { variables: snapshot.variables, collections: snapshot.collections },
  }
  const key = (entry: { caseId: string; mode: string }) =>
    JSON.stringify([entry.caseId, entry.mode])
  let candidates = contract.cases.filter((entry) => entry.baseline?.endsWith(".png"))
  if (options.caseKeys !== undefined) {
    if (!Array.isArray(options.caseKeys) || !options.caseKeys.length)
      throw Error("Explicit conversion selection must not be empty")
    const selected = new Set<string>()
    for (const selection of options.caseKeys) {
      if (!selection || typeof selection.caseId !== "string" || typeof selection.mode !== "string")
        throw Error("Conversion selection requires caseId and mode")
      const identity = key(selection)
      if (selected.has(identity)) throw Error(`Duplicate conversion selection: ${identity}`)
      selected.add(identity)
      const matches = contract.cases.filter((entry) => key(entry) === identity)
      if (matches.length !== 1)
        throw Error(`Unknown or ambiguous conversion selection: ${identity}`)
      if (!requireValue(matches[0], "Required webp-conversion value").baseline?.endsWith(".png"))
        throw Error(`Conversion selection must name a PNG reference: ${identity}`)
    }
    candidates = candidates.filter((entry) => selected.has(key(entry)))
  }
  if (!candidates.length) throw Error("Family has no PNG references to convert")
  // Fail before producing files if any source image/receipt is absent or invalid.
  for (const entry of candidates) {
    const result = validateBaselineReceipt({
      repoRoot,
      contract,
      caseEntry: entry,
      context,
      pngPath: resolveBaselinePath(repoRoot, contract, entry),
      requireReceipt: true,
    })
    if (result.status !== "pass")
      throw Error(`Cannot convert ${entry.caseId}/${entry.mode}: ${result.details.join("; ")}`)
  }
  const codec = await reflectionImageIO()
  await mkdir(outputRoot)
  await mkdir(join(outputRoot, "baselines"))
  const converted = structuredClone(contract)
  const artifacts: Array<{
    kind: "reference" | "receipt" | "contract"
    sourcePath: string
    destination: string
  }> = []
  const conversions: Array<{
    baseline: string
    pngBytes: number
    webpBytes: number
    originalSha256: string
    imageSha256: string
    decodedRgbaSha256: string
  }> = []
  for (const original of candidates) {
    const entry = requireValue(
      converted.cases.find(
        (item) => item.caseId === original.caseId && item.mode === original.mode,
      ),
      "Required webp-conversion value",
    )
    const source = resolveBaselinePath(repoRoot, contract, original)
    const oldReceipt = JSON.parse(await readFile(receiptPathForBaselinePath(source), "utf8"))
    const originalBytes = await readFile(source)
    if (
      hashBytes(originalBytes) !== oldReceipt.pngSha256 ||
      originalBytes.length !== oldReceipt.pngByteLength
    )
      throw Error(`PNG changed during conversion: ${original.baseline}`)
    const basename = requireValue(original.baseline, "Required webp-conversion value").replace(
      /\.png$/,
      ".webp",
    )
    const destination = join(outputRoot, "baselines", basename)
    const before = await codec.readImage(source)
    await codec.promoteBaselineImage(source, destination)
    const after = await codec.readImage(destination)
    if (hashBytes(await readFile(source)) !== oldReceipt.pngSha256)
      throw Error(`PNG changed during conversion: ${original.baseline}`)
    if (
      after.format !== "webp-lossless" ||
      before.image.width !== after.image.width ||
      before.image.height !== after.image.height ||
      !before.image.data.equals(after.image.data)
    )
      throw Error(`WebP conversion changed decoded RGBA pixels: ${original.baseline}`)
    const info = readBaselineInfo(destination)
    entry.baseline = basename
    const conversion = {
      baseline: basename,
      pngBytes: oldReceipt.pngByteLength,
      webpBytes: info.byteLength,
      originalSha256: oldReceipt.pngSha256,
      imageSha256: info.sha256,
      decodedRgbaSha256: hashBytes(before.image.data),
    }
    const {
      pngSha256: _pngSha256,
      pngByteLength: _pngByteLength,
      pngDimensions: _pngDimensions,
      ...sourceReceipt
    } = oldReceipt
    const receipt = {
      ...sourceReceipt,
      schemaVersion: 2,
      baseline: basename,
      imageFormat: "webp",
      imageSha256: info.sha256,
      imageByteLength: info.byteLength,
      imageDimensions: { width: info.width, height: info.height },
      caseFingerprint: computeCaseFingerprint({
        contract: converted,
        caseEntry: entry,
        sourceFrameId: oldReceipt.sourceFrameId,
      }),
      encodingConversion: {
        sourceFormat: "png",
        sourceSha256: conversion.originalSha256,
        sourceByteLength: conversion.pngBytes,
        decodedRgbaSha256: conversion.decodedRgbaSha256,
      },
    }
    await writeFile(receiptPathForBaselinePath(destination), formatReceiptJson(receipt), {
      flag: "wx",
    })
    artifacts.push(
      {
        kind: "reference",
        sourcePath: `baselines/${basename}`,
        destination: `baselines/${basename}`,
      },
      {
        kind: "receipt",
        sourcePath: `baselines/${basename.replace(/\.webp$/, ".meta.json")}`,
        destination: `baselines/${basename.replace(/\.webp$/, ".meta.json")}`,
      },
    )
    conversions.push(conversion)
  }
  await writeFile(
    join(outputRoot, "reflection-contract.json"),
    `${JSON.stringify(converted, null, 2)}\n`,
    { flag: "wx" },
  )
  artifacts.push({
    kind: "contract",
    sourcePath: "reflection-contract.json",
    destination: "reflection-contract.json",
  })
  const capture = { schemaVersion: 1, family, artifacts }
  await writeFile(join(outputRoot, "capture.json"), `${JSON.stringify(capture, null, 2)}\n`, {
    flag: "wx",
  })
  await writeFile(
    join(outputRoot, "conversion.json"),
    `${JSON.stringify({ schemaVersion: 1, family, conversions }, null, 2)}\n`,
    { flag: "wx" },
  )
  return { capturePath: join(outputRoot, "capture.json"), conversions }
}
