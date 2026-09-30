import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
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
