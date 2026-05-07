import path from "node:path"
import { fileURLToPath } from "node:url"
import type { StorybookConfig } from "@storybook/svelte-vite"

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
  framework: {
    name: "@storybook/svelte-vite",
    options: {
      // Disable Storybook's svelte-docgen plugin — it's incompatible with Vite 7.
      // The docgen plugin runs before vite-plugin-svelte:compile in the transform
      // pipeline and tries to this.parse() raw Svelte syntax as JavaScript.
      docgen: false,
    },
  },

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

    // Allow serving files from the monorepo root and pnpm store
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
