#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createPackedOverrides, readPackedManifest } from "./consumer-smoke-packages.mjs"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const fixtureRoot = join(repoRoot, "scripts", "fixtures", "consumer-smoke")
const canonicalFixtureRoot = join(repoRoot, "apps", "dashboard-teaser", "src", "fixtures")
const supportedFrameworks = ["react", "vue", "svelte"]

const frameworkConfig = {
  react: {
    adapter: "@marwes-ui/react",
    dependencies: {
      react: "19.2.4",
      "react-dom": "19.2.4",
    },
    devDependencies: {
      "@types/react": "19.2.13",
      "@types/react-dom": "19.2.3",
      "@vitejs/plugin-react": "5.1.3",
    },
    typecheck: ["exec", "tsc", "--noEmit"],
  },
  vue: {
    adapter: "@marwes-ui/vue",
    dependencies: {
      vue: "3.5.28",
      "@vue/server-renderer": "3.5.28",
    },
    devDependencies: {
      "@vitejs/plugin-vue": "6.0.4",
      "vue-tsc": "3.3.11",
    },
    typecheck: ["exec", "vue-tsc", "--noEmit"],
  },
  svelte: {
    adapter: "@marwes-ui/svelte",
    dependencies: {
      svelte: "5.56.3",
    },
    devDependencies: {
      "@sveltejs/vite-plugin-svelte": "6.2.4",
      "svelte-check": "4.3.5",
    },
    typecheck: ["exec", "svelte-check", "--tsconfig", "./tsconfig.json"],
  },
}

function usage() {
  return `Usage: pnpm consumer:smoke --framework <${supportedFrameworks.join("|")}> [--keep]\n\nBuilds and packs Marwes packages, installs their tarballs in a clean Vite fixture, then runs typecheck, test, and production build.\n`
}

function parseArguments(argv) {
  let framework
  let keep = false

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === "--help" || argument === "-h") {
      process.stdout.write(usage())
      process.exit(0)
    }
    if (argument === "--keep") {
      keep = true
      continue
    }
    if (argument === "--framework") {
      framework = argv[index + 1]
      index += 1
      continue
    }
    if (argument.startsWith("--framework=")) {
      framework = argument.slice("--framework=".length)
      continue
    }
    throw new Error(`Unknown argument: ${argument}\n\n${usage()}`)
  }

  if (!supportedFrameworks.includes(framework)) {
    throw new Error(`--framework must be one of: ${supportedFrameworks.join(", ")}\n\n${usage()}`)
  }

  return { framework, keep }
}

function run(command, args, options = {}) {
  const printable = [command, ...args].join(" ")
  process.stdout.write(`\n> ${printable}\n`)
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: { ...process.env, CI: process.env.CI ?? "true" },
    stdio: "inherit",
    shell: false,
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${printable} failed with exit code ${result.status ?? "unknown"}`)
  }
}

async function packPackage(packageName, tarballDirectory) {
  const before = new Set(await readdir(tarballDirectory))
  run("pnpm", ["--filter", packageName, "build"])
  run("pnpm", ["--filter", packageName, "pack", "--pack-destination", tarballDirectory])

  const after = await readdir(tarballDirectory)
  const tarball = after.find((file) => file.endsWith(".tgz") && !before.has(file))
  if (!tarball) throw new Error(`pnpm pack did not create a tarball for ${packageName}`)
  return join(tarballDirectory, tarball)
}

async function assertConsumerImports(appDirectory, adapterPackage) {
  const sourceDirectory = join(appDirectory, "src")
  const pending = [sourceDirectory]
  const sourceFiles = []

  while (pending.length > 0) {
    const current = pending.pop()
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      if (entry.isDirectory()) pending.push(path)
      else sourceFiles.push(path)
    }
  }

  const forbiddenImports = [
    /["']@marwes-ui\/(?:core|presets)(?:\/[^"']*)?["']/,
    new RegExp(`["']${adapterPackage.replace("/", "\\/")}\\/[^"']+["']`),
    /["'](?:\.\.\/)+\.\.\/packages\//,
  ]

  for (const sourceFile of sourceFiles) {
    const source = await readFile(sourceFile, "utf8")
    for (const forbiddenImport of forbiddenImports) {
      if (forbiddenImport.test(source)) {
        throw new Error(
          `${relative(repoRoot, sourceFile)} contains a private or non-adapter Marwes import: ${forbiddenImport}`,
        )
      }
    }
  }
}

async function assertPresetCss(appDirectory) {
  const installedPresetCss = join(
    appDirectory,
    "node_modules",
    "@marwes-ui",
    "presets",
    "src",
    "firstEdition",
    "styles.css",
  )
  const installedCss = await readFile(installedPresetCss, "utf8")
  const installedTokens = await readFile(join(dirname(installedPresetCss), "tokens.css"), "utf8")
  if (!installedCss.includes('@import "./tokens.css"') || !installedTokens.includes("--mw-")) {
    throw new Error("The packed presets package does not contain the expected Marwes preset CSS")
  }

  const assetsDirectory = join(appDirectory, "dist", "assets")
  const builtAssets = await readdir(assetsDirectory)
  const cssAssets = builtAssets.filter((file) => file.endsWith(".css"))
  if (cssAssets.length === 0) {
    throw new Error("The consumer production build did not emit a CSS asset")
  }

  const cssContents = await Promise.all(
    cssAssets.map((file) => readFile(join(assetsDirectory, file), "utf8")),
  )
  if (!cssContents.some((css) => css.includes("--mw-"))) {
    throw new Error("The consumer production build did not include the Marwes preset CSS")
  }
}

async function main() {
  const { framework, keep } = parseArguments(process.argv.slice(2))
  const config = frameworkConfig[framework]
  const temporaryRoot = await mkdtemp(join(tmpdir(), `marwes-consumer-${framework}-`))
  if (!resolve(temporaryRoot).startsWith(`${resolve(tmpdir())}/`)) {
    throw new Error(`Refusing to use unexpected temporary path: ${temporaryRoot}`)
  }
  const tarballDirectory = join(temporaryRoot, "tarballs")
  const appDirectory = join(temporaryRoot, "app")

  await cp(join(fixtureRoot, framework), appDirectory, { recursive: true })
  await cp(join(fixtureRoot, ".gitignore"), join(appDirectory, ".gitignore"))
  await cp(join(fixtureRoot, "package.json"), join(appDirectory, "package.json"))
  await cp(join(fixtureRoot, "index.html"), join(appDirectory, "index.html"))
  await cp(join(fixtureRoot, "tsconfig.json"), join(appDirectory, "tsconfig.json"))
  const fixtureExtension = framework === "react" ? "tsx" : framework
  await cp(
    join(canonicalFixtureRoot, `get-started.${fixtureExtension}`),
    join(appDirectory, "src", `app.${fixtureExtension}`),
  )
  await mkdir(tarballDirectory, { recursive: true })

  try {
    const packageNames = ["@marwes-ui/core", "@marwes-ui/presets", config.adapter]
    const tarballs = new Map()
    for (const packageName of packageNames) {
      tarballs.set(packageName, await packPackage(packageName, tarballDirectory))
    }
    const packedPackages = new Map(
      [...tarballs].map(([name, tarball]) => [
        name,
        { tarball, manifest: readPackedManifest(tarball) },
      ]),
    )
    // Validate published dependency versions before redirecting unpublished siblings locally.
    const packedOverrides = createPackedOverrides(packedPackages)

    const packageJsonPath = join(appDirectory, "package.json")
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))
    packageJson.name = `marwes-consumer-smoke-${framework}`
    packageJson.dependencies = {
      "@marwes-ui/core": `file:${tarballs.get("@marwes-ui/core")}`,
      "@marwes-ui/presets": `file:${tarballs.get("@marwes-ui/presets")}`,
      [config.adapter]: `file:${tarballs.get(config.adapter)}`,
      ...config.dependencies,
    }
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...config.devDependencies,
    }
    packageJson.pnpm = { ...packageJson.pnpm, overrides: packedOverrides }
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

    await assertConsumerImports(appDirectory, config.adapter)
    run("pnpm", ["install", "--ignore-workspace", "--no-frozen-lockfile"], { cwd: appDirectory })
    for (const [name, { manifest }] of packedPackages) {
      const installed = JSON.parse(
        await readFile(join(appDirectory, "node_modules", name, "package.json"), "utf8"),
      )
      if (installed.name !== name || installed.version !== manifest.version) {
        throw new Error(`Installed ${name} does not match its packed version ${manifest.version}`)
      }
    }
    run("pnpm", config.typecheck, { cwd: appDirectory })
    run("pnpm", ["test"], { cwd: appDirectory })
    run("pnpm", ["build"], { cwd: appDirectory })
    await assertPresetCss(appDirectory)

    process.stdout.write(`\nConsumer smoke passed for ${framework} using packed artifacts.\n`)
  } finally {
    if (keep) {
      process.stdout.write(`Kept smoke workspace for debugging: ${temporaryRoot}\n`)
    } else {
      await rm(temporaryRoot, { recursive: true, force: true })
    }
  }
}

main().catch((error) => {
  process.stderr.write(`Consumer smoke failed: ${error instanceof Error ? error.message : error}\n`)
  process.exitCode = 1
})
