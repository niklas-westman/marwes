export interface BreadcrumbItem {
  id?: string
  value?: string
  label: string
  href?: string
  current?: boolean
  ariaLabel?: string
  dataAttributes?: Record<string, string | boolean | undefined>
}

export interface BreadcrumbOptions {
  items?: readonly BreadcrumbItem[]
  ariaLabel?: string
  showHome?: boolean
  homeHref?: string
  homeLabel?: string
  dataAttributes?: Record<string, string | boolean | undefined>
}

export interface BreadcrumbA11yProps {
  ariaLabel: string
}

export interface BreadcrumbListA11yProps {
  role: "list"
}

export interface BreadcrumbSeparatorA11yProps {
  ariaHidden: true
}

export interface BreadcrumbItemA11yProps {
  ariaCurrent?: "page"
  ariaLabel?: string
}

export interface BreadcrumbHomeA11yProps {
  ariaLabel: string
}

export interface BreadcrumbBaseItemRenderKit {
  key: string
  label: string
  value?: string
  href?: string
  current: boolean
  className: string
  actionClassName: string
  vars: Record<string, string>
  dataAttributes: Record<string, string | boolean | undefined>
}

export interface BreadcrumbHomeRenderKit extends BreadcrumbBaseItemRenderKit {
  kind: "home"
  a11y: BreadcrumbHomeA11yProps
}

export interface BreadcrumbItemRenderKit extends BreadcrumbBaseItemRenderKit {
  kind: "item"
  item: BreadcrumbItem
  a11y: BreadcrumbItemA11yProps
}

export type BreadcrumbEntryRenderKit = BreadcrumbHomeRenderKit | BreadcrumbItemRenderKit

export interface BreadcrumbRenderKit {
  tag: "nav"
  className: string
  vars: Record<string, string>
  a11y: BreadcrumbA11yProps
  list: {
    tag: "ol"
    className: string
    vars: Record<string, string>
    a11y: BreadcrumbListA11yProps
  }
  separator: {
    tag: "span"
    className: string
    vars: Record<string, string>
    a11y: BreadcrumbSeparatorA11yProps
  }
  items: BreadcrumbEntryRenderKit[]
  dataAttributes: Record<string, string | boolean | undefined>
}
