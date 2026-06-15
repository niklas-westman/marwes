export const adapters = ["react", "vue", "svelte"] as const
export type Adapter = (typeof adapters)[number]

export const packageManagers = ["pnpm", "npm", "yarn", "bun"] as const
export type PackageManager = (typeof packageManagers)[number]

export const marwesTemplates = ["react-ts", "vue-ts", "svelte-ts"] as const
export type MarwesTemplate = (typeof marwesTemplates)[number]

export type AdapterRecipe = {
  adapter: Adapter
  displayName: string
  packageName: string
  installPackages: readonly string[]
  providerImport: string
  viteTemplate: MarwesTemplate
  rootFiles: readonly string[]
}

const adapterRecipes: Record<Adapter, AdapterRecipe> = {
  react: {
    adapter: "react",
    displayName: "React",
    packageName: "@marwes-ui/react",
    installPackages: ["@marwes-ui/react", "react", "react-dom"],
    providerImport: "MarwesProvider",
    viteTemplate: "react-ts",
    rootFiles: ["src/main.tsx", "src/main.jsx"],
  },
  vue: {
    adapter: "vue",
    displayName: "Vue",
    packageName: "@marwes-ui/vue",
    installPackages: ["@marwes-ui/vue", "vue"],
    providerImport: "MarwesProvider",
    viteTemplate: "vue-ts",
    rootFiles: ["src/App.vue", "src/main.ts"],
  },
  svelte: {
    adapter: "svelte",
    displayName: "Svelte",
    packageName: "@marwes-ui/svelte",
    installPackages: ["@marwes-ui/svelte"],
    providerImport: "MarwesProvider",
    viteTemplate: "svelte-ts",
    rootFiles: ["src/App.svelte"],
  },
}

export function isAdapter(value: string | undefined): value is Adapter {
  return adapters.includes(value as Adapter)
}

export function isPackageManager(value: string | undefined): value is PackageManager {
  return packageManagers.includes(value as PackageManager)
}

export function isMarwesTemplate(value: string | undefined): value is MarwesTemplate {
  return marwesTemplates.includes(value as MarwesTemplate)
}

export function getAdapterRecipe(adapter: Adapter): AdapterRecipe {
  return adapterRecipes[adapter]
}

export function adapterFromTemplate(template: MarwesTemplate): Adapter {
  if (template === "react-ts") {
    return "react"
  }

  if (template === "vue-ts") {
    return "vue"
  }

  return "svelte"
}

export function templateFromAdapter(adapter: Adapter): MarwesTemplate {
  return getAdapterRecipe(adapter).viteTemplate
}

export function createAiPrompt(adapter: Adapter, packageManager: PackageManager): string {
  const recipe = getAdapterRecipe(adapter)
  const installCommand = `${packageManager} add ${recipe.installPackages.join(" ")}`

  return [
    `Install and wire Marwes UI for a ${recipe.displayName} app using ${packageManager}.`,
    `Run: ${installCommand}.`,
    `Wrap the app root with ${recipe.providerImport} from ${recipe.packageName}.`,
    `Import Marwes components, enums, hooks/helpers, and theme tokens only from ${recipe.packageName}.`,
    "Do not install @marwes-ui/core or @marwes-ui/presets directly.",
    `Do not add a separate Marwes stylesheet import; the ${recipe.displayName} adapter loads the default styles automatically.`,
    "Add a small smoke render, for example a Marwes Button, and verify the app compiles.",
  ].join("\n")
}

export function supportedAdaptersLabel(): string {
  return adapters.join("|")
}

export function supportedPackageManagersLabel(): string {
  return packageManagers.join("|")
}

export function supportedTemplatesLabel(): string {
  return marwesTemplates.join("|")
}
