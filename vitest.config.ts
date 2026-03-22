import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    projects: [
      "packages/core/vitest.config.ts",
      "packages/presets/vitest.config.ts",
      "packages/react/vitest.config.ts",
      "packages/vue/vitest.config.ts",
    ],
  },
})
