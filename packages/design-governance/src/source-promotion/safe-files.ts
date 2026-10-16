import { createHash } from "node:crypto"
import { randomUUID } from "node:crypto"
import { lstat, mkdir, readFile, realpath, rename, unlink, writeFile } from "node:fs/promises"
import path from "node:path"

export function hashBytes(bytes: Uint8Array | string): string {
  return createHash("sha256").update(bytes).digest("hex")
}

export function relativeArtifactPath(value: string): string {
  if (
    !value ||
    value.includes("\\") ||
    value.includes("\0") ||
    path.isAbsolute(value) ||
    value.split("/").some((part) => !part || part === "." || part === ".." || part.startsWith("."))
  ) {
    throw new Error(`Unsafe artifact path: ${value}`)
  }
  return value
}

export async function safeFile(root: string, relative: string): Promise<string> {
  relativeArtifactPath(relative)
  const rootPath = await realpath(root)
  let current = rootPath
  for (const part of relative.split("/")) {
    current = path.join(current, part)
    try {
      if ((await lstat(current)).isSymbolicLink())
        throw new Error(`Symlink is not permitted: ${relative}`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    }
  }
  return current
}

export async function readOptional(file: string): Promise<Buffer | null> {
  try {
    const stat = await lstat(file)
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("Artifact must be a regular file")
    return await readFile(file)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
    throw error
  }
}

export async function fileHash(file: string): Promise<string | null> {
  const bytes = await readOptional(file)
  return bytes === null ? null : hashBytes(bytes)
}

export async function atomicWrite(file: string, bytes: Uint8Array | string): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.${randomUUID()}.tmp`
  try {
    await writeFile(temporary, bytes, { flag: "wx", mode: 0o600 })
    await rename(temporary, file)
  } finally {
    await unlink(temporary).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error
    })
  }
}

export type ArtifactKind = "source" | "reference" | "receipt" | "contract"

export function validateDestination(destination: string, kind: ArtifactKind): void {
  relativeArtifactPath(destination)
  const valid =
    kind === "contract"
      ? destination === "reflection-contract.json"
      : kind === "source"
        ? /^source\/.+\.json$/.test(destination)
        : kind === "reference"
          ? /^baselines\/.+\.(png|webp)$/.test(destination)
          : kind === "receipt" && /^baselines\/.+\.meta\.json$/.test(destination)
  if (!valid) throw new Error(`Destination ${destination} is outside ${kind} artifact scope`)
}
