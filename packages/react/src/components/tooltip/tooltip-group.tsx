import { IconName, type IconNameType } from "@marwes-ui/core"
import * as React from "react"
import { Icon } from "../icon"
import { Tooltip } from "./tooltip"

const TOOLTIP_EXIT_DURATION_MS = 160

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export interface TooltipGroupProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
  content: React.ReactNode
  icon?: IconNameType
  triggerLabel?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  tooltipId?: string
  tooltipClassName?: string
  triggerClassName?: string
  dataAttributes?: Record<string, string>
}

export function TooltipGroup(props: TooltipGroupProps): React.ReactElement {
  const reactId = React.useId()
  const {
    content,
    icon = IconName.HelpCircle,
    triggerLabel = "Show tooltip",
    open,
    defaultOpen = false,
    onOpenChange,
    tooltipId,
    tooltipClassName,
    triggerClassName,
    dataAttributes,
    className,
    id,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onKeyDown,
    ...nativeSpanProps
  } = props
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const resolvedOpen = isControlled ? open : internalOpen
  const [isTooltipMounted, setIsTooltipMounted] = React.useState(resolvedOpen)
  const resolvedTooltipId = tooltipId ?? `${id ?? `mw-tooltip-group-${reactId}`}-tooltip`

  React.useEffect(() => {
    if (resolvedOpen) {
      setIsTooltipMounted(true)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsTooltipMounted(false)
    }, TOOLTIP_EXIT_DURATION_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [resolvedOpen])

  const updateOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (resolvedOpen === nextOpen) {
        return
      }

      if (!isControlled) {
        setInternalOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange, resolvedOpen],
  )

  return (
    <span
      {...nativeSpanProps}
      {...dataAttributes}
      id={id}
      className={cx("mw-tooltip-group", className)}
      data-component="tooltip-group"
      data-open={resolvedOpen ? "true" : undefined}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)
        updateOpen(true)
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event)
        updateOpen(false)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        updateOpen(true)
      }}
      onBlur={(event) => {
        onBlur?.(event)

        const nextFocusedElement = event.relatedTarget
        if (
          nextFocusedElement instanceof Node &&
          event.currentTarget.contains(nextFocusedElement)
        ) {
          return
        }

        updateOpen(false)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.key === "Escape") {
          updateOpen(false)
        }
      }}
    >
      {isTooltipMounted ? (
        <Tooltip
          id={resolvedTooltipId}
          className={tooltipClassName}
          data-state={resolvedOpen ? "open" : "closed"}
          aria-hidden={resolvedOpen ? undefined : "true"}
        >
          {content}
        </Tooltip>
      ) : null}

      <button
        type="button"
        className={cx("mw-tooltip-group__trigger", triggerClassName)}
        aria-label={triggerLabel}
        aria-describedby={resolvedOpen ? resolvedTooltipId : undefined}
      >
        <Icon name={icon} decorative />
      </button>
    </span>
  )
}
