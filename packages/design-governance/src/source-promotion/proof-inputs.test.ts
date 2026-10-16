import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"
import { proofInputFingerprint } from "./proof-inputs.js"
const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "proof-tree-"))
  roots.push(root)
  return root
}
it("is stable across directory enumeration order and binds additions/removals", () => {
  const left = fixture()
  const right = fixture()
  for (const [root, names] of [
    [left, ["a", "b"]],
    [right, ["b", "a"]],
  ] as const)
    for (const name of names) writeFileSync(join(root, name), name)
  expect(proofInputFingerprint(left)).toBe(proofInputFingerprint(right))
  const before = proofInputFingerprint(left)
  mkdirSync(join(left, "new-empty-directory"))
  expect(proofInputFingerprint(left)).not.toBe(before)
  rmSync(join(left, "new-empty-directory"), { recursive: true })
  expect(proofInputFingerprint(left)).toBe(before)
})
it("rejects symlinks even when they point to another input inside the same tree", () => {
  const root = fixture()
  writeFileSync(join(root, "original"), "data")
  symlinkSync(join(root, "original"), join(root, "linked"))
  expect(() => proofInputFingerprint(root)).toThrow("symlinks")
})
