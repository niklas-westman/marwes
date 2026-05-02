import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/stories/**/__tests__/*.test.ts"],
  },
})
