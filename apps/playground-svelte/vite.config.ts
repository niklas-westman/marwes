import path from "node:path"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      {
        find: /^@marwes-ui\/presets\/firstEdition\/styles\.css$/,
        replacement: path.resolve(__dirname, "../../packages/presets/src/firstEdition/styles.css"),
      },
      {
        find: /^@marwes-ui\/presets\/firstEdition$/,
        replacement: path.resolve(__dirname, "../../packages/presets/src/firstEdition/index.ts"),
      },
      {
        find: /^@marwes-ui\/presets$/,
        replacement: path.resolve(__dirname, "../../packages/presets/src/index.ts"),
      },
      {
        find: /^@marwes-ui\/core$/,
        replacement: path.resolve(__dirname, "../../packages/core/src/index.ts"),
      },
      {
        find: /^@marwes-ui\/svelte$/,
        replacement: path.resolve(__dirname, "../../packages/svelte/src/lib/index.ts"),
      },
      {
        find: /^@marwes-ui\/svelte\/ssr$/,
        replacement: path.resolve(__dirname, "../../packages/svelte/src/lib/ssr.ts"),
      },
    ],
  },
})
