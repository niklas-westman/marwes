import { copyFile, lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { evidenceRoot, inputFingerprint } from "../evidence/store.js"
import { configuredSourceIdentity, familyRoot } from "../source/snapshot.js"
import { validateFamilyStage } from "./cli.js"
import { proofInputFingerprint } from "./proof-inputs.js"
import { hashBytes, safeFile } from "./safe-files.js"
import { readPromotionStage } from "./stage.js"

export const stageIdentifier = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/

async function copyInputs(source: string, destination: string): Promise<void> {
  let stat: Awaited<ReturnType<typeof lstat>>
  try {
    stat = await lstat(source)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return
    throw error
  }
  if (stat.isSymbolicLink()) throw Error("Proof inputs must not be symlinks")
  if (stat.isDirectory()) {
    await mkdir(destination, { recursive: true })
    for (const entry of await readdir(source))
      await copyInputs(join(source, entry), join(destination, entry))
  } else if (stat.isFile()) {
    await mkdir(dirname(destination), { recursive: true })
    await copyFile(source, destination)
  } else throw Error("Proof inputs must be regular files")
}

/** Materialize read-only proof inputs. This never applies a stage to the active family. */
export async function prepareStagedInputs(
  repoRoot: string,
  runRoot: string,
  family: string,
  stageId: string,
) {
  if (process.env.CI) throw Error("Staged verification is disabled in CI")
  if (!stageIdentifier.test(stageId)) throw Error("Invalid stage identifier")
  if (!/^[a-z0-9-]+$/.test(family)) throw Error("Invalid family identifier")
  const preview = await readPromotionStage(
    await safeFile(join(evidenceRoot(repoRoot), "stages"), stageId),
  )
  if (preview.stage.inputFingerprint !== inputFingerprint(repoRoot))
    throw Error("Stage inputs are stale; create a fresh stage")
  const activeRoot = await safeFile(join(repoRoot, familyRoot), family)
  await validateFamilyStage(preview, repoRoot, activeRoot, family)
  const proofRoot = join(runRoot, "inputs")
  await mkdir(proofRoot)
  await copyInputs(activeRoot, join(proofRoot, familyRoot, family))
  for (const relative of [
    ".pi/figma-sync.json",
    `${familyRoot}/source-frame-registry.json`,
    `docs/registry/families/${family}`,
  ])
    await copyInputs(join(repoRoot, relative), join(proofRoot, relative))
  const identity = configuredSourceIdentity(repoRoot)
  // Only compact pinned identity inputs are necessary, never the full raw capture.
  for (const source of [identity.manifestPath, identity.variablesPath]) {
    const relative = source.slice(repoRoot.length + 1)
    if (source.startsWith(`${repoRoot}/`)) await copyInputs(source, join(proofRoot, relative))
    else throw Error("Pinned source identity must be inside the repository")
  }
  const familyProofRoot = join(proofRoot, familyRoot, family)
  for (const [index, artifact] of preview.stage.artifacts.entries()) {
    const bytes = await readFile(await safeFile(preview.stageDirectory, `artifacts/${index}`))
    if (bytes.length !== artifact.bytes || hashBytes(bytes) !== artifact.sha256)
      throw Error("Staged artifact changed while preparing proof inputs")
    const destination = await safeFile(familyProofRoot, artifact.destination)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, bytes)
  }
  if (inputFingerprint(repoRoot) !== preview.stage.inputFingerprint)
    throw Error("Inputs changed while preparing staged proof")
  const after = await readPromotionStage(preview.stageDirectory)
  if (after.stageHash !== preview.stageHash)
    throw Error("Stage manifest changed while preparing proof inputs")
  const snapshotSha256 = hashBytes(
    await readFile(await safeFile(familyProofRoot, "source/snapshot.json")),
  )
  const manifestSha256 = hashBytes(
    await readFile(await safeFile(familyProofRoot, "source/manifest.json")),
  )
  return {
    proofRoot,
    stageId,
    stageHash: preview.stageHash,
    snapshotSha256,
    manifestSha256,
    proofInputsSha256: proofInputFingerprint(proofRoot),
  }
}
