import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@marwes-ui/core": resolve(__dirname, "../core/src/index.ts"),
      "@marwes-ui/presets": resolve(__dirname, "../presets/src/index.ts"),
      "@marwes-ui/presets/firstEdition": resolve(__dirname, "../presets/src/firstEdition/index.ts"),
      "@marwes-ui/presets/firstEdition/styles.css": resolve(
        __dirname,
        "../presets/src/firstEdition/styles.css",
      ),
      "@marwes-ui/react": resolve(__dirname, "./src/index.ts"),
    },
  },
  server: {
    fs: {
      allow: [resolve(__dirname, "../..")],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/__tests__/*.test.ts", "src/**/__tests__/*.test.tsx"],
    restoreMocks: true,
  },
})
