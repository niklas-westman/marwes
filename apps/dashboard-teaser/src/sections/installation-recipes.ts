export type Framework = "react" | "vue" | "svelte"

const frameworkLabels: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
}

const packageRunnerCommand = "npx @marwes-ui/cli"

export function createExistingAppInstallCommand(framework: Framework): string {
  return `${packageRunnerCommand} init --adapter ${framework}`
}

export function createAgenticInstallCommand(framework: Framework): string {
  return `${createExistingAppInstallCommand(framework)} --agentic`
}

export function createAgenticInstallPrompt(framework: Framework): string {
  return [
    `Install Marwes UI in this ${frameworkLabels[framework]} app.`,
    "Run this in the project root:",
    createAgenticInstallCommand(framework),
    "",
    "Follow the CLI output. If automatic patching is skipped, apply the manual provider instructions it prints.",
  ].join("\n")
}
