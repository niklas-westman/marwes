import { IconName, buildInputFieldA11yIds, resolveSelectMode } from "@marwes-ui/core"
import { computed, defineComponent, h, onBeforeUnmount, ref, watch } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Icon } from "../icon"
import { Paragraph } from "../paragraph"
import { Select, type SelectProps } from "./select"
import { SelectArrowIcon } from "./select-arrow-icon"

export type SelectFieldVariant = "default" | "date"

export type SelectFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  select: SelectProps
  ariaDescribedBy?: string
  modelValue?: string
  variant?: SelectFieldVariant
}

const selectFieldPropKeys = [
  "id",
  "label",
  "helperText",
  "error",
  "select",
  "ariaDescribedBy",
  "modelValue",
  "variant",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

function getInitialSelectValue(props: SelectProps): string {
  if (props.modelValue !== undefined) {
    return props.modelValue
  }

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

export const SelectField = defineComponent(
  (props: SelectFieldProps, { slots, emit }) => {
    const localSelectId = createLocalId("mw-select")
    const id = computed(() => props.id ?? localSelectId)
    const sourceSelect = computed<SelectProps>(() => props.select)
    const mode = computed(() => resolveSelectMode(sourceSelect.value))
    const externalValue = computed(
      () => props.modelValue ?? sourceSelect.value.modelValue ?? sourceSelect.value.value,
    )
    const isControlled = computed(
      () =>
        props.modelValue !== undefined ||
        sourceSelect.value.modelValue !== undefined ||
        sourceSelect.value.value !== undefined,
    )
    const internalValue = ref(getInitialSelectValue(sourceSelect.value))
    const open = ref(false)
    const activeIndex = ref(
      getInitialActiveOptionIndex(
        sourceSelect.value.options,
        externalValue.value ?? internalValue.value,
      ),
    )
    const controlRef = ref<HTMLElement | null>(null)
    const buttonRef = ref<HTMLElement | null>(null)

    const hasHelperText = computed(() => hasTextContent(props.helperText))
    const hasError = computed(() => hasTextContent(props.error))

    const a11yIds = computed(() =>
      buildInputFieldA11yIds({
        id: id.value,
        hasHelperText: hasHelperText.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const disabled = computed(() => sourceSelect.value.disabled || false)
    const invalid = computed(() => hasError.value || sourceSelect.value.invalid || false)
    const currentValue = computed(() => externalValue.value ?? internalValue.value)
    const selectedOption = computed(
      () =>
        sourceSelect.value.options.find((option) => option.value === currentValue.value) ??
        (sourceSelect.value.placeholder === undefined ? sourceSelect.value.options[0] : undefined),
    )
    const placeholderSelected = computed(
      () => sourceSelect.value.placeholder !== undefined && currentValue.value === "",
    )
    const displayText = computed(() =>
      placeholderSelected.value
        ? (sourceSelect.value.placeholder ?? "")
        : (selectedOption.value?.label ?? ""),
    )
    const accessibleName = computed(
      () =>
        sourceSelect.value.ariaLabel ??
        (hasTextContent(props.label) ? props.label : undefined) ??
        (hasTextContent(displayText.value) ? displayText.value : undefined),
    )

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-input-field",
        "mw-input-field--select",
        mode.value === "marwes" && "mw-input-field--select-marwes",
        props.variant === "date" && "mw-input-field--select-date",
        disabled.value && "mw-input-field--disabled",
        invalid.value && "mw-input-field--invalid",
      ),
    )

    const mergedSelectProps = computed<SelectProps>(() => {
      const nextSelectProps: SelectProps = {
        ...sourceSelect.value,
        id: id.value,
        invalid: invalid.value,
      }

      if (externalValue.value !== undefined) {
        nextSelectProps.modelValue = externalValue.value
      }

      if (a11yIds.value.describedBy) {
        nextSelectProps.describedBy = a11yIds.value.describedBy
      }

      const originalOnValueChange = sourceSelect.value.onValueChange
      nextSelectProps.onValueChange = (nextValue: string) => {
        originalOnValueChange?.(nextValue)
        emit("update:modelValue", nextValue)
        emit("value-change", nextValue)
      }

      return nextSelectProps
    })

    watch(
      [open, currentValue, () => sourceSelect.value.options],
      ([isOpen]) => {
        if (!isOpen) {
          return
        }

        activeIndex.value = getInitialActiveOptionIndex(
          sourceSelect.value.options,
          currentValue.value,
        )
      },
      { deep: true },
    )

    watch(disabled, (isDisabled) => {
      if (isDisabled) {
        open.value = false
      }
    })

    const handlePointerDown = (event: PointerEvent) => {
      if (controlRef.value?.contains(event.target as Node)) {
        return
      }

      open.value = false
    }

    watch(open, (isOpen) => {
      if (isOpen) {
        document.addEventListener("pointerdown", handlePointerDown)
        return
      }

      document.removeEventListener("pointerdown", handlePointerDown)
    })

    onBeforeUnmount(() => {
      document.removeEventListener("pointerdown", handlePointerDown)
    })

    const commitValue = (nextValue: string) => {
      if (!isControlled.value) {
        internalValue.value = nextValue
      }

      sourceSelect.value.onValueChange?.(nextValue)
      emit("update:modelValue", nextValue)
      emit("value-change", nextValue)
    }

    const selectOptionAtIndex = (index: number) => {
      const option = sourceSelect.value.options[index]

      if (!option || option.disabled) {
        return
      }

      commitValue(option.value)
      open.value = false
      buttonRef.value?.focus()
    }

    const handleTriggerKeydown = (event: KeyboardEvent) => {
      if (disabled.value) {
        return
      }

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault()

          if (!open.value) {
            open.value = true
            activeIndex.value = getInitialActiveOptionIndex(
              sourceSelect.value.options,
              currentValue.value,
            )
            return
          }

          activeIndex.value = getNextEnabledOptionIndex(
            sourceSelect.value.options,
            activeIndex.value,
            1,
          )
          return
        }
        case "ArrowUp": {
          event.preventDefault()

          if (!open.value) {
            open.value = true
            activeIndex.value = getInitialActiveOptionIndex(
              sourceSelect.value.options,
              currentValue.value,
            )
            return
          }

          activeIndex.value = getNextEnabledOptionIndex(
            sourceSelect.value.options,
            activeIndex.value,
            -1,
          )
          return
        }
        case "Home": {
          if (!open.value) {
            return
          }

          event.preventDefault()
          activeIndex.value = getFirstEnabledOptionIndex(sourceSelect.value.options)
          return
        }
        case "End": {
          if (!open.value) {
            return
          }

          event.preventDefault()
          activeIndex.value = getLastEnabledOptionIndex(sourceSelect.value.options)
          return
        }
        case "Enter":
        case " ": {
          event.preventDefault()

          if (!open.value) {
            open.value = true
            activeIndex.value = getInitialActiveOptionIndex(
              sourceSelect.value.options,
              currentValue.value,
            )
            return
          }

          if (activeIndex.value !== -1) {
            selectOptionAtIndex(activeIndex.value)
          }
          return
        }
        case "Escape": {
          if (!open.value) {
            return
          }

          event.preventDefault()
          open.value = false
          return
        }
        case "Tab": {
          open.value = false
          return
        }
        default:
          return
      }
    }

    const labelContent = () => slots.label?.() ?? [props.label]
    const helperContent = () => slots.helper?.() ?? (props.helperText ? [props.helperText] : [])
    const errorContent = () => slots.error?.() ?? (props.error ? [props.error] : [])

    return () =>
      h("div", { class: wrapperClass.value }, [
        h("label", { class: "mw-input-field__label", for: id.value }, [
          h(Paragraph, { size: "md" }, { default: labelContent }),
        ]),

        h("div", { class: "mw-input-field__input-wrapper" }, [
          mode.value === "native"
            ? h(Select, { ...mergedSelectProps.value, native: true })
            : h(
                "div",
                {
                  ref: controlRef,
                  class: mergeClassNames(
                    "mw-select-field__control",
                    open.value && "mw-select-field__control--open",
                  ),
                },
                [
                  h(
                    "button",
                    {
                      ref: buttonRef,
                      id: id.value,
                      type: "button",
                      class: mergeClassNames(
                        "mw-select-field__trigger",
                        placeholderSelected.value && "mw-select-field__trigger--placeholder",
                        invalid.value && "is-invalid",
                        open.value && "mw-select-field__trigger--open",
                      ),
                      role: "combobox",
                      "aria-controls": `${id.value}-listbox`,
                      "aria-expanded": open.value ? "true" : "false",
                      "aria-haspopup": "listbox",
                      "aria-label": accessibleName.value,
                      "aria-describedby": a11yIds.value.describedBy,
                      "aria-invalid": invalid.value ? "true" : undefined,
                      "aria-required": sourceSelect.value.required ? "true" : undefined,
                      "aria-activedescendant":
                        open.value && activeIndex.value !== -1
                          ? `${id.value}-option-${activeIndex.value}`
                          : undefined,
                      disabled: disabled.value,
                      "data-placeholder-selected": placeholderSelected.value ? "true" : undefined,
                      onClick: () => {
                        if (disabled.value) {
                          return
                        }

                        open.value = !open.value
                      },
                      onKeydown: handleTriggerKeydown,
                    },
                    [
                      h("span", { class: "mw-select-field__trigger-text" }, displayText.value),
                      h(SelectArrowIcon, {
                        className: "mw-select-field__trigger-icon",
                      }),
                    ],
                  ),
                  sourceSelect.value.name
                    ? h("input", {
                        "aria-hidden": "true",
                        class: "mw-select-field__proxy-input",
                        name: sourceSelect.value.name,
                        type: "hidden",
                        value: currentValue.value,
                        readonly: true,
                      })
                    : null,
                  open.value
                    ? h(
                        "div",
                        {
                          class: "mw-select-field__list",
                          id: `${id.value}-listbox`,
                          role: "listbox",
                        },
                        sourceSelect.value.options.map((option, optionIndex) => {
                          const selected = option.value === currentValue.value
                          const active = optionIndex === activeIndex.value

                          return h(
                            "div",
                            {
                              id: `${id.value}-option-${optionIndex}`,
                              key: option.value,
                              class: mergeClassNames(
                                "mw-select-field__option",
                                active && "mw-select-field__option--active",
                                selected && "mw-select-field__option--selected",
                                option.disabled && "mw-select-field__option--disabled",
                              ),
                              role: "option",
                              "aria-selected": selected ? "true" : "false",
                              "aria-disabled": option.disabled ? "true" : undefined,
                              onClick: () => selectOptionAtIndex(optionIndex),
                              onMousedown: (event: MouseEvent) => event.preventDefault(),
                              onMouseenter: () => {
                                if (!option.disabled) {
                                  activeIndex.value = optionIndex
                                }
                              },
                            },
                            [
                              h("span", { class: "mw-select-field__option-label" }, option.label),
                              selected
                                ? h(Icon, {
                                    className: "mw-select-field__option-check",
                                    name: IconName.Check,
                                    size: "xs",
                                    decorative: true,
                                  })
                                : null,
                            ],
                          )
                        }),
                      )
                    : null,
                ],
              ),
        ]),

        hasHelperText.value && !hasError.value
          ? h("div", { class: "mw-input-field__helper", id: a11yIds.value.helperTextId }, [
              h(Paragraph, { size: "sm" }, { default: helperContent }),
            ])
          : null,

        hasError.value
          ? h(
              "div",
              {
                class: "mw-input-field__error",
                id: a11yIds.value.errorId,
                "aria-live": "polite",
              },
              [h(Paragraph, { size: "sm" }, { default: errorContent })],
            )
          : null,
      ])
  },
  {
    name: "MarwesSelectField",
    props: [...selectFieldPropKeys],
    emits: ["update:modelValue", "value-change"],
  },
)
