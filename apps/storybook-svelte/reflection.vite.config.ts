import { fileURLToPath } from "node:url"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"

const fromRoot = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url))

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      {
        find: "@marwes-ui/svelte/ssr",
        replacement: fromRoot("packages/svelte/src/lib/ssr.ts"),
      },
      {
        find: "@marwes-ui/svelte",
        replacement: fromRoot("packages/svelte/src/lib/index.ts"),
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
