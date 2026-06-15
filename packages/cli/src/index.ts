import { parseArgs } from "node:util"
import { type CreateOptions, runCreate } from "./create"
import { type DoctorOptions, adapterFromString, runDoctor } from "./doctor"
import { type InitOptions, runInit } from "./init"
import {
  type PackageManager,
  createAiPrompt,
  isMarwesTemplate,
  isPackageManager,
  supportedAdaptersLabel,
  supportedPackageManagersLabel,
  supportedTemplatesLabel,
} from "./recipes"

export { runCreate, type CreateOptions, type CreateResult } from "./create"
export { runDoctor, type DoctorItem, type DoctorOptions, type DoctorResult } from "./doctor"
export { runInit, type InitOptions, type InitResult } from "./init"
export {
  adapters,
  createAiPrompt,
  getAdapterRecipe,
  marwesTemplates,
  packageManagers,
  type Adapter,
  type AdapterRecipe,
  type MarwesTemplate,
  type PackageManager,
} from "./recipes"

type CliOptions = {
  cwd?: string
  write?: (message: string) => void
}

function writeHelp(write: (message: string) => void): void {
  write(`Marwes CLI

Commands:
  marwes init --adapter <${supportedAdaptersLabel()}>
  marwes doctor [--adapter <${supportedAdaptersLabel()}]
  marwes ai-prompt --adapter <${supportedAdaptersLabel()}>
  marwes create <name> --template <${supportedTemplatesLabel()}>

Options:
  --pm <${supportedPackageManagersLabel()}>
  --dry-run
  --no-install
  --no-patch
`)
}

function parsePackageManager(value: unknown): PackageManager | undefined {
  return typeof value === "string" && isPackageManager(value) ? value : undefined
}

export async function runMarwesCli(argv: string[], options: CliOptions = {}): Promise<number> {
  const write = options.write ?? ((message: string) => console.log(message))
  const [command, ...args] = argv

  if (!command || command === "help" || command === "--help" || command === "-h") {
    writeHelp(write)
    return 0
  }

  if (command === "init") {
    const parsed = parseArgs({
      args,
      options: {
        adapter: { type: "string" },
        pm: { type: "string" },
        "dry-run": { type: "boolean" },
        yes: { type: "boolean" },
        "no-install": { type: "boolean" },
        "no-patch": { type: "boolean" },
      },
      allowPositionals: true,
    })
    const adapter = adapterFromString(String(parsed.values.adapter ?? ""))

    if (!adapter) {
      write(`Missing or invalid --adapter. Expected one of: ${supportedAdaptersLabel()}`)
      return 1
    }

    const packageManager = parsePackageManager(parsed.values.pm)
    const initOptions: InitOptions = {
      adapter,
      dryRun: parsed.values["dry-run"] === true,
      yes: parsed.values.yes === true,
      noInstall: parsed.values["no-install"] === true,
      noPatch: parsed.values["no-patch"] === true,
      write,
    }

    if (options.cwd) {
      initOptions.cwd = options.cwd
    }

    if (packageManager) {
      initOptions.packageManager = packageManager
    }

    const result = await runInit(initOptions)
    return result.exitCode
  }

  if (command === "doctor") {
    const parsed = parseArgs({
      args,
      options: {
        adapter: { type: "string" },
        pm: { type: "string" },
        "run-build": { type: "boolean" },
      },
      allowPositionals: true,
    })
    const adapter = adapterFromString(String(parsed.values.adapter ?? ""))
    const packageManager = parsePackageManager(parsed.values.pm)
    const doctorOptions: DoctorOptions = {
      runBuild: parsed.values["run-build"] === true,
      write,
    }

    if (adapter) {
      doctorOptions.adapter = adapter
    }

    if (options.cwd) {
      doctorOptions.cwd = options.cwd
    }

    if (packageManager) {
      doctorOptions.packageManager = packageManager
    }

    const result = await runDoctor(doctorOptions)
    return result.exitCode
  }

  if (command === "ai-prompt") {
    const parsed = parseArgs({
      args,
      options: {
        adapter: { type: "string" },
        pm: { type: "string" },
      },
      allowPositionals: true,
    })
    const adapter = adapterFromString(String(parsed.values.adapter ?? ""))

    if (!adapter) {
      write(`Missing or invalid --adapter. Expected one of: ${supportedAdaptersLabel()}`)
      return 1
    }

    write(createAiPrompt(adapter, parsePackageManager(parsed.values.pm) ?? "pnpm"))
    return 0
  }

  if (command === "create") {
    return runCreateMarwesCli(args, options)
  }

  write(`Unknown command: ${command}`)
  writeHelp(write)
  return 1
}

export async function runCreateMarwesCli(
  argv: string[],
  options: CliOptions = {},
): Promise<number> {
  const write = options.write ?? ((message: string) => console.log(message))
  const parsed = parseArgs({
    args: argv,
    options: {
      template: { type: "string" },
      pm: { type: "string" },
      "dry-run": { type: "boolean" },
      "no-install": { type: "boolean" },
    },
    allowPositionals: true,
  })
  const projectName = parsed.positionals[0]
  const template = String(parsed.values.template ?? "react-ts")

  if (!projectName) {
    write("Missing project name.")
    return 1
  }

  if (!isMarwesTemplate(template)) {
    write(`Invalid --template. Expected one of: ${supportedTemplatesLabel()}`)
    return 1
  }

  const packageManager = parsePackageManager(parsed.values.pm)
  const createOptions: CreateOptions = {
    projectName,
    template,
    dryRun: parsed.values["dry-run"] === true,
    noInstall: parsed.values["no-install"] === true,
    write,
  }

  if (options.cwd) {
    createOptions.cwd = options.cwd
  }

  if (packageManager) {
    createOptions.packageManager = packageManager
  }

  const result = await runCreate(createOptions)

  return result.exitCode
}
