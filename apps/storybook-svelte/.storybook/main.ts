import path from "node:path"
import { fileURLToPath } from "node:url"
import type { StorybookConfig } from "@storybook/svelte-vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/svelte-vite",

  async viteFinal(cfg) {
    cfg.resolve ??= {}
    const existing = Array.isArray(cfg.resolve.alias) ? cfg.resolve.alias : []

    cfg.resolve.alias = [
      {
        find: /^@marwes-ui\/presets\/firstEdition\/styles\.css$/,
        replacement: path.resolve(
          __dirname,
          "../../../packages/presets/src/firstEdition/styles.css",
        ),
      },
      {
        find: /^@marwes-ui\/presets\/firstEdition$/,
        replacement: path.resolve(__dirname, "../../../packages/presets/src/firstEdition/index.ts"),
      },
      {
        find: /^@marwes-ui\/presets$/,
        replacement: path.resolve(__dirname, "../../../packages/presets/src/index.ts"),
      },
      {
        find: /^@marwes-ui\/core$/,
        replacement: path.resolve(__dirname, "../../../packages/core/src/index.ts"),
      },
      {
        find: /^@marwes-ui\/svelte$/,
        replacement: path.resolve(__dirname, "../../../packages/svelte/src/lib/index.ts"),
      },
      ...existing,
    ]

    // Ensure Vite processes .svelte files from node_modules through the Svelte plugin
    cfg.optimizeDeps ??= {}
    cfg.optimizeDeps.exclude = [...(cfg.optimizeDeps.exclude ?? []), "@storybook/svelte"]

    // Allow serving files from the pnpm store
    cfg.server ??= {}
    cfg.server.fs ??= {}
    cfg.server.fs.allow = [
      ...(cfg.server.fs.allow ?? []),
      path.resolve(__dirname, "../../.."),
      path.resolve(__dirname, "../../../node_modules"),
    ]

    return cfg
  },
}

export default config
