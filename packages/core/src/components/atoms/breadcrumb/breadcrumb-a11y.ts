import type {
  BreadcrumbA11yProps,
  BreadcrumbHomeA11yProps,
  BreadcrumbItem,
  BreadcrumbItemA11yProps,
  BreadcrumbListA11yProps,
  BreadcrumbOptions,
  BreadcrumbSeparatorA11yProps,
} from "./breadcrumb-types"

export function resolveBreadcrumbA11y(options: BreadcrumbOptions = {}): BreadcrumbA11yProps {
  return {
    ariaLabel: options.ariaLabel ?? "Breadcrumb",
  }
}

export function resolveBreadcrumbListA11y(): BreadcrumbListA11yProps {
  return {
    role: "list",
  }
}

export function resolveBreadcrumbSeparatorA11y(): BreadcrumbSeparatorA11yProps {
  return {
    ariaHidden: true,
  }
}

export function resolveBreadcrumbHomeA11y(homeLabel: string): BreadcrumbHomeA11yProps {
  return {
    ariaLabel: homeLabel,
  }
}

export function resolveBreadcrumbItemA11y(
  item: BreadcrumbItem,
  current: boolean,
): BreadcrumbItemA11yProps {
  return {
    ...(current ? { ariaCurrent: "page" as const } : {}),
    ...(item.ariaLabel ? { ariaLabel: item.ariaLabel } : {}),
  }
}
