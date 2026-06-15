import { resolve } from "node:path"
import type { CommandRunner } from "./command-runner"
import { defaultCommandRunner } from "./command-runner"
import { runInit } from "./init"
import { createViteCommand, detectPackageManager, formatShellCommand } from "./package-manager"
import { type MarwesTemplate, type PackageManager, adapterFromTemplate } from "./recipes"

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

export async function runCreate(options: CreateOptions): Promise<CreateResult> {
  const cwd = options.cwd ?? process.cwd()
  const write = options.write ?? ((message: string) => console.log(message))
  const runner = options.runner ?? defaultCommandRunner
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
