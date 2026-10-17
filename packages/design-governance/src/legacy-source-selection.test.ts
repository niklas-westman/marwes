import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { findRawFigmaFile } from "./baseline-receipts.mjs"

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe("legacy receipt source selection", () => {
  it("selects the configured file even when another file sorts first", () => {
    const root = mkdtempSync(join(tmpdir(), "marwes-source-"))
    roots.push(root)
    mkdirSync(join(root, "source/_raw"), { recursive: true })
    writeFileSync(join(root, "source/_raw/a_full.json"), "{}")
    writeFileSync(join(root, "source/_raw/z_full.json"), "{}")
    expect(findRawFigmaFile(root, { liveDir: "source", fileKey: "z" })).toBe(
      "source/_raw/z_full.json",
    )
  })

  it("does not substitute an unrelated export when the configured file is absent", () => {
    const root = mkdtempSync(join(tmpdir(), "marwes-source-"))
    roots.push(root)
    mkdirSync(join(root, "source/_raw"), { recursive: true })
    writeFileSync(join(root, "source/_raw/a_full.json"), "{}")
    expect(findRawFigmaFile(root, { liveDir: "source", fileKey: "z" })).toBeUndefined()
  })
})
