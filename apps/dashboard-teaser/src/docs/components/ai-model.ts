import type { DocsSection } from "./component-docs-model"

interface AiPageModel {
  schemaVersion: 1
  title: string
  summary: string
  heading: string
  description: string
  entrypoint: string
  resources: string[]
  footnote: string
  sections: DocsSection[]
}

export type { AiPageModel }
