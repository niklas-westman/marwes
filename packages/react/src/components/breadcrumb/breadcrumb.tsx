import { IconName, createBreadcrumbRecipe } from "@marwes-ui/core"
import type { BreadcrumbItem, BreadcrumbOptions } from "@marwes-ui/core"
import type * as React from "react"
import { Icon } from "../icon"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export interface BreadcrumbProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children">,
    BreadcrumbOptions {
  items: readonly BreadcrumbItem[]
  onItemSelect?: (
    value: string,
    item: BreadcrumbItem,
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void
  onHomeClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}

export function Breadcrumb(props: BreadcrumbProps): React.ReactElement {
  const {
    items,
    ariaLabel,
    showHome,
    homeHref,
    homeLabel,
    dataAttributes,
    onItemSelect,
    onHomeClick,
    className,
    ...restProps
  } = props
  const kit = createBreadcrumbRecipe({
    items,
    ...(ariaLabel !== undefined ? { ariaLabel } : {}),
    ...(showHome !== undefined ? { showHome } : {}),
    ...(homeHref !== undefined ? { homeHref } : {}),
    ...(homeLabel !== undefined ? { homeLabel } : {}),
    ...(dataAttributes !== undefined ? { dataAttributes } : {}),
  })

  return (
    <nav
      {...restProps}
      {...kit.dataAttributes}
      className={cx(kit.className, className)}
      aria-label={kit.a11y.ariaLabel}
    >
      <ol className={kit.list.className} role={kit.list.a11y.role}>
        {kit.items.map((item, index) => (
          <li key={item.key} className={item.className} {...item.dataAttributes}>
            {index > 0 && (
              <span className={kit.separator.className} aria-hidden={kit.separator.a11y.ariaHidden}>
                <Icon name={IconName.ChevronRight} decorative size={12} />
              </span>
            )}
            {item.kind === "home" ? (
              renderHomeItem(item, onHomeClick)
            ) : (
              <BreadcrumbAction item={item} onItemSelect={onItemSelect} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function renderHomeItem(
  item: ReturnType<typeof createBreadcrumbRecipe>["items"][number],
  onHomeClick: BreadcrumbProps["onHomeClick"],
): React.ReactElement {
  const commonProps = {
    className: item.actionClassName,
    "aria-label": item.a11y.ariaLabel,
    "aria-current": item.current ? ("page" as const) : undefined,
  }

  if (item.href) {
    return (
      <a
        {...commonProps}
        href={item.href}
        onClick={(event) => {
          onHomeClick?.(event)
        }}
      >
        <Icon name={IconName.Home} decorative size={14} />
      </a>
    )
  }

  if (onHomeClick && !item.current) {
    return (
      <button type="button" {...commonProps} onClick={onHomeClick}>
        <Icon name={IconName.Home} decorative size={14} />
      </button>
    )
  }

  return (
    <span {...commonProps}>
      <Icon name={IconName.Home} decorative size={14} />
    </span>
  )
}

interface BreadcrumbActionProps {
  item: Extract<ReturnType<typeof createBreadcrumbRecipe>["items"][number], { kind: "item" }>
  onItemSelect?: BreadcrumbProps["onItemSelect"]
}

function BreadcrumbAction({ item, onItemSelect }: BreadcrumbActionProps): React.ReactElement {
  const sourceItem = item.item ?? {
    label: item.label,
    ...(item.value ? { value: item.value } : {}),
    ...(item.href ? { href: item.href } : {}),
    current: item.current,
  }
  const commonProps = {
    className: item.actionClassName,
    "aria-label": item.a11y.ariaLabel,
    "aria-current": item.a11y.ariaCurrent,
  }

  if (item.current) {
    return <span {...commonProps}>{item.label}</span>
  }

  if (item.href) {
    return (
      <a
        {...commonProps}
        href={item.href}
        onClick={(event) => {
          onItemSelect?.(item.value ?? item.label, sourceItem, event)
        }}
      >
        {item.label}
      </a>
    )
  }

  return (
    <button
      type="button"
      {...commonProps}
      onClick={(event) => {
        onItemSelect?.(item.value ?? item.label, sourceItem, event)
      }}
    >
      {item.label}
    </button>
  )
}
