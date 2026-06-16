/**
 * React adapter for Marwes SegmentedControl.
 * Single-select segmented toggle using radiogroup semantics.
 */

import {
  createSegmentedControlItemRecipe,
  createSegmentedControlRecipe,
  moveSegmentedControlSelection,
  resolveSegmentedControlValue,
} from "@marwes-ui/core"
import type {
  SegmentedControlItemState,
  SegmentedControlSize,
  SegmentedControlVariant,
} from "@marwes-ui/core"
import * as React from "react"

export interface SegmentedControlItem<T extends string = string> {
  value: T
  label?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  ariaLabel?: string
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedControlItem<T>[]
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  variant?: SegmentedControlVariant
  size?: SegmentedControlSize
  disabled?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  /** Stretch the control to fill its container. Defaults to inline width. */
  fullWidth?: boolean
  className?: string
  id?: string
  style?: React.CSSProperties
}

function toItemState<T extends string>(item: SegmentedControlItem<T>): SegmentedControlItemState {
  const state: SegmentedControlItemState = { value: item.value }
  if (item.disabled) state.disabled = true
  return state
}

export function SegmentedControl<T extends string = string>(
  props: SegmentedControlProps<T>,
): React.ReactElement {
  const {
    items,
    value: controlledValue,
    defaultValue,
    onValueChange,
    variant,
    size,
    disabled,
    ariaLabel,
    ariaLabelledBy,
    fullWidth,
    className,
    id,
    style,
  } = props

  const itemStates = React.useMemo<SegmentedControlItemState[]>(
    () => items.map(toItemState),
    [items],
  )

  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = React.useState<string | undefined>(() =>
    resolveSegmentedControlValue(itemStates, defaultValue),
  )

  const resolvedValue = React.useMemo(
    () => resolveSegmentedControlValue(itemStates, isControlled ? controlledValue : internalValue),
    [itemStates, isControlled, controlledValue, internalValue],
  )

  const selectItem = React.useCallback(
    (nextValue: string | undefined) => {
      const resolved = resolveSegmentedControlValue(itemStates, nextValue)
      if (!resolved || resolved === resolvedValue) return

      if (!isControlled) setInternalValue(resolved)
      // `resolved` always traces back to one of `items[i].value: T`, so this cast is safe.
      onValueChange?.(resolved as T)
    },
    [itemStates, isControlled, resolvedValue, onValueChange],
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      let direction: "next" | "previous" | "start" | "end" | undefined

      switch (event.key) {
        case "ArrowRight":
          direction = "next"
          break
        case "ArrowLeft":
          direction = "previous"
          break
        case "Home":
          direction = "start"
          break
        case "End":
          direction = "end"
          break
        default:
          return
      }

      event.preventDefault()
      const nextValue = moveSegmentedControlSelection(itemStates, resolvedValue, direction)
      if (nextValue) {
        selectItem(nextValue)
        const btn = event.currentTarget.querySelector<HTMLButtonElement>(
          `[data-value="${nextValue}"]`,
        )
        btn?.focus()
      }
    },
    [itemStates, resolvedValue, selectItem],
  )

  const trackKit = createSegmentedControlRecipe({
    value: resolvedValue,
    variant,
    size,
    disabled,
    ariaLabel,
    ariaLabelledBy,
    fullWidth,
  })
  const trackClassName = [trackKit.className, className].filter(Boolean).join(" ")

  return (
    <div
      id={id}
      className={trackClassName}
      role={trackKit.a11y.role}
      aria-label={trackKit.a11y.ariaLabel}
      aria-labelledby={trackKit.a11y.ariaLabelledBy}
      aria-disabled={trackKit.a11y.ariaDisabled}
      onKeyDown={handleKeyDown}
      style={style}
    >
      {items.map((item) => {
        const isSelected = item.value === resolvedValue
        const isItemDisabled = disabled || item.disabled
        const isIconOnly = item.icon != null && item.label == null
        const itemKit = createSegmentedControlItemRecipe({
          value: item.value,
          selected: isSelected,
          disabled: isItemDisabled,
          ariaLabel: item.ariaLabel,
          iconOnly: isIconOnly,
        })

        return (
          <button
            key={item.value}
            type="button"
            className={itemKit.className}
            role={itemKit.a11y.role}
            aria-checked={itemKit.a11y.ariaChecked}
            aria-disabled={itemKit.a11y.ariaDisabled}
            aria-label={itemKit.a11y.ariaLabel}
            tabIndex={itemKit.a11y.tabIndex}
            disabled={isItemDisabled}
            data-value={item.value}
            onClick={() => selectItem(item.value)}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
