import type { DocsSection } from "./component-docs-model"

interface AccessibilityPageModel {
  schemaVersion: 1
  title: string
  summary: string
  heading: string
  description: string
  requirements: string[]
  sections: DocsSection[]
}

export type { AccessibilityPageModel }
