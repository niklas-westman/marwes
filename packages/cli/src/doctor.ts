import { readFile, readdir } from "node:fs/promises"
import { basename, extname, join } from "node:path"
import type { CommandRunner } from "./command-runner"
import { defaultCommandRunner } from "./command-runner"
import { detectPackageManager, formatShellCommand, runScriptCommand } from "./package-manager"
import { type Adapter, type PackageManager, adapters, getAdapterRecipe, isAdapter } from "./recipes"

export type DoctorLevel = "pass" | "warn" | "fail"

export type DoctorItem = {
  level: DoctorLevel
  message: string
  fix?: string
}

export type DoctorOptions = {
  adapter?: Adapter
  cwd?: string
  packageManager?: PackageManager
  runBuild?: boolean
  runner?: CommandRunner
  write?: (message: string) => void
}

export type DoctorResult = {
  adapter?: Adapter
  items: DoctorItem[]
  exitCode: number
}

type PackageJson = {
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

type SourceFile = {
  path: string
  source: string
}

const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".vue", ".svelte", ".css"])
const sourceDirectories = ["src", "app", "pages"]
const knownRootFile = /^(?:main|app|layout|index|root)\.(?:ts|tsx|js|jsx|vue|svelte)$/i

function dependencyVersion(packageJson: PackageJson, packageName: string): string | undefined {
  return (
    packageJson.dependencies?.[packageName] ??
    packageJson.devDependencies?.[packageName] ??
    packageJson.peerDependencies?.[packageName] ??
    packageJson.optionalDependencies?.[packageName]
  )
}

async function readPackageJson(cwd: string): Promise<PackageJson> {
  const source = await readFile(join(cwd, "package.json"), "utf8")
  return JSON.parse(source) as PackageJson
}

async function collectSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => [])
  const files: string[] = []

  for (const entry of entries) {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git", ".next", ".svelte-kit"].includes(entry.name)) {
        continue
      }

      files.push(...(await collectSourceFiles(path)))
      continue
    }

    if (sourceExtensions.has(extname(entry.name))) {
      files.push(path)
    }
  }

  return files
}

async function readProjectSources(cwd: string): Promise<SourceFile[]> {
  const paths = new Set<string>()

  for (const directory of sourceDirectories) {
    for (const file of await collectSourceFiles(join(cwd, directory))) {
      paths.add(file)
    }
  }

  const rootEntries = await readdir(cwd, { withFileTypes: true }).catch(() => [])
  for (const entry of rootEntries) {
    if (entry.isFile() && knownRootFile.test(entry.name)) {
      paths.add(join(cwd, entry.name))
    }
  }

  return Promise.all(
    [...paths].map(async (path) => ({ path, source: await readFile(path, "utf8") })),
  )
}

function detectInstalledAdapter(packageJson: PackageJson): Adapter | undefined {
  return adapters.find((adapter) =>
    dependencyVersion(packageJson, getAdapterRecipe(adapter).packageName),
  )
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function importedProviderNames(source: string, packageName: string): string[] {
  const names: string[] = []
  const importPattern = new RegExp(
    `import\\s*\\{([^}]*)\\}\\s*from\\s*["']${escapeRegExp(packageName)}["']`,
    "g",
  )

  for (const match of source.matchAll(importPattern)) {
    for (const binding of (match[1] ?? "").split(",")) {
      const provider = binding.trim().match(/^MarwesProvider(?:\s+as\s+([A-Za-z_$][\w$]*))?$/)
      if (provider) {
        names.push(provider[1] ?? "MarwesProvider")
      }
    }
  }

  return names
}

function rendersComponent(source: string, componentName: string): boolean {
  return new RegExp(`<\\s*${escapeRegExp(componentName)}(?:\\s|/?>)`).test(source)
}

function providerSetupFile(
  sources: readonly SourceFile[],
  packageName: string,
): SourceFile | undefined {
  return sources.find((file) =>
    importedProviderNames(file.source, packageName).some((name) =>
      rendersComponent(file.source, name),
    ),
  )
}

function sourceContains(sources: readonly SourceFile[], needle: string): boolean {
  return sources.some((file) => file.source.includes(needle))
}

function sourceMatches(sources: readonly SourceFile[], pattern: RegExp): boolean {
  return sources.some((file) => pattern.test(file.source))
}

function formatItem(item: DoctorItem): string {
  const prefix = item.level === "pass" ? "[pass]" : item.level === "warn" ? "[warn]" : "[fail]"
  return item.fix
    ? `${prefix} ${item.message}\n       fix: ${item.fix}`
    : `${prefix} ${item.message}`
}

export async function runDoctor(options: DoctorOptions = {}): Promise<DoctorResult> {
  const cwd = options.cwd ?? process.cwd()
  const write = options.write ?? ((message: string) => console.log(message))
  const runner = options.runner ?? defaultCommandRunner
  const packageJson = await readPackageJson(cwd)
  const adapter = options.adapter ?? detectInstalledAdapter(packageJson)
  const sources = await readProjectSources(cwd)
  const items: DoctorItem[] = []
  let commandFailureCode: number | undefined

  if (!adapter) {
    items.push({
      level: "fail",
      message: "No Marwes adapter dependency found.",
      fix: "Run marwes init --adapter react, marwes init --adapter vue, or marwes init --adapter svelte.",
    })
  } else {
    const recipe = getAdapterRecipe(adapter)

    for (const packageName of recipe.installPackages) {
      if (dependencyVersion(packageJson, packageName)) {
        items.push({ level: "pass", message: `${packageName} is installed.` })
      } else {
        items.push({
          level: "fail",
          message: `${packageName} is missing.`,
          fix: `${options.packageManager ?? (await detectPackageManager(cwd))} add ${recipe.installPackages.join(" ")}`,
        })
      }
    }

    const providerFile = providerSetupFile(sources, recipe.packageName)
    const providerMentioned = sourceContains(sources, "MarwesProvider")
    items.push(
      providerFile
        ? {
            level: "pass",
            message: `MarwesProvider is imported from ${recipe.packageName} and rendered in ${basename(providerFile.path)}.`,
          }
        : {
            level: "fail",
            message: providerMentioned
              ? `MarwesProvider is not both imported from ${recipe.packageName} and rendered in the same app entry file.`
              : "MarwesProvider was not rendered in app source.",
            fix: `Wrap the app root with MarwesProvider from ${recipe.packageName}. Checked src/, app/, pages/, and known root entry files.`,
          },
    )
  }

  for (const internalPackage of ["@marwes-ui/core", "@marwes-ui/presets"]) {
    if (dependencyVersion(packageJson, internalPackage)) {
      items.push({
        level: "warn",
        message: `${internalPackage} is installed directly.`,
        fix: "App projects should import from the public adapter package instead.",
      })
    }

    const escapedPackage = escapeRegExp(internalPackage)
    if (
      sourceMatches(sources, new RegExp(`(?:from\\s*|import\\s*)["']${escapedPackage}(?:["'/])`))
    ) {
      items.push({
        level: "warn",
        message: `Direct source import from ${internalPackage} found.`,
        fix: "Import consumer APIs from the framework adapter package instead.",
      })
    }
  }

  if (sourceMatches(sources, /["']@marwes-ui\/presets\/[^"']*styles\.css["']/)) {
    items.push({
      level: "warn",
      message: "Manual Marwes preset stylesheet import found.",
      fix: "Remove the stylesheet import; adapter packages load the default styles automatically.",
    })
  }

  if (options.runBuild) {
    const packageManager = options.packageManager ?? (await detectPackageManager(cwd))
    const scriptName = packageJson.scripts?.typecheck
      ? "typecheck"
      : packageJson.scripts?.build
        ? "build"
        : undefined

    if (!scriptName) {
      items.push({ level: "warn", message: "No typecheck or build script found to run." })
    } else {
      const command = runScriptCommand(packageManager, scriptName)
      write(`Running ${formatShellCommand(command)}`)
      const exitCode = await runner(command, { cwd })
      if (exitCode !== 0) {
        commandFailureCode = exitCode
      }
      items.push(
        exitCode === 0
          ? { level: "pass", message: `${scriptName} completed successfully.` }
          : { level: "fail", message: `${scriptName} failed with exit code ${exitCode}.` },
      )
    }
  }

  for (const item of items) {
    write(formatItem(item))
  }

  const exitCode = commandFailureCode ?? (items.some((item) => item.level === "fail") ? 1 : 0)
  return { ...(adapter ? { adapter } : {}), items, exitCode }
}

export function adapterFromString(value: string | undefined): Adapter | undefined {
  return isAdapter(value) ? value : undefined
}
