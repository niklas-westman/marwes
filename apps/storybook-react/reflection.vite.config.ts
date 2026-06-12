import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const fromRoot = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@marwes-ui/react/ssr",
        replacement: fromRoot("packages/react/src/ssr.tsx"),
      },
      {
        find: "@marwes-ui/react",
        replacement: fromRoot("packages/react/src/index.ts"),
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
