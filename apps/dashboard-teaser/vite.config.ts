import { readFileSync } from "node:fs"
import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { renderDashboardSeoHead, resolveDashboardSeo } from "./src/seo/dashboard-seo"

const dashboardBasePath = process.env.VITE_BASE_PATH ?? "/"
const dashboardSeo = resolveDashboardSeo({
  basePath: dashboardBasePath,
  siteOrigin: process.env.VITE_PUBLIC_SITE_ORIGIN,
})

type DocsRouteManifest = {
  routes: Array<{ path: string }>
}

const docsRouteManifest = JSON.parse(
  readFileSync(path.resolve(__dirname, "src/docs/generated/docs-routes.json"), "utf8"),
) as DocsRouteManifest

const mpaInputs = Object.fromEntries([
  ["index", path.resolve(__dirname, "index.html")],
  ...docsRouteManifest.routes.map((route) => {
    const relativePath = route.path.replace(/^\//, "")
    const name = relativePath.replace(/\/$/, "").replaceAll("/", "-")
    return [name, path.resolve(__dirname, relativePath, "index.html")]
  }),
])

export default defineConfig({
  base: dashboardBasePath,
  plugins: [
    {
      name: "dashboard-teaser-seo",
      transformIndexHtml(html) {
        return html.replace("<!--dashboard-seo-head-->", renderDashboardSeoHead(dashboardSeo))
      },
    },
    react(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "styled-components"],
    alias: [
      // CSS imports - must come before other @marwes-ui/presets aliases
      {
        find: /^@marwes-ui\/presets\/firstEdition\/styles\.css$/,
        replacement: path.resolve(__dirname, "../../packages/presets/src/firstEdition/styles.css"),
      },
      // TypeScript module imports
      {
        find: /^@marwes-ui\/presets\/firstEdition$/,
        replacement: path.resolve(__dirname, "../../packages/presets/src/firstEdition/index.ts"),
      },
      {
        find: /^@marwes-ui\/presets$/,
        replacement: path.resolve(__dirname, "../../packages/presets/src/index.ts"),
      },
      {
        find: /^@marwes-ui\/core$/,
        replacement: path.resolve(__dirname, "../../packages/core/src/index.ts"),
      },
      {
        find: /^@marwes-ui\/react$/,
        replacement: path.resolve(__dirname, "../../packages/react/src/index.ts"),
      },
    ],
  },
  build: {
    rollupOptions: {
      input: mpaInputs,
    },
  },
})
