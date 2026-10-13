import { defineConfig } from "vitest/config"
import adapterConfig from "./vitest.config"

export default defineConfig({
  ...adapterConfig,
  resolve: { ...adapterConfig.resolve, conditions: ["node"] },
  test: {
    ...adapterConfig.test,
    environment: "node",
    setupFiles: [],
    globalSetup: [],
    exclude: ["**/node_modules/**"],
    include: ["src/tests/server-smoke.test.ts"],
  },
})
