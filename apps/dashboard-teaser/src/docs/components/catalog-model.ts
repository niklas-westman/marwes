import type { DocsSection } from "./component-docs-model"

interface CatalogEntry {
  family: string
  displayName: string
  summary: string
  recommended: string
  alsoAvailable: string[]
  searchTerms: string
}

interface CatalogPageModel {
  schemaVersion: 1
  title: string
  summary: string
  entries: CatalogEntry[]
  sections: DocsSection[]
}

export type { CatalogEntry, CatalogPageModel }
