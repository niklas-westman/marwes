import type {
  SelectComboboxA11yProps,
  SelectListboxA11yProps,
  SelectOptionA11yProps,
} from "./select-types"

export interface SelectComboboxA11yOptions {
  /** Field id; also the id of the trigger. */
  id: string
  open: boolean
  /** Index of the keyboard-active option, or -1 when none. */
  activeIndex: number
  label?: string | undefined
  displayText?: string | undefined
  ariaLabel?: string | undefined
  ariaLabelledBy?: string | undefined
  describedBy?: string | undefined
  invalid?: boolean | undefined
  required?: boolean | undefined
}

function nonEmpty(text: string | undefined): string | undefined {
  return text !== undefined && text.trim().length > 0 ? text : undefined
}

export function getSelectListboxId(fieldId: string): string {
  return `${fieldId}-listbox`
}

export function getSelectOptionId(fieldId: string, index: number): string {
  return `${fieldId}-option-${index}`
}

export function resolveSelectComboboxA11y(options: SelectComboboxA11yOptions): {
  trigger: SelectComboboxA11yProps
  listbox: SelectListboxA11yProps
} {
  const listboxId = getSelectListboxId(options.id)
  const trigger: SelectComboboxA11yProps = {
    role: "combobox",
    ariaControls: listboxId,
    ariaExpanded: options.open,
    ariaHaspopup: "listbox",
  }

  // An external labelling element wins over any generated accessible name.
  const labelledBy = nonEmpty(options.ariaLabelledBy)
  if (labelledBy) {
    trigger.ariaLabelledBy = labelledBy
  } else {
    const name =
      nonEmpty(options.ariaLabel) ?? nonEmpty(options.label) ?? nonEmpty(options.displayText)
    if (name) trigger.ariaLabel = name
  }

  if (options.describedBy) trigger.ariaDescribedBy = options.describedBy
  if (options.invalid) trigger.ariaInvalid = true
  if (options.required) trigger.ariaRequired = true
  if (options.open && options.activeIndex !== -1) {
    trigger.ariaActivedescendant = getSelectOptionId(options.id, options.activeIndex)
  }

  return { trigger, listbox: { id: listboxId, role: "listbox", tabIndex: -1 } }
}

export function resolveSelectOptionA11y(options: {
  fieldId: string
  index: number
  selected: boolean
  disabled?: boolean | undefined
}): SelectOptionA11yProps {
  const a11y: SelectOptionA11yProps = {
    id: getSelectOptionId(options.fieldId, options.index),
    role: "option",
    ariaSelected: options.selected,
    tabIndex: -1,
  }
  if (options.disabled) a11y.ariaDisabled = true
  return a11y
}
