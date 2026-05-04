export const compassConfig = {
  entrypointPath: "docs/start-here.md",
  repoMapPath: "docs/reference/repo-map.md",
  docsIndexPath: "docs/README.md",
  specPath: "docs/reference/spec.md",
  auditStatusPath: "docs/audits/status.md",
  auditReadmePath: "docs/audits/README.md",
  packageJsonPath: "package.json",
  skippedDirectories: new Set([
    "node_modules",
    ".git",
    "dist",
    "storybook-static",
    ".turbo",
    ".next",
    "mai6-debreif",
    "mai6-debrief",
  ]),
  routeModel: [
    {
      intent: "Contribute to Marwes",
      docs: "docs/start-here.md → docs/want-to-contribute.md → docs/reference/repo-map.md",
      command: "pnpm check:changed",
    },
    {
      intent: "Build an app",
      docs: "docs/start-here.md → docs/guides/vite.md or docs/guides/next.md → docs/blocks/README.md",
      command: "pnpm check:repo-map",
    },
    {
      intent: "Change a component",
      docs: "docs/start-here.md → docs/reference/repo-map.md → docs/reference/family-validation.md",
      command: "pnpm validate:family <family>",
    },
    {
      intent: "Update docs/registry/generated truth",
      docs: "docs/start-here.md → docs/reference/repo-map.md → docs/registry/README.md",
      command: "pnpm check:repo-map",
    },
    {
      intent: "Check a branch quickly",
      docs: "docs/start-here.md → docs/reference/testing.md",
      command: "pnpm check:changed",
    },
    {
      intent: "Prepare release confidence",
      docs: "docs/start-here.md → docs/reference/governance.md → docs/reference/testing.md",
      command: "pnpm validate:release",
    },
  ],
  repoMap: {
    requiredPaths: [
      "docs/start-here.md",
      "docs/want-to-contribute.md",
      "docs/reference/repo-map.md",
      "docs/reference/testing.md",
      "docs/reference/architecture.md",
      "docs/reference/accessibility.md",
      "docs/audits/status.md",
      "docs/registry/README.md",
      "docs/blocks/README.md",
      "artifacts/component-registry.json",
    ],
    requiredCommands: [
      "compass",
      "check:compass",
      "check:changed",
      "check:adapter-boundaries",
      "check:repo-map",
      "validate:family",
      "validate:packages",
      "validate:release",
      "registry:check",
      "parity:summary:check",
    ],
    requiredPhrases: [
      "Code and generated artifacts",
      "Reference docs",
      "Registry family docs",
      "Audit docs",
      "Guides and blocks",
      "Planning docs",
      "Blocks are not package APIs",
      "Planning docs lifecycle",
    ],
  },
  docsApi: {
    sharedForbiddenPatterns: [
      {
        pattern: /import\s*\{\s*firstEdition\s*\}\s*from\s*"@marwes-ui\/presets"/,
        description: "stale import `firstEdition` from `@marwes-ui/presets`",
      },
      {
        pattern: /<MarwesProvider[^>]*\spreset=/,
        description: "stale provider prop `preset={...}`",
      },
      {
        pattern: /\bpreset=\{firstEdition\}/,
        description: "stale example `preset={firstEdition}`",
      },
    ],
    documentationFiles: [
      {
        path: "README.md",
        requiredPatterns: [
          {
            pattern: /<MarwesProvider>/,
            description: "show default `<MarwesProvider>` setup",
          },
        ],
        forbiddenPatterns: [
          {
            pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
            description: "manual first edition CSS import in default adapter setup",
          },
        ],
      },
      {
        path: "packages/presets/README.md",
        requiredPatterns: [
          {
            pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
            description: "import `@marwes-ui/presets/firstEdition/styles.css`",
          },
          {
            pattern: /<MarwesProvider>/,
            description: "show default `<MarwesProvider>` setup",
          },
        ],
      },
      {
        path: "packages/react/README.md",
        requiredPatterns: [
          {
            pattern: /<MarwesProvider>/,
            description: "show default `<MarwesProvider>` setup",
          },
        ],
        forbiddenPatterns: [
          {
            pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
            description: "manual first edition CSS import in default React setup",
          },
        ],
      },
      {
        path: "apps/playground-react/README.md",
        requiredPatterns: [
          {
            pattern: /<MarwesProvider>/,
            description: "show default `<MarwesProvider>` setup",
          },
        ],
        forbiddenPatterns: [
          {
            pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
            description: "manual first edition CSS import in default playground setup",
          },
        ],
      },
      {
        path: "apps/storybook-react/README.md",
        requiredPatterns: [
          {
            pattern: /<MarwesProvider>/,
            description: "show default `<MarwesProvider>` setup",
          },
        ],
        forbiddenPatterns: [
          {
            pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
            description: "manual first edition CSS import in default Storybook setup",
          },
        ],
      },
      {
        path: "packages/vue/README.md",
        requiredPatterns: [
          {
            pattern: /<MarwesProvider>/,
            description: "show default `<MarwesProvider>` setup",
          },
        ],
        forbiddenPatterns: [
          {
            pattern: /import\s*"@marwes-ui\/presets\/firstEdition\/styles\.css"/,
            description: "manual first edition CSS import in default Vue setup",
          },
        ],
      },
    ],
  },
}
