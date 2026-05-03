import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/ssr.tsx"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "@marwes-ui/presets/firstEdition/styles.css"],
})
