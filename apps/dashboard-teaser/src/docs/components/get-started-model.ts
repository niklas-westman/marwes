import type { DocsFramework, DocsSection } from "./component-docs-model"

interface GetStartedStep {
  id: string
  title: string
  description: string
  code?: { language: string; content: string }
}

interface GetStartedPageModel {
  schemaVersion: 1
  framework: DocsFramework
  packageName: string
  title: string
  summary: string
  steps: GetStartedStep[]
  sections: DocsSection[]
}

export type { GetStartedPageModel, GetStartedStep }
