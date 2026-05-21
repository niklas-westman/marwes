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
import { type VNodeChild, computed, defineComponent, h, ref, useAttrs, watch } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"

export interface SegmentedControlItemVue {
  value: string
  label?: string
  icon?: VNodeChild
  disabled?: boolean
  ariaLabel?: string
}

export interface SegmentedControlPropsVue {
  items: SegmentedControlItemVue[]
  modelValue?: string
  variant?: SegmentedControlVariant
  size?: SegmentedControlSize
  disabled?: boolean
  ariaLabel?: string
  className?: string
  id?: string
}

const propKeys = [
  "items",
  "modelValue",
  "variant",
  "size",
  "disabled",
  "ariaLabel",
  "className",
  "id",
] as const

function toItemState(item: SegmentedControlItemVue): SegmentedControlItemState {
  const state: SegmentedControlItemState = { value: item.value }
  if (item.disabled) state.disabled = true
  return state
}

export const SegmentedControl = defineComponent(
  (props: SegmentedControlPropsVue, { emit }) => {
    const attrs = useAttrs()

    const itemStates = computed<SegmentedControlItemState[]>(() =>
      (props.items ?? []).map(toItemState),
    )

    const internalValue = ref<string | undefined>(
      resolveSegmentedControlValue(itemStates.value, props.modelValue),
    )

    const isControlled = computed(() => props.modelValue !== undefined)

    const resolvedValue = computed(() =>
      resolveSegmentedControlValue(
        itemStates.value,
        isControlled.value ? props.modelValue : internalValue.value,
      ),
    )

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== undefined) {
          internalValue.value = resolveSegmentedControlValue(itemStates.value, newVal)
        }
      },
    )

    function selectItem(nextValue: string | undefined): void {
      const resolved = resolveSegmentedControlValue(itemStates.value, nextValue)
      if (!resolved || resolved === resolvedValue.value) return

      if (!isControlled.value) internalValue.value = resolved
      emit("update:modelValue", resolved)
      emit("value-change", resolved)
    }

    function handleKeyDown(event: KeyboardEvent): void {
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
      const nextValue = moveSegmentedControlSelection(
        itemStates.value,
        resolvedValue.value,
        direction,
      )
      if (nextValue) {
        selectItem(nextValue)
        const container = event.currentTarget as HTMLElement
        const btn = container.querySelector<HTMLButtonElement>(`[data-value="${nextValue}"]`)
        btn?.focus()
      }
    }

    return () => {
      const trackKit = createSegmentedControlRecipe({
        value: resolvedValue.value,
        variant: props.variant,
        size: props.size,
        disabled: props.disabled,
        ariaLabel: props.ariaLabel,
      })

      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(trackKit.className, props.className, attrs.class)

      const itemNodes = (props.items ?? []).map((item) => {
        const isSelected = item.value === resolvedValue.value
        const isItemDisabled = props.disabled || item.disabled
        const isIconOnly = item.icon != null && item.label == null
        const itemKit = createSegmentedControlItemRecipe({
          value: item.value,
          selected: isSelected,
          disabled: isItemDisabled,
          ariaLabel: item.ariaLabel,
          iconOnly: isIconOnly,
        })

        return h(
          "button",
          {
            type: "button",
            class: itemKit.className,
            role: itemKit.a11y.role,
            "aria-checked": itemKit.a11y.ariaChecked,
            "aria-disabled": itemKit.a11y.ariaDisabled,
            "aria-label": itemKit.a11y.ariaLabel,
            tabindex: itemKit.a11y.tabIndex,
            disabled: isItemDisabled,
            "data-value": item.value,
            onClick: () => selectItem(item.value),
          },
          [item.icon, item.label],
        )
      })

      return h(
        "div",
        {
          ...passthroughAttrs,
          id: props.id,
          class: className,
          role: trackKit.a11y.role,
          "aria-label": trackKit.a11y.ariaLabel,
          "aria-disabled": trackKit.a11y.ariaDisabled,
          onKeydown: handleKeyDown,
        },
        itemNodes,
      )
    }
  },
  {
    name: "MarwesSegmentedControl",
    inheritAttrs: false,
    props: [...propKeys],
    emits: ["update:modelValue", "value-change"],
  },
)
