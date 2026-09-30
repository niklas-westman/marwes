const dashboardDocsGuides = [
  [
    "/docs/introduction/",
    "Introduction",
    "What Marwes is, how it's organized, and where to go next.",
  ],
  [
    "/docs/get-started/react/",
    "Get started with React",
    "Install Marwes for React and render your first accessible component.",
  ],
  [
    "/docs/get-started/vue/",
    "Get started with Vue",
    "Install Marwes for Vue and render your first accessible component.",
  ],
  [
    "/docs/get-started/svelte/",
    "Get started with Svelte",
    "Install Marwes for Svelte and render your first accessible component.",
  ],
  [
    "/docs/components/",
    "Component catalog",
    "Find the right public Marwes component by family, framework, export, or use case.",
  ],
  ["/docs/theming/", "Theming", "Wrap once, provide a theme, and brand every Marwes component."],
  [
    "/docs/accessibility/",
    "Accessibility",
    "Understand the accessibility contract shared by Marwes components.",
  ],
  [
    "/docs/integrations/next/",
    "Next.js integration",
    "Use Marwes with Next.js while preserving SSR-safe theme behavior.",
  ],
  [
    "/docs/integrations/nuxt/",
    "Nuxt integration",
    "Use Marwes with Nuxt and install the provider at the application boundary.",
  ],
  [
    "/docs/integrations/sveltekit/",
    "SvelteKit integration",
    "Use Marwes with SvelteKit without causing a light or dark mode flash.",
  ],
  [
    "/docs/compatibility/",
    "Compatibility",
    "Supported frameworks, runtimes, browsers, and package boundaries.",
  ],
  [
    "/docs/troubleshooting/",
    "Troubleshooting",
    "Diagnose missing styles, provider wiring, imports, SSR, fonts, and partial CLI setup.",
  ],
  [
    "/docs/ai/",
    "AI and agent usage",
    "Give coding agents canonical, machine-readable Marwes documentation.",
  ],
  [
    "/docs/contributing/",
    "Contributing",
    "Contribute to Marwes without confusing internal atoms with its public consumer API.",
  ],
]

function getDashboardDocsPaths(families) {
  return [
    ...dashboardDocsGuides.map(([path]) => path),
    ...families.map((family) => `/docs/components/${family}/`),
  ]
}

export { dashboardDocsGuides, getDashboardDocsPaths }
