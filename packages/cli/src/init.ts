import type { CommandRunner } from "./command-runner"
import { defaultCommandRunner } from "./command-runner"
import { type DoctorResult, runDoctor } from "./doctor"
import { detectPackageManager, formatShellCommand, installCommand } from "./package-manager"
import { type PatchResult, patchProject } from "./patchers"
import { type Adapter, type PackageManager, getAdapterRecipe } from "./recipes"
import { setupGuidance } from "./setup-guidance"

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
  status: "complete" | "manual-action-required" | "failed"
  adapter: Adapter
  packageManager: PackageManager
  installCommand: string
  installSkipped: boolean
  patchSkipped: boolean
  patch?: PatchResult
  doctor?: DoctorResult
  exitCode: number
}

function shouldPrintProviderGuidance(patch: PatchResult | undefined): boolean {
  return patch?.status === "manual-action-required"
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
      write("Marwes init status: failed.")
      write(
        `Marwes init failed: installation command exited with code ${exitCode}. Provider patching and doctor were not run.`,
      )
      return {
        status: "failed",
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
    if (patch.searchedFiles?.length) {
      write(`Files searched: ${patch.searchedFiles.join(", ")}`)
    }
  }

  let doctor: DoctorResult | undefined
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
  }

  const providerFailure =
    doctor?.items.some(
      (item) => item.level === "fail" && item.message.startsWith("MarwesProvider"),
    ) === true
  const otherFailure =
    doctor?.items.some(
      (item) => item.level === "fail" && !item.message.startsWith("MarwesProvider"),
    ) === true
  const needsManualAction = providerFailure && (shouldPrintProviderGuidance(patch) || noPatch)
  const status: InitResult["status"] = otherFailure
    ? "failed"
    : needsManualAction
      ? "manual-action-required"
      : doctor && doctor.exitCode !== 0
        ? "failed"
        : "complete"

  if (needsManualAction) {
    write(
      `Manual follow-up: wrap the app root with ${recipe.providerImport} from ${recipe.packageName}.`,
    )
    write("Automatic patching currently supports the standard Vite app layout.")
  }
  if (agentic || needsManualAction || status === "complete") {
    for (const line of setupGuidance(options.adapter, agentic || needsManualAction)) write(line)
  }

  exitCode =
    status === "manual-action-required" ? 2 : status === "failed" ? (doctor?.exitCode ?? 1) : 0
  write(dryRun ? `[dry-run] Planned init status: ${status}.` : `Marwes init status: ${status}.`)
  write(
    dryRun
      ? "[dry-run] Marwes init plan complete. No installation, file changes, or doctor checks performed."
      : status === "complete"
        ? "Marwes init complete."
        : status === "manual-action-required"
          ? "Marwes provider wiring requires manual action (exit code 2)."
          : "Marwes init failed.",
  )

  return {
    status,
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
