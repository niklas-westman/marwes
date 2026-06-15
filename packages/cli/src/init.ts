import type { CommandRunner } from "./command-runner"
import { defaultCommandRunner } from "./command-runner"
import { type DoctorResult, runDoctor } from "./doctor"
import { detectPackageManager, formatShellCommand, installCommand } from "./package-manager"
import { type PatchResult, patchProject } from "./patchers"
import { type Adapter, type PackageManager, getAdapterRecipe } from "./recipes"

export type InitOptions = {
  adapter: Adapter
  cwd?: string
  packageManager?: PackageManager
  dryRun?: boolean
  agentic?: boolean
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
  doctor?: DoctorResult
  exitCode: number
}

function providerGuidance(adapter: Adapter): string {
  const recipe = getAdapterRecipe(adapter)
  return `Manual follow-up: wrap the app root with ${recipe.providerImport} from ${recipe.packageName}.`
}

function shouldPrintProviderGuidance(patch: PatchResult | undefined): boolean {
  if (!patch || patch.changed) {
    return false
  }

  return !patch.message.toLowerCase().includes("already")
}

function writeAgenticBoundaryRules(adapter: Adapter, write: (message: string) => void): void {
  const recipe = getAdapterRecipe(adapter)
  write("Agentic rules:")
  write(`- Import Marwes APIs only from ${recipe.packageName}.`)
  write("- Do not install @marwes-ui/core or @marwes-ui/presets directly.")
  write("- Do not add a separate Marwes stylesheet import.")
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
  const agentic = options.agentic === true
  const noInstall = options.noInstall === true
  const noPatch = options.noPatch === true

  write(`Marwes init: ${recipe.displayName}`)
  write(`Package manager: ${packageManager}`)
  if (agentic) {
    write("Mode: agentic")
  }

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

  let doctor: DoctorResult | undefined
  if (agentic) {
    if (shouldPrintProviderGuidance(patch) || noPatch) {
      write(providerGuidance(options.adapter))
    }

    writeAgenticBoundaryRules(options.adapter, write)

    if (dryRun) {
      write(`[dry-run] marwes doctor --adapter ${options.adapter}`)
    } else {
      write("Marwes doctor:")
      doctor = await runDoctor({
        adapter: options.adapter,
        cwd,
        packageManager,
        runner,
        write,
      })
      exitCode = doctor.exitCode
    }
  }

  write("Marwes init complete.")

  return {
    adapter: options.adapter,
    packageManager,
    installCommand: commandLabel,
    installSkipped: noInstall || dryRun,
    patchSkipped: noPatch,
    ...(patch ? { patch } : {}),
    ...(doctor ? { doctor } : {}),
    exitCode,
  }
}
