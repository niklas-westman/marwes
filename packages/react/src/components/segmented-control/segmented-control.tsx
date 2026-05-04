import {
  type SegmentedControlItemOptions,
  type SegmentedControlItemState,
  type SegmentedControlOptions,
  type SegmentedControlVariantName,
  buildSegmentedControlA11yIds,
  createSegmentedControlItemRecipe,
  createSegmentedControlRecipe,
  moveSegmentedControlSelection,
  resolveSegmentedControlValue,
} from "@marwes-ui/core"
import * as React from "react"

export interface SegmentedControlOption {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  ariaLabel?: string
}

export interface SegmentedControlProps {
  id?: string
  label?: React.ReactNode
  ariaLabel?: string
  ariaDescribedBy?: string
  options: SegmentedControlOption[]
  value?: string
  defaultValue?: string
  disabled?: boolean
  variant?: SegmentedControlVariantName
  onValueChange?: (value: string) => void
  className?: string
  dataAttributes?: Record<string, string>
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasContent(value: React.ReactNode | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  return true
}

function focusSegmentedControlItem(itemId: string): void {
  if (typeof document === "undefined") {
    return
  }

  const item = document.getElementById(itemId)
  if (item instanceof HTMLButtonElement) {
    item.focus()
  }
}

function toItemState(
  option: SegmentedControlOption,
  groupDisabled?: boolean,
): SegmentedControlItemState {
  const itemState: SegmentedControlItemState = { value: option.value }

  if (groupDisabled || option.disabled) {
    itemState.disabled = true
  }

  return itemState
}

export function SegmentedControl(props: SegmentedControlProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-segmented-control-${reactId}`
  const hasLabel = hasContent(props.label)
  const isControlled = props.value !== undefined
  const itemStates = React.useMemo<SegmentedControlItemState[]>(
    () => props.options.map((option) => toItemState(option, props.disabled)),
    [props.disabled, props.options],
  )
  const [internalValue, setInternalValue] = React.useState<string | undefined>(() =>
    resolveSegmentedControlValue(itemStates, props.defaultValue),
  )

  React.useEffect(() => {
    if (!isControlled) {
      setInternalValue((currentValue) =>
        resolveSegmentedControlValue(itemStates, currentValue ?? props.defaultValue),
      )
    }
  }, [isControlled, itemStates, props.defaultValue])

  const selectedValue = React.useMemo(
    () => resolveSegmentedControlValue(itemStates, isControlled ? props.value : internalValue),
    [internalValue, isControlled, itemStates, props.value],
  )

  const a11yIds = React.useMemo(
    () =>
      buildSegmentedControlA11yIds({
        id,
        itemValues: props.options.map((option) => option.value),
        hasLabel,
      }),
    [hasLabel, id, props.options],
  )

  const selectValue = React.useCallback(
    (nextValue: string | undefined) => {
      if (props.disabled) {
        return
      }

      const resolvedValue = resolveSegmentedControlValue(itemStates, nextValue)
      if (!resolvedValue) {
        return
      }

      if (!isControlled) {
        setInternalValue(resolvedValue)
      }

      if (resolvedValue !== selectedValue) {
        props.onValueChange?.(resolvedValue)
      }
    },
    [isControlled, itemStates, props.disabled, props.onValueChange, selectedValue],
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      let direction: "next" | "previous" | "start" | "end" | undefined

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          direction = "next"
          break
        case "ArrowLeft":
        case "ArrowUp":
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

      const nextValue = moveSegmentedControlSelection(itemStates, selectedValue, direction)
      if (!nextValue) {
        return
      }

      selectValue(nextValue)
      const nextItemId = a11yIds.itemIds[nextValue]
      if (nextItemId) {
        focusSegmentedControlItem(nextItemId)
      }
    },
    [a11yIds.itemIds, itemStates, selectedValue, selectValue],
  )

  const controlOptions: SegmentedControlOptions = {}
  if (props.variant !== undefined) controlOptions.variant = props.variant
  if (props.disabled !== undefined) controlOptions.disabled = props.disabled
  if (!hasLabel) controlOptions.ariaLabel = props.ariaLabel ?? "Segmented control"
  if (hasLabel && a11yIds.labelId) controlOptions.ariaLabelledby = a11yIds.labelId
  if (props.ariaDescribedBy !== undefined) controlOptions.ariaDescribedBy = props.ariaDescribedBy

  const kit = createSegmentedControlRecipe(controlOptions)

  return (
    <div
      className={cx(
        "mw-segmented-control-field",
        hasLabel && "mw-segmented-control-field--labelled",
      )}
    >
      {hasLabel && (
        <span id={a11yIds.labelId} className="mw-segmented-control__label">
          {props.label}
        </span>
      )}
      <div
        id={a11yIds.groupId}
        className={cx(kit.className, props.className)}
        style={Object.keys(kit.vars).length > 0 ? kit.vars : undefined}
        role={kit.a11y.role}
        aria-label={kit.a11y.ariaLabel}
        aria-labelledby={kit.a11y.ariaLabelledby}
        aria-describedby={kit.a11y.ariaDescribedBy}
        aria-disabled={kit.a11y.ariaDisabled}
        onKeyDown={handleKeyDown}
        {...kit.dataAttributes}
        {...props.dataAttributes}
      >
        {props.options.map((option) => {
          const itemDisabled = Boolean(props.disabled || option.disabled)
          const selected = option.value === selectedValue
          const itemOptions: SegmentedControlItemOptions = { selected }
          if (itemDisabled) itemOptions.disabled = true
          if (props.variant !== undefined) itemOptions.variant = props.variant
          if (option.ariaLabel !== undefined) itemOptions.ariaLabel = option.ariaLabel

          const itemKit = createSegmentedControlItemRecipe(itemOptions)

          return (
            <button
              key={option.value}
              id={a11yIds.itemIds[option.value] ?? `${id}-item-${option.value}`}
              type="button"
              className={itemKit.className}
              style={Object.keys(itemKit.vars).length > 0 ? itemKit.vars : undefined}
              role={itemKit.a11y.role}
              aria-checked={itemKit.a11y.ariaChecked}
              aria-disabled={itemKit.a11y.ariaDisabled}
              aria-label={itemKit.a11y.ariaLabel}
              tabIndex={itemKit.a11y.tabIndex}
              disabled={itemDisabled}
              onClick={() => selectValue(option.value)}
              {...itemKit.dataAttributes}
            >
              {option.icon && (
                <span className="mw-segmented-control__item-icon">{option.icon}</span>
              )}
              <span className="mw-segmented-control__item-label">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
