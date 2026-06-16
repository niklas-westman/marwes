import {
  IconName,
  clampPaginationPage,
  createPaginationControlRecipe,
  createPaginationEllipsisRecipe,
  createPaginationListItemRecipe,
  createPaginationListRecipe,
  createPaginationPageRecipe,
  createPaginationRecipe,
  resolvePaginationAdaptiveProfile,
  resolvePaginationItemAriaLabel,
} from "@marwes-ui/core"
import type {
  IconName as IconNameType,
  PaginationAdaptiveProfile,
  PaginationControlDirection,
  PaginationControlDisplay,
  PaginationGetItemAriaLabel,
  PaginationResolvedControlDisplay,
} from "@marwes-ui/core"
import * as React from "react"
import { Icon } from "../icon"

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange" | "children"> {
  pageCount: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  siblingCount?: number
  boundaryCount?: number
  maxVisibleItems?: number
  controlDisplay?: PaginationControlDisplay
  adaptive?: boolean
  showPrevNext?: boolean
  showFirstLast?: boolean
  disabled?: boolean
  firstLabel?: string
  previousLabel?: string
  nextLabel?: string
  lastLabel?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  getItemAriaLabel?: PaginationGetItemAriaLabel
}

export function Pagination(props: PaginationProps): React.ReactElement {
  const {
    pageCount,
    page: controlledPage,
    defaultPage,
    onPageChange,
    siblingCount,
    boundaryCount,
    maxVisibleItems,
    controlDisplay = "auto",
    adaptive = true,
    showPrevNext,
    showFirstLast,
    disabled,
    firstLabel = "First",
    previousLabel = "Previous",
    nextLabel = "Next",
    lastLabel = "Last",
    ariaLabel,
    ariaLabelledBy,
    getItemAriaLabel,
    className,
    id,
    style,
    ...rest
  } = props

  const isControlled = controlledPage !== undefined
  const rootRef = React.useRef<HTMLElement>(null)
  const adaptiveProfile = useAdaptivePaginationProfile(rootRef, {
    adaptive,
    pageCount,
    ...(siblingCount !== undefined ? { siblingCount } : {}),
    ...(boundaryCount !== undefined ? { boundaryCount } : {}),
    ...(maxVisibleItems !== undefined ? { maxVisibleItems } : {}),
    controlDisplay,
  })
  const [internalPage, setInternalPage] = React.useState(() =>
    clampPaginationPage(defaultPage, pageCount),
  )
  const resolvedPage = clampPaginationPage(isControlled ? controlledPage : internalPage, pageCount)
  const resolvedControlDisplay: PaginationResolvedControlDisplay =
    adaptive && adaptiveProfile
      ? adaptiveProfile.controlDisplay
      : controlDisplay === "icon"
        ? "icon"
        : "label"
  const resolvedMaxVisibleItems =
    adaptive && adaptiveProfile ? adaptiveProfile.maxVisibleItems : maxVisibleItems
  const rootKit = createPaginationRecipe({
    page: resolvedPage,
    pageCount,
    ...(siblingCount !== undefined ? { siblingCount } : {}),
    ...(boundaryCount !== undefined ? { boundaryCount } : {}),
    ...(resolvedMaxVisibleItems !== undefined ? { maxVisibleItems: resolvedMaxVisibleItems } : {}),
    controlDisplay: resolvedControlDisplay,
    ...(showPrevNext !== undefined ? { showPrevNext } : {}),
    ...(showFirstLast !== undefined ? { showFirstLast } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(ariaLabel !== undefined ? { ariaLabel } : {}),
    ...(ariaLabelledBy !== undefined ? { ariaLabelledBy } : {}),
    firstLabel,
    previousLabel,
    nextLabel,
    lastLabel,
    ...(getItemAriaLabel !== undefined ? { getItemAriaLabel } : {}),
  })
  const listKit = createPaginationListRecipe()
  const listItemKit = createPaginationListItemRecipe()
  const rootClassName = [rootKit.className, className].filter(Boolean).join(" ")

  const selectPage = React.useCallback(
    (nextPage: number) => {
      if (disabled) return

      const resolved = clampPaginationPage(nextPage, pageCount)
      if (resolved === 0 || resolved === resolvedPage) return

      if (!isControlled) setInternalPage(resolved)
      onPageChange?.(resolved)
    },
    [disabled, isControlled, onPageChange, pageCount, resolvedPage],
  )

  const previousDisabled = disabled || resolvedPage <= 1
  const nextDisabled = disabled || resolvedPage <= 0 || resolvedPage >= pageCount
  const firstDisabled = disabled || resolvedPage <= 1
  const lastDisabled = disabled || resolvedPage <= 0 || resolvedPage >= pageCount

  const firstKit = createPaginationControlRecipe({
    direction: "first",
    disabled: firstDisabled,
    label: firstLabel,
    ...(getItemAriaLabel !== undefined
      ? {
          ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
            type: "first",
            page: 1,
            selected: false,
          }),
        }
      : {}),
  })
  const previousKit = createPaginationControlRecipe({
    direction: "previous",
    disabled: previousDisabled,
    label: previousLabel,
    ...(getItemAriaLabel !== undefined
      ? {
          ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
            type: "previous",
            page: resolvedPage - 1,
            selected: false,
          }),
        }
      : {}),
  })
  const nextKit = createPaginationControlRecipe({
    direction: "next",
    disabled: nextDisabled,
    label: nextLabel,
    ...(getItemAriaLabel !== undefined
      ? {
          ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
            type: "next",
            page: resolvedPage + 1,
            selected: false,
          }),
        }
      : {}),
  })
  const lastKit = createPaginationControlRecipe({
    direction: "last",
    disabled: lastDisabled,
    label: lastLabel,
    ...(getItemAriaLabel !== undefined
      ? {
          ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
            type: "last",
            page: pageCount,
            selected: false,
          }),
        }
      : {}),
  })

  const renderControl = (
    direction: PaginationControlDirection,
    kit: typeof firstKit | typeof previousKit | typeof nextKit | typeof lastKit,
    controlDisabled: boolean,
    targetPage: number,
    label: string,
    iconName: IconNameType,
  ) => {
    const isLeadingIcon = direction === "first" || direction === "previous"
    const icon = (
      <span className="mw-pagination__control-icon">
        <Icon name={iconName} decorative size={12} />
      </span>
    )

    return (
      <button
        type="button"
        className={kit.className}
        aria-label={kit.a11y.ariaLabel}
        aria-disabled={kit.a11y.ariaDisabled}
        disabled={controlDisabled}
        onClick={() => selectPage(targetPage)}
      >
        {isLeadingIcon && icon}
        <span className="mw-pagination__control-label">{label}</span>
        {!isLeadingIcon && icon}
      </button>
    )
  }

  return (
    <nav
      {...rest}
      ref={rootRef}
      id={id}
      className={rootClassName}
      style={{ ...rootKit.vars, ...style } as React.CSSProperties}
      aria-label={rootKit.a11y.ariaLabel}
      aria-labelledby={rootKit.a11y.ariaLabelledBy}
      data-component="pagination"
      data-control-display={rootKit.controlDisplay}
    >
      {rootKit.showFirstLast &&
        renderControl("first", firstKit, firstDisabled, 1, firstLabel, IconName.ChevronsLeft)}
      {rootKit.showPrevNext &&
        renderControl(
          "previous",
          previousKit,
          previousDisabled,
          resolvedPage - 1,
          previousLabel,
          IconName.ChevronLeft,
        )}
      <ul className={listKit.className} role={listKit.a11y.role}>
        {rootKit.items.map((item) => {
          if (item.type !== "page") {
            const ellipsisKit = createPaginationEllipsisRecipe()

            return (
              <li key={item.key} className={listItemKit.className}>
                <span className={ellipsisKit.className} aria-hidden={ellipsisKit.a11y.ariaHidden}>
                  ...
                </span>
              </li>
            )
          }

          const pageKit = createPaginationPageRecipe({
            page: item.page,
            selected: item.selected,
            ...(disabled !== undefined ? { disabled } : {}),
            ...(getItemAriaLabel !== undefined
              ? {
                  ariaLabel: resolvePaginationItemAriaLabel(getItemAriaLabel, {
                    type: "page",
                    page: item.page,
                    selected: item.selected,
                  }),
                }
              : {}),
          })

          return (
            <li key={item.key} className={listItemKit.className}>
              <button
                type="button"
                className={pageKit.className}
                aria-label={pageKit.a11y.ariaLabel}
                aria-current={pageKit.a11y.ariaCurrent}
                aria-disabled={pageKit.a11y.ariaDisabled}
                disabled={disabled}
                onClick={() => selectPage(item.page)}
              >
                {item.page}
              </button>
            </li>
          )
        })}
      </ul>
      {rootKit.showPrevNext &&
        renderControl(
          "next",
          nextKit,
          nextDisabled,
          resolvedPage + 1,
          nextLabel,
          IconName.ChevronRight,
        )}
      {rootKit.showFirstLast &&
        renderControl("last", lastKit, lastDisabled, pageCount, lastLabel, IconName.ChevronsRight)}
    </nav>
  )
}

function parsePxValue(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

interface AdaptivePaginationProfileOptions {
  adaptive: boolean
  pageCount: number
  siblingCount?: number
  boundaryCount?: number
  maxVisibleItems?: number
  controlDisplay: PaginationControlDisplay
}

function resolveControlWidths(
  controls: HTMLElement[],
  itemSize: number,
): { labelControlWidth: number; iconControlWidth: number } {
  const labelControlWidth = controls.reduce((total, control) => {
    const icon = control.querySelector<HTMLElement>(".mw-pagination__control-icon")
    const label = control.querySelector<HTMLElement>(".mw-pagination__control-label")
    const iconWidth = icon?.getBoundingClientRect().width ?? 0
    const labelWidth = label?.scrollWidth ?? label?.getBoundingClientRect().width ?? 0
    const labelGap = iconWidth > 0 && labelWidth > 0 ? 4 : 0
    const measuredLabelWidth = iconWidth + labelGap + labelWidth

    return total + Math.max(control.getBoundingClientRect().width, measuredLabelWidth)
  }, 0)

  return {
    labelControlWidth,
    iconControlWidth: controls.length * itemSize,
  }
}

function useAdaptivePaginationProfile(
  rootRef: React.RefObject<HTMLElement | null>,
  opts: AdaptivePaginationProfileOptions,
): PaginationAdaptiveProfile | undefined {
  const [profile, setProfile] = React.useState<PaginationAdaptiveProfile | undefined>(undefined)

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!opts.adaptive || !root || typeof window === "undefined") {
      setProfile(undefined)
      return
    }

    const parent = root.parentElement
    if (!parent) return

    let frame = 0
    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const rootStyles = window.getComputedStyle(root)
        const parentStyles = window.getComputedStyle(parent)
        const itemSize = parsePxValue(rootStyles.getPropertyValue("--mw-pagination-size"), 32)
        const itemGap = parsePxValue(rootStyles.getPropertyValue("--mw-pagination-gap"), 2)
        const sectionGap = parsePxValue(
          rootStyles.getPropertyValue("--mw-pagination-section-gap"),
          12,
        )
        const parentWidth =
          parent.getBoundingClientRect().width -
          parsePxValue(parentStyles.paddingLeft, 0) -
          parsePxValue(parentStyles.paddingRight, 0)
        if (parentWidth <= 0) {
          setProfile(undefined)
          return
        }
        const controls = Array.from(root.querySelectorAll<HTMLElement>(".mw-pagination__control"))
        const { labelControlWidth, iconControlWidth } = resolveControlWidths(controls, itemSize)
        const nextProfile = resolvePaginationAdaptiveProfile({
          containerWidth: parentWidth,
          labelControlWidth,
          iconControlWidth,
          controlCount: controls.length,
          itemSize,
          itemGap,
          sectionGap,
          pageCount: opts.pageCount,
          ...(opts.siblingCount !== undefined ? { siblingCount: opts.siblingCount } : {}),
          ...(opts.boundaryCount !== undefined ? { boundaryCount: opts.boundaryCount } : {}),
          ...(opts.maxVisibleItems !== undefined ? { maxVisibleItems: opts.maxVisibleItems } : {}),
          controlDisplay: opts.controlDisplay,
        })

        setProfile((previous) =>
          previous?.controlDisplay === nextProfile.controlDisplay &&
          previous?.maxVisibleItems === nextProfile.maxVisibleItems &&
          previous?.reservedItemCount === nextProfile.reservedItemCount
            ? previous
            : nextProfile,
        )
      })
    }

    measure()

    const Observer = window.ResizeObserver
    const resizeObserver = Observer ? new Observer(measure) : undefined
    resizeObserver?.observe(parent)
    resizeObserver?.observe(root)
    window.addEventListener("resize", measure)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [
    opts.adaptive,
    opts.boundaryCount,
    opts.controlDisplay,
    opts.maxVisibleItems,
    opts.pageCount,
    opts.siblingCount,
    rootRef,
  ])

  return profile
}
