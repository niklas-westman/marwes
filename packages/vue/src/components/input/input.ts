import type { CssVars, InputOptions } from "@marwes-ui/core"
import { createInputRecipe, toInputHtmlAttributes } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { definePropKeys } from "../../internal/prop-keys"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type InputProps = InputOptions & {
  modelValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

const inputPropKeys = definePropKeys<InputProps>()([
  "id",
  "name",
  "value",
  "modelValue",
  "defaultValue",
  "placeholder",
  "disabled",
  "readOnly",
  "required",
  "inputMode",
  "type",
  "autoComplete",
  "tone",
  "invalid",
  "describedBy",
  "ariaLabel",
  "ariaLabelledBy",
  "label",
  "onValueChange",
  "className",
])

export const Input = defineComponent(
  (props: InputProps, { emit }) => {
    const attrs = useAttrs()
    const kit = computed(() => createInputRecipe(props))

    useRenderKitDebug(kit, "Input")

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)
      const controlledValue = props.modelValue ?? props.value
      const inputValue = controlledValue ?? props.defaultValue

      return h("input", {
        ...passthroughAttrs,
        class: className,
        style,
        ...toInputHtmlAttributes(renderKit.a11y),
        value: inputValue,
        onInput: (event: Event) => {
          const target = event.target as HTMLInputElement
          const nextValue = target.value
          props.onValueChange?.(nextValue)
          emit("update:modelValue", nextValue)
          emit("value-change", nextValue)
        },
        onChange: (event: Event) => emit("change", event),
      })
    }
  },
  {
    name: "MarwesInput",
    inheritAttrs: false,
    props: [...inputPropKeys],
    emits: ["update:modelValue", "value-change", "change"],
  },
)
