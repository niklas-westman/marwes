import type {
  SelectAppearance as CoreSelectAppearance,
  SelectOption as CoreSelectOption,
  CssVars,
  SelectOptions,
} from "@marwes-ui/core"
import { createSelectRecipe, toSelectHtmlAttributes } from "@marwes-ui/core"
import { computed, defineComponent, h, ref, useAttrs } from "vue"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { definePropKeys } from "../../internal/prop-keys"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"
import { SelectArrowIcon } from "./select-arrow-icon"

export type SelectAppearance = CoreSelectAppearance
export type SelectOption = CoreSelectOption

export type SelectProps = SelectOptions & {
  modelValue?: string
  onValueChange?: (value: string) => void
  className?: string
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

const selectPropKeys = definePropKeys<SelectProps>()([
  "id",
  "name",
  "value",
  "modelValue",
  "defaultValue",
  "options",
  "placeholder",
  "disabled",
  "required",
  "native",
  "tone",
  "appearance",
  "invalid",
  "describedBy",
  "ariaLabel",
  "ariaLabelledBy",
  "label",
  "onValueChange",
  "className",
])

export const Select = defineComponent(
  (props: SelectProps, { emit }) => {
    const attrs = useAttrs()
    const kit = computed(() => createSelectRecipe(props))
    const uncontrolledValue = ref(getInitialSelectValue(props))
    const currentValue = computed(() => props.modelValue ?? props.value ?? uncontrolledValue.value)
    const placeholderSelected = computed(
      () => props.placeholder !== undefined && currentValue.value === "",
    )

    useRenderKitDebug(kit, "Select")

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      const selectElement = h(
        "select",
        {
          ...passthroughAttrs,
          class: className,
          style,
          "data-placeholder-selected": placeholderSelected.value ? "true" : undefined,
          ...toSelectHtmlAttributes(renderKit.a11y),
          value: currentValue.value,
          onChange: (event: Event) => {
            const target = event.target as HTMLSelectElement
            const nextValue = target.value

            if (props.modelValue === undefined && props.value === undefined) {
              uncontrolledValue.value = nextValue
            }

            props.onValueChange?.(nextValue)
            emit("update:modelValue", nextValue)
            emit("value-change", nextValue)
            emit("change", event)
          },
        },
        [
          ...(props.placeholder
            ? [
                h(
                  "option",
                  {
                    value: "",
                    disabled: props.required ? true : undefined,
                    // Server-rendered markup carries the selection on options; Vue does not
                    // restore a select's value prop during hydration.
                    selected: currentValue.value === "",
                  },
                  props.placeholder,
                ),
              ]
            : []),
          ...props.options.map((option) =>
            h(
              "option",
              {
                key: option.value,
                value: option.value,
                disabled: option.disabled,
                selected: option.value === currentValue.value,
              },
              option.label,
            ),
          ),
        ],
      )

      return h("span", { class: "mw-select__control" }, [
        selectElement,
        h(SelectArrowIcon, { className: "mw-select__control-icon" }),
      ])
    }
  },
  {
    name: "MarwesSelect",
    inheritAttrs: false,
    props: [...selectPropKeys],
    emits: ["update:modelValue", "value-change", "change"],
  },
)
