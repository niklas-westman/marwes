import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "apps/storybook-react/src/stories/accordion/__tests__/*.test.ts",
      "apps/storybook-react/src/stories/input/__tests__/*.test.ts",
      "apps/storybook-react/src/stories/button/__tests__/*.test.ts",
      "apps/storybook-react/src/stories/checkbox/__tests__/*.test.ts",
      "apps/storybook-vue/src/stories/accordion/__tests__/*.test.ts",
      "apps/storybook-vue/src/stories/input/__tests__/*.test.ts",
      "apps/storybook-vue/src/stories/button/__tests__/*.test.ts",
      "apps/storybook-vue/src/stories/checkbox/__tests__/*.test.ts",
      "apps/storybook-vue/src/stories/radio/__tests__/*.test.ts",
      "apps/storybook-svelte/src/stories/accordion/__tests__/*.test.ts",
      "apps/storybook-svelte/src/stories/input/__tests__/*.test.ts",
      "apps/storybook-svelte/src/stories/button/__tests__/*.test.ts",
      "apps/storybook-svelte/src/stories/checkbox/__tests__/*.test.ts",
      "apps/storybook-svelte/src/stories/radio/__tests__/*.test.ts",
    ],
  },
})
