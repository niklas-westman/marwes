type DocsFramework = "react" | "vue" | "svelte"

type PublicApiExportKind = "component" | "type" | "enum" | "helper"

interface PublicApiExport {
  name: string
  kind: PublicApiExportKind
}

// Component-docs pages use a fixed set of ids; other docs page kinds (e.g.
// get-started guides) define their own section ids, so this stays a plain
// string rather than a literal union scoped to one page kind.
type DocsSectionId = string

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
