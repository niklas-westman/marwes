import { spawn } from "node:child_process"
import type { ShellCommand } from "./package-manager"

export type CommandRunner = (
  command: ShellCommand,
  options: {
    cwd: string
  },
) => Promise<number>

export const defaultCommandRunner: CommandRunner = (command, options) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command.command, command.args, {
      cwd: options.cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    })

    child.on("error", reject)
    child.on("exit", (code) => resolve(code ?? 1))
  })
}
