import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // CSS imports - must come before other @marwes/presets aliases
      {
        find: /^@marwes\/presets\/firstEdition\/styles\.css$/,
        replacement: path.resolve(__dirname, '../../packages/presets/src/firstEdition/styles.css'),
      },
      // TypeScript module imports
      {
        find: /^@marwes\/presets\/firstEdition$/,
        replacement: path.resolve(__dirname, '../../packages/presets/src/firstEdition/index.ts'),
      },
      {
        find: /^@marwes\/presets$/,
        replacement: path.resolve(__dirname, '../../packages/presets/src/index.ts'),
      },
      {
        find: /^@marwes\/core$/,
        replacement: path.resolve(__dirname, '../../packages/core/src/index.ts'),
      },
      {
        find: /^@marwes\/react$/,
        replacement: path.resolve(__dirname, '../../packages/react/src/index.ts'),
      },
    ],
  },
})
