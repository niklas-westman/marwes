import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"
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

const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".vue", ".svelte", ".css"])

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
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") {
        continue
      }

      files.push(...(await collectSourceFiles(path)))
      continue
    }

    const extension = entry.name.slice(entry.name.lastIndexOf("."))
    if (sourceExtensions.has(extension)) {
      files.push(path)
    }
  }

  return files
}

function detectInstalledAdapter(packageJson: PackageJson): Adapter | undefined {
  return adapters.find((adapter) =>
    dependencyVersion(packageJson, getAdapterRecipe(adapter).packageName),
  )
}

async function sourceContains(cwd: string, needle: string): Promise<boolean> {
  const sourceFiles = await collectSourceFiles(join(cwd, "src"))

  for (const file of sourceFiles) {
    const source = await readFile(file, "utf8")
    if (source.includes(needle)) {
      return true
    }
  }

  return false
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
  const items: DoctorItem[] = []

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

    const hasProvider = await sourceContains(cwd, "MarwesProvider")
    items.push(
      hasProvider
        ? { level: "pass", message: "MarwesProvider is referenced in app source." }
        : {
            level: "warn",
            message: "MarwesProvider was not found in app source.",
            fix: `Wrap the app root with MarwesProvider from ${recipe.packageName}.`,
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
  }

  if (await sourceContains(cwd, "@marwes-ui/presets/firstEdition/styles.css")) {
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
      items.push(
        exitCode === 0
          ? { level: "pass", message: `${scriptName} completed successfully.` }
          : { level: "fail", message: `${scriptName} failed.` },
      )
    }
  }

  for (const item of items) {
    write(formatItem(item))
  }

  const exitCode = items.some((item) => item.level === "fail") ? 1 : 0
  return { ...(adapter ? { adapter } : {}), items, exitCode }
}

export function adapterFromString(value: string | undefined): Adapter | undefined {
  return isAdapter(value) ? value : undefined
}
