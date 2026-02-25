import { defineConfig } from "vitest/config"

const enableAllure = process.env.MARWES_ALLURE === "1"

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    ...(enableAllure
      ? {
          setupFiles: ["allure-vitest/setup"],
          reporters: [
            "default",
            [
              "allure-vitest/reporter",
              {
                resultsDir: "../../.allure/results",
              },
            ],
          ],
        }
      : {}),
  },
})
