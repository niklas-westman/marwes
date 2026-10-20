import { createHash } from "node:crypto"
import { lstatSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

/** Bind every isolated input, including empty directories; never follow symlinks. */
export function proofInputFingerprint(root: string): string {
  const digest = createHash("sha256")
  function walk(relative: string): void {
    const path = relative ? join(root, relative) : root
    const stat = lstatSync(path)
    if (stat.isSymbolicLink()) throw Error("Staged proof inputs must not contain symlinks")
    if (stat.isDirectory()) {
      digest.update(`${JSON.stringify([relative, "directory"])}\n`)
      for (const name of readdirSync(path).sort()) walk(relative ? `${relative}/${name}` : name)
    } else if (stat.isFile()) {
      const bytes = readFileSync(path)
      digest.update(
        `${JSON.stringify([
          relative,
          "file",
          bytes.length,
          createHash("sha256").update(bytes).digest("hex"),
        ])}\n`,
      )
    } else throw Error("Staged proof inputs must be regular files or directories")
  }
  if (!lstatSync(root).isDirectory()) throw Error("Staged proof root must be a directory")
  walk("")
  return digest.digest("hex")
}
