import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { afterEach, describe, expect, it } from "vitest"
import { readBaselineInfoFromBuffer, receiptPathForBaselinePath } from "../baseline-receipts.mjs"
import { createLegacyPngButtonFixture } from "../source/offline-test-fixture.js"
import { validatePortableIntegrity } from "../source/portable-integrity.js"
import { validateFamilyStage } from "./cli.js"
import { applyPromotionStage, createPromotionStage } from "./index.js"
import { hashBytes } from "./safe-files.js"
import { prepareWebpConversion, reflectionImageIO } from "./webp-conversion.js"

const roots: string[] = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})
const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4nGP8z8jEwMLM/B8ACTsCDQhl4SkAAAAASUVORK5CYII=",
  "base64",
)
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "governance-webp-"))
  roots.push(root)
  return root
}

describe("lossless WebP governance references", () => {
  it("uses the pinned Reflection codec and retains hidden RGB under transparent pixels", async () => {
    const root = await fixture()
    const source = join(root, "source.png")
    const target = join(root, "reference.webp")
    await writeFile(source, transparentPng)
    const codec = await reflectionImageIO()
    await codec.promoteBaselineImage(source, target)
    const png = await codec.readImage(source)
    const webp = await codec.readImage(target)
    expect([...png.image.data]).toEqual([255, 1, 2, 0, 3, 4, 5, 255])
    expect(webp.format).toBe("webp-lossless")
    expect(webp.image.data).toEqual(png.image.data)
    const diff = await import(
      pathToFileURL(
        join(
          dirname(fileURLToPath(import.meta.resolve("reflection-check"))),
          "contracts/visual/image-diff.js",
        ),
      ).href
    )
    const pngResult = await diff.comparePngImages({
      expectedPath: source,
      actualPath: source,
      strict: true,
      threshold: { maxDiffPixels: 0 },
    })
    const webpResult = await diff.comparePngImages({
      expectedPath: target,
      actualPath: source,
      strict: true,
      threshold: { maxDiffPixels: 0 },
    })
    expect({ ...webpResult, expectedFormat: "png" }).toEqual(pngResult)
    const altered = join(root, "altered.png")
    await writeFile(
      altered,
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4nGP4z8jE8P////8AEgoE/y3y9YEAAAAASUVORK5CYII=",
        "base64",
      ),
    )
    for (const expectedPath of [source, target]) {
      expect(
        await diff.comparePngImages({
          expectedPath,
          actualPath: altered,
          strict: true,
          threshold: { maxDiffPixels: 0 },
        }),
      ).toMatchObject({ status: "fail", diffPixels: 1 })
    }

    expect(readBaselineInfoFromBuffer(await readFile(target))).toMatchObject({
      format: "webp",
      width: 2,
      height: 1,
    })
    expect(receiptPathForBaselinePath(target)).toBe(join(root, "reference.meta.json"))
  })

  it("rejects lossy and truncated WebP rather than trusting its extension", () => {
    const body = Buffer.alloc(20)
    body.write("RIFF", 0)
    body.writeUInt32LE(12, 4)
    body.write("WEBPVP8 ", 8)
    expect(() => readBaselineInfoFromBuffer(body)).toThrow("lossless")
    body.write("VP8L", 12)
    body.writeUInt32LE(8, 16)
    expect(() => readBaselineInfoFromBuffer(body)).toThrow("truncated")
  })

  it("prepares source-bound conversion, preserves active PNGs and verifies WebP receipts offline", async () => {
    const repo = createLegacyPngButtonFixture()
    roots.push(repo)
    const output = join(await fixture(), "capture")
    const result = await prepareWebpConversion(repo, "button", output)
    expect(result.conversions).toHaveLength(4)
    expect(validatePortableIntegrity(repo, "button").status).toBe("passed")
    const capture = JSON.parse(await readFile(result.capturePath, "utf8"))
    const contractPath = "packages/design-governance/reflection-families/button"
    const stagesRoot = join(await fixture(), "stages")
    await mkdir(stagesRoot)
    const stage = await createPromotionStage({
      family: "button",
      inputRoot: output,
      activeRoot: join(repo, contractPath),
      stagesRoot,
      inputFingerprint: "a".repeat(64),
      artifacts: capture.artifacts,
    })
    await expect(
      validateFamilyStage(stage, repo, join(repo, contractPath), "button"),
    ).resolves.toBeUndefined()
    const contractIndex = stage.stage.artifacts.findIndex((item) => item.kind === "contract")
    const malicious = JSON.parse(await readFile(join(output, "reflection-contract.json"), "utf8"))
    malicious.cases[0].comparison = { threshold: { maxDiffPixels: 999999 } }
    await writeFile(
      join(stage.stageDirectory, `artifacts/${contractIndex}`),
      JSON.stringify(malicious),
    )
    await expect(
      validateFamilyStage(stage, repo, join(repo, contractPath), "button"),
    ).rejects.toThrow("thresholds")

    const contract = JSON.parse(await readFile(join(output, "reflection-contract.json"), "utf8"))
    for (const artifact of capture.artifacts) {
      const target = join(repo, contractPath, artifact.destination)
      await writeFile(target, await readFile(join(output, artifact.sourcePath)))
    }
    expect(
      contract.cases.every((entry: { baseline: string }) => entry.baseline.endsWith(".webp")),
    ).toBe(true)
    expect(validatePortableIntegrity(repo, "button")).toMatchObject({
      status: "passed",
      details: [],
    })
    const first = contract.cases[0]
    const receiptPath = join(
      repo,
      contractPath,
      "baselines",
      first.baseline.replace(/\.webp$/, ".meta.json"),
    )
    const receipt = JSON.parse(await readFile(receiptPath, "utf8"))
    expect(receipt).toMatchObject({
      schemaVersion: 2,
      imageFormat: "webp",
      origin: "receipt-backfill",
    })
    expect(receipt.encodingConversion.sourceSha256).toMatch(/^[a-f0-9]{64}$/)
    receipt.imageSha256 = "0".repeat(64)
    await writeFile(receiptPath, JSON.stringify(receipt))
    expect(validatePortableIntegrity(repo, "button").status).toBe("failed")
  })

  it("converts an explicit subset while retaining uncaptured cases and the complete denominator", async () => {
    const repo = createLegacyPngButtonFixture()
    roots.push(repo)
    const contractPath = join(
      repo,
      "packages/design-governance/reflection-families/button/reflection-contract.json",
    )
    const original = JSON.parse(await readFile(contractPath, "utf8"))
    original.cases.push({
      ...original.cases[0],
      caseId: "button.uncaptured",
      baseline: "uncaptured.light.png",
    })
    await writeFile(contractPath, JSON.stringify(original))
    const first = original.cases[0]
    const caseKeys = [{ caseId: first.caseId, mode: first.mode }]
    const output = join(await fixture(), "capture")
    const result = await prepareWebpConversion(repo, "button", output, { caseKeys })
    expect(result.conversions).toHaveLength(1)
    const converted = JSON.parse(await readFile(join(output, "reflection-contract.json"), "utf8"))
    expect(converted.cases).toHaveLength(5)
    expect(converted.cases[0].baseline).toBe(first.baseline.replace(/\.png$/, ".webp"))
    expect(converted.cases.slice(1)).toEqual(original.cases.slice(1))
    expect(JSON.parse(await readFile(contractPath, "utf8"))).toEqual(original)
    const capture = JSON.parse(await readFile(result.capturePath, "utf8"))
    expect(capture.artifacts).toHaveLength(3)
    await expect(
      prepareWebpConversion(repo, "button", join(await fixture(), "all")),
    ).rejects.toThrow("uncaptured")
    await expect(
      prepareWebpConversion(repo, "button", join(await fixture(), "empty"), { caseKeys: [] }),
    ).rejects.toThrow("empty")
    await expect(
      prepareWebpConversion(repo, "button", join(await fixture(), "duplicate"), {
        caseKeys: [...caseKeys, ...caseKeys],
      }),
    ).rejects.toThrow("Duplicate")
    await expect(
      prepareWebpConversion(repo, "button", join(await fixture(), "unknown"), {
        caseKeys: [{ caseId: "button.unknown", mode: "light" }],
      }),
    ).rejects.toThrow("Unknown")
    await expect(
      prepareWebpConversion(repo, "button", join(await fixture(), "missing"), {
        caseKeys: [{ caseId: "button.uncaptured", mode: "light" }],
      }),
    ).rejects.toThrow("uncaptured")
  })

  it("rolls back contract, WebP and receipt together when an approved transaction fails", async () => {
    const root = await fixture()
    const activeRoot = join(root, "active")
    const inputRoot = join(root, "capture")
    const stagesRoot = join(root, "stages")
    await mkdir(activeRoot)
    await mkdir(inputRoot)
    await mkdir(stagesRoot)
    await writeFile(join(activeRoot, "reflection-contract.json"), '{"baseline":"old.png"}')
    await writeFile(join(inputRoot, "source.png"), transparentPng)
    const codec = await reflectionImageIO()
    await codec.promoteBaselineImage(join(inputRoot, "source.png"), join(inputRoot, "image.webp"))
    const image = await readFile(join(inputRoot, "image.webp"))
    await writeFile(
      join(inputRoot, "receipt.json"),
      JSON.stringify({
        schemaVersion: 2,
        family: "button",
        baseline: "basic.webp",
        imageFormat: "webp",
        imageSha256: hashBytes(image),
        imageByteLength: image.length,
      }),
    )
    await writeFile(join(inputRoot, "contract.json"), '{"baseline":"basic.webp"}')
    const inputFingerprint = "a".repeat(64)
    const preview = await createPromotionStage({
      family: "button",
      inputRoot,
      activeRoot,
      stagesRoot,
      inputFingerprint,
      artifacts: [
        { kind: "contract", sourcePath: "contract.json", destination: "reflection-contract.json" },
        { kind: "reference", sourcePath: "image.webp", destination: "baselines/basic.webp" },
        { kind: "receipt", sourcePath: "receipt.json", destination: "baselines/basic.meta.json" },
      ],
    })
    await expect(
      applyPromotionStage({
        stageDirectory: preview.stageDirectory,
        activeRoot,
        transactionsRoot: join(root, "transactions"),
        currentInputFingerprint: async () => inputFingerprint,
        approval: {
          schemaVersion: 1,
          decision: "approve",
          reviewer: "test owner",
          approvedAt: new Date().toISOString(),
          family: "button",
          stageId: preview.stage.stageId,
          stageHash: preview.stageHash,
          inputFingerprint,
          destinations: preview.stage.artifacts.map((item) => item.destination),
        },
        afterWrite: async (_path, index) => {
          if (index === 1) throw Error("interrupted transaction")
        },
      }),
    ).rejects.toThrow("interrupted transaction")
    expect(await readFile(join(activeRoot, "reflection-contract.json"), "utf8")).toBe(
      '{"baseline":"old.png"}',
    )
    await expect(readFile(join(activeRoot, "baselines/basic.webp"))).rejects.toMatchObject({
      code: "ENOENT",
    })
    await expect(readFile(join(activeRoot, "baselines/basic.meta.json"))).rejects.toMatchObject({
      code: "ENOENT",
    })
  })
})
