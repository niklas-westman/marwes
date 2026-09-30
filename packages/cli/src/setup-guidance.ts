import { type Adapter, getAdapterRecipe } from "./recipes"

function providerExample(adapter: Adapter): string {
  const packageName = getAdapterRecipe(adapter).packageName
  const providerImport = `import { MarwesProvider, type ThemeInput } from "${packageName}"`
  const theme = 'const brandTheme = { color: { primary: "#2457FF" } } satisfies ThemeInput'

  if (adapter === "react") {
    return [
      'import { createRoot } from "react-dom/client"',
      providerImport,
      'import App from "./App"',
      "",
      theme,
      "",
      'createRoot(document.getElementById("root")!).render(',
      "  <MarwesProvider theme={brandTheme}>",
      "    <App />",
      "  </MarwesProvider>,",
      ")",
    ].join("\n")
  }

  return [
    adapter === "vue" ? '<script setup lang="ts">' : '<script lang="ts">',
    `  ${providerImport}`,
    `  ${theme}`,
    "</script>",
    "",
    ...(adapter === "vue"
      ? [
          "<template>",
          '  <MarwesProvider :theme="brandTheme">',
          "    <main>Your app</main>",
          "  </MarwesProvider>",
          "</template>",
        ]
      : ["<MarwesProvider theme={brandTheme}>", "  <main>Your app</main>", "</MarwesProvider>"]),
  ].join("\n")
}

export function setupGuidance(adapter: Adapter, fullExample: boolean): string[] {
  const recipe = getAdapterRecipe(adapter)
  const ssrIntegration = { react: "next", vue: "nuxt", svelte: "sveltekit" }[adapter]
  const hookGuidance = {
    react:
      "useTheme() returns resolved concrete values: const theme = useTheme(); read theme.color.primary.base.",
    vue: "useTheme() returns a resolved snapshot directly, not a ref: const theme = useTheme(); read theme.color.primary.base (no .value).",
    svelte:
      "useTheme() returns a .theme getter: const themeState = useTheme(); read themeState.theme.color.primary.base. Keep the getter object; destructuring .theme takes a snapshot.",
  }[adapter]

  return [
    "Marwes setup guidance:",
    `- Import Marwes APIs only from ${recipe.packageName}.`,
    "- Do not install or import @marwes-ui/core or @marwes-ui/presets directly.",
    "- Default preset CSS loads automatically from the adapter; do not add a separate Marwes stylesheet import.",
    "- Wrap the app once with MarwesProvider; pass a small typed ThemeInput override. Unspecified values retain defaults.",
    "- --mw-* CSS variables are scoped to the provider and its descendants, not :root. Keep app styles and runtime consumers below the provider.",
    "- Use mwThemeVars for CSS var(...) references, not concrete JavaScript values. Call useTheme() only in a child component below MarwesProvider.",
    `- ${hookGuidance}`,
    ...(fullExample
      ? [
          `Complete ${recipe.displayName} provider example:`,
          providerExample(adapter),
          `Component example: import { PrimaryButton } from "${recipe.packageName}"; render <PrimaryButton>Save</PrimaryButton> below the provider. Use public components, not invented mw-* replacement classes.`,
          `Token example: import { mwThemeVars } from "${recipe.packageName}"; use mwThemeVars.color.text and mwThemeVars.spacing.sp24 in app-owned styles below the provider.`,
          "For SSR, follow the framework guide for matching style/script helpers and provider options before hydration; changing html classes alone is not no-flash setup.",
        ]
      : []),
    `Setup guide: https://marwes.io/docs/get-started/${adapter}/`,
    "Theming guide: https://marwes.io/docs/theming/",
    `SSR guide: https://marwes.io/docs/integrations/${ssrIntegration}/`,
    ...(fullExample
      ? [
          "AI discovery: https://marwes.io/llms.txt",
          `AI framework guide: https://marwes.io/ai/${adapter}.md`,
          "Public export inventory: https://marwes.io/ai/v1/public-api.json",
        ]
      : []),
  ]
}
