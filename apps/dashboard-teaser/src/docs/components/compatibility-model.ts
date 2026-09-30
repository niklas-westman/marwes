import type { DocsFramework, DocsSection } from "./component-docs-model"

interface CompatibilityRequirement {
  framework: DocsFramework
  packageName: string
  peerRequirement: string
  getStartedHref: string
}

interface CompatibilityPageModel {
  schemaVersion: 1
  title: string
  summary: string
  heading: string
  description: string
  requirements: CompatibilityRequirement[]
  runtimeRequirements: string[]
  footnote: string
  sections: DocsSection[]
}

export type { CompatibilityPageModel, CompatibilityRequirement }
