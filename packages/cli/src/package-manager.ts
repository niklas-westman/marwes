import { access } from "node:fs/promises"
import { join } from "node:path"
import type { PackageManager } from "./recipes"

export type ShellCommand = {
  command: string
  args: string[]
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  if (await exists(join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm"
  }

  if ((await exists(join(cwd, "bun.lockb"))) || (await exists(join(cwd, "bun.lock")))) {
    return "bun"
  }

  if (await exists(join(cwd, "yarn.lock"))) {
    return "yarn"
  }

  if (await exists(join(cwd, "package-lock.json"))) {
    return "npm"
  }

  return "pnpm"
}

export function installCommand(
  packageManager: PackageManager,
  packages: readonly string[],
): ShellCommand {
  if (packageManager === "npm") {
    return { command: "npm", args: ["install", ...packages] }
  }

  return { command: packageManager, args: ["add", ...packages] }
}

export function runScriptCommand(packageManager: PackageManager, scriptName: string): ShellCommand {
  if (packageManager === "npm" || packageManager === "pnpm" || packageManager === "bun") {
    return { command: packageManager, args: ["run", scriptName] }
  }

  return { command: "yarn", args: [scriptName] }
}

export function createViteCommand(
  packageManager: PackageManager,
  projectName: string,
  viteTemplate: string,
): ShellCommand {
  if (packageManager === "pnpm") {
    return {
      command: "pnpm",
      args: ["create", "vite@latest", projectName, "--", "--template", viteTemplate],
    }
  }

  if (packageManager === "npm") {
    return {
      command: "npm",
      args: ["create", "vite@latest", projectName, "--", "--template", viteTemplate],
    }
  }

  if (packageManager === "bun") {
    return {
      command: "bun",
      args: ["create", "vite", projectName, "--template", viteTemplate],
    }
  }

  return {
    command: "yarn",
    args: ["create", "vite", projectName, "--template", viteTemplate],
  }
}

export function formatShellCommand(command: ShellCommand): string {
  return [command.command, ...command.args].join(" ")
}
