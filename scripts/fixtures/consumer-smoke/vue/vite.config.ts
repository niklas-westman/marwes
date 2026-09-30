import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [vue()],
  ssr: {
    noExternal: true,
  },
  test: {
    environment: "node",
    server: {
      deps: {
        inline: true,
      },
    },
  },
})
