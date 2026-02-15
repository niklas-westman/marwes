import path from "node:path"
import { fileURLToPath } from "node:url"
import type { StorybookConfig } from "@storybook/react-vite"

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
  ],
  framework: "@storybook/react-vite",

  async viteFinal(cfg) {
    cfg.resolve ??= {}
    const existing = Array.isArray(cfg.resolve.alias) ? cfg.resolve.alias : []

    cfg.resolve.alias = [
      // CSS imports - must come before other @marwes/presets aliases
      {
        find: /^@marwes\/presets\/firstEdition\/styles\.css$/,
        replacement: path.resolve(
          __dirname,
          "../../../packages/presets/src/firstEdition/styles.css",
        ),
      },

      // TypeScript module imports
      {
        find: /^@marwes\/presets\/firstEdition$/,
        replacement: path.resolve(__dirname, "../../../packages/presets/src/firstEdition/index.ts"),
      },
      {
        find: /^@marwes\/presets$/,
        replacement: path.resolve(__dirname, "../../../packages/presets/src/index.ts"),
      },
      {
        find: /^@marwes\/core$/,
        replacement: path.resolve(__dirname, "../../../packages/core/src/index.ts"),
      },
      {
        find: /^@marwes\/react$/,
        replacement: path.resolve(__dirname, "../../../packages/react/src/index.ts"),
      },

      ...existing,
    ]

    return cfg
  },
}

export default config
