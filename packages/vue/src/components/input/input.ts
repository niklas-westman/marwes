import type { CssVars, InputOptions } from "@marwes-ui/core"
import { createInputRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"
import { useTheme } from "../../provider/use-theme"

export type InputProps = InputOptions & {
  modelValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

const inputPropKeys = [
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
  "onValueChange",
  "className",
] as const

export const Input = defineComponent(
  (props: InputProps, { emit }) => {
    const attrs = useAttrs()
    const theme = useTheme()
    const kit = computed(() => createInputRecipe(theme.value, props))

    useRenderKitDebug(kit, "Input")

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)
      const controlledValue = props.modelValue ?? props.value

      return h("input", {
        ...passthroughAttrs,
        class: className,
        style,
        id: renderKit.a11y.id,
        name: renderKit.a11y.name,
        type: renderKit.a11y.type,
        inputMode: renderKit.a11y.inputMode,
        autoComplete: renderKit.a11y.autoComplete,
        placeholder: renderKit.a11y.placeholder,
        disabled: renderKit.a11y.disabled,
        readOnly: renderKit.a11y.readOnly,
        required: renderKit.a11y.required,
        "aria-label": renderKit.a11y.ariaLabel,
        "aria-invalid": renderKit.a11y.ariaInvalid,
        "aria-describedby": renderKit.a11y.ariaDescribedBy,
        value: controlledValue,
        defaultValue: controlledValue === undefined ? props.defaultValue : undefined,
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
