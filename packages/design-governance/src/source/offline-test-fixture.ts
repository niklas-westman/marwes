import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import type { LegacyContract } from "../source/types.js"

/**
 * Pin compiler/integrity unit tests to committed proof, independent of a pending live refresh.
 * Families are promoted to a new Figma capture one at a time, so a fixture can only pin the
 * identity of one family; pass an unpromoted family to test the others.
 */
export function createOfflineProofFixture(pinnedFamily = "button"): string {
  const repository = resolve(import.meta.dirname, "../../../..")
  const fixture = mkdtempSync(join(tmpdir(), "marwes-pinned-proof-"))
  const families = "packages/design-governance/reflection-families"
  mkdirSync(join(fixture, families), { recursive: true })
  cpSync(join(repository, families), join(fixture, families), { recursive: true })
  // These four cases describe the retained capture and receipt bytes. Live
  // enrollment can expand independently without inventing proof for new cases.
  for (const contract of ["reflection-contract.json", "structural-contract.json"]) {
    cpSync(
      join(import.meta.dirname, "fixtures", `button-${contract}`),
      join(fixture, families, "button", contract),
    )
  }
  const fileKey = JSON.parse(
    readFileSync(join(fixture, families, pinnedFamily, "source/snapshot.json"), "utf8"),
  ).fileKey
  mkdirSync(join(fixture, ".pi"))
  writeFileSync(
    join(fixture, ".pi/figma-sync.json"),
    JSON.stringify({
      defaultTarget: "marwes",
      targets: {
        marwes: {
          figmaFile: `https://www.figma.com/design/${fileKey}/Pinned`,
          liveDir: ".figma/marwes",
        },
      },
    }),
  )
  for (const family of readdirSync(join(fixture, families))) {
    const path = join(fixture, families, family, "reflection-contract.json")
    if (!existsSync(path)) continue
    const contract: LegacyContract = JSON.parse(readFileSync(path, "utf8"))
    contract.figmaFileKey = fileKey
    writeFileSync(path, JSON.stringify(contract))
  }
  const registry = "docs/registry/families"
  mkdirSync(join(fixture, registry), { recursive: true })
  cpSync(join(repository, registry), join(fixture, registry), { recursive: true })
  return fixture
}
