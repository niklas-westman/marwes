import { dashboardDocsGuides, getDashboardDocsPaths } from "./dashboard-doc-routes.mjs"

export const siteOrigin = "https://marwes.io"
export const githubRepositoryUrl = "https://github.com/niklas-westman/marwes"
export const githubBranch = "main"

const packageSources = [
  {
    id: "package-react",
    slug: "react",
    framework: "react",
    title: "Marwes React",
    description: "React components, provider setup, theming, and usage examples.",
    sourcePath: "packages/react/README.md",
  },
  {
    id: "package-svelte",
    slug: "svelte",
    framework: "svelte",
    title: "Marwes Svelte",
    description: "Svelte components, provider setup, theming, and usage examples.",
    sourcePath: "packages/svelte/README.md",
  },
  {
    id: "package-vue",
    slug: "vue",
    framework: "vue",
    title: "Marwes Vue",
    description: "Vue components, provider setup, theming, and usage examples.",
    sourcePath: "packages/vue/README.md",
  },
]

const artifactSources = [
  {
    id: "artifact-public-api",
    slug: "public-api",
    title: "Public consumer API",
    description:
      "The canonical React, Vue, and Svelte root exports available to consumer applications.",
    sourcePath: "artifacts/public-api.json",
    scope: "public-consumer-api",
  },
  {
    id: "artifact-component-manifest",
    slug: "component-manifest",
    title: "Canonical component manifest",
    description: "The canonical semantic component subset and its framework source paths.",
    sourcePath: "artifacts/component-manifest.json",
    scope: "canonical-semantic-subset",
  },
  {
    id: "artifact-component-registry",
    slug: "component-registry",
    title: "Component family registry",
    description: "The complete registry of shipped component families and their coverage.",
    sourcePath: "artifacts/component-registry.json",
    scope: "complete-component-registry",
  },
  {
    id: "artifact-design-provenance",
    slug: "design-provenance",
    title: "Design provenance",
    description: "Figma and source provenance for the canonical semantic component subset.",
    sourcePath: "artifacts/design-provenance.json",
    scope: "canonical-semantic-subset",
  },
  {
    id: "artifact-framework-parity",
    slug: "framework-parity",
    title: "Framework parity",
    description: "React, Vue, and Svelte parity for the canonical semantic component subset.",
    sourcePath: "artifacts/framework-parity.json",
    scope: "canonical-semantic-subset",
  },
  {
    id: "artifact-purpose-registry",
    slug: "purpose-registry",
    title: "Purpose registry",
    description: "Machine-readable purpose component semantics and framework support.",
    sourcePath: "artifacts/purpose-registry.json",
    scope: "canonical-semantic-subset",
  },
]

function sourceUrl(sourcePath) {
  return `${githubRepositoryUrl}/blob/${githubBranch}/${sourcePath}`
}

function publicUrl(publicPath) {
  return new URL(publicPath, siteOrigin).href
}

export const aiPublicationResources = [
  ...packageSources.map((resource) => {
    const publicPath = `/ai/${resource.slug}.md`

    return {
      id: resource.id,
      kind: "package-readme",
      title: resource.title,
      description: resource.description,
      scope: "framework-guide",
      framework: resource.framework,
      sourcePath: resource.sourcePath,
      sourceUrl: sourceUrl(resource.sourcePath),
      outputPath: publicPath.slice(1),
      path: publicPath,
      url: publicUrl(publicPath),
      mediaType: "text/plain",
    }
  }),
  ...artifactSources.map((resource) => {
    const publicPath = `/ai/v1/${resource.slug}.json`

    return {
      id: resource.id,
      kind: "artifact",
      title: resource.title,
      description: resource.description,
      scope: resource.scope,
      schemaVersion: 1,
      sourcePath: resource.sourcePath,
      sourceUrl: sourceUrl(resource.sourcePath),
      outputPath: publicPath.slice(1),
      path: publicPath,
      url: publicUrl(publicPath),
      mediaType: "application/json",
    }
  }),
]

export const aiPublicationStorybooks = ["react", "vue", "svelte"].map((framework) => ({
  framework,
  url: `https://storybook-${framework}.marwes.io/latest/`,
  catalogUrl: `https://storybook-${framework}.marwes.io/latest/index.json`,
  mediaType: "application/json",
  scope: "component-catalog",
}))

export const aiPublicationDocumentation = dashboardDocsGuides.map(([path, title, description]) => ({
  path,
  title,
  description,
  url: publicUrl(path),
}))

export function getAiPublicationRoutes(families) {
  return [
    "/",
    "/llms.txt",
    "/ai/index.json",
    ...aiPublicationResources.map((resource) => resource.path),
    ...getDashboardDocsPaths(families),
  ]
}
