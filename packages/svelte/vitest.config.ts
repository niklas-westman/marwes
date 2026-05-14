import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vitest/config"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ["browser"],
    alias: {
      "@marwes-ui/core": resolve(__dirname, "../core/src/index.ts"),
      "@marwes-ui/presets/firstEdition/styles.css": resolve(
        __dirname,
        "../presets/src/firstEdition/styles.css",
      ),
      "@marwes-ui/presets/firstEdition": resolve(__dirname, "../presets/src/firstEdition/index.ts"),
      "@marwes-ui/presets": resolve(__dirname, "../presets/src/index.ts"),
      "@marwes-ui/svelte": resolve(__dirname, "./src/lib/index.ts"),
    },
  },
  server: {
    fs: {
      allow: [resolve(__dirname, "../..")],
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
  },
})
