import type { BreadcrumbItem, BreadcrumbOptions } from "@marwes-ui/core"

export interface BreadcrumbProps extends BreadcrumbOptions {
  items: readonly BreadcrumbItem[]
  onitemselect?: (value: string, item: BreadcrumbItem) => void
  onhomeclick?: () => void
  class?: string
}

export type { BreadcrumbItem }
