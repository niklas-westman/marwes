import { execFile } from "node:child_process"
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import os from "node:os"
import path from "node:path"
import { promisify } from "node:util"
import { afterEach, describe, expect, it } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import {
  type PromotionApproval,
  type StagePreview,
  applyPromotionStage,
  createPromotionStage,
  readPromotionStage,
  recoverPromotionTransaction,
} from "./index.js"
import { hashBytes } from "./safe-files.js"

const directories: string[] = []
const fingerprint = "a".repeat(64)
afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

async function fixture(): Promise<{
  root: string
  inputRoot: string
  activeRoot: string
  stagesRoot: string
  transactionsRoot: string
  preview: StagePreview
}> {
  const root = await mkdtemp(path.join(os.tmpdir(), "governance-promotion-"))
  directories.push(root)
  const inputRoot = path.join(root, "capture")
  const activeRoot = path.join(root, "active")
  const stagesRoot = path.join(root, "stages")
  const transactionsRoot = path.join(root, "transactions")
  await mkdir(inputRoot)
  await mkdir(path.join(activeRoot, "source"), { recursive: true })
  await writeFile(path.join(inputRoot, "snapshot.json"), '{"node":{"width":66}}')
  await writeFile(path.join(inputRoot, "manifest.json"), '{"source":"new"}')
  await writeFile(path.join(activeRoot, "source", "snapshot.json"), '{"node":{"width":65}}')
  const preview = await createPromotionStage({
    family: "button",
    inputFingerprint: fingerprint,
    inputRoot,
    activeRoot,
    stagesRoot,
    artifacts: [
      {
        sourcePath: "snapshot.json",
        destination: "source/snapshot.json",
        kind: "source",
      },
      {
        sourcePath: "manifest.json",
        destination: "source/manifest.json",
        kind: "source",
      },
    ],
  })
  return { root, inputRoot, activeRoot, stagesRoot, transactionsRoot, preview }
}

function approval(preview: StagePreview): PromotionApproval {
  return {
    schemaVersion: 1,
    decision: "approve",
    reviewer: "Niklas",
    approvedAt: new Date().toISOString(),
    family: "button",
    stageId: preview.stage.stageId,
    stageHash: preview.stageHash,
    inputFingerprint: fingerprint,
    destinations: preview.stage.artifacts.map((entry) => entry.destination),
  }
}

describe("staged source promotion", () => {
  it("captures an offline immutable set and applies only an exact supplied approval", async () => {
    const data = await fixture()
    expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"), "utf8")).toContain(
      "65",
    )
    expect(data.preview.changes.map((entry) => entry.change)).toEqual(["changed", "added"])
    const result = await applyPromotionStage({
      ...data,
      stageDirectory: data.preview.stageDirectory,
      approval: approval(data.preview),
      currentInputFingerprint: async () => fingerprint,
    })
    expect(result.state).toBe("applied")
    expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"), "utf8")).toContain(
      "66",
    )
    expect(
      await readFile(path.join(result.transactionDirectory, "journal.json"), "utf8"),
    ).toContain('"state": "applied"')
  })

  it.each(["stageId", "stageHash", "family", "inputFingerprint", "destinations"])(
    "rejects approval with wrong %s before mutation",
    async (field) => {
      const data = await fixture()
      const record = {
        ...approval(data.preview),
        [field]:
          field === "destinations"
            ? ["source/snapshot.json"]
            : field.includes("Hash") || field.includes("Fingerprint")
              ? "b".repeat(64)
              : "wrong",
      }
      await expect(
        applyPromotionStage({
          ...data,
          stageDirectory: data.preview.stageDirectory,
          approval: record,
          currentInputFingerprint: async () => fingerprint,
        }),
      ).rejects.toThrow()
      expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"), "utf8")).toContain(
        "65",
      )
    },
  )

  it("rejects changed input fingerprint and changed active bytes", async () => {
    const data = await fixture()
    const options = {
      ...data,
      stageDirectory: data.preview.stageDirectory,
      approval: approval(data.preview),
      currentInputFingerprint: async () => "b".repeat(64),
    }
    await expect(applyPromotionStage(options)).rejects.toThrow("inputs changed")
    await writeFile(path.join(data.activeRoot, "source/snapshot.json"), '{"node":{"width":64}}')
    await expect(
      applyPromotionStage({
        ...options,
        currentInputFingerprint: async () => fingerprint,
      }),
    ).rejects.toThrow("changed since capture")
    expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"), "utf8")).toContain(
      "64",
    )
  })

  it("rolls back old files and removes new files after an interrupted write", async () => {
    const data = await fixture()
    await expect(
      applyPromotionStage({
        ...data,
        stageDirectory: data.preview.stageDirectory,
        approval: approval(data.preview),
        currentInputFingerprint: async () => fingerprint,
        afterWrite: async (_destination, index) => {
          if (index === 1) throw new Error("Simulated interruption")
        },
      }),
    ).rejects.toThrow("Simulated interruption")
    expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"), "utf8")).toBe(
      '{"node":{"width":65}}',
    )
    await expect(
      readFile(path.join(data.activeRoot, "source/manifest.json")),
    ).rejects.toMatchObject({ code: "ENOENT" })
    await expect(
      readFile(path.join(data.activeRoot, ".governance-promotion.lock")),
    ).rejects.toMatchObject({ code: "ENOENT" })
  })

  it("recovers the journal after the applying process exits abruptly", async () => {
    const data = await fixture()
    const childOptions = {
      activeRoot: data.activeRoot,
      transactionsRoot: data.transactionsRoot,
      stageDirectory: data.preview.stageDirectory,
      approval: approval(data.preview),
    }
    const script = `import { applyPromotionStage } from ${JSON.stringify(
      new URL("./apply.ts", import.meta.url).href,
    )}; await applyPromotionStage({ ...${JSON.stringify(
      childOptions,
    )}, currentInputFingerprint: async () => ${JSON.stringify(
      fingerprint,
    )}, afterWrite: async () => process.exit(42) });`
    const loader = createRequire(import.meta.url).resolve("tsx")
    await expect(
      promisify(execFile)(process.execPath, [
        "--import",
        loader,
        "--input-type=module",
        "-e",
        script,
      ]),
    ).rejects.toMatchObject({ code: 42 })
    expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"), "utf8")).toContain(
      "66",
    )
    const [transactionId] = await readdir(data.transactionsRoot)
    expect(transactionId).toBeDefined()
    const transactionDirectory = path.join(
      data.transactionsRoot,
      requireValue(transactionId, "Required promotion.test value"),
    )
    expect((await recoverPromotionTransaction(transactionDirectory, data.activeRoot)).state).toBe(
      "rolled-back",
    )
    expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"), "utf8")).toContain(
      "65",
    )
    await expect(
      readFile(path.join(data.activeRoot, ".governance-promotion.lock")),
    ).rejects.toMatchObject({ code: "ENOENT" })
  })

  it("requires matching receipts when staging reference PNGs", async () => {
    const data = await fixture()
    const png = Buffer.alloc(24)
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png)
    png.write("IHDR", 12)
    png.writeUInt32BE(390, 16)
    png.writeUInt32BE(220, 20)
    await writeFile(path.join(data.inputRoot, "image.png"), png)
    const input = {
      ...data,
      family: "button",
      inputFingerprint: fingerprint,
      artifacts: [
        {
          sourcePath: "image.png",
          destination: "baselines/basic.png",
          kind: "reference" as const,
        },
      ],
    }
    await expect(createPromotionStage(input)).rejects.toThrow("receipt")
    await writeFile(
      path.join(data.inputRoot, "receipt.json"),
      JSON.stringify({
        family: "button",
        baseline: "basic.png",
        pngSha256: hashBytes(png),
        pngByteLength: png.length,
        origin: "existing-figma-export",
      }),
    )
    const stage = await createPromotionStage({
      ...input,
      artifacts: [
        ...input.artifacts,
        {
          sourcePath: "receipt.json",
          destination: "baselines/basic.meta.json",
          kind: "receipt",
        },
      ],
    })
    expect(stage.stage.artifacts[1]?.kind).toBe("receipt")
    expect(await readFile(path.join(stage.stageDirectory, "artifacts/1"), "utf8")).toContain(
      "existing-figma-export",
    )
  })

  it("rechecks current inputs immediately before apply and refuses unrelated receipt writes", async () => {
    const data = await fixture()
    let checks = 0
    await expect(
      applyPromotionStage({
        ...data,
        stageDirectory: data.preview.stageDirectory,
        approval: approval(data.preview),
        currentInputFingerprint: async () => (++checks === 1 ? fingerprint : "b".repeat(64)),
      }),
    ).rejects.toThrow("inputs changed")
    expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"), "utf8")).toContain(
      "65",
    )
    await writeFile(
      path.join(data.inputRoot, "receipt.json"),
      JSON.stringify({
        family: "button",
        baseline: "absent.png",
        pngSha256: fingerprint,
        pngByteLength: 20,
      }),
    )
    const preview = await createPromotionStage({
      ...data,
      family: "button",
      inputFingerprint: fingerprint,
      artifacts: [
        {
          sourcePath: "receipt.json",
          destination: "baselines/absent.meta.json",
          kind: "receipt",
        },
      ],
    })
    await expect(
      applyPromotionStage({
        ...data,
        stageDirectory: preview.stageDirectory,
        approval: approval(preview),
        currentInputFingerprint: async () => fingerprint,
      }),
    ).rejects.toThrow("exact reference")
  })

  it("rejects tampered stages, traversal, protected paths and symlinks", async () => {
    const data = await fixture()
    await writeFile(path.join(data.preview.stageDirectory, "artifacts/0"), '{"tampered":true}')
    await expect(readPromotionStage(data.preview.stageDirectory)).rejects.toThrow("changed")
    for (const destination of [
      "../outside.json",
      "/tmp/outside.json",
      "source/../../.env",
      ".env",
      "reflection-contract.json",
    ]) {
      await expect(
        createPromotionStage({
          ...data,
          family: "button",
          inputFingerprint: fingerprint,
          artifacts: [{ sourcePath: "snapshot.json", destination, kind: "source" }],
        }),
      ).rejects.toThrow()
    }
    await symlink(
      path.join(data.inputRoot, "snapshot.json"),
      path.join(data.inputRoot, "linked.json"),
    )
    await expect(
      createPromotionStage({
        ...data,
        family: "button",
        inputFingerprint: fingerprint,
        artifacts: [
          {
            sourcePath: "linked.json",
            destination: "source/snapshot.json",
            kind: "source",
          },
        ],
      }),
    ).rejects.toThrow("Symlink")
  })
})
