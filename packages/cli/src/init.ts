import type { CommandRunner } from "./command-runner"
import { defaultCommandRunner } from "./command-runner"
import { detectPackageManager, formatShellCommand, installCommand } from "./package-manager"
import { type PatchResult, patchProject } from "./patchers"
import { type Adapter, type PackageManager, getAdapterRecipe } from "./recipes"

export type InitOptions = {
  adapter: Adapter
  cwd?: string
  packageManager?: PackageManager
  dryRun?: boolean
  yes?: boolean
  noInstall?: boolean
  noPatch?: boolean
  runner?: CommandRunner
  write?: (message: string) => void
}

export type InitResult = {
  adapter: Adapter
  packageManager: PackageManager
  installCommand: string
  installSkipped: boolean
  patchSkipped: boolean
  patch?: PatchResult
  exitCode: number
}

export async function runInit(options: InitOptions): Promise<InitResult> {
  const cwd = options.cwd ?? process.cwd()
  const write = options.write ?? ((message: string) => console.log(message))
  const runner = options.runner ?? defaultCommandRunner
  const recipe = getAdapterRecipe(options.adapter)
  const packageManager = options.packageManager ?? (await detectPackageManager(cwd))
  const command = installCommand(packageManager, recipe.installPackages)
  const commandLabel = formatShellCommand(command)
  const dryRun = options.dryRun === true
  const noInstall = options.noInstall === true
  const noPatch = options.noPatch === true

  write(`Marwes init: ${recipe.displayName}`)
  write(`Package manager: ${packageManager}`)

  let exitCode = 0

  if (noInstall) {
    write(`Install skipped. Run manually: ${commandLabel}`)
  } else if (dryRun) {
    write(`[dry-run] ${commandLabel}`)
  } else {
    exitCode = await runner(command, { cwd })
    if (exitCode !== 0) {
      return {
        adapter: options.adapter,
        packageManager,
        installCommand: commandLabel,
        installSkipped: false,
        patchSkipped: noPatch,
        exitCode,
      }
    }
  }

  let patch: PatchResult | undefined
  if (noPatch) {
    write("Patch skipped.")
  } else {
    patch = await patchProject(cwd, options.adapter, dryRun)
    const patchLabel = patch.file ? `${patch.file}: ${patch.message}` : patch.message
    write(dryRun && patch.changed ? `[dry-run] ${patchLabel}` : patchLabel)
  }

  write("Marwes init complete.")

  return {
    adapter: options.adapter,
    packageManager,
    installCommand: commandLabel,
    installSkipped: noInstall || dryRun,
    patchSkipped: noPatch,
    ...(patch ? { patch } : {}),
    exitCode,
  }
}
