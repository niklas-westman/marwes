import { fileURLToPath } from "node:url"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

const fromRoot = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@marwes-ui/vue/ssr",
        replacement: fromRoot("packages/vue/src/ssr.ts"),
      },
      {
        find: "@marwes-ui/vue",
        replacement: fromRoot("packages/vue/src/index.ts"),
      },
      {
        find: "@marwes-ui/core",
        replacement: fromRoot("packages/core/src/index.ts"),
      },
      {
        find: "@marwes-ui/presets/firstEdition/styles.css",
        replacement: fromRoot("packages/presets/src/firstEdition/styles.css"),
      },
      {
        find: "@marwes-ui/presets/firstEdition",
        replacement: fromRoot("packages/presets/src/firstEdition/index.ts"),
      },
      {
        find: "@marwes-ui/presets",
        replacement: fromRoot("packages/presets/src/index.ts"),
      },
    ],
  },
})
