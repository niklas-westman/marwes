import { createFamilySemanticAttributes } from "../../../semantics"
import {
  resolveBreadcrumbA11y,
  resolveBreadcrumbHomeA11y,
  resolveBreadcrumbItemA11y,
  resolveBreadcrumbListA11y,
  resolveBreadcrumbSeparatorA11y,
} from "./breadcrumb-a11y"
import type {
  BreadcrumbItem,
  BreadcrumbItemRenderKit,
  BreadcrumbOptions,
  BreadcrumbRenderKit,
} from "./breadcrumb-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function createItemKey(item: BreadcrumbItem, index: number): string {
  return item.id ?? item.value ?? `${index}-${item.href ?? item.label}`
}

function resolveCurrentIndex(items: readonly BreadcrumbItem[]): number {
  const explicitIndex = items.findIndex((item) => item.current === true)
  if (explicitIndex >= 0) return explicitIndex
  return items.length - 1
}

function createBreadcrumbItemRenderKit(
  item: BreadcrumbItem,
  index: number,
  currentIndex: number,
): BreadcrumbItemRenderKit {
  const current = index === currentIndex
  const value = item.value ?? item.id ?? item.href ?? item.label

  return {
    key: `item-${createItemKey(item, index)}`,
    kind: "item",
    item,
    label: item.label,
    value,
    ...(item.href ? { href: item.href } : {}),
    current,
    className: cx("mw-breadcrumb__item", current && "mw-breadcrumb__item--current"),
    actionClassName: cx("mw-breadcrumb__action", current && "mw-breadcrumb__current"),
    vars: {},
    a11y: resolveBreadcrumbItemA11y(item, current),
    dataAttributes: {
      "data-component": "breadcrumb",
      "data-part": "item",
      "data-current": current ? "true" : undefined,
      "data-value": value,
      ...item.dataAttributes,
    },
  }
}

export function createBreadcrumbRecipe(options: BreadcrumbOptions = {}): BreadcrumbRenderKit {
  const showHome = options.showHome ?? true
  const homeLabel = options.homeLabel ?? "Home"
  const items = options.items ?? []
  const currentIndex = resolveCurrentIndex(items)
  const rootDataAttributes = {
    ...createFamilySemanticAttributes("breadcrumb"),
    ...options.dataAttributes,
  }

  return {
    tag: "nav",
    className: "mw-breadcrumb",
    vars: {},
    a11y: resolveBreadcrumbA11y(options),
    dataAttributes: rootDataAttributes,
    list: {
      tag: "ol",
      className: "mw-breadcrumb__list",
      vars: {},
      a11y: resolveBreadcrumbListA11y(),
    },
    separator: {
      tag: "span",
      className: "mw-breadcrumb__separator",
      vars: {},
      a11y: resolveBreadcrumbSeparatorA11y(),
    },
    items: [
      ...(showHome
        ? [
            {
              key: "home",
              kind: "home" as const,
              label: homeLabel,
              value: "home",
              ...(options.homeHref ? { href: options.homeHref } : {}),
              current: items.length === 0,
              className: cx(
                "mw-breadcrumb__item",
                "mw-breadcrumb__item--home",
                items.length === 0 && "mw-breadcrumb__item--current",
              ),
              actionClassName: cx(
                "mw-breadcrumb__action",
                "mw-breadcrumb__home",
                items.length === 0 && "mw-breadcrumb__current",
              ),
              vars: {},
              a11y: resolveBreadcrumbHomeA11y(homeLabel),
              dataAttributes: {
                "data-component": "breadcrumb",
                "data-part": "home",
                "data-current": items.length === 0 ? "true" : undefined,
                "data-value": "home",
              },
            },
          ]
        : []),
      ...items.map((item, index) => createBreadcrumbItemRenderKit(item, index, currentIndex)),
    ],
  }
}
