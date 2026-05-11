// Monorepo Metro config for Expo
// Fixes dual-React issue in pnpm workspaces where workspace packages
// resolve react to the root node_modules (19.2.4) instead of the
// playground's react (19.1.0).
const { getDefaultConfig } = require("expo/metro-config")
const fs = require("node:fs")
const path = require("node:path")

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot)

// Watch the full monorepo so workspace packages are visible
config.watchFolders = [monorepoRoot]

// Let Metro find modules in both the project and monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
]

// Prevent Metro from walking up directory tree to find modules.
// Without this, imports from packages/react-native/src/ resolve
// `react` via the monorepo root (wrong version).
config.resolver.disableHierarchicalLookup = true

// Provide explicit fallback paths for modules not found locally.
// This ensures all react/react-native imports resolve to the
// playground's copies regardless of which workspace package
// originated the import.
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (_target, name) => {
      // First try playground's node_modules, then monorepo root
      const localPath = path.resolve(projectRoot, "node_modules", String(name))
      const rootPath = path.resolve(monorepoRoot, "node_modules", String(name))
      try {
        fs.statSync(localPath)
        return localPath
      } catch {
        return rootPath
      }
    },
  },
)

module.exports = config
