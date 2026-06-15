export type Framework = "react" | "vue" | "svelte"
export type PackageManager = "pnpm" | "npm" | "yarn" | "bun"

export const packageManagers: readonly PackageManager[] = ["pnpm", "npm", "yarn", "bun"]

const frameworkLabels: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
}

export function createPackageRunnerCommand(packageManager: PackageManager): string {
  if (packageManager === "pnpm") {
    return "pnpm dlx @marwes-ui/cli"
  }

  if (packageManager === "npm") {
    return "npx @marwes-ui/cli"
  }

  if (packageManager === "yarn") {
    return "yarn dlx @marwes-ui/cli"
  }

  return "bunx @marwes-ui/cli"
}

export function createExistingAppInstallCommand(
  framework: Framework,
  packageManager: PackageManager,
): string {
  return `${createPackageRunnerCommand(packageManager)} init --adapter ${framework}`
}

export function createAgenticInstallCommand(
  framework: Framework,
  packageManager: PackageManager,
): string {
  return `${createExistingAppInstallCommand(framework, packageManager)} --agentic`
}

export function createAgenticInstallPrompt(
  framework: Framework,
  packageManager: PackageManager,
): string {
  return [
    `Install Marwes UI in this ${frameworkLabels[framework]} app.`,
    "Run this in the project root:",
    createAgenticInstallCommand(framework, packageManager),
    "",
    "Follow the CLI output. If automatic patching is skipped, apply the manual provider instructions it prints.",
  ].join("\n")
}
