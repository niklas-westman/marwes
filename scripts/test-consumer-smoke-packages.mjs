import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { createPackedOverrides, readPackedManifest } from "./consumer-smoke-packages.mjs"

function packedPackages() {
  return new Map(
    [
      ["core", {}],
      ["presets", { "@marwes-ui/core": "1.5.0" }],
      ["react", { "@marwes-ui/core": "1.5.0", "@marwes-ui/presets": "1.5.0" }],
    ].map(([name, dependencies]) => [
      `@marwes-ui/${name}`,
      {
        tarball: `/tmp/marwes packed/${name}.tgz`,
        manifest: { name: `@marwes-ui/${name}`, version: "1.5.0", dependencies },
      },
    ]),
  )
}

test("maps every packed sibling to a local override after validating transitive versions", () => {
  assert.deepEqual(createPackedOverrides(packedPackages()), {
    "@marwes-ui/core": "file:/tmp/marwes packed/core.tgz",
    "@marwes-ui/presets": "file:/tmp/marwes packed/presets.tgz",
    "@marwes-ui/react": "file:/tmp/marwes packed/react.tgz",
  })
})

test("does not let overrides conceal mismatched published dependency versions", () => {
  for (const version of ["1.4.1", "workspace:*", "^1.5.0"]) {
    const packages = packedPackages()
    packages.get("@marwes-ui/presets").manifest.dependencies["@marwes-ui/core"] = version
    assert.throws(() => createPackedOverrides(packages), /requires @marwes-ui\/core@/)
  }
})

test("rejects a runtime dependency without a packed sibling", () => {
  const packages = packedPackages()
  packages.delete("@marwes-ui/core")
  assert.throws(() => createPackedOverrides(packages), /no sibling tarball was packed/)
})

test("validates optional Marwes runtime dependencies too", () => {
  const packages = packedPackages()
  packages.get("@marwes-ui/react").manifest.optionalDependencies = {
    "@marwes-ui/unknown": "1.5.0",
  }
  assert.throws(() => createPackedOverrides(packages), /requires @marwes-ui\/unknown/)
})

test("rejects invalid packed identities and dependency objects", () => {
  for (const manifest of [
    null,
    { name: "@marwes-ui/wrong", version: "1.5.0" },
    { name: "@marwes-ui/core", version: "latest" },
    { name: "@marwes-ui/core", version: "1.5.0", dependencies: [] },
    { name: "@marwes-ui/core", version: "1.5.0", dependencies: null },
  ]) {
    const packages = packedPackages()
    packages.get("@marwes-ui/core").manifest = manifest
    assert.throws(() => createPackedOverrides(packages), /Invalid/)
  }
})

test("reads the actual tarball manifest and rejects malformed JSON", async () => {
  const directory = await mkdtemp(join(tmpdir(), "marwes-packed-manifest-"))
  try {
    await mkdir(join(directory, "package"))
    const tarball = join(directory, "packed package.tgz")
    for (const contents of ['{"name":"@marwes-ui/core","version":"1.5.0"}', "not JSON"]) {
      await writeFile(join(directory, "package", "package.json"), contents)
      const result = spawnSync("tar", ["-czf", tarball, "-C", directory, "package"], {
        encoding: "utf8",
        shell: false,
      })
      assert.equal(result.status, 0, result.stderr)
      if (contents === "not JSON") {
        assert.throws(() => readPackedManifest(tarball), /Invalid package.json JSON/)
      } else {
        assert.deepEqual(readPackedManifest(tarball), JSON.parse(contents))
      }
    }
    assert.throws(() => readPackedManifest(join(directory, "missing.tgz")), /Cannot read packed/)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
