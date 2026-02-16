import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // CSS imports - must come before other @marwes-ui/presets aliases
      {
        find: /^@marwes-ui\/presets\/firstEdition\/styles\.css$/,
        replacement: path.resolve(__dirname, "../../packages/presets/src/firstEdition/styles.css"),
      },
      // TypeScript module imports
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
        find: /^@marwes-ui\/react$/,
        replacement: path.resolve(__dirname, "../../packages/react/src/index.ts"),
      },
    ],
  },
})
