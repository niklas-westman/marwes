import { IconName, buildInputFieldA11yIds, resolveSelectMode } from "@marwes-ui/core"
import * as React from "react"
import { Icon } from "../icon"
import { Text } from "../text"
import { Select } from "./select"
import type { SelectProps } from "./select"
import { SelectArrowIcon } from "./select-arrow-icon"

export type SelectFieldVariant = "default" | "date"

export type SelectFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  select: SelectProps
  ariaDescribedBy?: string
  variant?: SelectFieldVariant
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

function getInitialSelectValue(props: SelectProps): string {
  if (props.value !== undefined) {
    return props.value
  }

  if (props.defaultValue !== undefined) {
    return props.defaultValue
  }

  if (props.placeholder !== undefined) {
    return ""
  }

  return props.options[0]?.value ?? ""
}

function getFirstEnabledOptionIndex(options: SelectProps["options"]): number {
  return options.findIndex((option) => !option.disabled)
}

function getLastEnabledOptionIndex(options: SelectProps["options"]): number {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index
    }
  }

  return -1
}

function getSelectedOptionIndex(options: SelectProps["options"], value: string): number {
  return options.findIndex((option) => option.value === value && !option.disabled)
}

function getInitialActiveOptionIndex(options: SelectProps["options"], value: string): number {
  const selectedIndex = getSelectedOptionIndex(options, value)

  if (selectedIndex !== -1) {
    return selectedIndex
  }

  return getFirstEnabledOptionIndex(options)
}

function getNextEnabledOptionIndex(
  options: SelectProps["options"],
  currentIndex: number,
  direction: 1 | -1,
): number {
  if (options.length === 0) {
    return -1
  }

  let nextIndex = currentIndex

  for (let attempts = 0; attempts < options.length; attempts += 1) {
    nextIndex = (nextIndex + direction + options.length) % options.length

    if (!options[nextIndex]?.disabled) {
      return nextIndex
    }
  }

  return currentIndex
}

type MarwesSelectFieldControlProps = {
  id: string
  label?: string
  select: SelectProps
}

function MarwesSelectFieldControl(props: MarwesSelectFieldControlProps): React.ReactElement {
  const { id, label, select } = props
  const listboxId = `${id}-listbox`
  const isControlled = select.value !== undefined
  const [internalValue, setInternalValue] = React.useState(() => getInitialSelectValue(select))
  const value = isControlled ? (select.value ?? "") : internalValue
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(() =>
    getInitialActiveOptionIndex(select.options, value),
  )
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  const selectedOption =
    select.options.find((option) => option.value === value) ??
    (select.placeholder === undefined ? select.options[0] : undefined)
  const placeholderSelected = select.placeholder !== undefined && value === ""
  const displayText = placeholderSelected ? select.placeholder : (selectedOption?.label ?? "")
  const accessibleName =
    select.ariaLabel ??
    (hasTextContent(label) ? label : undefined) ??
    (hasTextContent(displayText) ? displayText : undefined)

  React.useEffect(() => {
    if (!open) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) {
        return
      }

      setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [open])

  React.useEffect(() => {
    if (!open) {
      return
    }

    setActiveIndex(getInitialActiveOptionIndex(select.options, value))
  }, [open, select.options, value])

  React.useEffect(() => {
    if (!select.disabled) {
      return
    }

    setOpen(false)
  }, [select.disabled])

  const commitValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    select.onValueChange?.(nextValue)
  }

  const selectOptionAtIndex = (index: number) => {
    const option = select.options[index]

    if (!option || option.disabled) {
      return
    }

    commitValue(option.value)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (select.disabled) {
      return
    }

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault()

        if (!open) {
          setOpen(true)
          setActiveIndex(getInitialActiveOptionIndex(select.options, value))
          return
        }

        setActiveIndex((currentIndex) => getNextEnabledOptionIndex(select.options, currentIndex, 1))
        return
      }
      case "ArrowUp": {
        event.preventDefault()

        if (!open) {
          setOpen(true)
          setActiveIndex(getInitialActiveOptionIndex(select.options, value))
          return
        }

        setActiveIndex((currentIndex) =>
          getNextEnabledOptionIndex(select.options, currentIndex, -1),
        )
        return
      }
      case "Home": {
        if (!open) {
          return
        }

        event.preventDefault()
        setActiveIndex(getFirstEnabledOptionIndex(select.options))
        return
      }
      case "End": {
        if (!open) {
          return
        }

        event.preventDefault()
        setActiveIndex(getLastEnabledOptionIndex(select.options))
        return
      }
      case "Enter":
      case " ": {
        event.preventDefault()

        if (!open) {
          setOpen(true)
          setActiveIndex(getInitialActiveOptionIndex(select.options, value))
          return
        }

        if (activeIndex !== -1) {
          selectOptionAtIndex(activeIndex)
        }
        return
      }
      case "Escape": {
        if (!open) {
          return
        }

        event.preventDefault()
        setOpen(false)
        return
      }
      case "Tab": {
        setOpen(false)
        return
      }
      default:
        return
    }
  }

  return (
    <div
      ref={rootRef}
      className={cx("mw-select-field__control", open && "mw-select-field__control--open")}
    >
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className={cx(
          "mw-select-field__trigger",
          placeholderSelected && "mw-select-field__trigger--placeholder",
          select.invalid && "is-invalid",
          open && "mw-select-field__trigger--open",
        )}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={accessibleName}
        aria-describedby={select.describedBy}
        aria-invalid={select.invalid ? "true" : undefined}
        aria-required={select.required ? "true" : undefined}
        aria-activedescendant={
          open && activeIndex !== -1 ? `${id}-option-${activeIndex}` : undefined
        }
        disabled={select.disabled}
        data-placeholder-selected={placeholderSelected ? "true" : undefined}
        onClick={() => {
          if (select.disabled) {
            return
          }

          setOpen((currentOpen) => !currentOpen)
        }}
        onKeyDown={handleKeyDown}
      >
        <span className="mw-select-field__trigger-text">{displayText}</span>
        <SelectArrowIcon className="mw-select-field__trigger-icon" />
      </button>

      {select.name ? (
        <input
          aria-hidden="true"
          className="mw-select-field__proxy-input"
          name={select.name}
          type="hidden"
          value={value}
          readOnly
        />
      ) : null}

      {open ? (
        <>
          <div className="mw-select-field__list" id={listboxId} role="listbox" tabIndex={-1}>
            {select.options.map((option, optionIndex) => {
              const selected = option.value === value
              const active = optionIndex === activeIndex

              return (
                <div
                  id={`${id}-option-${optionIndex}`}
                  key={option.value}
                  className={cx(
                    "mw-select-field__option",
                    active && "mw-select-field__option--active",
                    selected && "mw-select-field__option--selected",
                    option.disabled && "mw-select-field__option--disabled",
                  )}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled ? "true" : undefined}
                  tabIndex={-1}
                  onClick={() => selectOptionAtIndex(optionIndex)}
                  onKeyDown={(event) => {
                    if (option.disabled) {
                      return
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      selectOptionAtIndex(optionIndex)
                    }
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => {
                    if (!option.disabled) {
                      setActiveIndex(optionIndex)
                    }
                  }}
                >
                  <span className="mw-select-field__option-label">{option.label}</span>
                  {selected ? (
                    <Icon
                      className="mw-select-field__option-check"
                      name={IconName.Check}
                      size="xs"
                      decorative
                    />
                  ) : null}
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

export function SelectField(props: SelectFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-select-${reactId}`
  const mode = resolveSelectMode(props.select)

  const hasHelperText = hasTextContent(props.helperText)
  const hasError = hasTextContent(props.error)

  const {
    helperTextId,
    errorId,
    describedBy: mergedDescribedBy,
  } = buildInputFieldA11yIds({
    id,
    hasHelperText,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  const disabled = props.select.disabled || false
  const invalid = hasError || props.select.invalid || false

  const wrapperClass = cx(
    "mw-input-field",
    "mw-input-field--select",
    mode === "marwes" && "mw-input-field--select-marwes",
    props.variant === "date" && "mw-input-field--select-date",
    disabled && "mw-input-field--disabled",
    invalid && "mw-input-field--invalid",
  )

  const selectProps: SelectProps = {
    ...props.select,
    id,
    invalid,
  }

  if (mergedDescribedBy) {
    selectProps.describedBy = mergedDescribedBy
  }

  return (
    <div className={wrapperClass}>
      <label className="mw-input-field__label" htmlFor={id}>
        <Text variant="label">{props.label}</Text>
      </label>

      <div className="mw-input-field__input-wrapper">
        {mode === "native" ? (
          <Select {...selectProps} native />
        ) : (
          <MarwesSelectFieldControl id={id} label={props.label} select={selectProps} />
        )}
      </div>

      {hasHelperText && !hasError && (
        <div className="mw-input-field__helper" id={helperTextId}>
          <Text variant="caption">{props.helperText}</Text>
        </div>
      )}

      {hasError && (
        <div className="mw-input-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      )}
    </div>
  )
}
