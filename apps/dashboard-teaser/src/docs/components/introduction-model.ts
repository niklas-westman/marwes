import type { DocsSection } from "./component-docs-model"

interface IntroductionTopic {
  id: string
  title: string
  description: string
}

interface IntroductionLink {
  label: string
  href: string
  description: string
}

interface IntroductionPageModel {
  schemaVersion: 1
  title: string
  summary: string
  topics: IntroductionTopic[]
  links: IntroductionLink[]
  sections: DocsSection[]
}

export type { IntroductionLink, IntroductionPageModel, IntroductionTopic }
