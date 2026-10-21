import { spawnSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, describe, expect, it } from "vitest"
import { configuredSourceIdentity } from "../source/snapshot.ts"
import { assertIncomingOutput } from "./promotion-guard.mjs"

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url))
const commands = [
  "export-figma-baselines",
  "install-browsers",
  "migrate-frame-prep-into-contracts",
  "prepare-figma-reflection-frames",
  "rename-figma-frames",
  "sort-figma-baselines",
  "write-baseline-receipts",
]
const temporary: string[] = []
function run(command: string, args: string[], canonical = false) {
  const directory = canonical ? "packages/design-governance/src/tooling" : "scripts/reflection"
  return spawnSync(process.execPath, [join(repoRoot, directory, `${command}.mjs`), ...args], {
    cwd: tmpdir(),
    encoding: "utf8",
    timeout: 20_000,
  })
}
afterEach(() => {
  for (const path of temporary.splice(0)) rmSync(path, { force: true, recursive: true })
})

describe("legacy Reflection compatibility entry points", () => {
  for (const command of commands) {
    it(`${command} delegates help from any working directory`, () => {
      const wrapper = readFileSync(join(repoRoot, "scripts/reflection", `${command}.mjs`), "utf8")
      expect(wrapper).toContain(
        `import "../../packages/design-governance/src/tooling/${command}.mjs"`,
      )
      expect(wrapper.split("\n").length).toBeLessThan(7)
      const original = run(command, ["--help"])
      const canonical = run(command, ["--help"], true)
      expect(original.error).toBeUndefined()
      expect(original.status).toBe(0)
      expect(original.stdout).toBe(canonical.stdout)
      expect(original.stderr).toBe(canonical.stderr)
      expect(canonical.status).toBe(0)
    })
  }
  for (const [command, args] of [
    ["export-figma-baselines", ["--family", "button"]],
    ["prepare-figma-reflection-frames", ["--family", "button", "--write", "--export-baselines"]],
    ["sort-figma-baselines", ["--target", "active", "--write"]],
    ["write-baseline-receipts", ["--all", "--write"]],
  ] as const) {
    it(`${command} refuses direct active writes before external access`, () => {
      const result = run(command, [...args])
      expect(result.status).toBe(1)
      expect(result.stderr).toContain("cannot write active references or receipts")
      expect(result.stderr).toContain("source-stage")
      expect(result.stderr).toContain("owner-authored approval")
    })
  }
  for (const [command, args] of [
    ["export-figma-baselines", ["--family", "button", "--dry-run"]],
    ["prepare-figma-reflection-frames", ["--family", "button", "--dry-run"]],
    ["migrate-frame-prep-into-contracts", ["--family", "button", "--dry-run"]],
    ["write-baseline-receipts", ["--family", "button", "--dry-run"]],
  ] as const) {
    it(`${command} preserves offline dry-run results`, () => {
      const original = run(command, [...args])
      const canonical = run(command, [...args], true)
      expect(original.error).toBeUndefined()
      // This legacy audit needs the ignored raw export; the canonical governance
      // check has separate tests proving operation from committed compact proof.
      const buttonContract = JSON.parse(
        readFileSync(
          join(
            repoRoot,
            "packages/design-governance/reflection-families/button/reflection-contract.json",
          ),
          "utf8",
        ),
      )
      const missingButtonReferences = buttonContract.cases.some(
        (entry: { baseline: string }) =>
          !existsSync(join(repoRoot, buttonContract.baselineRoot, entry.baseline)),
      )
      // The legacy receipt writer cannot process the explicit-mode captures in the full Button
      // contract, so for that command only the equivalence of both entry points is asserted.
      const expectedStatus =
        command === "write-baseline-receipts" &&
        (!existsSync(configuredSourceIdentity(repoRoot).rawPath) || missingButtonReferences)
          ? 1
          : 0
      if (command === "write-baseline-receipts") {
        expect(canonical.status).toBe(original.status)
      } else {
        expect(original.status).toBe(expectedStatus)
        expect(canonical.status).toBe(expectedStatus)
      }
      expect(original.stdout).toBe(canonical.stdout)
      expect(original.stderr).toBe(canonical.stderr)
    }, 30_000)
  }
})

it("sorts a fixture offline without writing output", () => {
  const fixture = mkdtempSync(join(tmpdir(), "governance-sort-"))
  temporary.push(fixture)
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=",
    "base64",
  )
  for (const mode of ["light", "dark"]) {
    mkdirSync(join(fixture, `${mode}-marwes-reflection`))
    writeFileSync(join(fixture, `${mode}-marwes-reflection`, "Button.png"), png)
  }
  const map = join(fixture, "map.json")
  writeFileSync(
    map,
    JSON.stringify({
      viewportSize: { width: 1, height: 1 },
      families: {
        button: [
          {
            caseId: "button.primary",
            requiredFrameNames: {
              light: { currentName: "Button", requiredName: "reflection/button/primary/light" },
              dark: { currentName: "Button", requiredName: "reflection/button/primary/dark" },
            },
          },
        ],
      },
    }),
  )
  const output = join(fixture, "output")
  const args = ["--source", fixture, "--map", map, "--out-root", output, "--dry-run"]
  const original = run("sort-figma-baselines", args)
  const canonical = run("sort-figma-baselines", args, true)
  expect(original.status).toBe(0)
  expect(original.stdout).toContain("Mapped PNGs: 2")
  expect(original.stdout).toBe(canonical.stdout)
  expect(original.stderr).toBe(canonical.stderr)
  expect(existsSync(output)).toBe(false)
  const refused = run("sort-figma-baselines", [...args, "--write"])
  expect(refused.status).toBe(1)
  expect(refused.stderr).toContain("source-stage")
  expect(existsSync(output)).toBe(false)
})

it("incoming staging cannot escape into active references through paths or symlinks", () => {
  const fixture = mkdtempSync(join(tmpdir(), "governance-tooling-"))
  temporary.push(fixture)
  const families = join(fixture, "packages/design-governance/reflection-families")
  mkdirSync(join(families, "_incoming"), { recursive: true })
  mkdirSync(join(families, "button/baselines"), { recursive: true })
  expect(() =>
    assertIncomingOutput(fixture, join(families, "_incoming/capture/button/baselines/a.png")),
  ).not.toThrow()
  expect(() => assertIncomingOutput(fixture, join(families, "button/baselines/a.png"))).toThrow(
    "source-stage",
  )
  symlinkSync(join(families, "button"), join(families, "_incoming/escape"))
  expect(() =>
    assertIncomingOutput(fixture, join(families, "_incoming/escape/baselines/a.png")),
  ).toThrow("source-stage")
  rmSync(join(families, "_incoming"), { recursive: true })
  symlinkSync(join(families, "button"), join(families, "_incoming"))
  expect(() => assertIncomingOutput(fixture, join(families, "_incoming/baselines/a.png"))).toThrow(
    "Symlinked",
  )
})
