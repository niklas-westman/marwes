import type { DocsSection } from "./component-docs-model"

interface ThemingPageModel {
  schemaVersion: 1
  title: string
  summary: string
  heading: string
  description: string
  code: { language: string; content: string }
  calloutTitle: string
  calloutBody: string
  sections: DocsSection[]
}

export type { ThemingPageModel }
