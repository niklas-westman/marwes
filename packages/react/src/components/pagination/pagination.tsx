import {
  IconName,
  clampPaginationPage,
  createPaginationControlRecipe,
  createPaginationEllipsisRecipe,
  createPaginationListItemRecipe,
  createPaginationListRecipe,
  createPaginationPageRecipe,
  createPaginationRecipe,
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
  showPrevNext?: boolean
  disabled?: boolean
  previousLabel?: string
  nextLabel?: string
  ariaLabel?: string
}

export function Pagination(props: PaginationProps): React.ReactElement {
  const {
    pageCount,
    page: controlledPage,
    defaultPage,
    onPageChange,
    siblingCount,
    boundaryCount,
    showPrevNext,
    disabled,
    previousLabel = "Previous",
    nextLabel = "Next",
    ariaLabel,
    className,
    id,
    ...rest
  } = props

  const isControlled = controlledPage !== undefined
  const [internalPage, setInternalPage] = React.useState(() =>
    clampPaginationPage(defaultPage, pageCount),
  )
  const resolvedPage = clampPaginationPage(isControlled ? controlledPage : internalPage, pageCount)
  const rootKit = createPaginationRecipe({
    page: resolvedPage,
    pageCount,
    siblingCount,
    boundaryCount,
    showPrevNext,
    disabled,
    ariaLabel,
    previousLabel,
    nextLabel,
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

  const previousKit = createPaginationControlRecipe({
    direction: "previous",
    disabled: previousDisabled,
    label: previousLabel,
  })
  const nextKit = createPaginationControlRecipe({
    direction: "next",
    disabled: nextDisabled,
    label: nextLabel,
  })

  return (
    <nav
      {...rest}
      id={id}
      className={rootClassName}
      aria-label={rootKit.a11y.ariaLabel}
      data-component="pagination"
    >
      {rootKit.showPrevNext && (
        <button
          type="button"
          className={previousKit.className}
          aria-label={previousKit.a11y.ariaLabel}
          aria-disabled={previousKit.a11y.ariaDisabled}
          disabled={previousDisabled}
          onClick={() => selectPage(resolvedPage - 1)}
        >
          <span className="mw-pagination__control-icon">
            <Icon name={IconName.ChevronLeft} decorative size={12} />
          </span>
          {previousLabel}
        </button>
      )}
      <ul className={listKit.className} role={listKit.a11y.role}>
        {rootKit.items.map((item) => {
          const itemContent =
            item.type === "ellipsis"
              ? (() => {
                  const ellipsisKit = createPaginationEllipsisRecipe()
                  return (
                    <span
                      className={ellipsisKit.className}
                      aria-hidden={ellipsisKit.a11y.ariaHidden}
                    >
                      ...
                    </span>
                  )
                })()
              : (() => {
                  const pageKit = createPaginationPageRecipe({
                    page: item.page,
                    selected: item.selected,
                    disabled,
                  })
                  return (
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
                  )
                })()

          return (
            <li key={item.key} className={listItemKit.className}>
              {itemContent}
            </li>
          )
        })}
      </ul>
      {rootKit.showPrevNext && (
        <button
          type="button"
          className={nextKit.className}
          aria-label={nextKit.a11y.ariaLabel}
          aria-disabled={nextKit.a11y.ariaDisabled}
          disabled={nextDisabled}
          onClick={() => selectPage(resolvedPage + 1)}
        >
          {nextLabel}
          <span className="mw-pagination__control-icon">
            <Icon name={IconName.ChevronRight} decorative size={12} />
          </span>
        </button>
      )}
    </nav>
  )
}
