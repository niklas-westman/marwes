import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/ssr.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["vue", "@marwes-ui/presets/firstEdition/styles.css"],
})
