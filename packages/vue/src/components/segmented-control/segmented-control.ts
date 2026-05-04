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
import { type VNodeChild, computed, defineComponent, h, ref, useAttrs, watch } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type SegmentedControlOption = {
  value: string
  label: VNodeChild
  icon?: VNodeChild
  disabled?: boolean
  ariaLabel?: string
}

export type SegmentedControlProps = {
  id?: string
  label?: VNodeChild
  ariaLabel?: string
  ariaDescribedBy?: string
  options: SegmentedControlOption[]
  value?: string
  modelValue?: string
  defaultValue?: string
  disabled?: boolean
  variant?: SegmentedControlVariantName
  onValueChange?: (value: string) => void
  dataAttributes?: Record<string, string>
  className?: string
}

const segmentedControlPropKeys = [
  "id",
  "label",
  "ariaLabel",
  "ariaDescribedBy",
  "options",
  "value",
  "modelValue",
  "defaultValue",
  "disabled",
  "variant",
  "onValueChange",
  "dataAttributes",
  "className",
] as const

function hasContent(value: VNodeChild | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  return true
}

function toChildren(value: VNodeChild | undefined): VNodeChild[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value === undefined || value === null || value === false) {
    return []
  }

  return [value]
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

export const SegmentedControl = defineComponent(
  (props: SegmentedControlProps, { emit }) => {
    const attrs = useAttrs()
    const localId = createLocalId("mw-segmented-control")
    const id = computed(() => props.id ?? localId)
    const hasLabel = computed(() => hasContent(props.label))
    const isControlled = computed(() => props.modelValue !== undefined || props.value !== undefined)
    const controlledValue = computed(() => props.modelValue ?? props.value)
    const itemStates = computed<SegmentedControlItemState[]>(() =>
      props.options.map((option) => toItemState(option, props.disabled)),
    )
    const internalValue = ref<string | undefined>(
      resolveSegmentedControlValue(itemStates.value, props.defaultValue),
    )

    watch(
      itemStates,
      (nextStates) => {
        if (!isControlled.value) {
          internalValue.value = resolveSegmentedControlValue(
            nextStates,
            internalValue.value ?? props.defaultValue,
          )
        }
      },
      { immediate: true },
    )

    const selectedValue = computed(() =>
      resolveSegmentedControlValue(
        itemStates.value,
        isControlled.value ? controlledValue.value : internalValue.value,
      ),
    )

    const a11yIds = computed(() =>
      buildSegmentedControlA11yIds({
        id: id.value,
        itemValues: props.options.map((option) => option.value),
        hasLabel: hasLabel.value,
      }),
    )

    const selectValue = (nextValue: string | undefined): void => {
      if (props.disabled) {
        return
      }

      const resolvedValue = resolveSegmentedControlValue(itemStates.value, nextValue)
      const currentValue = selectedValue.value

      if (!resolvedValue) {
        return
      }

      if (!isControlled.value) {
        internalValue.value = resolvedValue
      }

      if (resolvedValue !== currentValue) {
        props.onValueChange?.(resolvedValue)
        emit("update:modelValue", resolvedValue)
        emit("value-change", resolvedValue)
      }
    }

    const handleKeydown = (event: KeyboardEvent): void => {
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

      const nextValue = moveSegmentedControlSelection(
        itemStates.value,
        selectedValue.value,
        direction,
      )
      if (!nextValue) {
        return
      }

      selectValue(nextValue)
      const nextItemId = a11yIds.value.itemIds[nextValue]
      if (nextItemId) {
        focusSegmentedControlItem(nextItemId)
      }
    }

    return () => {
      const controlOptions: SegmentedControlOptions = {}
      if (props.variant !== undefined) controlOptions.variant = props.variant
      if (props.disabled !== undefined) controlOptions.disabled = props.disabled
      if (!hasLabel.value) controlOptions.ariaLabel = props.ariaLabel ?? "Segmented control"
      if (hasLabel.value && a11yIds.value.labelId) {
        controlOptions.ariaLabelledby = a11yIds.value.labelId
      }
      if (props.ariaDescribedBy !== undefined) {
        controlOptions.ariaDescribedBy = props.ariaDescribedBy
      }

      const kit = createSegmentedControlRecipe(controlOptions)
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(kit.className, props.className, attrs.class)
      const style = mergeStyles(kit.vars, attrs.style)

      return h(
        "div",
        {
          class: mergeClassNames(
            "mw-segmented-control-field",
            hasLabel.value && "mw-segmented-control-field--labelled",
          ),
        },
        [
          hasLabel.value
            ? h(
                "span",
                {
                  id: a11yIds.value.labelId,
                  class: "mw-segmented-control__label",
                },
                toChildren(props.label),
              )
            : null,
          h(
            "div",
            {
              ...passthroughAttrs,
              ...kit.dataAttributes,
              ...(props.dataAttributes ?? {}),
              id: a11yIds.value.groupId,
              class: className,
              style,
              role: kit.a11y.role,
              "aria-label": kit.a11y.ariaLabel,
              "aria-labelledby": kit.a11y.ariaLabelledby,
              "aria-describedby": kit.a11y.ariaDescribedBy,
              "aria-disabled": kit.a11y.ariaDisabled,
              onKeydown: handleKeydown,
            },
            props.options.map((option) => {
              const itemDisabled = Boolean(props.disabled || option.disabled)
              const selected = option.value === selectedValue.value
              const itemOptions: SegmentedControlItemOptions = { selected }
              if (itemDisabled) itemOptions.disabled = true
              if (props.variant !== undefined) itemOptions.variant = props.variant
              if (option.ariaLabel !== undefined) itemOptions.ariaLabel = option.ariaLabel

              const itemKit = createSegmentedControlItemRecipe(itemOptions)
              const itemId =
                a11yIds.value.itemIds[option.value] ?? `${id.value}-item-${option.value}`

              return h(
                "button",
                {
                  ...itemKit.dataAttributes,
                  key: option.value,
                  id: itemId,
                  type: "button",
                  class: itemKit.className,
                  style: mergeStyles(itemKit.vars),
                  role: itemKit.a11y.role,
                  "aria-checked": itemKit.a11y.ariaChecked,
                  "aria-disabled": itemKit.a11y.ariaDisabled,
                  "aria-label": itemKit.a11y.ariaLabel,
                  tabindex: itemKit.a11y.tabIndex,
                  disabled: itemDisabled ? true : undefined,
                  onClick: () => selectValue(option.value),
                },
                [
                  option.icon
                    ? h(
                        "span",
                        { class: "mw-segmented-control__item-icon" },
                        toChildren(option.icon),
                      )
                    : null,
                  h(
                    "span",
                    { class: "mw-segmented-control__item-label" },
                    toChildren(option.label),
                  ),
                ],
              )
            }),
          ),
        ],
      )
    }
  },
  {
    name: "MarwesSegmentedControl",
    inheritAttrs: false,
    props: [...segmentedControlPropKeys],
    emits: ["update:modelValue", "value-change"],
  },
)
