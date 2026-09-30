import { spawnSync } from "node:child_process"

export function readPackedManifest(tarball) {
  const result = spawnSync("tar", ["-xOf", tarball, "package/package.json"], {
    encoding: "utf8",
    shell: false,
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`Cannot read packed manifest from ${tarball}: ${result.stderr.trim()}`)
  }
  try {
    return JSON.parse(result.stdout)
  } catch {
    throw new Error(`Invalid package.json JSON in ${tarball}`)
  }
}

export function createPackedOverrides(packages) {
  for (const [name, { manifest, tarball }] of packages) {
    if (
      !manifest ||
      typeof manifest !== "object" ||
      manifest.name !== name ||
      typeof manifest.version !== "string" ||
      !/^\d+\.\d+\.\d+(?:-[\da-z.-]+)?(?:\+[\da-z.-]+)?$/i.test(manifest.version)
    ) {
      throw new Error(`Invalid packed name/version for ${name} in ${tarball}`)
    }
  }

  for (const [name, { manifest }] of packages) {
    for (const group of ["dependencies", "optionalDependencies"]) {
      const dependencies = manifest[group] === undefined ? {} : manifest[group]
      if (!dependencies || typeof dependencies !== "object" || Array.isArray(dependencies)) {
        throw new Error(`Invalid ${group} in packed ${name}`)
      }
      for (const [dependency, version] of Object.entries(dependencies)) {
        if (!dependency.startsWith("@marwes-ui/")) continue
        const sibling = packages.get(dependency)
        if (!sibling) {
          throw new Error(
            `Packed ${name} requires ${dependency}, but no sibling tarball was packed`,
          )
        }
        if (version !== sibling.manifest.version) {
          throw new Error(
            `Packed ${name} requires ${dependency}@${version}, but its tarball is ${sibling.manifest.version}`,
          )
        }
      }
    }
  }

  return Object.fromEntries([...packages].map(([name, { tarball }]) => [name, `file:${tarball}`]))
}
