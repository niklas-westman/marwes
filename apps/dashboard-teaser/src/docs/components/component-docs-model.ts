type DocsFramework = "react" | "vue" | "svelte"

type PublicApiExportKind = "component" | "type" | "enum" | "helper"

interface PublicApiExport {
  name: string
  kind: PublicApiExportKind
}

type DocsSectionId =
  | "what-this-family-solves"
  | "recommended-components"
  | "public-imports"
  | "examples"
  | "accessibility"
  | "theming"
  | "resources"

interface FrameworkDocsEntry {
  framework: DocsFramework
  packageName: string
  exports: PublicApiExport[]
  example: string
}

interface RecommendedComponent {
  name: string
  description: string
}

interface DocumentationRequirement {
  title: string
  description: string
}

interface DocsSection {
  id: DocsSectionId
  label: string
}

interface DocsResource {
  title: string
  description: string
  href: string
  kind: "storybook" | "npm" | "source" | "issue"
}

interface ComponentDocsPageModel {
  schemaVersion: 1
  family: string
  title: string
  summary: string
  useWhen: string[]
  avoidWhen: string[]
  recommendationDescription: string
  recommendedComponents: RecommendedComponent[]
  frameworks: FrameworkDocsEntry[]
  accessibility: DocumentationRequirement[]
  theming: string
  sections: DocsSection[]
  resources: DocsResource[]
}

export type {
  ComponentDocsPageModel,
  DocsFramework,
  DocsResource,
  DocsSection,
  DocsSectionId,
  FrameworkDocsEntry,
  PublicApiExport,
  PublicApiExportKind,
  RecommendedComponent,
}
