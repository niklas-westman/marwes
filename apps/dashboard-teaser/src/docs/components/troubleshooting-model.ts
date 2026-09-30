import type { DocsSection } from "./component-docs-model"

interface TroubleshootingIssue {
  title: string
  description: string
}

interface TroubleshootingPageModel {
  schemaVersion: 1
  title: string
  summary: string
  heading: string
  issues: TroubleshootingIssue[]
  code: { language: string; content: string }
  sections: DocsSection[]
}

export type { TroubleshootingIssue, TroubleshootingPageModel }
