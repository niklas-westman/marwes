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

function providerGuidance(adapter: Adapter): string[] {
  const recipe = getAdapterRecipe(adapter)
  const examples: Record<Adapter, string> = {
    react: [
      'import { createRoot } from "react-dom/client"',
      'import { MarwesProvider } from "@marwes-ui/react"',
      'import App from "./App"',
      "",
      'createRoot(document.getElementById("root")!).render(',
      "  <MarwesProvider>",
      "    <App />",
      "  </MarwesProvider>,",
      ")",
    ].join("\n"),
    vue: [
      '<script setup lang="ts">',
      'import { MarwesProvider } from "@marwes-ui/vue"',
      "</script>",
      "",
      "<template>",
      "  <MarwesProvider>",
      "    <main>Your app</main>",
      "  </MarwesProvider>",
      "</template>",
    ].join("\n"),
    svelte: [
      '<script lang="ts">',
      '  import { MarwesProvider } from "@marwes-ui/svelte"',
      "</script>",
      "",
      "<MarwesProvider>",
      "  <main>Your app</main>",
      "</MarwesProvider>",
    ].join("\n"),
  }

  return [
    `Manual follow-up: wrap the app root with ${recipe.providerImport} from ${recipe.packageName}.`,
    "Automatic patching currently supports the standard Vite app layout.",
    `Complete ${recipe.displayName} provider example:`,
    examples[adapter],
    `Setup guide: https://marwes.io/docs/get-started/${adapter}/`,
  ]
}

function shouldPrintProviderGuidance(patch: PatchResult | undefined): boolean {
  return patch?.status === "manual-action-required"
}

function writeProviderGuidance(adapter: Adapter, write: (message: string) => void): void {
  for (const line of providerGuidance(adapter)) {
    write(line)
  }
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
  if (agentic) {
    writeAgenticBoundaryRules(options.adapter, write)
  }

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
    writeProviderGuidance(options.adapter, write)
  }

  exitCode =
    status === "manual-action-required" ? 2 : status === "failed" ? (doctor?.exitCode ?? 1) : 0
  write(
    status === "complete"
      ? "Marwes init complete."
      : status === "manual-action-required"
        ? "Marwes packages are installed, but provider wiring requires manual action."
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
