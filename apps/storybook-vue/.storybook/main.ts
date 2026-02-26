import path from "node:path"
import { fileURLToPath } from "node:url"
import type { StorybookConfig } from "@storybook/vue3-vite"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/***/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "./addons/renderkit/preset.ts",
  ],
  framework: "@storybook/vue3-vite",

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
        find: /^@marwes-ui\/vue$/,
        replacement: path.resolve(__dirname, "../../../packages/vue/src/index.ts"),
      },
      ...existing,
    ]

    return cfg
  },
}

export default config
