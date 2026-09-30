import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import type { CommandRunner } from "./command-runner"
import { defaultCommandRunner } from "./command-runner"
import { runInit } from "./init"
import { createViteCommand, detectPackageManager, formatShellCommand } from "./package-manager"
import {
  type Adapter,
  type MarwesTemplate,
  type PackageManager,
  adapterFromTemplate,
  getAdapterRecipe,
} from "./recipes"

export type CreateOptions = {
  projectName: string
  template: MarwesTemplate
  cwd?: string
  packageManager?: PackageManager
  dryRun?: boolean
  noInstall?: boolean
  runner?: CommandRunner
  write?: (message: string) => void
}

export type CreateResult = {
  projectName: string
  template: MarwesTemplate
  exitCode: number
}

const safeProjectPathPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*(?:\/[a-zA-Z0-9][a-zA-Z0-9._-]*)*$/

export function isSafeProjectPath(projectName: string): boolean {
  return safeProjectPathPattern.test(projectName)
}

async function stageAdapterDependency(cwd: string, adapter: Adapter): Promise<void> {
  const packageJsonPath = resolve(cwd, "package.json")
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))
  const packageName = getAdapterRecipe(adapter).packageName
  const dependencies = packageJson.dependencies ?? {}

  if (!(packageName in dependencies) && !(packageName in (packageJson.devDependencies ?? {}))) {
    packageJson.dependencies = { ...dependencies, [packageName]: "latest" }
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
  }
}

export async function runCreate(options: CreateOptions): Promise<CreateResult> {
  const cwd = options.cwd ?? process.cwd()
  const write = options.write ?? ((message: string) => console.log(message))
  const runner = options.runner ?? defaultCommandRunner

  if (!isSafeProjectPath(options.projectName)) {
    write(
      "Invalid project name. Use a relative path made from letters, numbers, dots, dashes, underscores, and forward slashes.",
    )
    return {
      projectName: options.projectName,
      template: options.template,
      exitCode: 1,
    }
  }

  const packageManager = options.packageManager ?? (await detectPackageManager(cwd))
  const command = createViteCommand(packageManager, options.projectName, options.template)
  const adapter = adapterFromTemplate(options.template)
  const targetCwd = resolve(cwd, options.projectName)

  write(`Create Marwes app: ${options.projectName}`)
  write(`Template: ${options.template}`)

  if (options.dryRun) {
    write(`[dry-run] ${formatShellCommand(command)}`)
    write(`[dry-run] marwes init --adapter ${adapter}`)
    return {
      projectName: options.projectName,
      template: options.template,
      exitCode: 0,
    }
  }

  const createExitCode = await runner(command, { cwd })
  if (createExitCode !== 0) {
    return {
      projectName: options.projectName,
      template: options.template,
      exitCode: createExitCode,
    }
  }

  if (options.noInstall) {
    await stageAdapterDependency(targetCwd, adapter)
    write(
      `Recorded ${getAdapterRecipe(adapter).packageName} in package.json. Run ${packageManager} install before starting the app.`,
    )
  }

  const initResult = await runInit({
    adapter,
    cwd: targetCwd,
    packageManager,
    noInstall: options.noInstall === true,
    runner,
    write,
  })

  return {
    projectName: options.projectName,
    template: options.template,
    exitCode: initResult.exitCode,
  }
}
