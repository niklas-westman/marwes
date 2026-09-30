import type { DocsSection } from "./component-docs-model"

interface ContributingPageModel {
  schemaVersion: 1
  title: string
  summary: string
  heading: string
  description: string
  secondaryDescription: string
  code: { language: string; content: string }
  externalLink: { href: string; label: string }
  sections: DocsSection[]
}

export type { ContributingPageModel }
